// src/App.jsx
import { useState } from "react";
import GCPForm from "./components/GCPForm";
import Result from "./components/Results";
import "./App.css";


function App() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "👋 Welcome to Google Cloud Platform Smart Agent. How can I help you manage your GCP resources today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const addMessage = (type, content) => {
    setMessages(prev => [...prev, {
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div className="app-container">
      {/* GCP Header */}
      <header className="gcp-header">
  <div className="header-left">
    <div className="gcp-logo">
      <img src="cloud.png" alt="GCP Logo" width={40} height={40} />

    </div>
    <div className="header-title">
      <h1>Google Cloud Platform</h1>
      <span className="header-subtitle">Smart Agent Console</span>
    </div>
  </div>
  <div className="header-right">
    <span className="status-badge">● Connected</span>
  </div>
</header>


      {/* Main Content */}
      <div className="main-layout">
        {/* Chat Section */}
        <div className="chat-section">
          <Result messages={messages} loading={loading} />
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <GCPForm 
            addMessage={addMessage} 
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;