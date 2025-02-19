import { NextResponse } from 'next/server';
import { loadLanguageData } from '../db-azure';

interface Language {
  id: number;
  language_name: string;
  asr: boolean;
  nmt: boolean;
  tts: boolean;
  latitude: number;
  longitude: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelType = searchParams.get('model');
  try {
    const languages = await loadLanguageData(modelType || undefined);
    
    // Transform the data to match the expected format
    const transformedLanguages = (languages as Language[]).map(lang => {
      const models = [];
      if (lang.asr) models.push('ASR');
      if (lang.nmt) models.push('NMT');
      if (lang.tts) models.push('TTS');
      
      return {
        id: lang.id,
        name: lang.language_name || '',
        latitude: Number(lang.latitude) || 0,
        longitude: Number(lang.longitude) || 0,
        available_models: models
      };
    });

    if (transformedLanguages.length === 0) {
      console.warn('No languages found in the database');
    }

    return NextResponse.json(transformedLanguages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to fetch languages: ${errorMessage}` },
      { status: 500 }
    );
  }
}
