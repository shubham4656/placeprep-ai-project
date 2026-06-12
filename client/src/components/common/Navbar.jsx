import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  Mic,
  FileText,
  Map,
  Trophy,
  Settings,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { to: "/quiz", label: "Quizzes", icon: <BookOpen size={18} /> },
    { to: "/mock-interview", label: "Interview", icon: <Mic size={18} /> },
    { to: "/resume", label: "Resume", icon: <FileText size={18} /> },
    { to: "/roadmap", label: "Roadmap", icon: <Map size={18} /> },
    { to: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
  ];

  // Hide certain student-facing links when the logged in user is an admin
  const displayedNavLinks = navLinks.filter((link) => {
    if (user?.role === "admin") {
      const blockedForAdmin = [
        "/quiz",
        "/mock-interview",
        "/resume",
        "/roadmap",
      ];
      return !blockedForAdmin.includes(link.to);
    }
    return true;
  });

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="
      sticky top-0 z-50
      border-b border-gray-200/50 dark:border-gray-700/50
      bg-white/80 dark:bg-dark-100/80
      backdrop-blur-xl
      shadow-sm
    "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="
              h-11 w-11
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              flex items-center justify-center
              shadow-lg
              group-hover:scale-105
              transition-all
            "
            >
              <Brain size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                PlacePrep
                <span className="text-indigo-600">AI</span>
              </h1>

              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Career Acceleration Platform
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2">
              {displayedNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive(link.to)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive("/admin")
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Settings size={16} />
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <div
                    className="
                    h-10 w-10
                    rounded-xl
                    bg-gradient-to-r
                    from-indigo-600
                    to-purple-600
                    flex items-center justify-center
                    text-white
                    font-bold
                    shadow-lg
                  "
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="hidden md:block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-dark-100/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User size={16} />
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline py-2 px-4 text-sm">
                  Login
                </Link>

                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && isAuthenticated && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-100 px-4 py-4 space-y-2">
          {displayedNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium"
            >
              <Settings size={18} />
              Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
