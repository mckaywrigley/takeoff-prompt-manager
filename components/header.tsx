"use client"; // Needed for usePathname hook

import { motion } from "framer-motion";
import { BookMarked } from "lucide-react"; // Icon (install if needed: npm i lucide-react)
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook to get current path

export const Header = () => {
  const pathname = usePathname(); // Get current route

  // Define navigation links
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Prompts", href: "/prompts" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      {/* max-w-6xl mx-auto px-4... for consistent content width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <motion.div /* ... animation props ... */
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BookMarked className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Prompt Manager</span>
          </motion.div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.div /* ... animation props ... */
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    // Conditional styling for active link
                    pathname === item.href
                      ? "text-blue-600 dark:text-blue-400" // Active style
                      : "text-gray-600 dark:text-gray-300" // Default style
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
