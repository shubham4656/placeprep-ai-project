
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getUserResumes, deleteResume } from "../api/axios";
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeAnalysis from "../components/resume/ResumeAnalysis";
import Loader from "../components/common/Loader";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import {
  Sparkles,
  Brain,
  FileText,
  Trash2,
  ChevronRight,
} from "lucide-react";

const ResumeAnalyzer = () => {
  const [selectedResume, setSelectedResume] = useState(null);

  const { data: resumes, isLoading, refetch } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const res = await getUserResumes();
      return res.data.data;
    },
  });

  const handleUploadSuccess = (resume) => {
    refetch();
    setSelectedResume(resume);
    if (resume.aiScore > 0) {
      toast.success("Resume uploaded and analyzed automatically!");
    }
  };

  const handleAnalysisComplete = (updatedResume) => {
    setSelectedResume(updatedResume);
    refetch();
  };

  const handleDelete = async (id) => {
    try {
      await deleteResume(id);
      toast.success("Resume deleted");
      if (selectedResume?._id === id) setSelectedResume(null);
      refetch();
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  return (
    <div className="page-container max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-8 md:p-10 text-white shadow-[0_20px_60px_rgba(99,102,241,0.35)] mb-8">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md mb-4">
            <Sparkles size={16} />
            ATS Resume Intelligence
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3">
            AI Resume Analyzer
          </h1>

          <p className="text-white/80 max-w-2xl">
            Upload resumes, receive ATS scoring, keyword insights,
            recruiter-focused feedback and AI recommendations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4">
              <h3 className="text-3xl font-black">{resumes?.length || 0}</h3>
              <p className="text-white/70 text-sm">Resumes</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4">
              <h3 className="text-3xl font-black">ATS</h3>
              <p className="text-white/70 text-sm">Analysis</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4">
              <h3 className="text-3xl font-black">AI</h3>
              <p className="text-white/70 text-sm">Suggestions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />

          {isLoading ? (
            <Loader text="Loading resumes..." />
          ) : resumes?.length > 0 ? (
            <div className="rounded-[36px] border border-white/20 bg-white/80 dark:bg-dark-200/80 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center">
                  <Brain size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Resume Library
                  </h3>
                  <p className="text-xs text-gray-500">
                    Uploaded resumes
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {resumes.map((resume) => (
                  <motion.div
                    key={resume._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedResume(resume)}
                    className={`cursor-pointer rounded-3xl border p-5 transition-all hover:shadow-xl ${
                      selectedResume?._id === resume._id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center">
                        <FileText size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {resume.fileName || "Resume"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(resume.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume._id);
                        }}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="xl:col-span-8">
          {selectedResume ? (
            <ResumeAnalysis
              resume={selectedResume}
              onAnalysisComplete={handleAnalysisComplete}
            />
          ) : (
            <div className="rounded-[36px] border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-200 shadow-2xl flex flex-col items-center justify-center py-32 text-center">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-6">
                <FileText size={42} />
              </div>

              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Resume Analysis Dashboard
              </h2>

              <p className="text-gray-500 mt-4 max-w-md">
                Upload or select a resume to unlock ATS scoring and AI insights.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-indigo-600 font-medium">
                Select Resume
                <ChevronRight size={16} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
