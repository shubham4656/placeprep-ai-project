import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Sparkles, Brain, Trophy } from "lucide-react";
import ChatBubble from "./ChatBubble";
import { startInterview, answerInterview } from "../../api/axios";
import toast from "react-hot-toast";

const InterviewPanel = ({ jobRole, difficulty, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStart = async () => {
    try {
      setIsLoading(true);

      const res = await startInterview({
        jobRole,
        difficulty,
      });

      const interviewerMessage = {
        role: "interviewer",
        content: res.data.data.message,
      };

      setMessages([interviewerMessage]);
      setIsStarted(true);
      setQuestionNumber(1);
    } catch (error) {
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnswer = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await answerInterview({
        messages: [...messages, userMessage],
        userAnswer: userInput,
        questionNumber,
      });

      const interviewerMessage = {
        role: "interviewer",
        content: res.data.data.message,
      };

      setMessages((prev) => [...prev, interviewerMessage]);

      setQuestionNumber((prev) => prev + 1);

      if (res.data.data.isComplete) {
        setIsComplete(true);

        if (onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendAnswer();
    }
  };

  if (!isStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          rounded-[32px]
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-dark-200
          shadow-2xl
          p-10
          text-center
        "
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl">
          <Brain size={36} className="text-white" />
        </div>

        <h2 className="text-3xl font-black text-gray-900 dark:text-white">
          AI Mock Interview
        </h2>

        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Practice real interview questions powered by AI.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="rounded-2xl bg-gray-50 dark:bg-dark-300 p-4">
            <p className="text-xs text-gray-500">Role</p>
            <h4 className="font-bold text-indigo-600">{jobRole}</h4>
          </div>

          <div className="rounded-2xl bg-gray-50 dark:bg-dark-300 p-4">
            <p className="text-xs text-gray-500">Difficulty</p>
            <h4 className="font-bold text-purple-600 capitalize">
              {difficulty}
            </h4>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-5 text-sm text-gray-600 dark:text-gray-300">
          You'll answer 5 AI-generated questions. Press Enter to submit answers.
        </div>

        <button
          onClick={handleStart}
          disabled={isLoading}
          className="
            mt-8
            inline-flex items-center gap-2
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            px-8 py-4
            text-white
            font-semibold
            shadow-xl
          "
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Start Interview
            </>
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <div
      className="
        rounded-[32px]
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-dark-200
        shadow-2xl
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
              AI Interview Session
            </h3>

            <p className="text-sm text-gray-500">{jobRole}</p>
          </div>

          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2">
            Question {Math.min(questionNumber, 5)} / 5
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-gray-100 dark:bg-dark-300">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
            style={{
              width: `${Math.min((questionNumber / 5) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="h-[520px] overflow-y-auto p-6 space-y-5">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            AI Interviewer is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isComplete && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-5">
          <div className="flex gap-3">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Type your answer..."
              disabled={isLoading}
              className="
                flex-1
                rounded-2xl
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-dark-300
                px-4 py-3
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />

            <button
              onClick={handleSendAnswer}
              disabled={isLoading || !userInput.trim()}
              className="
                h-14 w-14
                rounded-2xl
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                text-white
                flex items-center justify-center
                shadow-lg
              "
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-green-100 dark:bg-green-900/20 px-4 py-2 text-green-600 font-semibold">
            <Trophy size={18} />
            Interview Completed Successfully
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPanel;
