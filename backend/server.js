require("dotenv").config();
const express   = require("express");
const http      = require("http");
const cors      = require("cors");
const mongoose  = require("mongoose");
const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: "http://localhost:5173" } });

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/auth"));
app.use("/api/interview", require("./routes/interview"));

// ── Database ────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// ── Gemini setup ────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Socket.IO — Real-time interview chat ────────────────────
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Each socket keeps its own Gemini chat history
  let chatHistory = [];
  let interviewConfig = null;

  // Called once when interview starts — sets up AI persona
  socket.on("start_interview", ({ position, experience, difficulty }) => {
    interviewConfig = { position, experience, difficulty };
    chatHistory = [];

    const systemPrompt = `You are a professional interviewer conducting a job interview.
Role: ${position}
Candidate experience: ${experience}
Difficulty level: ${difficulty}

Rules:
- Ask ONE question at a time
- Wait for the candidate's answer before asking the next
- Keep questions relevant to the role
- Give brief encouraging feedback before the next question
- After 5 questions, say "Thank you! The interview is now complete." and give a short summary.
- Start by greeting the candidate and asking the first question.`;

    chatHistory.push({ role: "user", parts: [{ text: systemPrompt }] });

    // Kick off the interview
    getAIResponse(socket, chatHistory, "Hello! Let's begin.", interviewConfig);
  });

  // Called every time the user sends a voice/text message
  socket.on("user_message", async ({ message }) => {
    if (!interviewConfig) return;
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    await getAIResponse(socket, chatHistory);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

async function getAIResponse(socket, chatHistory) {
  try {
    socket.emit("ai_typing", true);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat  = model.startChat({ history: chatHistory.slice(0, -1) });

    const lastMsg = chatHistory[chatHistory.length - 1].parts[0].text;
    const result  = await chat.sendMessage(lastMsg);
    const text    = result.response.text();

    // Save AI reply to history
    chatHistory.push({ role: "model", parts: [{ text }] });

    socket.emit("ai_typing", false);
    socket.emit("ai_message", { message: text });
  } catch (err) {
    socket.emit("ai_typing", false);
    socket.emit("error", { message: "AI error: " + err.message });
  }
}

// ── Start server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
