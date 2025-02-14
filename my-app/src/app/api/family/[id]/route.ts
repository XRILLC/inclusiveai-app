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
        ln.iso_code,
        ln.glottocode,
        lf.name as family_name,
        lf.id as family_id,
        ls.name as subfamily_name,
        ls.id as subfamily_id,
        ln.latitude,
        ln.longitude,
        ln.asr_url IS NOT NULL as asr,
        ln.nmt_url IS NOT NULL as nmt,
        ln.tts_url IS NOT NULL as tts,
        ln.asr_url,
        ln.nmt_url,
        ln.tts_url
      FROM language_new ln
      LEFT JOIN language_family lf ON ln.family_id = lf.id
      LEFT JOIN language_subfamily ls ON ln.subfamily_id = ls.id
      WHERE ln.family_id = ${parseInt(id)}
      ORDER BY ln.language_name;
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family languages' },
      { status: 500 }
    );
  }
}
