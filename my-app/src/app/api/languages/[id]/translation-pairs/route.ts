import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sql = postgres({
      host: process.env.AZURE_PGHOST,
      port: parseInt(process.env.AZURE_PGPORT || '5432'),
      database: process.env.AZURE_PGDATABASE,
      username: process.env.AZURE_PGUSER,
      password: process.env.AZURE_PGPASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    });

    const { id } = await params;
    const languageId = parseInt(id);
    if (isNaN(languageId)) {
      return NextResponse.json(
        { error: 'Invalid language ID' },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        nps.chrf_plus as chrf_score,
        nps.spbleu_spm_200 as bleu_score,
        source_lang.language_name AS source_language,
        target_lang.language_name AS target_language,
        CASE 
          WHEN source_lang.id = $1 THEN 'Source'
          ELSE 'Target'
        END as role
      FROM 
        nmt_pairs_source nps
      LEFT JOIN 
        language_new AS source_lang 
      ON 
        nps.source_lang_id = source_lang.id
      LEFT JOIN 
        language_new AS target_lang 
      ON 
        nps.target_lang_id = target_lang.id
      WHERE 
        nps.source_lang_id IS NOT NULL
        AND nps.target_lang_id IS NOT NULL
        AND (source_lang.id = $1 OR target_lang.id = $1)
      ORDER BY 
        role, nps.chrf_plus DESC NULLS LAST
    `;

    const result = await sql.unsafe(query, [languageId]);
    await sql.end();

    // Transform the results to ensure all values are JSON serializable and properly formatted
    const transformedResult = result.map(row => ({
      ...row,
      chrf_score: row.chrf_score ? Number(row.chrf_score) : null,
      bleu_score: row.bleu_score ? Number(row.bleu_score) : null,
      source_language: String(row.source_language),
      target_language: String(row.target_language),
      role: String(row.role)
    }));

    return NextResponse.json(transformedResult);
  } catch (error) {
    console.error('Error fetching translation pairs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translation pairs' },
      { status: 500 }
    );
  }
}
