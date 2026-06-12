const User = require("../models/User");
const Result = require("../models/Result");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// @desc    Get user dashboard stats
// @route   GET /api/user/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const results = await Result.find({ user: req.user._id })
      .populate("quiz", "title category difficulty")
      .sort({ createdAt: -1 })
      .limit(5);

    const totalQuizzes = await Result.countDocuments({ user: req.user._id });
    const totalScore = await Result.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$score" } } },
    ]);

    const categoryStats = await Result.aggregate([
      { $match: { user: req.user._id } },
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz",
          foreignField: "_id",
          as: "quizData",
        },
      },
      { $unwind: "$quizData" },
      {
        $group: {
          _id: "$quizData.category",
          avgScore: { $avg: "$percentage" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        recentResults: results,
        stats: {
          totalQuizzes,
          totalScore: totalScore[0]?.total || 0,
          averageScore: user.progress.averageScore,
        },
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/user/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: "student" })
      .select("name email avatar progress")
      .sort({ "progress.averageScore": -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/user/all
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).select("-refreshToken");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get admin analytics summary
// @route   GET /api/user/analytics
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalQuizzes = await Quiz.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalAttempts = await Result.countDocuments();

    const averageScoreData = await Result.aggregate([
      { $group: { _id: null, averageScore: { $avg: "$percentage" } } },
    ]);

    const categoryPerformance = await Result.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz",
          foreignField: "_id",
          as: "quizData",
        },
      },
      { $unwind: "$quizData" },
      {
        $group: {
          _id: "$quizData.category",
          averageScore: { $avg: "$percentage" },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { attempts: -1, averageScore: -1 } },
    ]);

    const topPerformers = await User.find({ role: "student" })
      .select("name email progress")
      .sort({ "progress.averageScore": -1 })
      .limit(5);

    const userGrowth = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalQuizzes,
        totalQuestions,
        totalAttempts,
        averageScore: Math.round(averageScoreData[0]?.averageScore || 0),
        categoryPerformance,
        topPerformers,
        userGrowth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getLeaderboard,
  updateProfile,
  getAllUsers,
  deleteUser,
  getAdminAnalytics,
};
