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
        ln.lang_name,
        ln.glotto_id,
        ln.lang_fam_id,
        ln.lang_sub_id,
        ln.speakers,
        ln.city,
        ln.country,
        ln.continent,
        ln.has_nmt,
        ln.has_asr,
        ln.has_tts,
        ST_X(ln.coordinates::geometry) as longitude,
        ST_Y(ln.coordinates::geometry) as latitude,
        lf.name as family_name,
        ls.name as subfamily_name
      FROM language_new ln
      LEFT JOIN language_family lf ON ln.lang_fam_id = lf.id
      LEFT JOIN language_subfamily ls ON ln.lang_sub_id = ls.id
      WHERE ls.id = ${parseInt(id)}
      ORDER BY ln.lang_name ASC;
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
