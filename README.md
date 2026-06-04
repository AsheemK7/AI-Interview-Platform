# 🎤 AI Interview Practice App

A full-stack AI-powered interview practice tool using React + Node.js + Gemini + Socket.IO.

---

## Prerequisites

- Node.js v18+ → https://nodejs.org
- MongoDB (Community) → https://www.mongodb.com/try/download/community
- Gemini API Key → https://aistudio.google.com (free)
- Chrome or Edge browser (for voice input)

---

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Edit `.env` and fill in your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-interview
JWT_SECRET=any_random_secret_string
GEMINI_API_KEY=your_key_from_aistudio.google.com
```

Start the backend:
```bash
node server.js
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in Chrome.

---

## How to Use

1. **Sign up** with your name, email, password
2. **Choose** your target position, experience level, and difficulty
3. **Click "Start Interview"**
4. **Hold the mic button** to speak your answer (or type in the text box)
5. The AI interviewer will ask 5 questions and give a summary
6. **Click "End & Save"** to save the transcript

---

## Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React + Vite             |
| Backend   | Node.js + Express        |
| Database  | MongoDB + Mongoose       |
| Auth      | JWT + bcryptjs           |
| Real-time | Socket.IO                |
| AI        | Google Gemini 1.5 Flash  |
| Voice In  | Web Speech API (browser) |
| Voice Out | SpeechSynthesis (browser)|
