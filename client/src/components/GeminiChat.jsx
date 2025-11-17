import { useState } from "react";
import API from "../api/api";

function GeminiChat({ setResult }) {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const res = await API.post("/gemini/chat", { message: input });
    setResult(JSON.stringify(res.data, null, 2));
  };

  return (
    <div>
      <h2>Gemini Chat</h2>

      <form onSubmit={sendMessage}>
        <textarea
          placeholder="Ask something to Gemini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="5"
          style={{ width: "100%", padding: "10px" }}
        ></textarea>

        <button type="submit">Ask Gemini</button>
      </form>
    </div>
  );
}

export default GeminiChat;
