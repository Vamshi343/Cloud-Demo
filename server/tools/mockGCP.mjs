// server/tools/mockGCP.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to terraform state files
const statePath = path.join(__dirname, "../../terraform/state");

// Helper to read JSON files
function readJSON(fileName) {
  try {
    const filePath = path.join(statePath, fileName);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error.message);
    return null;
  }
}

// Mock GCP Actions
const actions = {
  // ============================================
  // CLOUD STORAGE OPERATIONS
  // ============================================
  listBuckets() {
    const bucketMeta = readJSON("bucket_metadata.json");
    if (!bucketMeta) return { error: "Bucket metadata not found" };
    
    return {
      buckets: [bucketMeta.bucket_name]
    };
  },

  getBucketDetails(bucketName) {
    const bucketMeta = readJSON("bucket_metadata.json");
    if (!bucketMeta) return { error: "Bucket metadata not found" };
    
    if (bucketMeta.bucket_name !== bucketName) {
      return { error: `Bucket '${bucketName}' not found` };
    }
    
    return {
      bucket_name: bucketMeta.bucket_name,
      location: bucketMeta.location,
      storage_class: bucketMeta.storage_class,
      created_at: bucketMeta.created_at
    };
  },

  createBucket(bucketName) {
    return {
      message: "Bucket created successfully",
      bucket_name: bucketName,
      location: "US-CENTRAL1",
      storage_class: "STANDARD",
      created_at: new Date().toISOString()
    };
  },

  uploadToBucket(filename) {
    return {
      message: "File uploaded successfully",
      bucket: "vamshi-demo-bucket",
      filename: filename || "sample-file.txt",
      size: "2.3 MB",
      uploaded_at: new Date().toISOString()
    };
  },

  deleteFromBucket(filename) {
    return {
      message: "File deleted successfully",
      bucket: "vamshi-demo-bucket",
      filename: filename || "file.txt",
      deleted_at: new Date().toISOString()
    };
  },

  // ============================================
  // BIGQUERY OPERATIONS
  // ============================================
  listDatasets() {
    const dataset = readJSON("bigquery_dataset.json");
    if (!dataset) return { error: "Dataset metadata not found" };
    
    return {
      datasets: [dataset.dataset_id]
    };
  },

  getDatasetDetails(datasetId) {
    const dataset = readJSON("bigquery_dataset.json");
    if (!dataset) return { error: "Dataset metadata not found" };
    
    if (dataset.dataset_id !== datasetId) {
      return { error: `Dataset '${datasetId}' not found` };
    }
    
    return {
      dataset_id: dataset.dataset_id,
      location: dataset.location,
      created_at: dataset.created_at
    };
  },

  runBigQueryQuery() {
    const rows = readJSON("bigquery_sample_rows.json");
    if (!rows) return { error: "Sample data not found" };
    
    return rows; // Returns array for table formatting
  },

  uploadToBigQuery() {
    return {
      message: "Data inserted successfully",
      dataset: "demo_dataset_vamshi",
      table: "sample_table",
      rows_inserted: 5,
      inserted_at: new Date().toISOString()
    };
  },

  runSQL(sql) {
    const rows = readJSON("bigquery_sample_rows.json");
    return {
      query: sql,
      rows_returned: rows ? rows.length : 2,
      data: rows || [],
      executed_at: new Date().toISOString()
    };
  },

  // ============================================
  // UTILITY
  // ============================================
  getStatus() {
    return {
      status: "connected",
      services: {
        storage: "active",
        bigquery: "active",
        gemini: "active"
      },
      timestamp: new Date().toISOString()
    };
  },

  fallback(data) {
    return {
      message: "I don't understand that command, but mock agent responded.",
      received: data.prompt
    };
  }
};

export default {
  actions,
  readJSON
};