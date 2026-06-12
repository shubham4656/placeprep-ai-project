import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  Mic,
  FileText,
  Map,
  Trophy,
  ChevronRight,
  CheckCircle,
  Zap,
  Users,
  Star,
  User,
  Sparkles,
  Rocket,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen size={28} className="text-blue-500" />,
      title: "Smart Quizzes",
      description:
        "Practice DSA, OS, DBMS, Aptitude and more with AI-powered feedback on every attempt.",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <Mic size={28} className="text-purple-500" />,
      title: "Mock Interviews",
      description:
        "Face AI-driven mock interviews tailored to your target role and get real-time feedback.",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: <FileText size={28} className="text-green-500" />,
      title: "Resume Analyzer",
      description:
        "Get your resume ATS score, keyword analysis and actionable improvement tips.",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: <Map size={28} className="text-orange-500" />,
      title: "Study Roadmap",
      description:
        "Get a personalized week-by-week study plan based on your weak areas and target company.",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: <Trophy size={28} className="text-yellow-500" />,
      title: "Leaderboard",
      description:
        "Compete with peers, track your rank and stay motivated throughout your prep journey.",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: <Brain size={28} className="text-red-500" />,
      title: "AI Feedback",
      description:
        "Every quiz attempt, interview and resume gets detailed AI-powered analysis and tips.",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  const stats = [
    { value: "500+", label: "Practice Questions" },
    { value: "10+", label: "Quiz Categories" },
    { value: "AI", label: "Powered Feedback" },
    { value: "24/7", label: "Available" },
  ];

  const steps = [
    {
      step: 1,
      title: "Create Profile",
      description:
        "Register and set your placement goals, skills and target job roles.",
    },
    {
      step: 2,
      title: "Practice & Learn",
      description:
        "Solve quizzes, follow roadmaps and strengthen technical concepts.",
    },
    {
      step: 3,
      title: "AI Evaluation",
      description:
        "Take mock interviews and ATS resume analysis with AI feedback.",
    },
    {
      step: 4,
      title: "Get Placement Ready",
      description:
        "Track progress, improve weak areas and confidently crack interviews.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 text-white">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-white/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl px-5 py-2 mb-6">
                <Zap size={16} />
                AI Powered Placement Platform
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                Land Your
                <span className="block text-yellow-300">Dream Placement</span>
                With AI
              </h1>

              <p className="mt-6 text-xl text-white/80 max-w-xl">
                Practice quizzes, AI mock interviews, ATS resume analysis and
                personalized roadmaps built for placement success.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
                >
                  Get Started Free
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="border border-white/20 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl font-bold"
                >
                  Login
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10">
                <div>
                  <h3 className="text-4xl font-black">500+</h3>
                  <p className="text-white/70">Questions</p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">10+</h3>
                  <p className="text-white/70">Topics</p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">24/7</h3>
                  <p className="text-white/70">AI Support</p>
                </div>
              </div>
            </div>

            {/* Right Premium AI Orb */}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:flex items-center justify-center min-h-[650px]"
            >
              {/* Background Glow */}
              <div className="absolute h-[550px] w-[550px] rounded-full bg-white/10 blur-3xl" />
              <div className="absolute h-[400px] w-[400px] rounded-full bg-yellow-300/10 blur-3xl" />

              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                }}
                className="
      relative 
      z-10
      h-[300px]
      w-[300px]
      rounded-[48px]
      bg-white/10
      backdrop-blur-2xl
      border border-white/20
      shadow-[0_30px_80px_rgba(0,0,0,0.25)]
      flex flex-col items-center justify-center
    "
              >
                <Brain size={100} className="text-yellow-300" />

                <h2 className="mt-6 text-4xl font-black">PlacePrep AI</h2>

                <p className="mt-3 text-center text-white/70 px-8 text-lg">
                  AI Powered Placement Preparation Platform
                </p>
              </motion.div>

              {/* Smart Quiz */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="
      absolute
      z-20
      top-4
      left-[-40px]
      w-72
      h-50
      rounded-[32px]
      bg-white/10
      backdrop-blur-2xl
      border border-white/20
      p-7
      shadow-2xl
      flex flex-col justify-between
    "
              >
                <BookOpen size={34} className="text-cyan-300" />

                <div>
                  <h3 className="text-3xl font-bold mb-3">Smart Quizzes</h3>

                  <p className="text-white/70 text-base leading-relaxed">
                    500+ placement questions with AI feedback.
                  </p>
                </div>
              </motion.div>

              {/* AI Interview */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="
      absolute
      z-20
      top-8
      right-[-30px]
      w-72
      h-50
      rounded-[32px]
      bg-white/10
      backdrop-blur-2xl
      border border-white/20
      p-7
      shadow-2xl
      flex flex-col justify-between
    "
              >
                <Mic size={34} className="text-pink-300" />

                <div>
                  <h3 className="text-3xl font-bold mb-3">AI Interview</h3>

                  <p className="text-white/70 text-base leading-relaxed">
                    Practice real interview scenarios with AI.
                  </p>
                </div>
              </motion.div>

              {/* ATS Resume */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4.5 }}
                className="
      absolute
      z-20
      bottom-14
      left-[-80px]
      w-72
      h-50
      rounded-[32px]
      bg-white/10
      backdrop-blur-2xl
      border border-white/20
      p-7
      shadow-2xl
      flex flex-col justify-between
    "
              >
                <FileText size={34} className="text-green-300" />

                <div>
                  <h3 className="text-3xl font-bold mb-3">ATS Resume</h3>

                  <p className="text-white/70 text-base leading-relaxed">
                    Analyze and optimize your resume instantly.
                  </p>
                </div>
              </motion.div>

              {/* Roadmaps */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5.5 }}
                className="
      absolute
      z-20
      bottom-10
      right-[-60px]
      w-72
      h-50
      rounded-[32px]
      bg-white/10
      backdrop-blur-2xl
      border border-white/20
      p-7
      shadow-2xl
      flex flex-col justify-between
    "
              >
                <Map size={34} className="text-yellow-300" />

                <div>
                  <h3 className="text-3xl font-bold mb-3">Roadmaps</h3>

                  <p className="text-white/70 text-base leading-relaxed">
                    Personalized learning paths for your dream job.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 px-4 bg-white dark:bg-dark-100 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 h-80 w-80 bg-purple-500/10 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div
              className="
          inline-flex items-center gap-2
          px-5 py-2.5
          rounded-full
          bg-indigo-100
          dark:bg-indigo-900/20
          text-indigo-600
          font-semibold
          text-sm
          mb-5
        "
            >
              🚀 Simple Process
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-5">
              How PlacePrep AI Works
            </h2>

            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Follow a structured AI-powered placement journey and maximize your
              placement success from preparation to placement.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="
            relative
            group
          "
              >
                {/* Connector Line */}
                {index !== steps.length - 1 && (
                  <div
                    className="
                hidden xl:block
                absolute
                top-12
                left-full
                w-8
                h-[2px]
                dark:
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
                z-0
              "
                  />
                )}

                <div
                  className="
    relative
    h-full
    rounded-[36px]
    border border-white/20
    bg-white/70
    dark:bg-dark-200/70
    backdrop-blur-2xl
    p-8
    overflow-hidden
    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
    hover:shadow-[0_30px_80px_rgba(99,102,241,0.25)]
    transition-all
    duration-500
    hover:-translate-y-3
  "
                >
                  {/* Gradient Glow */}
                  <div
                    className="
      absolute
      inset-0
      opacity-0
      group-hover:opacity-100
      transition-all
      duration-500
      bg-gradient-to-br
      from-indigo-500/5
      via-purple-500/5
      to-pink-500/5
    "
                  />

                  {/* Step Badge */}
                  <div
                    className="
      absolute
      top-5
      right-5
      h-10
      w-10
      rounded-full
      dark: bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      flex
      items-center
      justify-center
      font-bold
      text-sm
      shadow-lg
    "
                  >
                    0{step.step}
                  </div>

                  {/* Icon */}
                  <div
                    className="
      h-20
      w-20
      rounded-3xl
      bg-gradient-to-br
      from-indigo-600
      via-purple-600
      to-fuchsia-600
      flex
      items-center
      justify-center
      text-white
      shadow-[0_20px_40px_rgba(99,102,241,0.35)]
      mb-8
    "
                  >
                    {index === 0 && <User size={34} />}
                    {index === 1 && <BookOpen size={34} />}
                    {index === 2 && <Brain size={34} />}
                    {index === 3 && <Trophy size={34} />}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 leading-8 text-[15px]">
                    {step.description}
                  </p>

                  <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 bg-indigo-500/20 blur-[120px] rounded-full" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="
        relative
        overflow-hidden
        rounded-[40px]
        bg-gradient-to-r
        from-indigo-600
        via-purple-600
        to-fuchsia-600
        p-12 md:p-20
        text-white
        shadow-[0_30px_80px_rgba(99,102,241,0.35)]
      "
          >
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 h-80 w-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <div
                className="
            inline-flex
            items-center
            gap-2
            px-5 py-2
            rounded-full
            bg-white/15
            backdrop-blur-xl
            border border-white/20
            mb-6
          "
              >
                <Sparkles size={16} />
                Trusted by Placement Aspirants
              </div>

              <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                Ready To Crack
                <br />
                Your Dream Placement?
              </h2>

              <p className="max-w-2xl mx-auto text-white/80 text-lg md:text-xl mb-10">
                Practice quizzes, AI mock interviews, ATS resume analysis and
                personalized roadmaps — all in one platform.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mb-10">
                <div>
                  <h3 className="text-4xl font-black">500+</h3>
                  <p className="text-white/70 text-sm">Questions</p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">10+</h3>
                  <p className="text-white/70 text-sm">Domains</p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">24/7</h3>
                  <p className="text-white/70 text-sm">AI Support</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="
              bg-white
              text-indigo-700
              px-8 py-4
              rounded-2xl
              font-bold
              shadow-xl
              hover:scale-105
              transition-all
              flex items-center justify-center gap-2
            "
                >
                  <Rocket size={18} />
                  Get Started Free
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              px-8 py-4
              rounded-2xl
              font-bold
              hover:bg-white/20
              transition-all
            "
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
