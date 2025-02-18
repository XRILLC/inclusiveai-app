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
        ROUND(CAST(ST_Y(ln.coordinates::geometry) as numeric), 6) as latitude,
        ROUND(CAST(ST_X(ln.coordinates::geometry) as numeric), 6) as longitude,
        array_remove(ARRAY[
          CASE WHEN ln.asr THEN 'ASR' ELSE NULL END,
          CASE WHEN ln.nmt THEN 'NMT' ELSE NULL END,
          CASE WHEN ln.tts THEN 'TTS' ELSE NULL END
        ], NULL) as available_models
      FROM language_new ln
      LEFT JOIN language_family lf ON ln.language_family_id = lf.id
      LEFT JOIN language_subfamily ls ON ln.language_subfamily_id = ls.id
      WHERE ln.language_subfamily_id = ${parseInt(id)}
      ORDER BY ln.language_name;
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subfamily languages' },
      { status: 500 }
    );
  }
}
