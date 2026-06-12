import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getLeaderboard } from "../api/axios";
import { useAuthStore } from "../store/authStore";
import Loader from "../components/common/Loader";

const Leaderboard = () => {
  const { user } = useAuthStore();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await getLeaderboard();
      return res.data.data;
    },
  });

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={22} className="text-yellow-500" />;
    if (index === 1) return <Medal size={22} className="text-slate-400" />;
    if (index === 2) return <Award size={22} className="text-amber-600" />;

    return (
      <span className="font-bold text-gray-500 text-sm">#{index + 1}</span>
    );
  };

  if (isLoading) {
    return <Loader fullScreen text="Loading leaderboard..." />;
  }

  return (
    <div className="page-container max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="
              h-16 w-16
              rounded-3xl
              bg-gradient-to-br
              from-yellow-500
              to-orange-500
              flex items-center justify-center
              text-white
              shadow-[0_15px_35px_rgba(245,158,11,0.35)]
            "
          >
            <Crown size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">
              Leaderboard
            </h1>

            <p className="text-gray-500 dark:text-gray-400">
              Top performers ranked by average score
            </p>
          </div>
        </div>

        <div
          className="
            inline-flex items-center gap-2
            rounded-full
            bg-yellow-100
            dark:bg-yellow-900/20
            px-4 py-2
            text-yellow-700
            dark:text-yellow-300
            text-sm
            font-semibold
          "
        >
          <Sparkles size={14} />
          Compete • Improve • Get Ranked
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      {leaderboard?.length >= 3 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2nd */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="
                rounded-3xl
                border border-slate-200
                dark:border-slate-700
                bg-white
                dark:bg-dark-200
                p-6
                shadow-xl
                text-center
                md:order-1
              "
            >
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-gradient-to-br
                  from-slate-400
                  to-slate-600
                  flex items-center justify-center
                  text-white
                  font-black
                  text-xl
                  mx-auto mb-4
                "
              >
                {leaderboard[1]?.name?.charAt(0)}
              </div>

              <Medal size={28} className="text-slate-400 mx-auto mb-2" />

              <h3 className="font-bold text-gray-900 dark:text-white">
                {leaderboard[1]?.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">2nd Position</p>

              <p className="mt-3 text-3xl font-black text-slate-600">
                {leaderboard[1]?.progress?.averageScore || 0}%
              </p>
            </motion.div>

            {/* 1st */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                rounded-3xl
                border border-yellow-200
                dark:border-yellow-700
                bg-gradient-to-br
                from-yellow-50
                to-orange-50
                dark:from-yellow-900/20
                dark:to-orange-900/20
                p-8
                shadow-2xl
                text-center
                scale-105
                md:order-2
              "
            >
              <div
                className="
                  w-20 h-20
                  rounded-3xl
                  bg-gradient-to-br
                  from-yellow-500
                  to-orange-500
                  flex items-center justify-center
                  text-white
                  font-black
                  text-2xl
                  mx-auto mb-4
                  shadow-xl
                "
              >
                {leaderboard[0]?.name?.charAt(0)}
              </div>

              <Crown size={32} className="text-yellow-500 mx-auto mb-2" />

              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                {leaderboard[0]?.name}
              </h3>

              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Champion
              </p>

              <p className="mt-3 text-4xl font-black text-yellow-600">
                {leaderboard[0]?.progress?.averageScore || 0}%
              </p>
            </motion.div>

            {/* 3rd */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="
                rounded-3xl
                border border-amber-200
                dark:border-amber-700
                bg-white
                dark:bg-dark-200
                p-6
                shadow-xl
                text-center
                md:order-3
              "
            >
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-gradient-to-br
                  from-amber-500
                  to-orange-600
                  flex items-center justify-center
                  text-white
                  font-black
                  text-xl
                  mx-auto mb-4
                "
              >
                {leaderboard[2]?.name?.charAt(0)}
              </div>

              <Award size={28} className="text-amber-600 mx-auto mb-2" />

              <h3 className="font-bold text-gray-900 dark:text-white">
                {leaderboard[2]?.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">3rd Position</p>

              <p className="mt-3 text-3xl font-black text-amber-600">
                {leaderboard[2]?.progress?.averageScore || 0}%
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Rankings */}
      <div className="space-y-4">
        {leaderboard?.map((student, index) => (
          <motion.div
            key={student._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className={`
              rounded-3xl
              border
              bg-white
              dark:bg-dark-200
              p-5
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all
              flex items-center gap-4
              ${
                student._id === user?._id
                  ? "ring-2 ring-indigo-500 border-indigo-300"
                  : "border-gray-200 dark:border-gray-700"
              }
            `}
          >
            {/* Rank */}
            <div className="w-10 flex justify-center">{getRankIcon(index)}</div>

            {/* Avatar */}
            <div
              className="
                h-12 w-12
                rounded-2xl
                bg-gradient-to-br
                from-indigo-600
                to-purple-600
                flex items-center justify-center
                text-white
                font-bold
                shadow-lg
              "
            >
              {student.name?.charAt(0)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white truncate">
                {student.name}

                {student._id === user?._id && (
                  <span className="ml-2 text-indigo-600 text-sm">(You)</span>
                )}
              </h3>

              <p className="text-sm text-gray-500">
                {student.progress?.totalQuizzes || 0} Quiz Attempts
              </p>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-green-600">
                <TrendingUp size={14} />
                <span className="text-2xl font-black">
                  {student.progress?.averageScore || 0}%
                </span>
              </div>

              <p className="text-xs text-gray-500">Average Score</p>
            </div>
          </motion.div>
        ))}

        {leaderboard?.length === 0 && (
          <div className="text-center py-20">
            <div
              className="
                h-20 w-20
                rounded-3xl
                bg-gradient-to-br
                from-yellow-500
                to-orange-500
                flex items-center justify-center
                mx-auto mb-4
                text-white
              "
            >
              <Trophy size={36} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No Rankings Yet
            </h3>

            <p className="text-gray-500 mt-2">
              Complete quizzes and become the first ranked student.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
