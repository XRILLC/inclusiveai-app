"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BridgingProgressBar } from '../../../components/BridgingProgressBar';

interface LanguageDetails {
  id: number;
  name: string;
  iso_code: string;
  glottocode: string;
  family_name: string;
  family_id: number;
  subfamily_name: string;
  subfamily_id: number;
  available_models: string[];
  nmt_pair_count: number;
  latitude: number;
  longitude: number;
  asr: boolean;
  nmt: boolean;
  tts: boolean;
}

export default function LanguageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [language, setLanguage] = useState<LanguageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguageDetails = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/languages/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch language details');
        }
        const data = await response.json();
        setLanguage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch language details');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageDetails();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !language) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-red-500">{error || 'Language not found'}</div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(
    (language.available_models.length / 3) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{language.name}</h1>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Map
          </Link>
        </div>

        <div className="mb-8">
          <BridgingProgressBar progress={progressPercentage} />
          <p className="text-sm text-gray-500 mt-2">{progressPercentage}% to Goal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500">ISO Code</dt>
                <dd className="text-gray-900">{language.iso_code || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Glottocode</dt>
                <dd className="text-gray-900">{language.glottocode || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Language Family</dt>
                <dd className="text-gray-900">
                  {language.family_name ? (
                    <Link 
                      href={`/family/${language.family_id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {language.family_name}
                    </Link>
                  ) : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Subfamily</dt>
                <dd className="text-gray-900">
                  {language.subfamily_name ? (
                    <Link 
                      href={`/subfamily/${language.subfamily_id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {language.subfamily_name}
                    </Link>
                  ) : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Language Technology</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Available Models</h3>
                <div className="space-y-2">
                  <div className={`flex items-center ${language.asr ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="mr-2">{language.asr ? '✓' : '×'}</span>
                    <span>Automatic Speech Recognition (ASR)</span>
                  </div>
                  <div className={`flex items-center ${language.nmt ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="mr-2">{language.nmt ? '✓' : '×'}</span>
                    <span>Neural Machine Translation (NMT)</span>
                  </div>
                  <div className={`flex items-center ${language.tts ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="mr-2">{language.tts ? '✓' : '×'}</span>
                    <span>Text-to-Speech (TTS)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Translation Pairs</h2>
            <div>
              <p className="text-3xl font-bold text-blue-600 mb-2">{language.nmt_pair_count}</p>
              <p className="text-sm text-gray-500">Total translation pairs available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
