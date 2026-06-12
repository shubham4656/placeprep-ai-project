import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Activity,
  Award,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { getDashboard, getLeaderboard } from "../api/axios";
import { useAuthStore } from "../store/authStore";
import StatsCard from "../components/dashboard/StatsCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import Loader from "../components/common/Loader";

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await getDashboard();
      return res.data.data;
    },
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await getLeaderboard();
      return res.data.data;
    },
  });

  const userRank =
    leaderboard?.findIndex((student) => student._id === user?._id) + 1;

  if (isLoading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const stats = data?.stats || {};
  const categoryStats = data?.categoryStats || [];
  const recentResults = data?.recentResults || [];

  const quickActions = [
    {
      label: "Take a Quiz",
      icon: <BookOpen size={22} />,
      to: "/quiz",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      label: "Mock Interview",
      icon: <Target size={22} />,
      to: "/mock-interview",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      label: "Resume Analyzer",
      icon: <TrendingUp size={22} />,
      to: "/resume",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      label: "Leaderboard",
      icon: <Trophy size={22} />,
      to: "/leaderboard",
      gradient: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <div className="page-container pb-10">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-10 text-white shadow-[0_20px_60px_rgba(99,102,241,0.35)] mb-8"
      >
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md">
              <Sparkles size={16} />
              Placement Preparation Dashboard
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-black">
              Welcome back,
              <br />
              {user?.name?.split(" ")[0]} 👋
            </h1>

            <p className="mt-4 max-w-2xl text-white/80 text-lg">
              Track your progress, improve your skills, and stay ahead in your
              placement journey.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <p className="text-sm text-white/70">Average Score</p>
              <h3 className="text-3xl font-bold">{stats.averageScore || 0}%</h3>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <p className="text-sm text-white/70">Quizzes</p>
              <h3 className="text-3xl font-bold">{stats.totalQuizzes || 0}</h3>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <p className="text-sm text-white/70">Total Score</p>
              <h3 className="text-3xl font-bold">{stats.totalScore || 0}</h3>
            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5">
              <p className="text-sm text-white/70">Leaderboard Rank</p>
              <h3 className="text-2xl font-bold">
                {userRank ? `#${userRank}` : "#—"}
              </h3>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Quizzes Attempted"
          value={stats.totalQuizzes || 0}
          icon={<BookOpen size={24} />}
          color="blue"
          subtitle="Total quiz attempts"
        />

        <StatsCard
          title="Average Score"
          value={`${stats.averageScore || 0}%`}
          icon={<TrendingUp size={24} />}
          color="green"
          subtitle="Performance growth"
        />

        <StatsCard
          title="Total Score"
          value={stats.totalScore || 0}
          icon={<Target size={24} />}
          color="purple"
          subtitle="Cumulative marks"
        />

        <StatsCard
          title="Leaderboard Rank"
          value={userRank ? `#${userRank}` : "N/A"}
          icon={<Award size={24} />}
          color="orange"
          subtitle={
            userRank === 1
              ? "🏆 Top Performer"
              : userRank <= 3
                ? "🔥 Top 3 Rank"
                : "Keep improving"
          }
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="text-indigo-600" size={20} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              onClick={() => navigate(action.to)}
              className="
                rounded-3xl
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-dark-200
                p-5
                shadow-lg
                text-left
                transition-all
              "
            >
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center text-white shadow-lg`}
              >
                {action.icon}
              </div>

              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                {action.label}
              </h3>

              <div className="mt-3 flex items-center text-sm text-indigo-600 font-medium">
                Open
                <ArrowRight size={14} className="ml-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* PERFORMANCE SECTION */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
          Performance Overview
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ProgressChart categoryStats={categoryStats} type="radar" />

          <ProgressChart categoryStats={categoryStats} type="bar" />
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <RecentActivity results={recentResults} />
    </div>
  );
};

export default Dashboard;
