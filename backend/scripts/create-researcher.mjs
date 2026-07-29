/**
 * One-time script: create or update the Purnima researcher account.
 * Run from the backend/ directory:
 *   node --env-file=.env scripts/create-researcher.mjs
 */

import pg from 'pg';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set. Make sure .env is loaded.');
  process.exit(1);
}

const PHONE        = '+919434224388';
const PASSWORD     = 'purnima143';
const FULL_NAME    = 'Purnima Chakrabortty';
const EMAIL        = 'purnima.ch123@gmail.com';
const DESIGNATION  = 'Principal Investigator';
const BCRYPT_ROUNDS = 12;

const pool = new pg.Pool({ connectionString: DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash(PASSWORD, BCRYPT_ROUNDS);

    // Upsert the User row
    const upsertUser = await client.query(
      `INSERT INTO "User" (id, phone, "phoneVerified", "passwordHash", role,
         "preferredLanguage", "isActive", "failedPasswordAttempts",
         "failedPinAttempts", "createdAt", "updatedAt")
       VALUES ($1, $2, true, $3, 'researcher', 'en', true, 0, 0, NOW(), NOW())
       ON CONFLICT (phone) DO UPDATE
         SET "passwordHash" = EXCLUDED."passwordHash",
             role            = 'researcher',
             "isActive"      = true,
             "updatedAt"     = NOW()
       RETURNING id`,
      [randomUUID(), PHONE, passwordHash]
    );

    const userId = upsertUser.rows[0].id;
    console.log(`✔ User upserted — id: ${userId}`);

    // Upsert the ResearcherProfile row
    await client.query(
      `INSERT INTO "ResearcherProfile" (id, "userId", "fullName", designation,
         email, "accessLevel", "createdAt")
       VALUES ($1, $2, $3, $4, $5, 'full', NOW())
       ON CONFLICT ("userId") DO UPDATE
         SET "fullName"    = EXCLUDED."fullName",
             designation   = EXCLUDED.designation,
             email         = EXCLUDED.email,
             "accessLevel" = 'full'`,
      [randomUUID(), userId, FULL_NAME, DESIGNATION, EMAIL]
    );

    await client.query('COMMIT');
    console.log(`✔ ResearcherProfile upserted for ${FULL_NAME}`);
    console.log(`\nDone! Login credentials:`);
    console.log(`  Phone:    ${PHONE}`);
    console.log(`  Password: ${PASSWORD}`);
    console.log(`  Role:     researcher`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('ERROR — rolled back:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
