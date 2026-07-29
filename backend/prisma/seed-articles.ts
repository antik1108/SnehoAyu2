/**
 * Targeted article seed — only upserts learning articles.
 * Run with: DATABASE_URL="..." npx tsx prisma/seed-articles.ts
 */
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/index.js';
import { learningHubContent } from '../../frontend/src/content/learningHubContent.js';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  console.error('DATABASE_URL is required.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  const seedAuthor = await prisma.user.findFirst({
    where: { role: 'researcher' },
    select: { id: true },
  });

  if (!seedAuthor) {
    console.error('No researcher user found. Run the full seed first to create researcher accounts.');
    process.exit(1);
  }

  console.log(`Seeding ${learningHubContent.length} articles...`);
  let seeded = 0;

  for (const item of learningHubContent) {
    await prisma.learningArticle.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        body: item.body,
        summary: item.summary ?? null,
        category: item.category,
        audioUrl: item.audioUrl ?? null,
        status: 'published',
        publishedAt: new Date('2025-01-01T00:00:00.000Z'),
      },
      create: {
        slug: item.slug,
        title: item.title,
        body: item.body,
        summary: item.summary ?? null,
        category: item.category,
        tags: [],
        imageUrls: [],
        audioUrl: item.audioUrl ?? null,
        videoUrl: null,
        coverImageUrl: null,
        status: 'published',
        publishedAt: new Date('2025-01-01T00:00:00.000Z'),
        authorId: seedAuthor.id,
      },
    });
    seeded++;
    if (seeded % 10 === 0) console.log(`  ${seeded}/${learningHubContent.length} done...`);
  }

  console.log(`✓ Seeded ${seeded} learning articles.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
