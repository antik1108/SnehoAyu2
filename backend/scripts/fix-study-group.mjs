import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
  process.env[key] = val;
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    // Show recent users and their state
    const { rows: users } = await client.query(`
      SELECT 
        u.id, u.phone, u.role,
        mp.id as mp_id, 
        mp."studyGroup", 
        mp."participantCode", 
        mp."hospitalId",
        mp.onboarding_completed_at
      FROM "User" u 
      LEFT JOIN "MotherProfile" mp ON mp."userId" = u.id 
      WHERE u.role = 'mother'
      ORDER BY u."createdAt" DESC 
      LIMIT 5
    `);

    console.log('\n=== Recent mother accounts ===');
    users.forEach((u, i) => {
      console.log(`\n[${i + 1}] Phone: ${u.phone}`);
      console.log(`    studyGroup:       ${u.studyGroup ?? 'NULL ← needs fixing'}`);
      console.log(`    participantCode:  ${u.participantCode ?? 'not assigned yet'}`);
      console.log(`    hospitalId:       ${u.hospitalId ?? 'not linked'}`);
      console.log(`    onboarding done:  ${u.onboarding_completed_at ? 'YES' : 'no'}`);
    });

    // Fix: assign 'study' group to all mothers with null studyGroup who have a hospital linked
    const { rowCount } = await client.query(`
      UPDATE "MotherProfile"
      SET "studyGroup" = 'study'
      WHERE "studyGroup" IS NULL
        AND "hospitalId" IS NOT NULL
        AND "participantCode" IS NULL
        AND onboarding_completed_at IS NULL
    `);

    console.log(`\n✅ Fixed ${rowCount} mother profile(s) — assigned study_group = 'study'`);
    console.log('\nNow go back to your browser and click Retry — it should complete onboarding.\n');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
