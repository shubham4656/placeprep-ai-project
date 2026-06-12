import { Brain } from "lucide-react";

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-dark-200 flex flex-col items-center justify-center z-50">
        <div className="bg-primary-600 p-4 rounded-2xl animate-pulse-slow mb-4">
          <Brain size={40} className="text-white" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">{text}</p>
    </div>
  );
};

export default Loader;