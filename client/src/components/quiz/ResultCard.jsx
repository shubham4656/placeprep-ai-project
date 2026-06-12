import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock3,
  RotateCcw,
  Home,
  Sparkles,
  Brain,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  getScoreColor,
  getScoreLabel,
  formatTime,
} from "../../utils/scoreHelper";

const ResultCard = ({ result }) => {
  const navigate = useNavigate();

  const { score, totalMarks, percentage, passed, timeTaken, aiFeedback, quiz } =
    result;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
      }}
      className="max-w-5xl mx-auto"
    >
      {/* Hero Section */}
      <div
        className={`
          relative overflow-hidden rounded-[32px]
          p-8 md:p-10
          shadow-2xl mb-8
          ${
            passed
              ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"
              : "bg-gradient-to-r from-red-600 via-rose-600 to-pink-600"
          }
        `}
      >
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md mb-4">
              <Sparkles size={16} />
              Quiz Completed Successfully
            </div>

            <h1 className="text-4xl font-black mb-2">
              {getScoreLabel(percentage)}
            </h1>

            <p className="text-white/80 text-lg">
              {quiz?.title || "Quiz Assessment"}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3">
              {passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}

              <span className="font-semibold">
                {passed ? "Passed" : "Needs Improvement"}
              </span>
            </div>
          </div>

          {/* Score Circle */}
          <div className="relative">
            <div className="h-44 w-44 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">
                {percentage}%
              </span>

              <span className="text-white/70 text-sm mt-1">Final Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center justify-center shadow-lg mb-4">
            <Trophy size={24} />
          </div>

          <p className="text-sm text-gray-500">Score Achieved</p>

          <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2">
            {score}
            <span className="text-xl text-gray-400">/{totalMarks}</span>
          </h3>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl"
        >
          <div
            className={`
              h-14 w-14 rounded-2xl text-white
              flex items-center justify-center shadow-lg mb-4
              ${
                passed
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }
            `}
          >
            {passed ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          </div>

          <p className="text-sm text-gray-500">Result Status</p>

          <h3
            className={`text-3xl font-black mt-2 ${
              passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {passed ? "Passed" : "Failed"}
          </h3>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg mb-4">
            <Clock3 size={24} />
          </div>

          <p className="text-sm text-gray-500">Time Taken</p>

          <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
            {formatTime(timeTaken || 0)}
          </h3>
        </motion.div>
      </div>

      {/* AI Feedback */}
      {aiFeedback?.summary && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-[32px]
            border border-gray-200
            dark:border-gray-700
            bg-white
            dark:bg-dark-200
            p-8
            shadow-2xl
            mb-8
          "
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
              <Brain size={24} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Performance Analysis
              </h3>

              <p className="text-sm text-gray-500">
                Personalized feedback based on your answers
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-5 mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aiFeedback.summary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {aiFeedback.strengths?.length > 0 && (
              <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={18} className="text-green-600" />
                  <h4 className="font-bold text-green-700 dark:text-green-300">
                    Strengths
                  </h4>
                </div>

                <ul className="space-y-2">
                  {aiFeedback.strengths.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-green-700 dark:text-green-400"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiFeedback.weaknesses?.length > 0 && (
              <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} className="text-red-600" />
                  <h4 className="font-bold text-red-700 dark:text-red-300">
                    Areas for Improvement
                  </h4>
                </div>

                <ul className="space-y-2">
                  {aiFeedback.weaknesses.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-red-700 dark:text-red-400"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {aiFeedback.recommendations?.length > 0 && (
            <div className="mt-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 p-5">
              <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3">
                📚 Recommendations
              </h4>

              <ul className="space-y-2">
                {aiFeedback.recommendations.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-blue-700 dark:text-blue-400"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/quiz")}
          className="
            flex items-center justify-center gap-2
            rounded-2xl
            border border-gray-200
            dark:border-gray-700
            bg-white
            dark:bg-dark-200
            py-4
            font-semibold
            shadow-lg
            hover:shadow-xl
            transition-all
          "
        >
          <RotateCcw size={18} />
          Try Another Quiz
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="
            flex items-center justify-center gap-2
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            py-4
            text-white
            font-semibold
            shadow-xl
          "
        >
          <Home size={18} />
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default ResultCard;
