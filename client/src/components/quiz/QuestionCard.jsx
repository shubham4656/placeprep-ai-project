import { motion } from "framer-motion";
import { CheckCircle, Circle, Sparkles, CheckCheck } from "lucide-react";

const QuestionCard = ({
  question,
  index,
  selectedAnswer,
  onSelect,
  showResult = false,
}) => {
  const getOptionStyle = (optionValue) => {
    if (!showResult) {
      if (selectedAnswer === optionValue) {
        return `
          border-indigo-500
          bg-indigo-50
          dark:bg-indigo-900/20
          shadow-lg
          scale-[1.01]
        `;
      }

      return `
        border-gray-200
        dark:border-gray-700
        hover:border-indigo-300
        hover:bg-gray-50
        dark:hover:bg-dark-300
      `;
    }

    if (optionValue === question.answer) {
      return `
        border-green-500
        bg-green-50
        dark:bg-green-900/20
      `;
    }

    if (selectedAnswer === optionValue && optionValue !== question.answer) {
      return `
        border-red-500
        bg-red-50
        dark:bg-red-900/20
      `;
    }

    return `
      border-gray-200
      dark:border-gray-700
      opacity-60
    `;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 250,
      }}
      className="
        rounded-[28px]
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-200
        shadow-xl
        p-6
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="
            h-12 w-12
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            flex items-center justify-center
            text-white
            shadow-lg
          "
        >
          <Sparkles size={18} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600">
            Question {index + 1}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select the most appropriate answer
          </p>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
        {question.text}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option) => (
          <motion.button
            whileHover={!showResult ? { scale: 1.01 } : {}}
            whileTap={!showResult ? { scale: 0.99 } : {}}
            key={option.value}
            onClick={() => !showResult && onSelect(question._id, option.value)}
            disabled={showResult}
            className={`
              w-full
              flex items-center gap-4
              rounded-2xl
              border-2
              p-4
              text-left
              transition-all duration-300
              ${getOptionStyle(option.value)}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {selectedAnswer === option.value ? (
                <CheckCircle
                  size={22}
                  className={
                    showResult
                      ? option.value === question.answer
                        ? "text-green-500"
                        : "text-red-500"
                      : "text-indigo-600"
                  }
                />
              ) : (
                <Circle size={22} className="text-gray-400" />
              )}
            </div>

            {/* Option Label */}
            <div>
              <span className="mr-2 text-xs font-bold text-gray-400">
                {option.label}
              </span>

              <span className="font-medium text-gray-800 dark:text-gray-200">
                {option.value}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      {showResult && question.explanation && (
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{
            opacity: 1,
            height: "auto",
          }}
          className="
            mt-6
            rounded-2xl
            border border-blue-200
            dark:border-blue-800
            bg-blue-50
            dark:bg-blue-900/20
            p-5
          "
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCheck size={18} className="text-blue-600" />

            <h4 className="font-semibold text-blue-700 dark:text-blue-300">
              Explanation
            </h4>
          </div>

          <p className="text-sm leading-relaxed text-blue-600 dark:text-blue-400">
            {question.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
