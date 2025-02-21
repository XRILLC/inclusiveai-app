import { NextResponse } from 'next/server';
import { query } from '../db-azure';

interface StatsData {
  totalLanguages: number;
  totalModels: number;
  languagesWithModels: number;
}

export async function GET() {
  try {
    // Get total languages
    const totalLangsResult = await query(`
      SELECT COUNT(DISTINCT id) AS total
      FROM language_new;
    `);

    // Get languages with models
    const langsWithModelsResult = await query(`
      SELECT COUNT(DISTINCT id) AS total
      FROM language_new
      WHERE asr = TRUE OR nmt = TRUE;
    `);

    // Get total models and datasets
    const totalModelsResult = await query(`
      SELECT 
        (SELECT COUNT(source_lang_id) FROM nmt_pairs_source) +
        (SELECT COUNT(lang_1_id) FROM nmt_datasets) +
        (SELECT COUNT(lang_id) FROM asr_source) 
        AS total;
    `);

    const stats: StatsData = {
      totalLanguages: Number(totalLangsResult[0].total),
      languagesWithModels: Number(langsWithModelsResult[0].total),
      totalModels: Number(totalModelsResult[0].total)
    };
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
