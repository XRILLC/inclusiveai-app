"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import TranslationPairs from "../../../components/TranslationPairs";
import ProgressBar from "../../../components/ProgressBar";
import { LanguageData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";


function ModelAvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  return (
    <Badge variant={isAvailable ? "default" : "secondary"} className="text-sm">
      {isAvailable ? '✓ Available' : '✗ Not Available'}
    </Badge>
  );
}

export default function LanguageDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [language, setLanguage] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/languages/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch language details');
        }
        const data = await response.json();
        setLanguage(data);
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
          <p className="text-gray-400">Loading language details...</p>
        </div>
      </div>
    );
  }

  if (error || !language) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-950/20 border-red-900">
          <CardContent className="pt-6">
            <p className="text-red-400 text-center">{error || 'Language not found'}</p>
            <Link href="/" className="text-blue-400 hover:text-blue-300 hover:underline mt-4 block text-center">
              ← Back to Map
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate progress based on available models and translation pairs
  const calculateProgress = () => {
    let score = 0;
    const maxScore = 100;

    if (language.latitude && language.longitude) score += 10;
    const availableModels = language.available_models?.filter(Boolean) || [];
    score += availableModels.length * 15;
    const translationPairCount = language.nmt_pair_count || 0;
    score += Math.min(translationPairCount * 5, 40);

    return Math.min(Math.round((score / maxScore) * 100), 100);
  };

  const progress = calculateProgress();

  return (
    <main className="container mx-auto p-6 space-y-8 bg-gradient-to-b from-gray-800/20 to-gray-900/20 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
            {language.name}
          </h1>
          <p className="text-blue-300/70 mt-1 text-lg">Language Profile</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-blue-300 hover:text-blue-200 flex items-center gap-2 rounded-lg hover:bg-blue-900/30 transition-colors"
        >
          ← Back to Map
        </Link>
      </div>

      <Card className="border-blue-900/20 bg-blue-950/10 backdrop-blur-sm shadow-lg hover:bg-blue-900/20 transition-colors">
        <CardContent className="pt-6">
          <ProgressBar progress={progress} />
          <p className="text-base text-blue-300/70 mt-2 text-center font-medium">
            {progress}% Progress towards full language support
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-2">
          <TabsList className="w-full h-14 bg-transparent gap-1">
            <TabsTrigger 
              value="overview" 
              className="text-lg px-8 py-3 rounded-md data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-200 transition-all h-full"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="technology" 
              className="text-lg px-8 py-3 rounded-md data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-200 transition-all h-full"
            >
              Language Technology
            </TabsTrigger>
            <TabsTrigger 
              value="pairs" 
              className="text-lg px-8 py-3 rounded-md data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-200 transition-all h-full"
            >
              Translation Pairs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="border-blue-900/20 bg-blue-950/10 backdrop-blur-sm shadow-lg hover:bg-blue-900/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-gray-400">🌍</span>
                Location and Geography
              </CardTitle>
            </CardHeader>
            <CardContent>
              {language.latitude && language.longitude ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-300 text-lg px-4 py-2">
                    {language.latitude.toFixed(2)}°N, {language.longitude.toFixed(2)}°E
                  </Badge>
                </div>
              ) : (
                <p className="text-gray-500 italic">Location data not available</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-900/20 bg-blue-950/10 backdrop-blur-sm shadow-lg hover:bg-blue-900/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-gray-400">🏷️</span>
                Classification and Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {language.family_name && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link 
                      href={`/family/${language.family_id}`}
                      className="block p-4 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                    >
                      <span className="text-gray-400">Family</span>
                      <p className="text-blue-400 mt-1">{language.family_name}</p>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-gray-900/95 border-gray-800">
                    <p className="text-sm text-gray-400">
                      Click to view all languages in the {language.family_name} family
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}

              {language.subfamily_name && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link 
                      href={`/subfamily/${language.subfamily_id}`}
                      className="block p-4 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors"
                    >
                      <span className="text-gray-400">Subfamily</span>
                      <p className="text-blue-400 mt-1">{language.subfamily_name}</p>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-gray-900/95 border-gray-800">
                    <p className="text-sm text-gray-400">
                      Click to view all languages in the {language.subfamily_name} subfamily
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}

              <div className="grid grid-cols-2 gap-4">
                {language.iso_code && (
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <span className="text-gray-400">ISO Code</span>
                    <p className="text-white mt-1 font-mono">{language.iso_code}</p>
                  </div>
                )}
                {language.glottocode && (
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <span className="text-gray-400">Glotto Code</span>
                    <p className="text-white mt-1 font-mono">{language.glottocode}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-900/20 bg-blue-950/10 backdrop-blur-sm shadow-lg hover:bg-blue-900/20 transition-colors">
              <CardHeader>
                <CardTitle>Speech Recognition</CardTitle>
                <CardDescription>Automatic Speech Recognition (ASR)</CardDescription>
              </CardHeader>
              <CardContent>
                <ModelAvailabilityBadge isAvailable={language.available_models?.includes('ASR')} />
              </CardContent>
            </Card>
            
            <Card className="border-blue-900/20 bg-blue-950/10 backdrop-blur-sm shadow-lg hover:bg-blue-900/20 transition-colors">
              <CardHeader>
                <CardTitle>Machine Translation</CardTitle>
                <CardDescription>Neural Machine Translation (NMT)</CardDescription>
              </CardHeader>
              <CardContent>
                <ModelAvailabilityBadge isAvailable={language.available_models?.includes('NMT')} />
              </CardContent>
            </Card>
            
            <Card className="border-blue-900/20 bg-blue-950/10 backdrop-blur-sm shadow-lg hover:bg-blue-900/20 transition-colors">
              <CardHeader>
                <CardTitle>Text to Speech</CardTitle>
                <CardDescription>Text-to-Speech Synthesis (TTS)</CardDescription>
              </CardHeader>
              <CardContent>
                <ModelAvailabilityBadge isAvailable={language.available_models?.includes('TTS')} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pairs" className="mt-6">
          <TranslationPairs languageId={resolvedParams.id} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
