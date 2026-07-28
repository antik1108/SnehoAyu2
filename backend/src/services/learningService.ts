/**
 * @file services/learningService.ts
 * @description Public read operations for published LearningArticle records,
 *              including view tracking for mother-role users.
 * Requirements: 7.1–7.7, 8.1–8.5
 */
import { PrismaClient } from '../../generated/prisma/index.js';
import { createError } from '../middlewares/errorHandler.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function estimateDuration(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── listPublishedArticles ──────────────────────────────────────────────────────

export interface ListPublishedFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function listPublishedArticles(
  filters: ListPublishedFilters,
  userId: string,
  role: string,
  prisma: PrismaClient
) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = { status: 'published' };
  if (filters.category) where['category'] = filters.category;
  if (filters.search) {
    const search = filters.search;
    where['OR'] = [
      { title: { contains: search, mode: 'insensitive' } },
      { body: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search] } },
    ];
  }

  const [rawArticles, total] = await Promise.all([
    prisma.learningArticle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        tags: true,
        coverImageUrl: true,
        audioUrl: true,
        videoUrl: true,
        publishedAt: true,
        body: true, // needed for durationMin calculation; stripped before response
      },
    }),
    prisma.learningArticle.count({ where }),
  ]);

  // Compute durationMin and omit body from response
  const articles = rawArticles.map(({ body, ...rest }) => ({
    ...rest,
    durationMin: estimateDuration(body),
  }));

  // Fetch viewedSlugs for mothers
  let viewedSlugs: string[] = [];
  if (role === 'mother') {
    const motherProfile = await prisma.motherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (motherProfile) {
      const views = await prisma.contentView.findMany({
        where: { motherProfileId: motherProfile.id },
        select: { contentItem: { select: { slug: true } } },
      });
      viewedSlugs = views.map((v) => v.contentItem.slug);
    }
  }

  return { articles, total, viewedSlugs };
}

// ── getPublishedArticleBySlug ──────────────────────────────────────────────────

export async function getPublishedArticleBySlug(
  slug: string,
  userId: string,
  role: string,
  prisma: PrismaClient
) {
  const article = await prisma.learningArticle.findUnique({
    where: { slug },
  });

  if (!article || article.status !== 'published') {
    throw createError(404, 'ARTICLE_NOT_FOUND', 'Article not found.');
  }

  // View tracking — mothers only
  if (role === 'mother') {
    // Upsert ContentItem for this slug
    await prisma.contentItem.upsert({
      where: { slug },
      update: {},
      create: { slug, category: article.category },
    });

    const motherProfile = await prisma.motherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (motherProfile) {
      const contentItem = await prisma.contentItem.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (contentItem) {
        await prisma.contentView.upsert({
          where: {
            motherProfileId_contentItemId: {
              motherProfileId: motherProfile.id,
              contentItemId: contentItem.id,
            },
          },
          update: { viewedAt: new Date() },
          create: {
            motherProfileId: motherProfile.id,
            contentItemId: contentItem.id,
          },
        });
      }
    }
  }

  return {
    ...article,
    durationMin: estimateDuration(article.body),
  };
}
