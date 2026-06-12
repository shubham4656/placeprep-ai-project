const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      default: "",
    },
    aiScore: {
      type: Number,
      default: 0,
    },
    suggestions: [
      {
        category: { type: String },
        message: { type: String },
      },
    ],
    keywords: {
      found: [String],
      missing: [String],
    },
    sections: {
      hasEducation: { type: Boolean, default: false },
      hasExperience: { type: Boolean, default: false },
      hasSkills: { type: Boolean, default: false },
      hasProjects: { type: Boolean, default: false },
      hasSummary: { type: Boolean, default: false },
    },
    overallFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);