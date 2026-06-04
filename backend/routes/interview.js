const express   = require("express");
const Interview = require("../models/Interview");
const auth      = require("../middleware/auth");
const router    = express.Router();

// START INTERVIEW — creates a new interview session
router.post("/start", auth, async (req, res) => {
  try {
    const { position, experience, difficulty } = req.body;
    const interview = await Interview.create({
      userId: req.userId,
      position,
      experience,
      difficulty,
      isStart: true,
    });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// STOP INTERVIEW — saves final transcript and marks done
router.put("/stop/:id", auth, async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { isStart: false, chatTranscript: req.body.chatTranscript },
      { new: true }
    );
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all interviews for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
