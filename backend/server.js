require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

// ── Gemini setup ────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ── Socket.IO — Real-time interview chat ────────────────────
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  let chatHistory = [];
  let interviewConfig = null;

  // Start interview
  socket.on(
    "start_interview",
    ({ position, experience, difficulty }) => {
      interviewConfig = {
        position,
        experience,
        difficulty,
      };

      chatHistory = [];

const systemPrompt = `
You are Ayesha, a professional and friendly interviewer conducting a realistic mock job interview.

Your name is Ayesha.
Never use placeholders like [Candidate's Name] or [Interviewer's Name].

Role: ${position}
Candidate experience: ${experience}
Difficulty level: ${difficulty}

Interview Rules:
- Introduce yourself as Ayesha at the beginning.
- Greet the candidate naturally.
- Call the user "Candidate" naturally when needed.
- Ask ONLY ONE interview question at a time.
- Wait for the candidate's answer before asking the next question.
- Keep questions highly relevant to the role.
- Give short encouraging feedback before moving to the next question.
- Make the interview feel realistic and professional.
- Do NOT use placeholder text.
- After exactly 5 interview questions, say:
"Thank you! The interview is now complete."
and provide a short performance summary.

Start the interview by introducing yourself as Ayesha and asking the first interview question naturally.
`;

      chatHistory.push({
        role: "user",
        parts: [{ text: systemPrompt }],
      });

      getAIResponse(socket, chatHistory);
    }
  );

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
    console.log(
      "❌ User disconnected:",
      socket.id
    );
  });
});

// ── AI Response Function ────────────────────────────────────
async function getAIResponse(socket, chatHistory) {
  try {
    socket.emit("ai_typing", true);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const chat = model.startChat({
      history: chatHistory.slice(0, -1),
    });

    const lastMessage =
      chatHistory[chatHistory.length - 1].parts[0]
        .text;

    const result =
      await chat.sendMessage(lastMessage);

    const text = result.response.text();

    // Save AI reply
    chatHistory.push({
      role: "model",
      parts: [{ text }],
    });

    socket.emit("ai_typing", false);
    socket.emit("ai_message", {
      message: text,
    });
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
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});