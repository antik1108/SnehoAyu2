/**
 * One-time script: find all learning_articles with broken/empty slugs
 * and assign them proper unique slugs.
 *
 * Run from the backend/ directory:
 *   node --env-file=.env scripts/fix-broken-slugs.mjs
 */

import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

function generateSlug(title) {
  const ascii = title
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, ' ')   // Bengali → space
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
  return ascii || '';
}

async function run() {
  const client = await pool.connect();
  try {
    // Fetch ALL articles so we can detect slug conflicts
    const { rows: all } = await client.query(
      `SELECT id, title, slug FROM "learning_articles" ORDER BY created_at ASC`
    );

    console.log(`Found ${all.length} total articles.`);

    const usedSlugs = new Set(all.map(r => r.slug).filter(Boolean));
    let fixed = 0;

    for (const row of all) {
      const currentSlug = row.slug ?? '';

      // A slug is broken if it's empty, just dashes, or starts with '--'
      const isBroken = !currentSlug
        || currentSlug.replace(/-/g, '').length === 0
        || currentSlug === '--'
        || currentSlug.startsWith('--');

      if (!isBroken) continue;

      // Generate a new slug from the title
      usedSlugs.delete(currentSlug); // remove the broken one from the set
      let base = generateSlug(row.title) || `article-${Date.now()}`;
      let newSlug = base;
      let i = 2;
      while (usedSlugs.has(newSlug)) {
        newSlug = `${base}-${i}`;
        i++;
      }
      usedSlugs.add(newSlug);

      await client.query(
        `UPDATE "learning_articles" SET slug = $1, updated_at = NOW() WHERE id = $2`,
        [newSlug, row.id]
      );
      console.log(`  Fixed: "${row.title}" → slug: "${newSlug}" (was: "${currentSlug}")`);
      fixed++;
    }

    if (fixed === 0) {
      console.log('No broken slugs found — all articles are fine.');
    } else {
      console.log(`\n✔ Fixed ${fixed} broken slug(s). Patients can now open those articles.`);
    }
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
