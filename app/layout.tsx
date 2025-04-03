import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Or your chosen fonts
import "./globals.css"; // Tailwind base styles

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Update metadata for the site
export const metadata: Metadata = {
  title: "Prompt Manager",
  description: "Organize and manage your AI prompts efficiently."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        // Apply font variables and base background/text colors
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        {/* children represents the content of the current page */}
        {children}
      </body>
    </html>
  );
}
