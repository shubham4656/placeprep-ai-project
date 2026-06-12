const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getLeaderboard,
  updateProfile,
  getAllUsers,
  deleteUser,
  getAdminAnalytics,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Protected routes
router.get("/dashboard", protect, getDashboard);
router.get("/leaderboard", protect, getLeaderboard);
router.put("/profile", protect, updateProfile);

// Admin only routes
router.get("/analytics", protect, authorizeRoles("admin"), getAdminAnalytics);
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
