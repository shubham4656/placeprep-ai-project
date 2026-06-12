import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon, color, subtitle }) => {
  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card flex items-center gap-4"
    >
      {/* Icon */}
      <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;