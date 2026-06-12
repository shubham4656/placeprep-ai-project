import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  BookOpen,
  BarChart3,
  ChevronRight,
  Sparkles,
  Target,
} from "lucide-react";
import { getDifficultyColor } from "../../utils/scoreHelper";

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
      }}
      onClick={() => navigate(`/quiz/${quiz._id}`)}
      className="
        group
        relative
        overflow-hidden
        cursor-pointer
        rounded-[28px]
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-200
        p-6
        shadow-xl
        hover:shadow-2xl
        transition-all
      "
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/20 px-3 py-1 text-xs font-semibold text-indigo-600">
            {quiz.category}
          </span>

          <span
            className={`${getDifficultyColor(
              quiz.difficulty,
            )} rounded-full px-3 py-1 text-xs font-semibold`}
          >
            {quiz.difficulty}
          </span>
        </div>

        <div
          className="
            h-10 w-10
            rounded-xl
            bg-gray-100
            dark:bg-dark-300
            flex items-center justify-center
            group-hover:bg-indigo-600
            transition-all
          "
        >
          <ChevronRight
            size={18}
            className="
              text-gray-500
              group-hover:text-white
              group-hover:translate-x-0.5
              transition-all
            "
          />
        </div>
      </div>

      {/* Icon */}
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
          mb-4
        "
      >
        <Sparkles size={24} />
      </div>

      {/* Title */}
      <h3 className="min-h-[56px] text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-3">
        {quiz.title}
      </h3>

      {/* Description */}
      {quiz.description ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-5">
          {quiz.description}
        </p>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
          Test your knowledge and improve your placement preparation skills.
        </p>
      )}

      {/* Assessment Info */}
      <div
        className="
    mb-5
    rounded-2xl
    border border-indigo-100 dark:border-indigo-800
    bg-gradient-to-r
    from-indigo-50
    to-purple-50
    dark:from-indigo-900/20
    dark:to-purple-900/20
    p-4
  "
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Assessment Type
        </p>

        <h4 className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
          {quiz.category} Practice Assessment
        </h4>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          AI-powered placement preparation quiz
        </p>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-3 border-t border-gray-100 dark:border-gray-700 pt-5 mt-5">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <BookOpen size={16} className="text-indigo-600" />
          </div>

          <p className="text-xs text-gray-500">Questions</p>

          <p className="font-bold text-gray-900 dark:text-white">
            {quiz.questions?.length || 0}
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Clock size={16} className="text-purple-600" />
          </div>

          <p className="text-xs text-gray-500">Duration</p>

          <p className="font-bold text-gray-900 dark:text-white">
            {quiz.duration}m
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-1">
            <BarChart3 size={16} className="text-green-600" />
          </div>

          <p className="text-xs text-gray-500">Marks</p>

          <p className="font-bold text-gray-900 dark:text-white">
            {quiz.totalMarks}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="
    mt-5
    flex items-center justify-between
    rounded-2xl
    bg-gradient-to-r
    from-indigo-600/10
    to-purple-600/10
    dark:from-indigo-900/20
    dark:to-purple-900/20
    px-4 py-3
  "
      >
        <div className="flex items-center gap-2">
          <Target size={16} className="text-indigo-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Assessment
          </span>
        </div>

        <ChevronRight size={16} className="text-indigo-600" />
      </div>
    </motion.div>
  );
};

export default QuizCard;
