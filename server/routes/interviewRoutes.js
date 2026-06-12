const express = require("express");
const router = express.Router();
const {
  startMockInterview,
  answerInterview,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

// Protected routes
router.post("/start", protect, startMockInterview);
router.post("/answer", protect, answerInterview);

module.exports = router;