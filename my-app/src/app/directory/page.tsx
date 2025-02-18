"use client";

import { useState, useEffect } from 'react';

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
      <div className="container mx-auto p-4">
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
      <div className="container mx-auto p-4">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Language Directory</h1>
        <p className="text-lg text-gray-300">
          This page shows the best known machine translation scores when paired with English 
          as well as the best ASR score per language.
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Search languages..."
            className="w-64 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Language</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">BLEU (NMT)</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">ChrF++</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">TTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLanguages.map((lang, index) => (
                <tr key={index} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {lang.language}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {lang['bleu (NMT)'] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {lang['ChrF++'] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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
