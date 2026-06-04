require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

// ✅ Allowed Frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-interview-platform-one-tau.vercel.app",
];

// ✅ Socket.IO CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ── Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/interview", require("./routes/interview"));

// ── Database ────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ── Socket.IO ───────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  let chatHistory = [];
  let interviewConfig = null;

  // Start interview
  socket.on("start_interview", ({ position, experience, difficulty }) => {
    interviewConfig = { position, experience, difficulty };
    chatHistory = [];

    const systemPrompt = `
You are Ayesha, a professional and friendly interviewer conducting a realistic mock job interview.

Role: ${position}
Experience: ${experience}
Difficulty: ${difficulty}

Rules:
- Ask ONE question at a time
- Be professional HR interviewer
- Give short feedback
- After 5 questions, end interview with summary
Start interview now.
`;

    chatHistory.push({
      role: "system",
      parts: [{ text: systemPrompt }],
    });

    getAIResponse(socket, chatHistory);
  });

  // User message
  socket.on("user_message", async ({ message }) => {
    if (!interviewConfig) return;

    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    await getAIResponse(socket, chatHistory);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ── GROQ AI FUNCTION ────────────────────────────────────────
async function getAIResponse(socket, chatHistory) {
  try {
    socket.emit("ai_typing", true);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: chatHistory.map((msg) => ({
          role: msg.role === "model" ? "assistant" : "user",
          content: msg.parts[0].text,
        })),
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    chatHistory.push({
      role: "model",
      parts: [{ text }],
    });

    socket.emit("ai_typing", false);
    socket.emit("ai_message", { message: text });
  } catch (err) {
    socket.emit("ai_typing", false);
    socket.emit("error", {
      message: "AI error: " + err.message,
    });
  }
}

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});