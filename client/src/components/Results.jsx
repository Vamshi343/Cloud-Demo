// src/components/Results.jsx
import { useEffect, useRef } from "react";

function Result({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-header">
              <span className="message-author">
                {msg.type === "user" ? "👤 You" : "🤖 GCP Agent"}
              </span>
              <span className="message-time">{msg.timestamp}</span>
            </div>
            <div className="message-content">
              <pre>{msg.content}</pre>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message bot">
            <div className="message-header">
              <span className="message-author">🤖 GCP Agent</span>
              <span className="message-time">Processing...</span>
            </div>
            <div className="message-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">Connecting to Google Cloud...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Result;