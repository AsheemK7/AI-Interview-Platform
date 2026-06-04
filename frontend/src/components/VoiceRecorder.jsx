import { useState, useRef } from "react";

export default function VoiceRecorder({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Use Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={styles.wrapper}>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        style={{
          ...styles.button,
          ...(recording ? styles.recording : {}),
        }}
      >
        <div style={styles.icon}>
          {recording ? "🔴" : "🎤"}
        </div>

        <span style={styles.text}>
          {recording ? "Listening..." : "Hold to Speak"}
        </span>

        {recording && <div style={styles.pulse} />}
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0.9rem 1.4rem",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    overflow: "hidden",
  },

  recording: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    boxShadow: "0 0 25px rgba(239,68,68,0.3)",
    transform: "scale(1.02)",
  },

  icon: {
    fontSize: "1.1rem",
  },

  text: {
    whiteSpace: "nowrap",
  },

  pulse: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "999px",
    animation: "pulse 1.2s infinite",
    background: "rgba(239,68,68,0.2)",
  },
};