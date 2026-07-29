import pg from 'pg';
import { learningHubContent } from '../../frontend/src/content/learningHubContent.js';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) { console.error('No DATABASE_URL'); process.exit(1); }

const pool = new pg.Pool({ connectionString });

async function main() {
  const res = await pool.query('SELECT slug, category, title FROM learning_articles ORDER BY category, slug');
  const dbSlugs = new Set(res.rows.map((r: { slug: string }) => r.slug));
  const contentSlugs = learningHubContent.map(a => a.slug);

  console.log(`DB articles:      ${res.rows.length}`);
  console.log(`Content articles: ${contentSlugs.length}`);

  const missing = contentSlugs.filter(s => !dbSlugs.has(s));
  const extra   = [...dbSlugs].filter(s => !contentSlugs.includes(s));

  if (missing.length) {
    console.log('\n❌ In content but NOT in DB:');
    missing.forEach(s => console.log('  ', s));
  } else {
    console.log('\n✅ All content slugs are in DB');
  }

  if (extra.length) {
    console.log('\n⚠️  In DB but NOT in content (old/orphaned):');
    extra.forEach(s => console.log('  ', s));
  }

  console.log('\nDB breakdown by category:');
  const byCat: Record<string, number> = {};
  res.rows.forEach((r: { category: string }) => { byCat[r.category] = (byCat[r.category] || 0) + 1; });
  Object.entries(byCat).sort().forEach(([c, n]) => console.log(`  ${c.padEnd(22)} ${n}`));

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
