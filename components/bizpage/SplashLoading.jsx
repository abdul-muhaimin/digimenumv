import { motion } from "framer-motion";

const SplashLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <motion.div
        className="w-24 h-24 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
    </div>
  );
};

export default SplashLoading;
