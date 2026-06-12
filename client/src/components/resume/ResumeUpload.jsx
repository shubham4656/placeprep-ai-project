import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { uploadResume } from "../../api/axios";
import toast from "react-hot-toast";

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile?.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];

    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadResume(formData);

      toast.success("Resume uploaded successfully!");

      if (onUploadSuccess) {
        onUploadSuccess(res.data.data);
      }

      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-[32px]
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-200
        p-8
        shadow-2xl
      "
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="
            h-14 w-14
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            flex items-center justify-center
            text-white
            shadow-lg
          "
        >
          <FileText size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload Resume
          </h2>

          <p className="text-sm text-gray-500">
            Upload your resume for ATS analysis
          </p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative
          overflow-hidden
          cursor-pointer
          rounded-[28px]
          border-2 border-dashed
          p-10
          text-center
          transition-all duration-300

          ${
            isDragging
              ? `
                border-indigo-500
                bg-indigo-50
                dark:bg-indigo-900/20
              `
              : `
                border-gray-300
                dark:border-gray-600
                hover:border-indigo-400
                hover:bg-gray-50
                dark:hover:bg-dark-300
              `
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />

        {!file ? (
          <div className="flex flex-col items-center">
            <div
              className="
                h-20 w-20
                rounded-3xl
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                flex items-center justify-center
                text-white
                shadow-xl
                mb-5
              "
            >
              <Upload size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Drag & Drop Resume
            </h3>

            <p className="text-gray-500 mt-2">
              Upload your PDF resume for AI-powered ATS analysis
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-dark-300 px-4 py-2 text-sm">
              <ShieldCheck size={16} />
              PDF Only • Max 5MB
            </div>
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="flex flex-col items-center"
          >
            <div
              className="
                h-20 w-20
                rounded-3xl
                bg-green-100
                dark:bg-green-900/20
                flex items-center justify-center
                text-green-600
                mb-4
              "
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white">
              {file.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="
                mt-4
                flex items-center gap-2
                rounded-xl
                bg-red-50
                px-4 py-2
                text-red-600
              "
            >
              <X size={14} />
              Remove File
            </button>
          </motion.div>
        )}
      </div>

      {/* Upload Button */}
      {file && (
        <motion.button
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          onClick={handleUpload}
          disabled={isUploading}
          className="
            mt-6
            w-full
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            py-4
            text-white
            font-semibold
            shadow-xl
            flex items-center justify-center gap-2
          "
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading Resume...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Upload & Analyze Resume
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default ResumeUpload;
