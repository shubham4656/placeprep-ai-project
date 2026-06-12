import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Settings,
  Plus,
  Trash2,
  Users,
  BookOpen,
  BarChart2,
  X,
  Loader2,
  Edit3,
  Search,
  Trophy,
  Activity,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Crown,
  Sparkles,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  getAllUsers,
  getAllQuestions,
  getAllQuizzes,
  getAdminAnalytics,
  createQuestion,
  deleteQuestion,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  deleteUser,
} from "../api/axios";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const TABS = ["Overview", "Questions", "Quiz Management", "Users", "Analytics"];
const CATEGORIES = ["DSA", "OS", "DBMS", "Aptitude", "HR", "Networking", "OOP"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const emptyQuestionForm = {
  text: "",
  category: "DSA",
  difficulty: "medium",
  answer: "",
  explanation: "",
  options: [
    { label: "A", value: "" },
    { label: "B", value: "" },
    { label: "C", value: "" },
    { label: "D", value: "" },
  ],
};

const emptyQuizForm = {
  title: "",
  description: "",
  category: "DSA",
  difficulty: "medium",
  duration: 15,
  questions: [],
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [quizForm, setQuizForm] = useState(emptyQuizForm);
  const [editQuizId, setEditQuizId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionCategory, setQuestionCategory] = useState("All");
  const [questionDifficulty, setQuestionDifficulty] = useState("All");
  const [quizSearch, setQuizSearch] = useState("");
  const [quizCategory, setQuizCategory] = useState("All");
  const [quizDifficulty, setQuizDifficulty] = useState("All");

  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await getAllUsers();
      return response.data.data;
    },
    enabled: ["Users", "Overview", "Analytics"].includes(activeTab),
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["admin-questions"],
    queryFn: async () => {
      const response = await getAllQuestions();
      return response.data.data;
    },
    enabled: ["Questions", "Quiz Management", "Overview", "Analytics"].includes(
      activeTab,
    ),
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["admin-quizzes"],
    queryFn: async () => {
      const response = await getAllQuizzes();
      return response.data.data;
    },
    enabled: ["Quiz Management", "Overview"].includes(activeTab),
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await getAdminAnalytics();
      return response.data.data;
    },
    enabled: activeTab === "Analytics",
  });

  const visibleQuestions = useMemo(() => {
    if (!questions) return [];

    const filtered = questions.filter((item) => {
      const matchesSearch = item.text
        .toLowerCase()
        .includes(questionSearch.toLowerCase());
      const matchesCategory =
        questionCategory === "All" || item.category === questionCategory;
      const matchesDifficulty =
        questionDifficulty === "All" || item.difficulty === questionDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    return filtered;
  }, [questions, questionSearch, questionCategory, questionDifficulty]);

  const visibleQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title
        .toLowerCase()
        .includes(quizSearch.toLowerCase());
      const matchesCategory =
        quizCategory === "All" || quiz.category === quizCategory;
      const matchesDifficulty =
        quizDifficulty === "All" || quiz.difficulty === quizDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [quizzes, quizSearch, quizCategory, quizDifficulty]);

  const handleQuestionSave = async () => {
    if (!questionForm.text || !questionForm.answer) {
      toast.error("Please add question text and a correct answer.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createQuestion(questionForm);
      toast.success("Question saved successfully.");
      queryClient.invalidateQueries(["admin-questions"]);
      setShowQuestionModal(false);
      setQuestionForm(emptyQuestionForm);
    } catch (error) {
      toast.error("Unable to save question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestion(id);
      toast.success("Question removed.");
      queryClient.invalidateQueries(["admin-questions"]);
    } catch (error) {
      toast.error("Failed to remove question.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted.");
      queryClient.invalidateQueries(["admin-users"]);
    } catch (error) {
      toast.error("Unable to delete user.");
    }
  };

  const handleQuizSave = async () => {
    if (!quizForm.title || !quizForm.questions.length) {
      toast.error("Quiz must have a title and at least one question.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: quizForm.title,
        description: quizForm.description,
        category: quizForm.category,
        difficulty: quizForm.difficulty,
        duration: quizForm.duration,
        questions: quizForm.questions,
      };

      if (editQuizId) {
        await updateQuiz(editQuizId, payload);
        toast.success("Quiz updated successfully.");
      } else {
        await createQuiz(payload);
        toast.success("Quiz created successfully.");
      }

      queryClient.invalidateQueries(["admin-quizzes"]);
      setShowQuizModal(false);
      setEditQuizId(null);
      setQuizForm(emptyQuizForm);
    } catch (error) {
      toast.error("Quiz save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await deleteQuiz(id);
      toast.success("Quiz deleted.");
      queryClient.invalidateQueries(["admin-quizzes"]);
    } catch (error) {
      toast.error("Failed to delete quiz.");
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditQuizId(quiz._id);
    setQuizForm({
      title: quiz.title || "",
      description: quiz.description || "",
      category: quiz.category || "DSA",
      difficulty: quiz.difficulty || "medium",
      duration: quiz.duration || 15,
      questions: quiz.questions?.map((question) => question._id) || [],
    });
    setShowQuizModal(true);
  };

  return (
    <div className="page-container pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-primary-100 px-4 py-2 text-primary-700">
            <Settings size={20} /> Admin Dashboard
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-30 mb-8 flex flex-wrap gap-3 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-dark-200/80 backdrop-blur-xl p-2 shadow-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Overview" && (
        <div className="space-y-8">
          {/* HERO SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl">
                    <Sparkles size={16} />
                    <span className="text-sm font-medium">
                      AI Powered Admin Workspace
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
                    PlacePrep AI
                    <span className="block text-white/80">
                      Admin Control Center
                    </span>
                  </h1>

                  <p className="max-w-2xl text-lg text-white/80">
                    Manage students, quizzes, questions, analytics and platform
                    growth from one centralized dashboard.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md">
                    {new Date().toLocaleDateString()}
                  </span>

                  <span className="rounded-full border border-emerald-300/30 bg-emerald-500/20 px-4 py-2 text-sm font-semibold">
                    Admin
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowQuestionModal(true)}
                    className="rounded-xl bg-white px-4 py-2 font-semibold text-gray-900 shadow-lg transition hover:scale-105"
                  >
                    + Add Question
                  </button>

                  <button
                    onClick={() => {
                      setEditQuizId(null);
                      setQuizForm(emptyQuizForm);
                      setShowQuizModal(true);
                    }}
                    className="rounded-xl bg-white/20 px-4 py-2 font-semibold backdrop-blur-md transition hover:bg-white/30"
                  >
                    + Create Quiz
                  </button>

                  <button
                    onClick={() => setActiveTab("Users")}
                    className="rounded-xl bg-white/20 px-4 py-2 font-semibold backdrop-blur-md transition hover:bg-white/30"
                  >
                    View Users
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                label: "Total Students",
                value: users?.length || 0,
                icon: Users,
                gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
              },
              {
                label: "Total Questions",
                value: questions?.length || 0,
                icon: BookOpen,
                gradient: "from-emerald-500/20 via-green-500/20 to-teal-500/20",
              },
              {
                label: "Total Quizzes",
                value: quizzes?.length || 0,
                icon: BarChart2,
                gradient: "from-pink-500/20 via-purple-500/20 to-indigo-500/20",
              },
              {
                label: "Quiz Attempts",
                value:
                  users?.reduce(
                    (sum, user) => sum + (user.progress?.totalQuizzes || 0),
                    0,
                  ) || 0,
                icon: Activity,
                gradient:
                  "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
              },
              {
                label: "Average Score",
                value: `${
                  users?.length
                    ? Math.round(
                        users.reduce(
                          (sum, user) =>
                            sum + (user.progress?.averageScore || 0),
                          0,
                        ) / users.length,
                      )
                    : 0
                }%`,
                icon: TrendingUp,
                gradient: "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
              },
              {
                label: "Active Categories",
                value: CATEGORIES.length,
                icon: ShieldCheck,
                gradient:
                  "from-fuchsia-500/20 via-violet-500/20 to-purple-500/20",
              },
            ].map((card) => (
              <motion.div
                key={card.label}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className={`group
                relative
                overflow-hidden
                rounded-[32px]
                border border-white/10
                bg-white/70
                dark:bg-dark-200/70
                backdrop-blur-xl
                p-7
                shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                hover:shadow-[0_25px_80px_rgba(99,102,241,0.18)]
                transition-all duration-500
                hover:-translate-y-2 bg-gradient-to-br ${card.gradient}
                p-6 backdrop-blur-xl shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {card.label}
                    </p>
                    <h2 className="mt-3 text-5xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white/20 p-4">
                    <card.icon size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Add Question",
                  action: () => setShowQuestionModal(true),
                },
                {
                  title: "Create Quiz",
                  action: () => {
                    setEditQuizId(null);
                    setQuizForm(emptyQuizForm);
                    setShowQuizModal(true);
                  },
                },
                {
                  title: "Manage Users",
                  action: () => setActiveTab("Users"),
                },
                {
                  title: "View Analytics",
                  action: () => setActiveTab("Analytics"),
                },
              ].map((item) => (
                <motion.button
                  key={item.title}
                  whileHover={{ scale: 1.03 }}
                  onClick={item.action}
                  className="group
                  rounded-[28px]
                  border border-gray-200/70
                  dark:border-gray-700
                  bg-white/80
                  dark:bg-dark-200/80
                  backdrop-blur-xl
                  p-6
                  text-left
                  shadow-xl
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all duration-500
                  hover:bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>

                  <div className="mt-6 flex items-center text-indigo-600 font-semibold">
                    Open
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* CATEGORY OVERVIEW + TOP PERFORMERS */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div
              className="relative
            overflow-hidden
            rounded-[36px]
            border border-gray-200/70
            dark:border-gray-700
            bg-white/80
            dark:bg-dark-200/80
            backdrop-blur-xl
            p-8
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                Category Overview
              </h2>

              <div className="space-y-4">
                {CATEGORIES.map((category) => {
                  const count =
                    questions?.filter((q) => q.category === category).length ||
                    0;

                  return (
                    <div key={category}>
                      <div className="mb-2 flex justify-between">
                        <span>{category}</span>
                        <span>{count}</span>
                      </div>

                      <div className="h-2 rounded-full bg-gray-200 dark:bg-dark-300">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{
                            width: `${Math.min(count * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-dark-200">
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                Top Performers
              </h2>

              <div className="space-y-4">
                {[...(users || [])]
                  .sort(
                    (a, b) =>
                      (b.progress?.averageScore || 0) -
                      (a.progress?.averageScore || 0),
                  )
                  .slice(0, 5)
                  .map((user, index) => (
                    <div
                      key={user._id}
                      className="group
                        flex items-center justify-between
                        rounded-3xl
                        border border-gray-200/50
                        dark:border-gray-700
                        bg-white/60
                        dark:bg-dark-300/60
                        backdrop-blur-xl
                        p-4
                        hover:shadow-lg
                        transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-white">
                          {user.name?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {user.progress?.averageScore || 0}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Crown size={18} className="text-yellow-500" />
                        )}

                        <span className="text-2xl font-black text-indigo-300">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-dark-200">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>

            <div className="space-y-4">
              {[
                "Question Added",
                "Quiz Created",
                "Student Registered",
                "Quiz Attempted",
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-full bg-indigo-500" />

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Activity #{index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Questions" && (
        <div className="space-y-6">
          {/* Header */}
          <div
            className="
      relative overflow-hidden
      rounded-[32px]
      bg-gradient-to-r
      from-indigo-600
      via-purple-600
      to-pink-600
      p-8
      text-white
      shadow-[0_20px_60px_rgba(99,102,241,0.35)]
    "
          >
            <div className="absolute top-0 right-0 h-72 w-72 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black">Question Management</h2>

                <p className="mt-2 text-white/80">
                  Manage, organize and maintain all quiz questions.
                </p>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl px-6 py-5">
                <p className="text-sm text-white/70">Total Questions</p>

                <h3 className="text-4xl font-black">
                  {questions?.length || 0}
                </h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            className="
      rounded-[32px]
      border border-gray-200/70
      dark:border-gray-700
      bg-white/80
      dark:bg-dark-200/80
      backdrop-blur-xl
      p-6
      shadow-[0_20px_60px_rgba(0,0,0,0.08)]
    "
          >
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="grid md:grid-cols-3 gap-4 flex-1">
                {/* Search */}
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Search
                  </label>

                  <div className="relative mt-2">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="search"
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      placeholder="Search questions..."
                      className="
                w-full
                rounded-2xl
                border border-gray-200
                dark:border-gray-700
                bg-white
                dark:bg-dark-300
                py-3
                pl-12
                pr-4
                outline-none
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
              "
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Category
                  </label>

                  <select
                    value={questionCategory}
                    onChange={(e) => setQuestionCategory(e.target.value)}
                    className="
              mt-2
              w-full
              rounded-2xl
              border border-gray-200
              dark:border-gray-700
              bg-white
              dark:bg-dark-300
              px-4
              py-3
            "
                  >
                    <option value="All">All Categories</option>

                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Difficulty
                  </label>

                  <select
                    value={questionDifficulty}
                    onChange={(e) => setQuestionDifficulty(e.target.value)}
                    className="
              mt-2
              w-full
              rounded-2xl
              border border-gray-200
              dark:border-gray-700
              bg-white
              dark:bg-dark-300
              px-4
              py-3
            "
                  >
                    <option value="All">All Difficulties</option>

                    {DIFFICULTIES.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowQuestionModal(true)}
                className="
                
                my-7
          h-[48px]
          px-8
          rounded-2xl
          bg-gradient-to-r
          from-indigo-600
          via-purple-600
          to-pink-600
          text-white
          font-semibold
          shadow-xl
          hover:scale-105
          transition-all
          flex
          items-center
          gap-2
          justify-center
        "
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>
          </div>

          {/* Content */}
          {questionsLoading ? (
            <Loader text="Loading questions..." />
          ) : !visibleQuestions.length ? (
            <div
              className="
        rounded-[32px]
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-200
        p-20
        text-center
      "
            >
              <FileText size={60} className="mx-auto text-gray-300 mb-4" />

              <h3 className="text-2xl font-bold">No Questions Found</h3>

              <p className="mt-2 text-gray-500">
                Try changing filters or add new questions.
              </p>
            </div>
          ) : (
            <div
              className="
        overflow-hidden
        rounded-[32px]
        border border-gray-200/70
        dark:border-gray-700
        bg-white/80
        dark:bg-dark-200/80
        backdrop-blur-xl
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
            >
              {/* Table Header */}
              <div
                className="
          hidden md:grid
          md:grid-cols-12
          gap-4
          px-6
          py-4
          border-b
          border-gray-200
          dark:border-gray-700
          text-xs
          uppercase
          tracking-wider
          font-bold
          text-gray-500
        "
              >
                <div className="col-span-6">Question</div>

                <div className="col-span-2">Category</div>

                <div className="col-span-2">Difficulty</div>

                <div className="col-span-2 text-right">Actions</div>
              </div>

              {visibleQuestions.map((question) => (
                <motion.div
                  key={question._id}
                  whileHover={{
                    backgroundColor: "rgba(99,102,241,0.03)",
                  }}
                  className="
            grid
            md:grid-cols-12
            gap-4
            px-6
            py-5
            border-b
            border-gray-100
            dark:border-gray-800
            items-center
          "
                >
                  <div className="md:col-span-6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {question.text}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <span
                      className="
                rounded-full
                bg-indigo-50
                dark:bg-indigo-900/20
                px-3 py-1
                text-xs
                font-semibold
                text-indigo-600
              "
                    >
                      {question.category}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        question.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : question.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="
                h-11
                w-11
                rounded-xl
                bg-red-50
                text-red-600
                hover:bg-red-100
                transition-all
                flex
                items-center
                justify-center
              "
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Quiz Management" && (
        <div className="space-y-6">
          {/* Header */}
          <div
            className="
      relative overflow-hidden
      rounded-[32px]
      bg-gradient-to-r
      from-emerald-500
      via-teal-500
      to-cyan-600
      p-8
      text-white
      shadow-[0_20px_60px_rgba(16,185,129,0.35)]
    "
          >
            <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black">Quiz Management</h2>

                <p className="mt-2 text-white/80">
                  Create, manage and organize quizzes for students.
                </p>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl px-6 py-5">
                <p className="text-sm text-white/70">Total Quizzes</p>

                <h3 className="text-4xl font-black">{quizzes?.length || 0}</h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            className="
      rounded-[32px]
      border border-gray-200/70
      dark:border-gray-700
      bg-white/80
      dark:bg-dark-200/80
      backdrop-blur-xl
      p-6
      shadow-[0_20px_60px_rgba(0,0,0,0.08)]
    "
          >
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="grid md:grid-cols-3 gap-4 flex-1">
                {/* Search */}
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Search Quiz
                  </label>

                  <div className="relative mt-2">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="search"
                      value={quizSearch}
                      onChange={(e) => setQuizSearch(e.target.value)}
                      placeholder="Search quizzes..."
                      className="
                w-full
                rounded-2xl
                border border-gray-200
                dark:border-gray-700
                bg-white
                dark:bg-dark-300
                py-3
                pl-12
                pr-4
                outline-none
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
              "
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Category
                  </label>

                  <select
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value)}
                    className="
              mt-2
              w-full
              rounded-2xl
              border border-gray-200
              dark:border-gray-700
              bg-white
              dark:bg-dark-300
              px-4
              py-3
            "
                  >
                    <option value="All">All Categories</option>

                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Difficulty
                  </label>

                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="
              mt-2
              w-full
              rounded-2xl
              border border-gray-200
              dark:border-gray-700
              bg-white
              dark:bg-dark-300
              px-4
              py-3
            "
                  >
                    <option value="All">All Difficulties</option>

                    {DIFFICULTIES.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditQuizId(null);
                  setQuizForm(emptyQuizForm);
                  setShowQuizModal(true);
                }}
                className="
          h-[56px]
          px-8
          my-6
          rounded-2xl
          bg-gradient-to-r
          from-emerald-500
          via-teal-500
          to-cyan-600
          text-white
          font-semibold
          shadow-xl
          hover:scale-105
          transition-all
          flex
          items-center
          gap-2
          justify-center
        "
              >
                <Plus size={18} />
                New Quiz
              </button>
            </div>
          </div>

          {/* Content */}
          {quizzesLoading ? (
            <Loader text="Loading quizzes..." />
          ) : !visibleQuizzes.length ? (
            <div
              className="
        rounded-[32px]
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-200
        p-20
        text-center
      "
            >
              <BookOpen size={60} className="mx-auto text-gray-300 mb-4" />

              <h3 className="text-2xl font-bold">No Quizzes Found</h3>

              <p className="mt-2 text-gray-500">
                Create your first quiz to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {visibleQuizzes.map((quiz) => (
                <motion.div
                  key={quiz._id}
                  whileHover={{
                    y: -4,
                  }}
                  className="
            rounded-[30px]
            border border-gray-200/70
            dark:border-gray-700
            bg-white/80
            dark:bg-dark-200/80
            backdrop-blur-xl
            p-6
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          "
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {quiz.title}
                      </h3>

                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {quiz.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-5">
                        <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 text-xs font-semibold text-indigo-600">
                          {quiz.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            quiz.difficulty === "easy"
                              ? "bg-green-100 text-green-700"
                              : quiz.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {quiz.difficulty}
                        </span>

                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-600">
                          {quiz.questions?.length || 0} Questions
                        </span>

                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                          {quiz.duration} Min
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        className="
                  h-11
                  px-5
                  rounded-xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  hover:bg-gray-50
                  dark:hover:bg-dark-300
                  flex
                  items-center
                  gap-2
                "
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="
                  h-11
                  px-5
                  rounded-xl
                  bg-red-50
                  text-red-600
                  hover:bg-red-100
                  flex
                  items-center
                  gap-2
                "
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Users" && (
        <div className="space-y-6">
          {/* Header */}
          <div
            className="
      relative overflow-hidden
      rounded-[32px]
      bg-gradient-to-r
      from-violet-600
      via-purple-600
      to-fuchsia-600
      p-8
      text-white
      shadow-[0_20px_60px_rgba(139,92,246,0.35)]
    "
          >
            <div className="absolute top-0 right-0 h-72 w-72 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black">User Management</h2>

                <p className="mt-2 text-white/80">
                  Monitor student accounts, performance and engagement.
                </p>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl px-6 py-5">
                <p className="text-sm text-white/70">Total Users</p>

                <h3 className="text-4xl font-black">{users?.length || 0}</h3>
              </div>
            </div>
          </div>

          {usersLoading ? (
            <Loader text="Loading users..." />
          ) : !users?.length ? (
            <div
              className="
        rounded-[32px]
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-200
        p-20
        text-center
      "
            >
              <Users size={60} className="mx-auto text-gray-300 mb-4" />

              <h3 className="text-2xl font-bold">No Users Found</h3>

              <p className="mt-2 text-gray-500">
                There are no registered students yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  whileHover={{ y: -4 }}
                  className="
            rounded-[30px]
            border border-gray-200/70
            dark:border-gray-700
            bg-white/80
            dark:bg-dark-200/80
            backdrop-blur-xl
            p-6
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          "
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div
                        className="
                  h-14 w-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-600
                  flex items-center justify-center
                  text-white
                  font-bold
                  text-lg
                  shadow-lg
                "
                      >
                        {user.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>

                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3">
                      <div
                        className="
                  rounded-2xl
                  bg-indigo-50
                  dark:bg-indigo-900/20
                  px-4 py-3
                  min-w-[130px]
                "
                      >
                        <p className="text-xs text-gray-500">Average Score</p>

                        <h4 className="text-xl font-bold text-indigo-600">
                          {user.progress?.averageScore || 0}%
                        </h4>
                      </div>

                      <div
                        className="
                  rounded-2xl
                  bg-emerald-50
                  dark:bg-emerald-900/20
                  px-4 py-3
                  min-w-[130px]
                "
                      >
                        <p className="text-xs text-gray-500">Quiz Attempts</p>

                        <h4 className="text-xl font-bold text-emerald-600">
                          {user.progress?.totalQuizzes || 0}
                        </h4>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="
                  h-11
                  px-5
                  rounded-xl
                  bg-red-50
                  text-red-600
                  hover:bg-red-100
                  transition-all
                  flex
                  items-center
                  gap-2
                "
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Analytics" && (
        <div className="space-y-6">
          {analyticsLoading ? (
            <Loader text="Loading analytics..." />
          ) : (
            <>
              {/* Hero */}
              <div
                className="
          relative overflow-hidden
          rounded-[32px]
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-purple-600
          p-8
          text-white
          shadow-[0_20px_60px_rgba(99,102,241,0.35)]
        "
              >
                <div className="absolute top-0 right-0 h-80 w-80 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <h2 className="text-4xl font-black">Analytics Dashboard</h2>

                  <p className="mt-2 text-white/80">
                    Monitor platform growth, student engagement and performance
                    metrics.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[28px] bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                  <p className="text-sm text-gray-500">Total Students</p>

                  <h3 className="mt-3 text-4xl font-black text-indigo-600">
                    {analytics?.totalUsers || 0}
                  </h3>
                </div>

                <div className="rounded-[28px] bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                  <p className="text-sm text-gray-500">Quiz Attempts</p>

                  <h3 className="mt-3 text-4xl font-black text-emerald-600">
                    {analytics?.totalAttempts || 0}
                  </h3>
                </div>

                <div className="rounded-[28px] bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                  <p className="text-sm text-gray-500">Average Score</p>

                  <h3 className="mt-3 text-4xl font-black text-orange-500">
                    {analytics?.averageScore || 0}%
                  </h3>
                </div>

                <div className="rounded-[28px] bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                  <p className="text-sm text-gray-500">Total Questions</p>

                  <h3 className="mt-3 text-4xl font-black text-purple-600">
                    {analytics?.totalQuestions || 0}
                  </h3>
                </div>
              </div>

              {/* Analytics Grid */}
              <div className="grid gap-6 xl:grid-cols-3">
                {/* Top Performers */}
                <div
                  className="
            rounded-[30px]
            border border-gray-200/70
            dark:border-gray-700
            bg-white/80
            dark:bg-dark-200/80
            backdrop-blur-xl
            p-6
            shadow-xl
          "
                >
                  <h3 className="text-xl font-bold mb-5">🏆 Top Performers</h3>

                  {analytics?.topPerformers?.length ? (
                    <div className="space-y-4">
                      {analytics.topPerformers.map((student) => (
                        <div
                          key={student._id}
                          className="
                    rounded-2xl
                    bg-gray-50
                    dark:bg-dark-300
                    p-4
                  "
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="
                        h-12 w-12
                        rounded-xl
                        bg-gradient-to-r
                        from-yellow-500
                        to-orange-500
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                            >
                              {student.name?.charAt(0)}
                            </div>

                            <div>
                              <p className="font-semibold">{student.name}</p>

                              <p className="text-xs text-gray-500">
                                {student.email}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <span
                              className="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-green-700
                      "
                            >
                              {student.progress?.averageScore || 0}% Average
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No performance data available.
                    </p>
                  )}
                </div>

                {/* Category Performance */}
                <div
                  className="
            rounded-[30px]
            border border-gray-200/70
            dark:border-gray-700
            bg-white/80
            dark:bg-dark-200/80
            backdrop-blur-xl
            p-6
            shadow-xl
          "
                >
                  <h3 className="text-xl font-bold mb-5">
                    📊 Category Performance
                  </h3>

                  {analytics?.categoryPerformance?.length ? (
                    <div className="space-y-4">
                      {analytics.categoryPerformance.map((item) => (
                        <div
                          key={item._id}
                          className="
                    rounded-2xl
                    bg-gray-50
                    dark:bg-dark-300
                    p-4
                  "
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{item._id}</h4>

                            <span className="text-indigo-600 font-bold">
                              {Math.round(item.averageScore || 0)}%
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-500">
                            Attempts: {item.attempts}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No category analytics available.
                    </p>
                  )}
                </div>

                {/* Growth */}
                <div
                  className="
            rounded-[30px]
            border border-white/10
            bg-gradient-to-br
            from-indigo-500/10
            via-purple-500/10
            to-pink-500/10
            backdrop-blur-xl
            p-6
            shadow-xl
          "
                >
                  <h3 className="text-xl font-bold mb-5">📈 User Growth</h3>

                  {analytics?.userGrowth?.length ? (
                    <div className="space-y-4">
                      {analytics.userGrowth.map((item) => (
                        <div
                          key={`${item._id.year}-${item._id.month}`}
                          className="
                    rounded-2xl
                    bg-white/60
                    dark:bg-dark-300
                    p-4
                  "
                        >
                          <div className="flex justify-between">
                            <span className="font-semibold">
                              {item._id.month}/{item._id.year}
                            </span>

                            <span className="text-indigo-600 font-bold">
                              +{item.count}
                            </span>
                          </div>

                          <p className="text-sm text-gray-500 mt-1">
                            New Students
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No growth data available.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {/* ── Modal Overlay ── */}
      {(showQuestionModal || showQuizModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          {showQuestionModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-6xl rounded-3xl bg-white dark:bg-dark-100 shadow-2xl shadow-black/20 flex flex-col max-h-[92vh]"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between gap-4 px-8 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                    <BookOpen
                      size={17}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                      Create New Question
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Create placement questions for students.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowQuestionModal(false);
                    setQuestionForm(emptyQuestionForm);
                  }}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-200 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={17} />
                </button>
              </div>

              {/* ── Two-column body ── */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
                  {/* ── LEFT: Question details ── */}
                  <div className="px-8 py-7 space-y-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                      Question Details
                    </p>

                    <div>
                      <label className="input-label">
                        Question text <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        className="input-field resize-none mt-1.5"
                        value={questionForm.text}
                        onChange={(e) =>
                          setQuestionForm({
                            ...questionForm,
                            text: e.target.value,
                          })
                        }
                        placeholder="e.g. What is the time complexity of binary search?"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Category</label>
                        <select
                          className="input-field mt-1.5"
                          value={questionForm.category}
                          onChange={(e) =>
                            setQuestionForm({
                              ...questionForm,
                              category: e.target.value,
                            })
                          }
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="input-label">Difficulty</label>
                        <select
                          className="input-field mt-1.5"
                          value={questionForm.difficulty}
                          onChange={(e) =>
                            setQuestionForm({
                              ...questionForm,
                              difficulty: e.target.value,
                            })
                          }
                        >
                          {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="input-label">
                        Explanation{" "}
                        <span className="text-gray-400 font-normal text-xs">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        className="input-field resize-none mt-1.5"
                        value={questionForm.explanation}
                        onChange={(e) =>
                          setQuestionForm({
                            ...questionForm,
                            explanation: e.target.value,
                          })
                        }
                        placeholder="Why is this the correct answer?"
                      />
                    </div>
                  </div>

                  {/* ── RIGHT: Options + Answer + Preview ── */}
                  <div className="px-8 py-7 space-y-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                      Options & Answer
                    </p>

                    <div>
                      <label className="input-label mb-2 block">
                        Answer options <span className="text-red-400">*</span>
                      </label>
                      <div className="space-y-2">
                        {questionForm.options.map((option, index) => {
                          const isCorrect =
                            questionForm.answer === option.value &&
                            option.value;
                          return (
                            <div
                              key={option.label}
                              className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${
                                isCorrect
                                  ? "border-emerald-300 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-900/20"
                                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <span
                                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  isCorrect
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-100 dark:bg-dark-300 text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {option.label}
                              </span>
                              <input
                                type="text"
                                value={option.value}
                                onChange={(e) => {
                                  const nextOptions = [...questionForm.options];
                                  nextOptions[index].value = e.target.value;
                                  setQuestionForm({
                                    ...questionForm,
                                    options: nextOptions,
                                  });
                                }}
                                placeholder={`Option ${option.label}`}
                                className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none"
                              />
                              {isCorrect && (
                                <svg
                                  className="w-4 h-4 text-emerald-500 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="input-label mb-2 block">
                        Correct answer <span className="text-red-400">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {questionForm.options
                          .filter((o) => o.value.trim())
                          .map((option) => (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() =>
                                setQuestionForm({
                                  ...questionForm,
                                  answer: option.value,
                                })
                              }
                              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                questionForm.answer === option.value
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:border-emerald-600 dark:text-emerald-300"
                                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300"
                              }`}
                            >
                              <span
                                className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 ${
                                  questionForm.answer === option.value
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              />
                              <span className="font-semibold">
                                {option.label}.
                              </span>
                              <span className="truncate max-w-[140px]">
                                {option.value}
                              </span>
                            </button>
                          ))}
                        {!questionForm.options.some((o) => o.value.trim()) && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 py-1">
                            Fill in options above first.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="input-label mb-2 block">
                        Live preview
                      </label>
                      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-dark-300/50 p-4 space-y-3 min-h-[160px]">
                        {!questionForm.text &&
                        !questionForm.options.some((o) => o.value) ? (
                          <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-8">
                            Start typing to see your question preview
                          </p>
                        ) : (
                          <>
                            {questionForm.text && (
                              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                                {questionForm.text}
                              </p>
                            )}
                            <div className="space-y-1.5">
                              {questionForm.options
                                .filter((o) => o.value.trim())
                                .map((opt) => {
                                  const isCorrect =
                                    questionForm.answer === opt.value;
                                  return (
                                    <div
                                      key={opt.label}
                                      className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs ${
                                        isCorrect
                                          ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                                          : "bg-white dark:bg-dark-200 border border-gray-100 dark:border-gray-700"
                                      }`}
                                    >
                                      <span
                                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold flex-shrink-0 ${
                                          isCorrect
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gray-100 dark:bg-dark-300 text-gray-500"
                                        }`}
                                      >
                                        {opt.label}
                                      </span>
                                      <span
                                        className={
                                          isCorrect
                                            ? "text-emerald-700 dark:text-emerald-300 font-medium"
                                            : "text-gray-700 dark:text-gray-300"
                                        }
                                      >
                                        {opt.value}
                                      </span>
                                      {isCorrect && (
                                        <svg
                                          className="w-3 h-3 text-emerald-500 ml-auto flex-shrink-0"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                            {questionForm.answer && (
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                Correct:{" "}
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  {questionForm.answer}
                                </span>
                              </p>
                            )}
                            {questionForm.explanation && (
                              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-3 py-2">
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                  <span className="font-semibold">
                                    Explanation:{" "}
                                  </span>
                                  {questionForm.explanation}
                                </p>
                              </div>
                            )}
                            {(questionForm.category ||
                              questionForm.difficulty) && (
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {questionForm.difficulty && (
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                                      questionForm.difficulty === "easy"
                                        ? "badge-easy"
                                        : questionForm.difficulty === "medium"
                                          ? "badge-medium"
                                          : "badge-hard"
                                    }`}
                                  >
                                    {questionForm.difficulty}
                                  </span>
                                )}
                                {questionForm.category && (
                                  <span className="badge-category text-[10px]">
                                    {questionForm.category}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Sticky Footer ── */}
              <div className="flex items-center justify-between gap-4 px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-dark-200/60 flex-shrink-0 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionModal(false);
                    setQuestionForm(emptyQuestionForm);
                  }}
                  className="btn-secondary px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleQuestionSave}
                  disabled={isSubmitting}
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    "Save Question"
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {showQuizModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-7xl rounded-3xl bg-white dark:bg-dark-100 shadow-2xl shadow-black/20 flex flex-col max-h-[92vh]"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between gap-4 px-8 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                    <BarChart2
                      size={17}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                      {editQuizId ? "Edit Quiz" : "Create Quiz"}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Build quizzes and assign questions to them.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowQuizModal(false);
                    setEditQuizId(null);
                    setQuizForm(emptyQuizForm);
                  }}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-200 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={17} />
                </button>
              </div>

              {/* ── Two-column body ── */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
                  {/* ── LEFT: Quiz details ── */}
                  <div className="px-8 py-7 space-y-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                      Quiz Details
                    </p>

                    <div>
                      <label className="input-label">
                        Quiz title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        className="input-field mt-1.5"
                        value={quizForm.title}
                        onChange={(e) =>
                          setQuizForm({ ...quizForm, title: e.target.value })
                        }
                        placeholder="Enter quiz title"
                      />
                    </div>

                    <div>
                      <label className="input-label">Description</label>
                      <textarea
                        rows={3}
                        className="input-field resize-none mt-1.5"
                        value={quizForm.description}
                        onChange={(e) =>
                          setQuizForm({
                            ...quizForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the quiz purpose"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Category</label>
                        <select
                          className="input-field mt-1.5"
                          value={quizForm.category}
                          onChange={(e) =>
                            setQuizForm({
                              ...quizForm,
                              category: e.target.value,
                            })
                          }
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="input-label">Difficulty</label>
                        <select
                          className="input-field mt-1.5"
                          value={quizForm.difficulty}
                          onChange={(e) =>
                            setQuizForm({
                              ...quizForm,
                              difficulty: e.target.value,
                            })
                          }
                        >
                          {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Duration (minutes)</label>
                      <input
                        type="number"
                        min={5}
                        className="input-field mt-1.5"
                        value={quizForm.duration}
                        onChange={(e) =>
                          setQuizForm({
                            ...quizForm,
                            duration: Number(e.target.value),
                          })
                        }
                        placeholder="15"
                      />
                    </div>

                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-200 p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        Summary
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            label: "Category",
                            value: quizForm.category || "—",
                          },
                          {
                            label: "Difficulty",
                            value: quizForm.difficulty || "—",
                          },
                          {
                            label: "Duration",
                            value: quizForm.duration
                              ? `${quizForm.duration} min`
                              : "—",
                          },
                          {
                            label: "Questions",
                            value: quizForm.questions.length,
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-xl bg-white dark:bg-dark-100 border border-gray-100 dark:border-gray-700 px-3 py-2.5"
                          >
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {label}
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-white capitalize">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT: Question selection ── */}
                  <div className="px-8 py-7 flex flex-col gap-4">
                    <div className="flex items-center justify-between flex-shrink-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        Assign Questions
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                          quizForm.questions.length > 0
                            ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800"
                            : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-dark-200 dark:text-gray-400 dark:border-gray-700"
                        }`}
                      >
                        {quizForm.questions.length} selected
                      </span>
                    </div>

                    <div className="relative flex-shrink-0">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="search"
                        placeholder="Search questions…"
                        className="input-field pl-9"
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase();
                          document
                            .querySelectorAll("[data-qid]")
                            .forEach((el) => {
                              el.style.display = el.dataset.qtext?.includes(val)
                                ? ""
                                : "none";
                            });
                        }}
                      />
                    </div>

                    <div
                      className="flex-1 overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-200 p-2 space-y-1.5 min-h-0"
                      style={{ maxHeight: "380px" }}
                    >
                      {questions?.length ? (
                        questions.map((question) => {
                          const checked = quizForm.questions.includes(
                            question._id,
                          );
                          return (
                            <label
                              key={question._id}
                              data-qid={question._id}
                              data-qtext={question.text?.toLowerCase()}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-sm transition select-none ${
                                checked
                                  ? "bg-primary-50 border border-primary-200 dark:bg-primary-900/15 dark:border-primary-800"
                                  : "bg-white dark:bg-dark-100 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition ${
                                  checked
                                    ? "border-primary-500 bg-primary-500"
                                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-200"
                                }`}
                              >
                                {checked && (
                                  <svg
                                    className="w-2.5 h-2.5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3.5}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm leading-snug ${checked ? "text-primary-900 dark:text-primary-100 font-medium" : "text-gray-800 dark:text-gray-200"}`}
                                >
                                  {question.text}
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                  <span className="badge-category text-[10px]">
                                    {question.category}
                                  </span>
                                  <span
                                    className={`text-[10px] rounded-full border px-2 py-0.5 font-semibold ${
                                      question.difficulty === "easy"
                                        ? "badge-easy"
                                        : question.difficulty === "medium"
                                          ? "badge-medium"
                                          : "badge-hard"
                                    }`}
                                  >
                                    {question.difficulty}
                                  </span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                onChange={() => {
                                  const selected = quizForm.questions.includes(
                                    question._id,
                                  )
                                    ? quizForm.questions.filter(
                                        (id) => id !== question._id,
                                      )
                                    : [...quizForm.questions, question._id];
                                  setQuizForm({
                                    ...quizForm,
                                    questions: selected,
                                  });
                                }}
                              />
                            </label>
                          );
                        })
                      ) : (
                        <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                          No questions available. Add questions first.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Sticky Footer ── */}
              <div className="sticky bottom-0 flex items-center justify-between gap-4 px-8 py-5 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-dark-100/80 backdrop-blur-xl rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuizModal(false);
                    setEditQuizId(null);
                    setQuizForm(emptyQuizForm);
                  }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleQuizSave}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : editQuizId ? (
                    "Update Quiz"
                  ) : (
                    "Create Quiz"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
