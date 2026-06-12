const { startInterview, continueInterview } = require("./aiController");

// @desc    Start mock interview session
// @route   POST /api/interview/start
// @access  Private
const startMockInterview = async (req, res) => {
  try {
    const { jobRole, difficulty } = req.body;

    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: "Job role is required",
      });
    }

    await startInterview(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Continue mock interview session
// @route   POST /api/interview/answer
// @access  Private
const answerInterview = async (req, res) => {
  try {
    const { messages, userAnswer, questionNumber } = req.body;

    if (!userAnswer) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    if (!messages || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Conversation history is required",
      });
    }

    await continueInterview(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { startMockInterview, answerInterview };