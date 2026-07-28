/**
 * Integration / unit tests for learningService (public endpoints)
 *
 * Requirements: 7.1-7.7, 8.1-8.3, 17.1
 *
 * Tests cover:
 *  - listPublishedArticles: returns only published articles with durationMin, without body
 *  - listPublishedArticles: category filter
 *  - listPublishedArticles: case-insensitive search across title/body/tags
 *  - listPublishedArticles: returns viewedSlugs for mother role; empty for nurse
 *  - getPublishedArticleBySlug: returns full article with body
 *  - getPublishedArticleBySlug: creates ContentView for mother role (idempotent)
 *  - getPublishedArticleBySlug: skips ContentView for nurse role
 *  - getPublishedArticleBySlug: throws 404 for non-existent / unpublished slug
 */

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Prisma mock ───────────────────────────────────────────────────────────────

const prismaMock = vi.hoisted(() => ({
  learningArticle: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  motherProfile: {
    findUnique: vi.fn(),
  },
  contentItem: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
  },
  contentView: {
    upsert: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));
vi.setConfig({ testTimeout: 15_000 });

let listPublishedArticles: typeof import('../src/services/learningService.js').listPublishedArticles;
let getPublishedArticleBySlug: typeof import('../src/services/learningService.js').getPublishedArticleBySlug;

const MOTHER_USER_ID = 'mother-user-id';
const NURSE_USER_ID = 'nurse-user-id';
const MOTHER_PROFILE_ID = 'mother-profile-id';
const CONTENT_ITEM_ID = 'content-item-id';

const PUBLISHED_ARTICLE = {
  id: 'article-id-1',
  slug: 'kangaroo-care',
  title: 'কাঙ্গারু মাদার কেয়ার',
  category: 'kmc',
  tags: ['kmc', 'preterm'],
  body: 'This is the article body with some words for reading time estimation.',
  status: 'published',
  authorId: 'author-id',
  coverImageUrl: 'https://r2.example.com/cover.jpg',
  imageUrls: [],
  audioUrl: null,
  videoUrl: null,
  publishedAt: new Date('2026-07-01'),
  createdAt: new Date('2026-07-01'),
  updatedAt: new Date('2026-07-01'),
};

const DRAFT_ARTICLE = {
  ...PUBLISHED_ARTICLE,
  id: 'article-id-2',
  slug: 'draft-article',
  status: 'draft',
  publishedAt: null,
};

beforeAll(async () => {
  process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/test';
  process.env['JWT_ACCESS_SECRET'] = 'test-secret-long-enough';
  process.env['NODE_ENV'] = 'test';

  ({
    listPublishedArticles,
    getPublishedArticleBySlug,
  } = await import('../src/services/learningService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ── listPublishedArticles ─────────────────────────────────────────────────────

describe('listPublishedArticles', () => {
  it('returns published articles with durationMin and without body', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([PUBLISHED_ARTICLE]);
    prismaMock.learningArticle.count.mockResolvedValue(1);
    prismaMock.motherProfile.findUnique.mockResolvedValue(null);

    const result = await listPublishedArticles({}, NURSE_USER_ID, 'nurse', prismaMock as never);

    expect(result.articles).toHaveLength(1);
    const article = result.articles[0];
    expect('body' in article).toBe(false);
    expect(article?.durationMin).toBeGreaterThanOrEqual(1);
    expect(typeof article?.durationMin).toBe('number');
  });

  it('only fetches articles with status=published', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([]);
    prismaMock.learningArticle.count.mockResolvedValue(0);

    await listPublishedArticles({}, NURSE_USER_ID, 'nurse', prismaMock as never);

    const findManyCall = prismaMock.learningArticle.findMany.mock.calls[0][0];
    expect(findManyCall.where.status).toBe('published');
  });

  it('applies category filter', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([]);
    prismaMock.learningArticle.count.mockResolvedValue(0);

    await listPublishedArticles({ category: 'kmc' }, NURSE_USER_ID, 'nurse', prismaMock as never);

    const findManyCall = prismaMock.learningArticle.findMany.mock.calls[0][0];
    expect(findManyCall.where.category).toBe('kmc');
  });

  it('includes case-insensitive search filter for title, body, tags', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([]);
    prismaMock.learningArticle.count.mockResolvedValue(0);

    await listPublishedArticles({ search: 'preterm' }, NURSE_USER_ID, 'nurse', prismaMock as never);

    const findManyCall = prismaMock.learningArticle.findMany.mock.calls[0][0];
    const orClause = findManyCall.where['OR'] as Array<Record<string, unknown>>;
    expect(Array.isArray(orClause)).toBe(true);
    // title search uses case-insensitive contains
    const titleClause = orClause.find((c) => 'title' in c) as
      | { title: { contains: string; mode: string } }
      | undefined;
    expect(titleClause?.title?.mode).toBe('insensitive');
  });

  it('returns viewedSlugs for mother role', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([PUBLISHED_ARTICLE]);
    prismaMock.learningArticle.count.mockResolvedValue(1);
    prismaMock.motherProfile.findUnique.mockResolvedValue({ id: MOTHER_PROFILE_ID });
    prismaMock.contentView.findMany.mockResolvedValue([
      { contentItem: { slug: 'kangaroo-care' } },
    ]);

    const result = await listPublishedArticles({}, MOTHER_USER_ID, 'mother', prismaMock as never);

    expect(result.viewedSlugs).toContain('kangaroo-care');
  });

  it('returns empty viewedSlugs for nurse role', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([PUBLISHED_ARTICLE]);
    prismaMock.learningArticle.count.mockResolvedValue(1);

    const result = await listPublishedArticles({}, NURSE_USER_ID, 'nurse', prismaMock as never);

    expect(result.viewedSlugs).toEqual([]);
    expect(prismaMock.contentView.findMany).not.toHaveBeenCalled();
  });
});

