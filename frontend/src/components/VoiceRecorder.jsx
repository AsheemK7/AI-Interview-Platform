import { useState, useRef } from "react";

export default function VoiceRecorder({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const toggleRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Your browser doesn't support voice input. Please use Chrome or Edge."
      );
      return;
    }

    // Stop recording
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }

    // Start recording
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (e) => {
      let transcript = "";

      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }

      recognitionRef.current.transcript = transcript;
    };

    recognition.onerror = (e) =>
      console.error("Speech error:", e.error);

    recognition.onend = () => {
      setRecording(false);

      const finalText =
        recognitionRef.current?.transcript;

      if (finalText?.trim()) {
        onTranscript(finalText);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  return (
    <button
      onClick={toggleRecording}
      style={{
        padding: "0.9rem 1.8rem",
        background: recording
          ? "#ef4444"
          : "#6366f1",
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.25s ease",
        boxShadow: recording
          ? "0 0 0 8px rgba(239,68,68,0.25)"
          : "0 8px 20px rgba(99,102,241,0.25)",
      }}
    >
      {recording
        ? "🔴 Tap to Stop"
        : "🎤 Tap to Speak"}
    </button>
  );
}