"use client";

interface StatsProps {
  totalLanguages: number;
  totalModels: number;
  languagesWithModels: number;
}

export function Stats({ totalLanguages, totalModels, languagesWithModels }: StatsProps) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10">
        <h3 className="text-sm font-medium text-gray-300">Total Languages</h3>
        <p className="mt-3 text-4xl font-bold text-white">{totalLanguages}</p>
      </div>
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10">
        <h3 className="text-sm font-medium text-gray-300">Total Model Implementations</h3>
        <p className="mt-3 text-4xl font-bold text-white">{totalModels}</p>
      </div>
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10">
        <h3 className="text-sm font-medium text-gray-300">Languages with Models</h3>
        <p className="mt-3 text-4xl font-bold text-white">{languagesWithModels}</p>
      </div>
    </div>
  );
}
