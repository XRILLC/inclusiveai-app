import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  try {
    // First verify environment variables
    const requiredEnvVars = ['AZURE_PGHOST', 'AZURE_PGPORT', 'AZURE_PGDATABASE', 'AZURE_PGUSER', 'AZURE_PGPASSWORD'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      console.error('Missing environment variables:', missingEnvVars);
      return NextResponse.json(
        { error: `Missing required environment variables: ${missingEnvVars.join(', ')}` },
        { status: 500 }
      );
    }

    const connectionConfig = {
      host: process.env.AZURE_PGHOST,
      port: parseInt(process.env.AZURE_PGPORT || '5432'),
      database: process.env.AZURE_PGDATABASE,
      username: process.env.AZURE_PGUSER,
      password: process.env.AZURE_PGPASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    };

    console.log('Attempting to connect with config:', {
      ...connectionConfig,
      password: '[REDACTED]'
    });

    const sql = postgres(connectionConfig);

    console.log('Executing query...');
    const result = await sql`
      SELECT 
        ln.language_name AS language, 
        nps.spbleu_spm_200 AS "bleu (NMT)", 
        nps.chrf_plus AS "ChrF++",
        ln.tts
      FROM public.language_new ln
      LEFT JOIN public.nmt_pairs_source nps 
        ON ln.id = nps.source_lang_id
      WHERE nps."Target" = 'eng_Latn'
      ORDER BY ln.language_name ASC;
    `;

    console.log('Query executed successfully, row count:', result.length);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('Unknown error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
