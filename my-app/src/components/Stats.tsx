"use client";

interface StatsProps {
  totalLanguages: number;
  totalModels: number;
  languagesWithModels: number;
}

export function Stats({ totalLanguages, totalModels, languagesWithModels }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-4">
      <div className="relative group p-6 rounded-xl bg-gradient-to-br from-white/90 to-sky-50/50 dark:from-gray-900/90 dark:to-sky-900/50 backdrop-blur-sm border border-sky-100/20 dark:border-sky-700/20 shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-sky-500/5 dark:from-emerald-500/5 dark:to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="relative z-10 text-sm font-medium bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent">Total Languages</h3>
        <p className="relative z-10 mt-3 text-4xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent">{totalLanguages}</p>
      </div>
      <div className="relative group p-6 rounded-xl bg-gradient-to-br from-white/90 to-sky-50/50 dark:from-gray-900/90 dark:to-sky-900/50 backdrop-blur-sm border border-sky-100/20 dark:border-sky-700/20 shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-sky-500/5 dark:from-emerald-500/5 dark:to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="relative z-10 text-sm font-medium bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent">Total Model Impl.</h3>
        <p className="relative z-10 mt-3 text-4xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent">{totalModels}</p>
      </div>
      <div className="relative group p-6 rounded-xl bg-gradient-to-br from-white/90 to-sky-50/50 dark:from-gray-900/90 dark:to-sky-900/50 backdrop-blur-sm border border-sky-100/20 dark:border-sky-700/20 shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-sky-500/5 dark:from-emerald-500/5 dark:to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="relative z-10 text-sm font-medium bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent">Languages with Models</h3>
        <p className="relative z-10 mt-3 text-4xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent">{languagesWithModels}</p>
      </div>
    </div>
  );
}
