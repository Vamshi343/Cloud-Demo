import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mockGCP from "./tools/mockGCP.mjs";
import mockGemini from "./tools/mockGemini.mjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// Serve React build files (for deployment)
// ============================================
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// ============================================
// HELPER: Detect if input is a question
// ============================================
function isQuestion(text) {
  const questionWords = [
    'what', 'why', 'how', 'when', 'where', 'who', 
    'explain', 'tell me', 'describe', 'compare',
    'difference', 'vs', 'versus', 'show me',
    'can you', 'could you', 'would you'
  ];
  
  const normalized = text.toLowerCase().trim();
  
  // Check if starts with question word
  const startsWithQuestion = questionWords.some(word => normalized.startsWith(word));
  
  // Check if contains question words
  const containsQuestion = questionWords.some(word => normalized.includes(' ' + word + ' ') || normalized.includes(word + ' '));
  
  // Check if ends with question mark
  const endsWithQuestion = normalized.endsWith('?');
  
  return startsWithQuestion || containsQuestion || endsWithQuestion;
}

// ============================================
// MAIN AGENT ENDPOINT - SUPER SMART
// ============================================
app.post("/agent/run", async (req, res) => {
  let { prompt } = req.body;

  if (!prompt) {
    return res.json({ success: false, error: "No prompt received" });
  }

  const normalized = prompt.trim().toLowerCase().replace(/\s+/g, " ");

  try {
    let output;

    // ============================================
    // PRIORITY 1: EXPLICIT GCP COMMANDS
    // ============================================
    
    // CLOUD STORAGE COMMANDS
    if (normalized.includes("list bucket")) {
      output = mockGCP.actions.listBuckets();
    } 
    else if (normalized.includes("bucket details") || normalized.includes("get bucket")) {
      const bucketName = prompt.match(/vamshi-demo-bucket/) 
        ? "vamshi-demo-bucket" 
        : "vamshi-demo-bucket";
      output = mockGCP.actions.getBucketDetails(bucketName);
    }
    else if (normalized.includes("create bucket")) {
      const bucketName = prompt.match(/[\w-]+bucket[\w-]*/i)?.[0] || "new-bucket";
      output = mockGCP.actions.createBucket(bucketName);
    }
    else if (normalized.includes("upload file") || normalized.includes("upload to bucket")) {
      const filename = prompt.match(/[\w-]+\.\w+/)?.[0] || "sample-file.txt";
      output = mockGCP.actions.uploadToBucket(filename);
    }
    else if (normalized.includes("delete file")) {
      const filename = prompt.match(/[\w-]+\.\w+/)?.[0] || "file.txt";
      output = mockGCP.actions.deleteFromBucket(filename);
    }
    
    // BIGQUERY COMMANDS
    else if (normalized.includes("list dataset") || normalized.includes("list bigquery")) {
      output = mockGCP.actions.listDatasets();
    }
    else if (normalized.includes("dataset details") || normalized.includes("get dataset")) {
      output = mockGCP.actions.getDatasetDetails("demo_dataset_vamshi");
    }
    else if (normalized.includes("query bigquery") || normalized.includes("run bigquery") || normalized.includes("bigquery query")) {
      output = mockGCP.actions.runBigQueryQuery();
    }
    else if (normalized.includes("insert data") || normalized.includes("upload to bigquery")) {
      output = mockGCP.actions.uploadToBigQuery();
    }
    else if (normalized.includes("run sql") || normalized.includes("execute sql")) {
      const sql = prompt.match(/SELECT.+/i)?.[0] || "SELECT * FROM table";
      output = mockGCP.actions.runSQL(sql);
    }
    
    // STATUS COMMAND
    else if (normalized.includes("status") && !isQuestion(prompt)) {
      output = mockGCP.actions.getStatus();
    }
    
    // ============================================
    // PRIORITY 2: SMART QUESTION DETECTION
    // ============================================
    // If it's a question OR contains "gemini" OR "ask", route to Gemini
    else if (
      isQuestion(prompt) || 
      normalized.includes("gemini") || 
      normalized.includes("ask") ||
      normalized.includes("tell me") ||
      normalized.includes("explain")
    ) {
      output = await mockGemini.chat(prompt);
    }
    
    // ============================================
    // PRIORITY 3: SINGLE-WORD TOPIC QUERIES
    // ============================================
    // Handle single words like "terraform", "bigquery", "pricing"
    else if (normalized.split(' ').length <= 2) {
      // Route single-word/two-word inputs to Gemini as questions
      output = await mockGemini.chat("What is " + prompt + "?");
    }
    
    // ============================================
    // FALLBACK: HELPFUL SUGGESTIONS
    // ============================================
    else {
      output = {
        message: "❓ I didn't quite understand that. Here are some things I can help with:",
        examples: {
          "GCP Commands": [
            "list buckets",
            "bucket details vamshi-demo-bucket",
            "list bigquery datasets",
            "query bigquery"
          ],
          "Ask Questions": [
            "What is Terraform?",
            "Explain BigQuery",
            "GCP vs AWS",
            "How does Cloud Storage work?",
            "Tell me about GCP pricing"
          ]
        },
        received: prompt
      };
    }

    res.json({
      success: true,
      question: prompt,
      reply: output,
    });

  } catch (err) {
    console.error("Agent error:", err);
    res.json({ 
      success: false, 
      error: err.message 
    });
  }
});

// ==================================================
// ADDITIONAL ENDPOINTS (kept for compatibility)
// ==================================================

app.post("/agent/upload", (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.json({ success: false, error: "No filename provided" });
    }
    const result = mockGCP.actions.uploadToBucket(filename);
    res.json({
      success: true,
      message: "File uploaded to bucket successfully",
      reply: result,
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/agent/delete-file", (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.json({ success: false, error: "No filename provided" });
    }
    const result = mockGCP.actions.deleteFromBucket(filename);
    res.json({
      success: true,
      message: "File deleted successfully",
      reply: result,
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/agent/create-bucket", (req, res) => {
  try {
    const { bucketName } = req.body;
    if (!bucketName) {
      return res.json({ success: false, error: "Bucket name required" });
    }
    const result = mockGCP.actions.createBucket(bucketName);
    res.json({
      success: true,
      message: "Bucket created successfully",
      reply: result,
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/agent/query-sql", (req, res) => {
  try {
    const { sql } = req.body;
    if (!sql) {
      return res.json({ success: false, error: "SQL query is required" });
    }
    const result = mockGCP.actions.runSQL(sql);
    res.json({
      success: true,
      message: "SQL query executed",
      reply: result,
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/gemini/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.json({
      success: false,
      error: "No prompt received"
    });
  }
  try {
    const reply = await mockGemini.chat(prompt);
    res.json({
      success: true,
      question: prompt,
      reply
    });
  } catch (err) {
    console.error("Gemini ERROR:", err);
    res.json({
      success: false,
      error: "Gemini processing failed"
    });
  }
});

// =========================================
// START SERVER
// =========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Mock GCP Agent running on port ${PORT}`);
  console.log(`📁 Reading from: ${path.join(__dirname, '../terraform/state')}`);
});