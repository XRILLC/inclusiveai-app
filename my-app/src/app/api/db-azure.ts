import postgres from 'postgres';

// Create a single, reusable connection pool
let sql: ReturnType<typeof postgres> | null = null;

function getConnection() {
  if (!sql) {
    sql = postgres({
      host: process.env.AZURE_PGHOST,
      port: parseInt(process.env.AZURE_PGPORT || '5432'),
      database: process.env.AZURE_PGDATABASE,
      username: process.env.AZURE_PGUSER,
      password: process.env.AZURE_PGPASSWORD,
      ssl: {
        rejectUnauthorized: false
      },
      max: 3,
      idle_timeout: 10,
      connect_timeout: 10,
      debug: false
    });
  }
  return sql;
}

export async function query(text: string, params?: (string | number | boolean | Date | null)[]) {
  const connection = getConnection();
  try {
    return await connection.unsafe(text, params);
  } catch (error) {
    if (error instanceof Error && error.message.includes('remaining connection slots')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return query(text, params);
    }
    throw error;
  }
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

export async function loadLanguageData(modelType?: string): Promise<Language[]> {
  try {
    let queryText = `
      SELECT 
        id,
        language_name,
        iso_639_3,
        coordinates,
        tts,
        asr,
        nmt,
        nmt_type,
        ROUND(CAST(ST_Y(coordinates::geometry) as numeric), 6) as latitude,
        ROUND(CAST(ST_X(coordinates::geometry) as numeric), 6) as longitude
      FROM language_new
      WHERE coordinates IS NOT NULL
        AND ST_IsValid(coordinates::geometry)
        AND ST_X(coordinates::geometry) BETWEEN -180 AND 180
        AND ST_Y(coordinates::geometry) BETWEEN -90 AND 90
    `;

    if (modelType) {
      // For the Data category, show all languages with any model
      if (modelType.toLowerCase() === 'all') {
        queryText += ` AND (tts IS true OR asr IS true OR nmt IS true)`;
      } else {
        // For specific model types (ASR, NMT, TTS)
        const modelColumn = modelType.toLowerCase();
        queryText += ` AND ${modelColumn} = true`;
      }
    }

    queryText += ` ORDER BY language_name`;

    const result = await query(queryText);
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
