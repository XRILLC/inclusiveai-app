import { NextResponse } from 'next/server';
import { loadLanguageData } from '../db-azure';

export async function GET() {
  try {
    const languages = await loadLanguageData();
    
    // Transform the data to match the expected format
    const transformedLanguages = languages.map(lang => {
      // Ensure all required fields have default values
      const transformedLang = {
        id: lang.id,
        name: lang.name || '',
        iso_code: lang.iso_code || '',
        latitude: Number(lang.latitude) || 0,
        longitude: Number(lang.longitude) || 0,
        available_models: Array.isArray(lang.available_models) ? lang.available_models : [],
        nmt_pair_count: Number(lang.nmt_pair_count) || 0,
        connected_languages: Array.isArray(lang.connected_languages) ? lang.connected_languages : [],
        connected_coords: Array.isArray(lang.connected_coords) ? lang.connected_coords : [],
        connected_lang_ids: Array.isArray(lang.connected_lang_ids) ? lang.connected_lang_ids : [],
        chrf_scores: Array.isArray(lang.chrf_scores) ? lang.chrf_scores.map(Number) : [],
        bleu_scores: Array.isArray(lang.bleu_scores) ? lang.bleu_scores.map(Number) : [],
        has_nmt_pair: Boolean(lang.has_nmt_pair)
      };

      return transformedLang;
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
