"use client"; // Mark as client component for interactivity

import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter(); // Hook for programmatic navigation

  return (
    <>
      <Header /> {/* Include the shared header */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
        {/* Use pt-16 (h-16) to offset content below fixed header */}
        <motion.main
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 /* Title */
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Prompt Manager
          </motion.h1>
          <motion.p /* Description */
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Store, organize, and manage all your AI prompts in one place. Boost your productivity with easy access to your favorite prompts.
          </motion.p>
          <motion.div /* Button */
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              onClick={() => router.push("/prompts")} // Navigate on click
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Get Started
            </button>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
}
