import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Brain,
  Sparkles,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import InterviewPanel from "../components/interview/InterviewPanel";

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const MockInterview = () => {
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    if (!jobRole) return;
    setIsStarted(true);
  };

  return (
    <div className="page-container max-w-6xl mx-auto">
      {!isStarted ? (
        <>
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
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white text-sm mb-4">
                <Sparkles size={14} />
                AI Powered Interview Simulator
              </div>

              <h1 className="text-4xl font-black text-white">
                Mock Interview Practice
              </h1>

              <p className="text-white/80 mt-3 max-w-2xl">
                Practice technical and HR interviews with AI-generated
                questions and improve your confidence before placement drives.
              </p>
            </div>
          </motion.div>

          {/* Setup Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              bg-white
              dark:bg-dark-200
              rounded-[32px]
              border border-gray-200
              dark:border-gray-700
              shadow-xl
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-600
                  to-purple-600
                  flex items-center justify-center
                  text-white
                "
              >
                <Brain size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Setup Your Interview
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  Choose your target role and difficulty level
                </p>
              </div>
            </div>

            {/* Job Roles */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Target Job Role
              </label>

              <div className="grid md:grid-cols-3 gap-4">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setJobRole(role)}
                    className={`
                      p-4
                      rounded-2xl
                      border-2
                      text-left
                      transition-all

                      ${
                        jobRole === role
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                      }
                    `}
                  >
                    <Briefcase
                      size={18}
                      className="text-indigo-600 mb-2"
                    />

                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {role}
                    </h3>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Difficulty Level
              </label>

              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`
                      py-3
                      rounded-2xl
                      capitalize
                      font-semibold
                      transition-all

                      ${
                        difficulty === diff
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-300"
                      }
                    `}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div
              className="
                rounded-3xl
                bg-gray-50
                dark:bg-dark-300
                p-5
                mb-8
              "
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />
                <h3 className="font-semibold">
                  What You'll Get
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div>✓ AI-generated interview questions</div>
                <div>✓ Technical & HR assessment</div>
                <div>✓ Real interview simulation</div>
                <div>✓ Instant performance feedback</div>
                <div>✓ 5-question structured interview</div>
                <div>✓ Placement-ready preparation</div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              disabled={!jobRole}
              className="
                w-full
                py-4
                rounded-2xl
                font-semibold
                text-white
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                shadow-xl
                flex items-center justify-center gap-2
                disabled:opacity-50
              "
            >
              <Mic size={18} />
              Start Interview
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </>
      ) : (
        <InterviewPanel
          jobRole={jobRole}
          difficulty={difficulty}
          onComplete={() => {}}
        />
      )}
    </div>
  );
};

export default MockInterview;