// ── getPublishedArticleBySlug ─────────────────────────────────────────────────

describe('getPublishedArticleBySlug', () => {
  it('returns full article with body field', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(PUBLISHED_ARTICLE);
    prismaMock.contentItem.upsert.mockResolvedValue({});
    prismaMock.motherProfile.findUnique.mockResolvedValue(null);

    const result = await getPublishedArticleBySlug(
      'kangaroo-care',
      NURSE_USER_ID,
      'nurse',
      prismaMock as never
    );

    expect(result.body).toBe(PUBLISHED_ARTICLE.body);
    expect(result.slug).toBe('kangaroo-care');
    expect(result.durationMin).toBeGreaterThanOrEqual(1);
  });

  it('creates ContentItem and ContentView for mother role', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(PUBLISHED_ARTICLE);
    prismaMock.contentItem.upsert.mockResolvedValue({ id: CONTENT_ITEM_ID });
    prismaMock.motherProfile.findUnique.mockResolvedValue({ id: MOTHER_PROFILE_ID });
    prismaMock.contentItem.findUnique.mockResolvedValue({ id: CONTENT_ITEM_ID });
    prismaMock.contentView.upsert.mockResolvedValue({});

    await getPublishedArticleBySlug(
      'kangaroo-care',
      MOTHER_USER_ID,
      'mother',
      prismaMock as never
    );

    expect(prismaMock.contentItem.upsert).toHaveBeenCalledWith({
      where: { slug: 'kangaroo-care' },
      update: {},
      create: { slug: 'kangaroo-care', category: 'kmc' },
    });
    expect(prismaMock.contentView.upsert).toHaveBeenCalledOnce();
  });

  it('calls contentView.upsert with idempotent where clause (no duplicates)', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(PUBLISHED_ARTICLE);
    prismaMock.contentItem.upsert.mockResolvedValue({ id: CONTENT_ITEM_ID });
    prismaMock.motherProfile.findUnique.mockResolvedValue({ id: MOTHER_PROFILE_ID });
    prismaMock.contentItem.findUnique.mockResolvedValue({ id: CONTENT_ITEM_ID });
    prismaMock.contentView.upsert.mockResolvedValue({});

    // Call twice
    for (let i = 0; i < 2; i++) {
      await getPublishedArticleBySlug(
        'kangaroo-care',
        MOTHER_USER_ID,
        'mother',
        prismaMock as never
      );
    }

    // upsert is called twice but both times use the unique composite key,
    // so the DB would only create one row (idempotent)
    const calls = prismaMock.contentView.upsert.mock.calls;
    expect(calls).toHaveLength(2);
    for (const call of calls) {
      expect(call[0].where).toEqual({
        motherProfileId_contentItemId: {
          motherProfileId: MOTHER_PROFILE_ID,
          contentItemId: CONTENT_ITEM_ID,
        },
      });
    }
  });

  it('skips ContentView creation for nurse role', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(PUBLISHED_ARTICLE);

    await getPublishedArticleBySlug(
      'kangaroo-care',
      NURSE_USER_ID,
      'nurse',
      prismaMock as never
    );

    expect(prismaMock.contentItem.upsert).not.toHaveBeenCalled();
    expect(prismaMock.contentView.upsert).not.toHaveBeenCalled();
  });

  it('throws 404 for non-existent slug', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(null);

    await expect(
      getPublishedArticleBySlug('non-existent', NURSE_USER_ID, 'nurse', prismaMock as never)
    ).rejects.toMatchObject({
      statusCode: 404,
      code: 'ARTICLE_NOT_FOUND',
    });
  });

  it('throws 404 for unpublished (draft) slug', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(DRAFT_ARTICLE);

    await expect(
      getPublishedArticleBySlug('draft-article', NURSE_USER_ID, 'nurse', prismaMock as never)
    ).rejects.toMatchObject({
      statusCode: 404,
      code: 'ARTICLE_NOT_FOUND',
    });
  });
});

