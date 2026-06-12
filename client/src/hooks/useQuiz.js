import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitQuiz } from "../api/axios";
import toast from "react-hot-toast";

const useQuiz = (quizId) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const selectAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = (total) => {
    if (currentQuestion < total - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async (timeTaken) => {
    try {
      setIsSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([question, selectedAnswer]) => ({
          question,
          selectedAnswer,
        })
      );

      const res = await submitQuiz(quizId, {
        answers: formattedAnswers,
        timeTaken,
      });

      toast.success("Quiz submitted successfully!");
      navigate(`/quiz/results/${res.data.data.result._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    answers,
    currentQuestion,
    setCurrentQuestion,
    isSubmitting,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    handleSubmit,
  };
};

export default useQuiz;