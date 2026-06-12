const express = require("express");
const router = express.Router();
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getAllQuestions,
  createQuestion,
  deleteQuestion,
  getUserResults,
  getResultById,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Question routes
router.get("/questions", protect, authorizeRoles("admin"), getAllQuestions);
router.post("/questions", protect, authorizeRoles("admin"), createQuestion);
router.delete("/questions/:id", protect, authorizeRoles("admin"), deleteQuestion);

// Result routes
router.get("/results", protect, getUserResults);
router.get("/results/:id", protect, getResultById);

// Quiz routes
router.get("/", protect, getAllQuizzes);
router.post("/", protect, authorizeRoles("admin"), createQuiz);
router.get("/:id", protect, getQuizById);
router.put("/:id", protect, authorizeRoles("admin"), updateQuiz);
router.delete("/:id", protect, authorizeRoles("admin"), deleteQuiz);
router.post("/:id/submit", protect, submitQuiz);

module.exports = router;