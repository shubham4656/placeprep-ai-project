const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Result = require("../models/Result");
const User = require("../models/User");
const { generateQuizFeedback } = require("./aiController");

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Private
const getAllQuizzes = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quiz/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a quiz
// @route   POST /api/quiz
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, duration, category, difficulty } =
      req.body;

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      duration,
      category,
      difficulty,
      totalMarks: questions.length,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quiz/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (Array.isArray(payload.questions)) {
      payload.totalMarks = payload.questions.length;
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quiz/:id
// @access  Private/Admin
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id).populate("questions");

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    const evaluatedAnswers = quiz.questions.map((question) => {
      const userAnswer = answers.find(
        (a) => a.question === question._id.toString(),
      );
      const isCorrect = userAnswer?.selectedAnswer === question.answer;
      if (isCorrect) score++;

      return {
        question: question._id,
        selectedAnswer: userAnswer?.selectedAnswer || "",
        isCorrect,
      };
    });

    const totalMarks = quiz.questions.length;
    const percentage = Math.round((score / totalMarks) * 100);
    const passed = percentage >= 50;

    // Generate AI feedback
    let aiFeedback = {
      summary: "",
      strengths: [],
      weaknesses: [],
      recommendations: [],
    };

    try {
      aiFeedback = await generateQuizFeedback(
        quiz.questions,
        evaluatedAnswers,
        percentage,
      );
    } catch (err) {
      console.log("AI feedback skipped:", err.message);
    }

    // Save result
    const result = await Result.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: evaluatedAnswers,
      score,
      totalMarks,
      percentage,
      timeTaken,
      aiFeedback,
      passed,
    });

    // Update user progress
    const allResults = await Result.find({ user: req.user._id });
    const totalQuizzes = allResults.length;
    const avgScore =
      allResults.reduce((acc, r) => acc + r.percentage, 0) / totalQuizzes;

    await User.findByIdAndUpdate(req.user._id, {
      "progress.totalQuizzes": totalQuizzes,
      "progress.totalScore": allResults.reduce((acc, r) => acc + r.score, 0),
      "progress.averageScore": Math.round(avgScore),
    });

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        result,
        score,
        totalMarks,
        percentage,
        passed,
        aiFeedback,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all questions
// @route   GET /api/quiz/questions
// @access  Private/Admin
const getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a question
// @route   POST /api/quiz/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    const question = await Question.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a question
// @route   DELETE /api/quiz/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user results
// @route   GET /api/quiz/results
// @access  Private
const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate("quiz", "title category difficulty")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single result
// @route   GET /api/quiz/results/:id
// @access  Private
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("quiz", "title category difficulty duration")
      .populate("answers.question");

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Result not found" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
