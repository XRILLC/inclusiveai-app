"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';

interface Language {
  id: number;
  name: string;
  iso_code: string;
  glottocode: string;
  family_name: string;
  family_id: number;
}

export default function FamilyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/family/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch family languages');
        }
        const data = await response.json();
        setLanguages(data);
        if (data.length > 0) {
          setFamilyName(data[0].family_name);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading languages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 pt-24 bg-gradient-to-b from-gray-800/20 to-gray-900/20 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 break-words">
              {familyName}
            </h1>
            <p className="text-blue-300/70 mt-2 text-lg">Language Family</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-blue-300 hover:text-blue-200 flex items-center gap-2 rounded-lg hover:bg-blue-900/30 transition-colors"
          >
            ← Back to Map
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((language) => (
            <Link
              key={language.id}
              href={`/language/${language.id}`}
              className="group p-4 rounded-lg bg-blue-950/10 hover:bg-blue-900/20 transition-all duration-200 border border-blue-900/20 hover:border-blue-800/30 backdrop-blur-sm"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-blue-100 group-hover:text-blue-300 transition-colors">
                    {language.name}
                  </h3>
                  {language.iso_code && (
                    <p className="text-sm text-blue-300/60 mt-1">
                      ISO: {language.iso_code}
                    </p>
                  )}
                </div>
                <span className="text-gray-500 group-hover:text-gray-400 transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
