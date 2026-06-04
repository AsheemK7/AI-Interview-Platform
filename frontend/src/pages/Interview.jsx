import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import VoiceRecorder from "../components/VoiceRecorder";
import api from "../api";

export default function Interview() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [textInput, setTextInput] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("start_interview", state);
    });

    socket.on("ai_message", ({ message }) => {
      setMessages((prev) => [...prev, { role: "ai", text: message }]);

      if (message.toLowerCase().includes("interview is now complete")) {
        setEnded(true);
      }

      speakText(message);
    });

    socket.on("ai_typing", (val) => setTyping(val));
    socket.on("error", ({ message }) => alert(message));

    return () => socket.disconnect();
  }, []);

  const sendMessage = (text) => {
    if (!text.trim() || ended) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    socketRef.current.emit("user_message", { message: text });

    setTextInput("");
  };

  const handleStop = async () => {
    try {
      await api.put(`/interview/stop/${id}`, { chatTranscript: messages });
      navigate("/");
    } catch {
      alert("Failed to save interview");
    }
  };

  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎤 AI Interview Room</h2>
          <p style={styles.subtitle}>
            {state?.position} • {state?.experience} • {state?.difficulty}
          </p>
        </div>

        <button onClick={handleStop} style={styles.stopBtn}>
          End & Save
        </button>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chat}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                ...(msg.role === "user"
                  ? styles.userBubble
                  : styles.aiBubble),
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={styles.aiTyping}>AI is thinking...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      {!ended ? (
        <div style={styles.inputBar}>
          <VoiceRecorder onTranscript={sendMessage} />

          <div style={styles.inputRow}>
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage(textInput)
              }
              placeholder="Type your answer..."
              style={styles.input}
            />

            <button
              onClick={() => sendMessage(textInput)}
              style={styles.sendBtn}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.finished}>
          ✅ Interview completed. Click “End & Save” to finish.
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    fontFamily: "sans-serif",
  },

  header: {
    padding: "1rem 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
  },

  title: {
    margin: 0,
    fontSize: "1.2rem",
  },

  subtitle: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#94a3b8",
  },

  stopBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: "1.5rem",
  },

  bubble: {
    maxWidth: "70%",
    padding: "0.75rem 1rem",
    borderRadius: "14px",
    fontSize: "0.95rem",
    lineHeight: "1.4",
  },

  aiBubble: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e2e8f0",
  },

  userBubble: {
    background: "#6366f1",
    color: "#fff",
  },

  aiTyping: {
    padding: "0.6rem 1rem",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.08)",
    color: "#94a3b8",
    fontSize: "0.85rem",
  },

  inputBar: {
    padding: "1rem",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  input: {
    flex: 1,
    padding: "0.8rem",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
  },

  sendBtn: {
    padding: "0.8rem 1.2rem",
    background: "#6366f1",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  finished: {
    padding: "1rem",
    textAlign: "center",
    color: "#22c55e",
    fontWeight: "600",
  },
};