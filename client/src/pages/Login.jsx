import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Brain,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Trophy,
  Target,
  Mail,
  Lock
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-indigo-50
        to-purple-50
        dark:from-dark-300
        dark:via-dark-200
        dark:to-dark-100
        flex items-center justify-center
        px-4 py-10
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center">
            <div
              className="
      h-14 w-14
      rounded-2xl
      bg-gradient-to-br
      from-indigo-600
      via-purple-600
      to-fuchsia-600
      flex items-center justify-center
      shadow-[0_15px_35px_rgba(99,102,241,0.35)]
    "
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
          </Link>

          <h1 className="text-4xl font-black text-gray-900 dark:text-white mt-5">
            Welcome Back
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Continue your placement preparation journey
          </p>
        </div>

        {/* Login Card */}
        <div
          className="
            rounded-[32px]
            border border-gray-200
            dark:border-gray-700
            bg-white/90
            dark:bg-dark-200/90
            backdrop-blur-xl
            shadow-2xl
            p-8
          "
        >
          {/* Feature Pills */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-3 text-center">
              <Target size={18} className="mx-auto mb-1 text-indigo-600" />
              <p className="text-xs font-semibold text-indigo-600">Roadmaps</p>
            </div>

            <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-3 text-center">
              <Brain size={18} className="mx-auto mb-1 text-green-600" />
              <p className="text-xs font-semibold text-green-600">AI Mock</p>
            </div>

            <div className="rounded-2xl bg-purple-50 dark:bg-purple-900/20 p-3 text-center">
              <Trophy size={18} className="mx-auto mb-1 text-purple-600" />
              <p className="text-xs font-semibold text-purple-600">
                ATS Resume
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="
        w-full
        pl-12
        rounded-2xl
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-300
        px-4 py-3
        outline-none
        focus:border-indigo-500
        focus:ring-4
        focus:ring-indigo-500/10
      "
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="
        w-full
        pl-12
        pr-12
        rounded-2xl
        border border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-dark-300
        px-4 py-3
        outline-none
        focus:border-indigo-500
        focus:ring-4
        focus:ring-indigo-500/10
      "
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-gray-400
        hover:text-indigo-600
      "
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                py-4
                rounded-2xl
                font-semibold
                text-white
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                shadow-xl
                hover:scale-[1.01]
                transition-all
                flex items-center justify-center gap-2
                disabled:opacity-70
              "
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="
                text-indigo-600
                font-semibold
                hover:underline
              "
            >
              Sign Up Free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
