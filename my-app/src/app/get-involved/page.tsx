"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export default function GetInvolvedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-600 dark:from-emerald-400 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">Get Involved</h1>
      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-sky-100/20 dark:border-sky-800/20">
        <a 
          href="https://form.jotform.com/250468687775173" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-lg text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-sky-600 hover:bg-clip-text hover:text-transparent transition-all"
        >
          Follow this <span className="underline">link</span> to connect
        </a>
      </div>
    </div>
  );
}
