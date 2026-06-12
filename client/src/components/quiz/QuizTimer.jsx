import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock3, AlertTriangle, Timer } from "lucide-react";
import { formatTime } from "../../utils/scoreHelper";

const QuizTimer = ({ duration, onTimeUp, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        if (onTick) {
          onTick(duration * 60 - newTime);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleTimeUp, duration, onTick]);

  const totalTime = duration * 60;

  const progress = (timeLeft / totalTime) * 100;

  const isWarning = timeLeft <= 60;
  const isDanger = timeLeft <= 30;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        px-5
        py-4
        shadow-xl
        backdrop-blur-xl
        ${
          isDanger
            ? `
              border-red-300
              bg-red-50
              dark:bg-red-900/20
            `
            : isWarning
              ? `
              border-yellow-300
              bg-yellow-50
              dark:bg-yellow-900/20
            `
              : `
              border-gray-200
              dark:border-gray-700
              bg-white
              dark:bg-dark-200
            `
        }
      `}
    >
      {/* Progress Background */}
      <div className="absolute inset-0">
        <div
          className={`
            h-full transition-all duration-1000
            ${
              isDanger
                ? "bg-red-500/10"
                : isWarning
                  ? "bg-yellow-500/10"
                  : "bg-indigo-500/10"
            }
          `}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div
            className={`
              h-12 w-12
              rounded-2xl
              flex items-center justify-center
              shadow-lg
              ${
                isDanger
                  ? "bg-red-500 text-white animate-pulse"
                  : isWarning
                    ? "bg-yellow-500 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              }
            `}
          >
            {isDanger ? <AlertTriangle size={22} /> : <Clock3 size={22} />}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Time Remaining
            </p>

            <h3
              className={`
                text-2xl
                font-black
                tracking-wider
                font-mono
                ${
                  isDanger
                    ? "text-red-600"
                    : isWarning
                      ? "text-yellow-600"
                      : "text-gray-900 dark:text-white"
                }
              `}
            >
              {formatTime(timeLeft)}
            </h3>
          </div>
        </div>

        {/* Right */}
        <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-gray-100 dark:bg-dark-300 px-4 py-2">
          <Timer size={16} className="text-indigo-600" />

          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Warning Message */}
      {isDanger && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="relative z-10 mt-3 text-xs font-semibold text-red-600"
        >
          ⚠ Less than 30 seconds remaining!
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizTimer;
