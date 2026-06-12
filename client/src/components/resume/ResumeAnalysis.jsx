import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  Tag,
  RefreshCw,
  Brain,
  TrendingUp,
  Award,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { analyzeResume } from "../../api/axios";
import toast from "react-hot-toast";

const ResumeAnalysis = ({ resume, onAnalysisComplete }) => {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);

      const res = await analyzeResume(resume._id, {
        resumeText,
      });

      toast.success("Resume analyzed successfully!");

      if (onAnalysisComplete) {
        onAnalysisComplete(res.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Analysis failed, please try again",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";

    if (score >= 60) return "from-yellow-500 to-orange-500";

    return "from-red-500 to-rose-600";
  };

  if (resume.aiScore > 0) {
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
        className="space-y-6"
      >
        {/* Hero Score Card */}
        <div
          className={`
            relative overflow-hidden
            rounded-[32px]
            bg-gradient-to-r
            ${getScoreGradient(resume.aiScore)}
            p-8
            text-white
            shadow-2xl
          `}
        >
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md mb-4">
                <Sparkles size={16} />
                ATS Resume Analysis
              </div>

              <h2 className="text-4xl font-black">ATS Score Report</h2>

              <p className="mt-3 text-white/80 max-w-xl">
                AI-powered resume evaluation based on ATS standards, recruiter
                expectations and placement readiness.
              </p>

              <button
                onClick={() => setShowManual(true)}
                className="
                  mt-5
                  inline-flex items-center gap-2
                  rounded-2xl
                  bg-white/20
                  px-4 py-3
                  font-medium
                  backdrop-blur-md
                "
              >
                <RefreshCw size={16} />
                Re-Analyze Resume
              </button>
            </div>

            {/* Score Circle */}
            <div className="relative">
              <div className="h-44 w-44 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{resume.aiScore}</span>

                <span className="text-white/80 text-sm">ATS Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Brain size={22} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Summary
              </h3>

              <p className="text-sm text-gray-500">
                Resume evaluation overview
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {resume.overallFeedback}
          </p>
        </div>

        {/* Re Analyze */}
        {showManual && (
          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-6 shadow-xl">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Re-Analyze Resume
            </h3>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              placeholder="Paste updated resume text..."
              className="input-field resize-none mb-4"
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                py-3
                text-white
                font-semibold
                flex items-center justify-center gap-2
              "
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Star size={18} />
                  Re-Analyze Resume
                </>
              )}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="rounded-3xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <Award className="text-green-600 mb-3" size={24} />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Resume Score
            </h4>
            <p
              className={`text-4xl font-black mt-2 ${getScoreColor(
                resume.aiScore,
              )}`}
            >
              {resume.aiScore}
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <CheckCircle2 className="text-green-600 mb-3" size={24} />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Keywords Found
            </h4>
            <p className="text-4xl font-black mt-2 text-green-600">
              {resume.keywords?.found?.length || 0}
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <AlertTriangle className="text-red-600 mb-3" size={24} />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Missing Keywords
            </h4>
            <p className="text-4xl font-black mt-2 text-red-600">
              {resume.keywords?.missing?.length || 0}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
            Resume Sections
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(resume.sections || {}).map(([key, value]) => (
              <div
                key={key}
                className="
                  flex items-center gap-3
                  rounded-2xl
                  border border-gray-100
                  dark:border-gray-700
                  p-4
                "
              >
                {value ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <XCircle size={20} className="text-red-500" />
                )}

                <span className="font-medium capitalize text-gray-700 dark:text-gray-300">
                  {key.replace("has", "")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-green-50 dark:bg-green-900/20 p-6">
            <h3 className="font-bold text-green-700 dark:text-green-300 mb-4">
              ✅ Found Keywords
            </h3>

            <div className="flex flex-wrap gap-2">
              {resume.keywords?.found?.map((kw, index) => (
                <span
                  key={index}
                  className="
                      rounded-full
                      bg-green-100
                      dark:bg-green-900/40
                      px-3 py-1
                      text-sm
                      text-green-700
                      dark:text-green-300
                    "
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-red-50 dark:bg-red-900/20 p-6">
            <h3 className="font-bold text-red-700 dark:text-red-300 mb-4">
              ❌ Missing Keywords
            </h3>

            <div className="flex flex-wrap gap-2">
              {resume.keywords?.missing?.map((kw, index) => (
                <span
                  key={index}
                  className="
                      rounded-full
                      bg-red-100
                      dark:bg-red-900/40
                      px-3 py-1
                      text-sm
                      text-red-700
                      dark:text-red-300
                    "
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp size={22} className="text-indigo-600" />

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Improvement Suggestions
            </h3>
          </div>

          <div className="space-y-4">
            {resume.suggestions?.map((item, index) => (
              <div
                key={index}
                className="
                    rounded-2xl
                    bg-indigo-50
                    dark:bg-indigo-900/20
                    p-4
                  "
              >
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {item.category}
                  </span>

                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

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
      <div className="flex items-center gap-3 mb-6">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center">
          <FileText size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Resume Analysis
          </h2>

          <p className="text-gray-500">Analyze your resume using AI</p>
        </div>
      </div>

      <div className="rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 mb-5">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Auto-analysis failed. Paste your resume content below for AI-powered
          ATS analysis.
        </p>
      </div>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={10}
        placeholder="Paste your resume content here..."
        className="input-field resize-none mb-5"
      />

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !resumeText.trim()}
        className="
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          py-4
          text-white
          font-semibold
          flex items-center justify-center gap-2
        "
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing Resume...
          </>
        ) : (
          <>
            <Star size={18} />
            Analyze Resume
          </>
        )}
      </button>
    </motion.div>
  );
};

export default ResumeAnalysis;
