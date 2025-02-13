import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  try {
    const sql = postgres({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

    const result = await sql`
      SELECT 
        ln.lang_name AS language, 
        CAST(nps.spbleu_spm_200 AS FLOAT) AS bleu_nmt, 
        CAST(nps.chrf_plus AS FLOAT) AS chrf,
        COALESCE(ln.tts, false) AS tts
      FROM public.language_new ln
      LEFT JOIN public.nmt_pairs_source nps 
        ON ln.id = nps.source_lang_id
      WHERE nps."Target" = 'eng_Latn'
      ORDER BY ln.lang_name ASC;
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
