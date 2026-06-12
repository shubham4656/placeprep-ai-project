import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, logoutUser } from "../api/axios";
import toast from "react-hot-toast";

const useAuth = () => {
  const { setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const res = await loginUser(data);
      const { token, ...user } = res.data.data;
      setUser(user, token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const res = await registerUser(data);
      const { token, ...user } = res.data.data;
      setUser(user, token);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Logout error:", error.message);
    } finally {
      logout();
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  return { login, register, handleLogout };
};

export default useAuth;