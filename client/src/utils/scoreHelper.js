export const getScoreColor = (percentage) => {
  if (percentage >= 80) return "text-green-500";
  if (percentage >= 50) return "text-yellow-500";
  return "text-red-500";
};

export const getScoreBg = (percentage) => {
  if (percentage >= 80) return "bg-green-100 text-green-700";
  if (percentage >= 50) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export const getScoreLabel = (percentage) => {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 50) return "Average";
  return "Needs Improvement";
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "badge-easy";
    case "medium":
      return "badge-medium";
    case "hard":
      return "badge-hard";
    default:
      return "badge-category";
  }
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};