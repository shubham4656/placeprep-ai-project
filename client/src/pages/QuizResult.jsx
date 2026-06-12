import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResultById } from "../api/axios";
import ResultCard from "../components/quiz/ResultCard";
import QuestionCard from "../components/quiz/QuestionCard";
import Loader from "../components/common/Loader";
import { motion } from "framer-motion";
import { Trophy, Brain, CheckCircle2, Sparkles } from "lucide-react";

const QuizResult = () => {
  const { id } = useParams();

  const { data: result, isLoading } = useQuery({
    queryKey: ["result", id],
    queryFn: async () => {
      const res = await getResultById(id);
      return res.data.data;
    },
  });

  if (isLoading) {
    return <Loader fullScreen text="Loading results..." />;
  }

  if (!result) return null;

  return (
    <div className="page-container max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-r
          from-indigo-600
          via-purple-600
          to-fuchsia-600
          p-8 md:p-10
          text-white
          shadow-2xl
          mb-8
        "
      >
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md">
              <Sparkles size={16} />
              AI Powered Assessment
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-black">
              Quiz Results
            </h1>

            <p className="mt-3 text-white/80 max-w-xl">
              Review your performance, analyze mistakes and improve with
              AI-generated feedback.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <Trophy size={20} />
              <h3 className="text-3xl font-bold mt-2">{result.percentage}%</h3>
              <p className="text-sm text-white/70">Final Score</p>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <CheckCircle2 size={20} />
              <h3 className="text-3xl font-bold mt-2">
                {result.passed ? "Pass" : "Retry"}
              </h3>
              <p className="text-sm text-white/70">Result</p>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <Brain size={20} />
              <h3 className="text-3xl font-bold mt-2">AI</h3>
              <p className="text-sm text-white/70">Feedback</p>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <Trophy size={20} />
              <h3 className="text-3xl font-bold mt-2">{result.score}</h3>
              <p className="text-sm text-white/70">Marks</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Result Summary */}
      <ResultCard result={result} />

      {/* Answer Review */}
      {result.answers?.length > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-10"
        >
          <div className="flex items-center gap-3 mb-6">
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
              <Brain size={22} />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Answer Review
              </h2>

              <p className="text-gray-500 dark:text-gray-400">
                Compare your answers with the correct solutions.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {result.answers.map((ans, index) => (
              <QuestionCard
                key={index}
                question={ans.question}
                index={index}
                selectedAnswer={ans.selectedAnswer}
                showResult={true}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuizResult;
