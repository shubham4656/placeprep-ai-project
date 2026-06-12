import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

import { getQuizById } from "../api/axios";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizTimer from "../components/quiz/QuizTimer";
import useQuiz from "../hooks/useQuiz";
import Loader from "../components/common/Loader";

const QuizAttempt = () => {
  const { id } = useParams();

  const [timeTaken, setTimeTaken] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const res = await getQuizById(id);
      return res.data.data;
    },
  });

  const {
    answers,
    currentQuestion,
    setCurrentQuestion,
    isSubmitting,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    handleSubmit,
  } = useQuiz(id);

  const handleTimeUp = useCallback(() => {
    handleSubmit(timeTaken);
  }, [handleSubmit, timeTaken]);

  const handleTick = useCallback((elapsed) => {
    setTimeTaken(elapsed);
  }, []);

  if (isLoading) {
    return <Loader fullScreen text="Loading quiz..." />;
  }

  if (!quiz) return null;

  const questions = quiz.questions || [];
  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[currentQuestion];

  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="page-container max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-r
          from-indigo-600
          via-purple-600
          to-fuchsia-600
          p-8
          shadow-2xl
          mb-8
        "
      >
        <div className="absolute right-0 top-0 h-48 w-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white text-sm mb-4">
              <Sparkles size={15} />
              AI Powered Assessment
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white">
              {quiz.title}
            </h1>

            <p className="text-white/80 mt-2">
              {quiz.category} • {quiz.difficulty}
            </p>
          </div>

          <QuizTimer
            duration={quiz.duration}
            onTimeUp={handleTimeUp}
            onTick={handleTick}
          />
        </div>
      </motion.div>

      {/* Progress */}
      <div className="bg-white dark:bg-dark-200 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Quiz Progress
          </span>

          <span className="text-sm font-bold text-indigo-600">
            {answeredCount}/{questions.length} Answered
          </span>
        </div>

        <div className="h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-dark-300">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{ duration: 0.4 }}
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
            "
          />
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-3 mb-8">
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`
              h-11 w-11
              rounded-xl
              font-bold
              transition-all

              ${
                index === currentQuestion
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : answers[q?._id]
                    ? "bg-green-500 text-white"
                    : "bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700"
              }
            `}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      {currentQ && (
        <QuestionCard
          question={currentQ}
          index={currentQuestion}
          selectedAnswer={answers[currentQ._id]}
          onSelect={selectAnswer}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="
            flex items-center gap-2
            px-6 py-3
            rounded-2xl
            bg-white
            dark:bg-dark-200
            border border-gray-200
            dark:border-gray-700
            font-semibold
            disabled:opacity-50
          "
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => nextQuestion(questions.length)}
            className="
              flex items-center gap-2
              px-7 py-3
              rounded-2xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              shadow-xl
            "
          >
            Next Question
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="
              flex items-center gap-2
              px-7 py-3
              rounded-2xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              shadow-xl
            "
          >
            <Send size={18} />
            Submit Quiz
          </button>
        )}
      </div>

      {/* Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-white
              dark:bg-dark-100
              p-7
              shadow-2xl
            "
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <AlertTriangle className="text-yellow-500" />
              </div>

              <h3 className="text-xl font-bold">Submit Quiz?</h3>
            </div>

            <p className="text-gray-500 mb-3">
              You answered
              <span className="font-bold text-indigo-600 mx-1">
                {answeredCount}
              </span>
              out of
              <span className="font-bold mx-1">{questions.length}</span>
              questions.
            </p>

            {answeredCount < questions.length && (
              <div className="rounded-2xl bg-yellow-50 text-yellow-700 p-3 text-sm mb-4">
                {questions.length - answeredCount} questions are still
                unanswered.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-3 rounded-2xl border border-gray-200 font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => {
                  setShowConfirm(false);
                  handleSubmit(timeTaken);
                }}
                className="
                  py-3
                  rounded-2xl
                  text-white
                  font-semibold
                  bg-gradient-to-r
                  from-indigo-600
                  to-purple-600
                "
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
