const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["mcq", "coding", "hr"],
      default: "mcq",
    },
    options: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    explanation: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["DSA", "OS", "DBMS", "Aptitude", "HR", "Networking", "OOP"],
      required: true,
    },
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);