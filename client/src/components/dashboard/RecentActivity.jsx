import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronRight,
  Activity,
} from "lucide-react";
import { getScoreBg } from "../../utils/scoreHelper";
import { timeAgo } from "../../utils/formatDate";

const RecentActivity = ({ results = [] }) => {
  const navigate = useNavigate();

  if (results.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/20">
            <Activity size={20} className="text-indigo-600" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your latest quiz performance
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 dark:bg-dark-300">
            <Clock3 size={30} className="text-gray-400 dark:text-gray-500" />
          </div>

          <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No Activity Yet
          </h4>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Start taking quizzes to track your progress and performance.
          </p>

          <button
            onClick={() => navigate("/quiz")}
            className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          >
            Take Your First Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        rounded-3xl
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-dark-200
        shadow-xl
        p-6
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/20">
            <Activity size={20} className="text-indigo-600" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Latest quiz attempts and scores
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/quiz")}
          className="
            flex items-center gap-1
            rounded-xl
            px-3 py-2
            text-sm font-medium
            text-indigo-600
            hover:bg-indigo-50
            dark:hover:bg-indigo-900/20
            transition-all
          "
        >
          View All
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Activities */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <motion.div
            key={result._id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/quiz/results/${result._id}`)}
            className="
              group
              flex items-center gap-4
              rounded-2xl
              border border-gray-100 dark:border-gray-700
              bg-gray-50 dark:bg-dark-300
              p-4
              cursor-pointer
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
            "
          >
            {/* Status */}
            <div className="flex-shrink-0">
              {result.passed ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/20">
                  <CheckCircle2 size={22} className="text-green-600" />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/20">
                  <XCircle size={22} className="text-red-600" />
                </div>
              )}
            </div>

            {/* Quiz Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {result.quiz?.title || "Quiz"}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {result.quiz?.category || "General"} •{" "}
                {timeAgo(result.createdAt)}
              </p>
            </div>

            {/* Score */}
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${getScoreBg(
                result.percentage,
              )}`}
            >
              {result.percentage}%
            </div>

            <ChevronRight
              size={18}
              className="
                text-gray-400
                group-hover:translate-x-1
                transition-transform
              "
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
