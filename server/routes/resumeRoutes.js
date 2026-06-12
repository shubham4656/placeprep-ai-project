const express = require("express");
const router = express.Router();
const {
  uploadResume,
  analyzeResumeById,
  getUserResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const { upload, cloudinary } = require("../config/cloudinary");

// Middleware to upload buffer to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "placeprep-resumes",
          resource_type: "raw",
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    req.file.path = result.secure_url;
    req.file.filename = result.public_id;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cloudinary upload failed: " + error.message,
    });
  }
};

// Routes
router.get("/", protect, getUserResumes);
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadToCloudinary,
  uploadResume
);
router.post("/analyze/:id", protect, analyzeResumeById);
router.get("/:id", protect, getResumeById);
router.delete("/:id", protect, deleteResume);

module.exports = router;