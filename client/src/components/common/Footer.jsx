import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  Github,
  Twitter,
  Linkedin,
  Shield,
  Users,
  BarChart3,
  FileText,
  LayoutDashboard,
  Trophy,
} from "lucide-react";

const Footer = () => {
  const location = useLocation();

  const isAdmin =
    location.pathname.includes("/admin") ||
    location.pathname === "/admin";

  const quickLinks = isAdmin
    ? [
        { to: "/admin", label: "Overview" },
        { to: "/admin", label: "Questions" },
        { to: "/admin", label: "Quiz Management" },
        { to: "/admin", label: "Users" },
        { to: "/admin", label: "Analytics" },
      ]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/quiz", label: "Quizzes" },
        { to: "/mock-interview", label: "Mock Interview" },
        { to: "/resume", label: "Resume Analyzer" },
      ];

  const resources = isAdmin
    ? [
        { to: "/admin", label: "Add Question" },
        { to: "/admin", label: "Create Quiz" },
        { to: "/admin", label: "Manage Users" },
        { to: "/admin", label: "Reports" },
      ]
    : [
        { to: "/roadmap", label: "Study Roadmap" },
        { to: "/leaderboard", label: "Leaderboard" },
        { to: "/register", label: "Get Started" },
      ];

  return (
    <footer className="relative overflow-hidden mt-auto border-t border-gray-200/50 dark:border-gray-700 bg-white dark:bg-dark-100">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 h-80 w-80 bg-purple-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-[0_15px_35px_rgba(99,102,241,0.35)]">
                <Brain size={24} className="text-white" />
              </div>

              <div>
                <h3 className="text-3xl font-black">
                  <span className="text-indigo-600">PlacePrep</span>
                  <span className="text-purple-600"> AI</span>
                </h3>
                <p className="text-xs text-gray-500">
                  AI Powered Placement Platform
                </p>
              </div>
            </Link>

            <p className="max-w-lg text-gray-500 dark:text-gray-400 leading-8">
              {isAdmin
                ? "Centralized admin workspace for managing quizzes, users and analytics."
                : "AI-powered placement preparation platform helping students crack aptitude tests, interviews and secure dream placements."}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
              <div className="rounded-2xl bg-gray-50 dark:bg-dark-200 p-4 text-center">
                <h4 className="text-2xl font-black text-indigo-600">500+</h4>
                <p className="text-xs text-gray-500">Questions</p>
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-dark-200 p-4 text-center">
                <h4 className="text-2xl font-black text-purple-600">AI</h4>
                <p className="text-xs text-gray-500">Powered</p>
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-dark-200 p-4 text-center">
                <h4 className="text-2xl font-black text-emerald-600">24/7</h4>
                <p className="text-xs text-gray-500">Support</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <button
                  key={index}
                  className="h-12 w-12 rounded-2xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg hover:-translate-y-1 hover:border-indigo-500 hover:text-indigo-600 transition-all"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              Navigation
            </h4>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              {isAdmin ? "Admin Tools" : "Resources"}
            </h4>

            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {isAdmin && (
              <div className="mt-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-600">
                    Administrator Access
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  You have full platform management permissions.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PlacePrep AI. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
