const Resume = require("../models/Resume");
const { cloudinary } = require("../config/cloudinary");
const { analyzeResume } = require("./aiController");
const pdfParse = require("pdf-parse");

// @desc    Upload and auto-analyze resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const fileUrl = req.file.path;
    const fileName = req.file.originalname;

    // Extract text from buffer BEFORE uploading
    let resumeText = "";
    try {
      // req.file.buffer contains the file data
      if (req.file.buffer) {
        const pdfData = await pdfParse(req.file.buffer);
        resumeText = pdfData.text;
        console.log("✅ PDF text extracted, length:", resumeText.length);
      }
    } catch (err) {
      console.log("❌ PDF text extraction failed:", err.message);
    }

    // Create resume record
    const resume = await Resume.create({
      user: req.user._id,
      fileUrl,
      fileName,
    });

    // Auto analyze if text extracted successfully
    if (resumeText && resumeText.trim().length > 50) {
      try {
        console.log("🤖 Starting AI analysis...");
        const analysis = await analyzeResume(resumeText);

        if (analysis) {
          const updatedResume = await Resume.findByIdAndUpdate(
            resume._id,
            {
              aiScore: analysis.aiScore,
              suggestions: analysis.suggestions,
              keywords: analysis.keywords,
              sections: analysis.sections,
              overallFeedback: analysis.overallFeedback,
            },
            { new: true }
          );

          console.log("✅ AI analysis complete, score:", analysis.aiScore);

          return res.status(201).json({
            success: true,
            message: "Resume uploaded and analyzed successfully",
            data: updatedResume,
          });
        }
      } catch (err) {
        console.log("❌ AI analysis failed:", err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Resume uploaded. Please paste text for analysis.",
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Manually analyze resume with pasted text
// @route   POST /api/resume/analyze/:id
// @access  Private
const analyzeResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resume",
      });
    }

    const resumeText = req.body.resumeText;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Please paste your resume text for analysis",
      });
    }

    const analysis = await analyzeResume(resumeText);

    if (!analysis) {
      return res.status(500).json({
        success: false,
        message: "AI analysis failed, please try again",
      });
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      {
        aiScore: analysis.aiScore,
        suggestions: analysis.suggestions,
        keywords: analysis.keywords,
        sections: analysis.sections,
        overallFeedback: analysis.overallFeedback,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: updatedResume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all resumes of logged in user
// @route   GET /api/resume
// @access  Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resume",
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this resume",
      });
    }

    const publicId = resume.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`placeprep-resumes/${publicId}`, {
      resource_type: "raw",
    });

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  analyzeResumeById,
  getUserResumes,
  getResumeById,
  deleteResume,
};