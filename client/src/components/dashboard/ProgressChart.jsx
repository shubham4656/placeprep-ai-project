import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const ProgressChart = ({ categoryStats = [], type = "radar" }) => {
  const defaultData = [
    { category: "DSA", avgScore: 0 },
    { category: "OS", avgScore: 0 },
    { category: "DBMS", avgScore: 0 },
    { category: "Aptitude", avgScore: 0 },
    { category: "HR", avgScore: 0 },
    { category: "Networking", avgScore: 0 },
  ];

  const data =
    categoryStats.length > 0
      ? categoryStats.map((s) => ({
          category: s._id,
          avgScore: Math.round(s.avgScore),
          attempts: s.count,
        }))
      : defaultData;

  const averageScore =
    data.length > 0
      ? Math.round(
          data.reduce((acc, item) => acc + item.avgScore, 0) / data.length
        )
      : 0;

  if (type === "bar") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          rounded-3xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-dark-200
          shadow-xl
          p-6
        "
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Performance by Category
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Average score across all topics
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2">
            <TrendingUp size={18} className="text-indigo-600" />
            <span className="font-semibold text-indigo-600">
              {averageScore}%
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="category"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                background: "#111827",
                color: "#fff",
              }}
            />

            <Legend />

            <Bar
              dataKey="avgScore"
              name="Average Score (%)"
              fill="#6366f1"
              radius={[12, 12, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        rounded-3xl
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-dark-200
        shadow-xl
        p-6
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Topic Mastery Radar
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualize strengths across categories
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-purple-50 dark:bg-purple-900/20 px-4 py-2">
          <TrendingUp size={18} className="text-purple-600" />
          <span className="font-semibold text-purple-600">
            {averageScore}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="#d1d5db" />

          <PolarAngleAxis
            dataKey="category"
            tick={{
              fontSize: 12,
              fill: "#6b7280",
            }}
          />

          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{
              fontSize: 10,
              fill: "#6b7280",
            }}
          />

          <Radar
            name="Score"
            dataKey="avgScore"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.35}
            strokeWidth={3}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "none",
              background: "#111827",
              color: "#fff",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProgressChart;