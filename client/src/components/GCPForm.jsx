// src/components/GCPForm.jsx
import { useState } from "react";
import API from "../api/api";
import "./GCPForm.css";

function GCPForm({ addMessage, setLoading, loading }) {
  const [prompt, setPrompt] = useState("");

  const quickActions = [
    { icon: "📦", label: "List Buckets", command: "list buckets" },
    { icon: "🔍", label: "Bucket Details", command: "get bucket details vamshi-demo-bucket" },
    { icon: "📊", label: "List Datasets", command: "list bigquery datasets" },
    { icon: "▶️", label: "Query BigQuery", command: "run bigquery query" },
    { icon: "🤖", label: "Ask Gemini", command: "ask gemini about gcp" }
  ];

  const runAgent = async (userPrompt) => {
    if (!userPrompt.trim()) return;

    // Add user message
    addMessage("user", userPrompt);
    setPrompt("");
    setLoading(true);

    try {
      const response = await API.post("/agent/run", { prompt: userPrompt });
      
      // Add bot response with formatted content
      const botResponse = formatResponse(response.data);
      addMessage("bot", botResponse);
      
    } catch (err) {
      console.error(err);
      addMessage("bot", "❌ GCP Error: Unable to process request. Please try again.");
    }

    setLoading(false);
  };

  const formatResponse = (data) => {
    if (!data.success) return "❌ Operation failed";

    const reply = data.reply;

    // Format bucket list
    if (reply.buckets) {
      return `✅ Cloud Storage Buckets\n\n${reply.buckets.map(b => `📦 ${b}`).join('\n')}`;
    }

    // Format bucket details
    if (reply.bucket_name) {
      return `✅ Bucket Details\n\n📦 Name: ${reply.bucket_name}\n📍 Location: ${reply.location}\n💾 Storage Class: ${reply.storage_class}`;
    }

    // Format dataset list
    if (reply.datasets) {
      return `✅ BigQuery Datasets\n\n${reply.datasets.map(d => `📊 ${d}`).join('\n')}`;
    }

    // Format query results
    if (Array.isArray(reply)) {
      return `✅ BigQuery Results (${reply.length} rows)\n\n${formatTable(reply)}`;
    }

    // Format Gemini response
    if (typeof reply === 'string') {
      return `🤖 Gemini AI\n\n${reply}`;
    }

    return JSON.stringify(reply, null, 2);
  };

  const formatTable = (data) => {
    if (!data.length) return "No data";
    
    const headers = Object.keys(data[0]);
    let table = headers.join(" | ") + "\n";
    table += headers.map(() => "---").join(" | ") + "\n";
    
    data.forEach(row => {
      table += headers.map(h => row[h]).join(" | ") + "\n";
    });
    
    return table;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      runAgent(prompt);
    }
  };

  return (
    <div className="gcp-form-wrapper">
      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">⚡ Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="quick-action-btn"
              onClick={() => runAgent(action.command)}
              disabled={loading}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Command Input */}
      <div className="command-section">
        <h3 className="section-title">💬 GCP Command Console</h3>
        <div className="input-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your GCP command (e.g., 'list buckets', 'query bigquery')..."
            rows="3"
            className="command-input"
            disabled={loading}
          />
          <button
            className="execute-btn"
            onClick={() => runAgent(prompt)}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>⏳ Executing...</>
            ) : (
              <>▶️ Execute</>
            )}
          </button>
        </div>
      </div>

      {/* Example Commands */}
      <div className="examples-section">
        <details>
          <summary className="examples-title">💡 Example Commands</summary>
          <div className="examples-list">
            <code onClick={() => setPrompt("list buckets")}>list buckets</code>
            <code onClick={() => setPrompt("query bigquery")}>query bigquery</code>
            <code onClick={() => setPrompt("ask gemini about cloud storage")}>ask gemini about cloud storage</code>
          </div>
        </details>
      </div>
    </div>
  );
}

export default GCPForm;