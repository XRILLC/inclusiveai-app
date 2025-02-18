import postgres from 'postgres';

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

export async function query(text: string, params?: (string | number | boolean | Date)[]) {
  const result = await sql.unsafe(text, params);
  return result;
}

interface Language {
  id: number;
  language_name: string;
  coordinates: string;
  asr: boolean;
  nmt: boolean;
  tts: boolean;
  latitude: number;
  longitude: number;
}

export async function loadLanguageData(): Promise<Language[]> {
  const queryText = `
    SELECT 
      id,
      language_name,
      coordinates,
      asr,
      nmt,
      tts,
      ROUND(CAST(ST_Y(coordinates::geometry) as numeric), 6) as latitude,
      ROUND(CAST(ST_X(coordinates::geometry) as numeric), 6) as longitude
    FROM language_new
    WHERE coordinates IS NOT NULL
      AND ST_IsValid(coordinates::geometry)
      AND ST_X(coordinates::geometry) BETWEEN -180 AND 180
      AND ST_Y(coordinates::geometry) BETWEEN -90 AND 90
    ORDER BY language_name
  `;

  try {
    const result = await sql.unsafe(queryText);
    return result.map(row => ({
      id: Number(row.id),
      language_name: String(row.language_name),
      coordinates: String(row.coordinates),
      asr: Boolean(row.asr),
      nmt: Boolean(row.nmt),
      tts: Boolean(row.tts),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude)
    })) as Language[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to load language data from database');
  }
}
