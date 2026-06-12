import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token
API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ─── AUTH ─────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const logoutUser = () => API.post("/auth/logout");

// ─── USER ─────────────────────────────────────────────
export const getDashboard = () => API.get("/user/dashboard");
export const getLeaderboard = () => API.get("/user/leaderboard");
export const updateProfile = (data) => API.put("/user/profile", data);
export const getAllUsers = () => API.get("/user/all");
export const deleteUser = (id) => API.delete(`/user/${id}`);
export const getAdminAnalytics = () => API.get("/user/analytics");

// ─── QUIZ ─────────────────────────────────────────────
export const getAllQuizzes = (params) => API.get("/quiz", { params });
export const getQuizById = (id) => API.get(`/quiz/${id}`);
export const submitQuiz = (id, data) => API.post(`/quiz/${id}/submit`, data);
export const getUserResults = () => API.get("/quiz/results");
export const getResultById = (id) => API.get(`/quiz/results/${id}`);

// ─── ADMIN QUIZ ───────────────────────────────────────
export const createQuiz = (data) => API.post("/quiz", data);
export const updateQuiz = (id, data) => API.put(`/quiz/${id}`, data);
export const deleteQuiz = (id) => API.delete(`/quiz/${id}`);
export const getAllQuestions = (params) =>
  API.get("/quiz/questions", { params });
export const createQuestion = (data) => API.post("/quiz/questions", data);
export const deleteQuestion = (id) => API.delete(`/quiz/questions/${id}`);

// ─── INTERVIEW ────────────────────────────────────────
export const startInterview = (data) => API.post("/interview/start", data);
export const answerInterview = (data) => API.post("/interview/answer", data);

// ─── RESUME ───────────────────────────────────────────
export const uploadResume = (data) =>
  API.post("/resume/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const analyzeResume = (id, data) =>
  API.post(`/resume/analyze/${id}`, data);
export const getUserResumes = () => API.get("/resume");
export const getResumeById = (id) => API.get(`/resume/${id}`);
export const deleteResume = (id) => API.delete(`/resume/${id}`);

// ─── AI ───────────────────────────────────────────────
export const generateRoadmap = (data) => API.post("/ai/roadmap", data);

export default API;
