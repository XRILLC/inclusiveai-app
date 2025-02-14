import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const result = await sql`
      SELECT 
        ln.id,
        ln.language_name as name,
        ln.iso_639_3 as iso_code,
        ln.glottocode,
        lf.name as family_name,
        lf.id as family_id,
        ls.name as subfamily_name,
        ls.id as subfamily_id,
        ln.asr,
        ln.nmt,
        ln.tts,
        ln.asr_url,
        ln.nmt_url,
        ln.tts_url,
        ST_Y(ln.coordinates::geometry) as latitude,
        ST_X(ln.coordinates::geometry) as longitude,
        array_remove(ARRAY[
          CASE WHEN ln.asr THEN 'ASR' ELSE NULL END,
          CASE WHEN ln.nmt THEN 'NMT' ELSE NULL END,
          CASE WHEN ln.tts THEN 'TTS' ELSE NULL END
        ], NULL) as available_models,
        (
          SELECT COUNT(*)
          FROM nmt_pairs_source nps
          WHERE source_lang_id = ln.id OR target_lang_id = ln.id
        ) as nmt_pair_count
      FROM language_new ln
      LEFT JOIN language_family lf ON ln.language_family_id = lf.id
      LEFT JOIN language_subfamily ls ON ln.language_subfamily_id = ls.id
      WHERE ln.id = ${parseInt(id)}
      LIMIT 1;
    `;

    await sql.end();
    
    // Transform the result to ensure all values are JSON serializable
    const transformedResult = result[0] ? {
      ...result[0],
      latitude: Number(result[0].latitude),
      longitude: Number(result[0].longitude),
      nmt_pair_count: Number(result[0].nmt_pair_count),
      available_models: Array.isArray(result[0].available_models) 
        ? result[0].available_models.filter(Boolean)
        : [],
      asr: Boolean(result[0].asr),
      nmt: Boolean(result[0].nmt),
      tts: Boolean(result[0].tts)
    } : null;

    return NextResponse.json(transformedResult);
  } catch (error) {
    console.error('Error fetching language:', error);
    return NextResponse.json(
      { error: 'Failed to fetch language details' },
      { status: 500 }
    );
  }
}
