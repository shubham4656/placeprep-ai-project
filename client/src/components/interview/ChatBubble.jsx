import { motion } from "framer-motion";
import { User, Bot, Sparkles } from "lucide-react";

const ChatBubble = ({ message }) => {
  const isInterviewer = message.role === "interviewer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className={`flex items-start gap-3 ${
        isInterviewer ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg ${
          isInterviewer
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            : "bg-gradient-to-r from-slate-600 to-slate-800 text-white"
        }`}
      >
        {isInterviewer ? <Bot size={20} /> : <User size={20} />}
      </div>

      {/* Message Bubble */}
      <div
        className={`group max-w-[80%] px-5 py-4 rounded-3xl shadow-lg transition-all duration-300 ${
          isInterviewer
            ? `
              bg-white dark:bg-dark-100
              border border-gray-200 dark:border-gray-700
              rounded-tl-md
              hover:shadow-xl
            `
            : `
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              text-white
              rounded-tr-md
              hover:shadow-xl
            `
        }`}
      >
        {/* Role Label */}
        <div
          className={`flex items-center gap-1 mb-2 text-[11px] font-semibold uppercase tracking-wider ${
            isInterviewer ? "text-gray-500 dark:text-gray-400" : "text-white/70"
          }`}
        >
          {isInterviewer && <Sparkles size={10} />}
          {isInterviewer ? "AI Interviewer" : "You"}
        </div>

        {/* Message Content */}
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isInterviewer ? "text-gray-800 dark:text-gray-200" : "text-white"
          }`}
        >
          {message.content}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
