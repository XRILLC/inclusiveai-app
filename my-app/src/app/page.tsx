"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Stats } from "../components/Stats";
import { ModelFilters } from "../components/ModelFilters";
import { BridgingProgressBar } from "../components/BridgingProgressBar";
import { LanguageData } from "@/types";


const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['ASR']);
  const [activeProgressTab, setActiveProgressTab] = useState<'languages' | 'population'>('languages');
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalLanguages: 0,
    languagesWithModels: 0,
    totalModels: 0
  });

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const model = selectedModels.length === 1 ? selectedModels[0] : null;
        const url = model ? `/api/languages?model=${model}` : '/api/languages';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch languages');
        }
        const data = await response.json();
        setLanguages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [selectedModels]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Fallback to calculating from map data if API fails
        setStats({
          totalLanguages: languages.length,
          languagesWithModels: languages.filter(lang => 
            lang.available_models && lang.available_models.length > 0
          ).length,
          totalModels: languages.reduce((sum, lang) => 
            sum + (lang.available_models?.length || 0), 0)
        });
      }
    };
    fetchStats();
  }, [languages]); // Re-fetch when languages change

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }


  return (
    <main className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-sky-500/30 to-blue-600/20 dark:from-emerald-900/40 dark:via-sky-900/50 dark:to-blue-900/40 text-gray-900 dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100px_100px,rgba(165,243,252,0.1),transparent)] dark:bg-[radial-gradient(circle_800px_at_100px_100px,rgba(56,189,248,0.1),transparent)]"></div>

      <div className="container mx-auto px-8 py-8 mt-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">DigitalDivide.ai</h1>
        </div>
        <Stats {...stats} />

        <div className="mt-12 mb-16">
          <BridgingProgressBar
            progress={46}
            activeTab={activeProgressTab}
            onTabChange={setActiveProgressTab}
          />
        </div>

        <ModelFilters onFilterChange={setSelectedModels} />

        <div className="rounded-xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 h-[600px]">
          <Map languages={languages} selectedModels={selectedModels} />
        </div>
      </div>
    </main>
  );
}