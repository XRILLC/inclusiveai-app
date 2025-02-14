import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkAmharicPairs() {
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

  try {
    // 1. Get Amharic's ID
    const [amharic] = await sql`
      SELECT id, language_name 
      FROM language_new 
      WHERE language_name = 'Amharic'`;
    console.log('\nAmharic details:', amharic);

    if (amharic) {
      // 2. Check translation pairs where Amharic is source
      console.log('\nTranslation pairs where Amharic is source:');
      const sourceResults = await sql`
        SELECT 
          source_lang.language_name AS source_language,
          target_lang.language_name AS target_language,
          nps.chrf_plus,
          nps.spbleu_spm_200,
          nps."Target"
        FROM nmt_pairs_source nps
        JOIN language_new source_lang ON nps.source_lang_id = source_lang.id
        JOIN language_new target_lang ON nps.target_lang_id = target_lang.id
        WHERE source_lang.id = ${amharic.id}`;
      console.log('Source pairs:', sourceResults);

      // 3. Check translation pairs where Amharic is target
      console.log('\nTranslation pairs where Amharic is target:');
      const targetResults = await sql`
        SELECT 
          source_lang.language_name AS source_language,
          target_lang.language_name AS target_language,
          nps.chrf_plus,
          nps.spbleu_spm_200,
          nps."Target"
        FROM nmt_pairs_source nps
        JOIN language_new source_lang ON nps.source_lang_id = source_lang.id
        JOIN language_new target_lang ON nps.target_lang_id = target_lang.id
        WHERE target_lang.id = ${amharic.id}`;
      console.log('Target pairs:', targetResults);

      // 4. For comparison, let's check Oromo's pairs
      const [oromo] = await sql`
        SELECT id, language_name 
        FROM language_new 
        WHERE language_name = 'Oromo'`;
      
      if (oromo) {
        console.log('\nFor comparison - Oromo translation pairs:');
        const oromoPairs = await sql`
          SELECT 
            source_lang.language_name AS source_language,
            target_lang.language_name AS target_language,
            nps.chrf_plus,
            nps.spbleu_spm_200,
            nps."Target"
          FROM nmt_pairs_source nps
          JOIN language_new source_lang ON nps.source_lang_id = source_lang.id
          JOIN language_new target_lang ON nps.target_lang_id = target_lang.id
          WHERE source_lang.id = ${oromo.id} OR target_lang.id = ${oromo.id}`;
        console.log('Oromo pairs:', oromoPairs);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

checkAmharicPairs();
