"use client";

import { useState, useEffect } from 'react';
import { ThemeToggle } from "@/components/theme-toggle";

interface Language {
  language: string;
  'bleu (NMT)': string | null;
  'ChrF++': string | null;
  tts: boolean;
}

export default function DirectoryPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/azure-directory');
        if (!response.ok) {
          throw new Error('Failed to fetch directory data');
        }
        const data = await response.json();
        console.log('API Response:', data);
        
        // Transform the data to match our interface
        const transformedData = data.map((item: { language: string; 'bleu (NMT)': string | null; 'ChrF++': string | null; tts: boolean }) => ({
          language: item.language,
          'bleu (NMT)': item['bleu (NMT)'],
          'ChrF++': item['ChrF++'],
          tts: Boolean(item.tts)
        }));
        
        setLanguages(transformedData);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLanguages = languages.filter(lang =>
    lang.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 mt-20">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Language Directory</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-20">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-600 dark:from-emerald-400 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent">Language Directory</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
          This page shows the best known machine translation scores when paired with English 
          as well as the best ASR score per language.
        </p>
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search languages..."
              className="w-64 px-4 py-2 bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm border border-sky-100/20 dark:border-sky-800/20 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

        <ThemeToggle />
      </div>

      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-sky-100/20 dark:border-sky-800/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sky-100/10 dark:border-sky-800/10 bg-gradient-to-r from-emerald-500/5 via-sky-500/5 to-blue-500/5 dark:from-emerald-500/10 dark:via-sky-500/10 dark:to-blue-500/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Language</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">BLEU (NMT)</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">ChrF++</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">WER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLanguages.map((lang, index) => (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-emerald-500/5 hover:via-sky-500/5 hover:to-blue-500/5 dark:hover:from-emerald-500/10 dark:hover:via-sky-500/10 dark:hover:to-blue-500/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {lang.language}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {lang['bleu (NMT)'] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {lang['ChrF++'] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {lang.tts ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