// ── durationMin calculation ───────────────────────────────────────────────────

describe('durationMin calculation (via listPublishedArticles)', () => {
  it('calculates durationMin = ceil(wordCount / 200), minimum 1', async () => {
    const shortBody = 'Hello world'; // 2 words → ceil(2/200) = 1
    prismaMock.learningArticle.findMany.mockResolvedValue([
      { ...PUBLISHED_ARTICLE, body: shortBody },
    ]);
    prismaMock.learningArticle.count.mockResolvedValue(1);

    const result = await listPublishedArticles({}, NURSE_USER_ID, 'nurse', prismaMock as never);
    expect(result.articles[0]?.durationMin).toBe(1);
  });

  it('correctly estimates for a 200-word body', async () => {
    // 200 words → ceil(200/200) = 1
    const exactBody = Array(200).fill('word').join(' ');
    prismaMock.learningArticle.findMany.mockResolvedValue([
      { ...PUBLISHED_ARTICLE, body: exactBody },
    ]);
    prismaMock.learningArticle.count.mockResolvedValue(1);

    const result = await listPublishedArticles({}, NURSE_USER_ID, 'nurse', prismaMock as never);
    expect(result.articles[0]?.durationMin).toBe(1);
  });

  it('correctly estimates for a 201-word body', async () => {
    // 201 words → ceil(201/200) = 2
    const body = Array(201).fill('word').join(' ');
    prismaMock.learningArticle.findMany.mockResolvedValue([
      { ...PUBLISHED_ARTICLE, body },
    ]);
    prismaMock.learningArticle.count.mockResolvedValue(1);

    const result = await listPublishedArticles({}, NURSE_USER_ID, 'nurse', prismaMock as never);
    expect(result.articles[0]?.durationMin).toBe(2);
  });
});
