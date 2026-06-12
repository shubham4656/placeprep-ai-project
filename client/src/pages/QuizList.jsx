import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Trophy,
  Brain,
} from "lucide-react";
import { getAllQuizzes } from "../api/axios";
import QuizCard from "../components/quiz/QuizCard";
import Loader from "../components/common/Loader";

const CATEGORIES = [
  "All",
  "DSA",
  "OS",
  "DBMS",
  "Aptitude",
  "HR",
  "Networking",
  "OOP",
  "Mixed",
];

const DIFFICULTIES = [
  "All",
  "easy",
  "medium",
  "hard",
  "mixed",
];

const QuizList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["quizzes", category, difficulty],
    queryFn: async () => {
      const params = {};

      if (category !== "All") {
        params.category = category;
      }

      if (difficulty !== "All") {
        params.difficulty = difficulty;
      }

      const res = await getAllQuizzes(params);
      return res.data.data;
    },
  });

  const filtered =
    data?.filter((quiz) =>
      quiz.title
        .toLowerCase()
        .includes(search.toLowerCase())
    ) || [];

  return (
    <div className="page-container pb-10">
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
          p-8
          md:p-10
          text-white
          shadow-2xl
          mb-8
        "
      >
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-medium">
              <Sparkles size={15} />
              AI Powered Assessments
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-black">
              Practice Quizzes
            </h1>

            <p className="mt-3 text-white/80 max-w-2xl">
              Master DSA, DBMS, OS, Aptitude,
              Networking and more with AI-powered
              quizzes and personalized feedback.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <BookOpen size={20} />
              <h3 className="mt-3 text-3xl font-black">
                {data?.length || 0}
              </h3>
              <p className="text-sm text-white/70">
                Total Quizzes
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <Brain size={20} />
              <h3 className="mt-3 text-3xl font-black">
                {CATEGORIES.length - 1}
              </h3>
              <p className="text-sm text-white/70">
                Categories
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <Trophy size={20} />
              <h3 className="mt-3 text-3xl font-black">
                100%
              </h3>
              <p className="text-sm text-white/70">
                Placement Focused
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <Sparkles size={20} />
              <h3 className="mt-3 text-3xl font-black">
                AI
              </h3>
              <p className="text-sm text-white/70">
                Feedback
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          rounded-[28px]
          border
          border-gray-200
          dark:border-gray-700
          bg-white
          dark:bg-dark-200
          p-6
          shadow-xl
          mb-8
        "
      >
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                dark:border-gray-700
                bg-gray-50
                dark:bg-dark-300
                py-3
                pl-11
                pr-4
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />
          </div>

          {/* Category */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter
              size={16}
              className="text-gray-400"
            />

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            Difficulty:
          </span>

          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() =>
                setDifficulty(diff)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                difficulty === diff
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <Loader text="Loading quizzes..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">
            🔍
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            No Quizzes Found
          </h3>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Try changing your filters or search
            query.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Quizzes
            </h2>

            <div className="text-sm text-gray-500">
              {filtered.length} Quiz
              {filtered.length !== 1 ? "es" : ""}
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >
            {filtered.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
              >
                <QuizCard quiz={quiz} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizList;