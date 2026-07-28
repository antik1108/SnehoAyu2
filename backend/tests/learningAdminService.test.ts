/**
 * Integration / unit tests for learningAdminService
 *
 * Requirements: 5.1-5.7, 17.2, 17.3
 *
 * Tests cover:
 *  - createArticle: sets status=draft, generates slug, stores authorId
 *  - updateArticle with status→published: sets publishedAt
 *  - updateArticle re-publish: preserves existing publishedAt
 *  - updateArticle with status→draft: clears publishedAt
 *  - updateArticle with status→archived: preserves publishedAt
 *  - deleteArticle: hard-deletes article
 *  - deleteArticle: throws 404 if not found
 *  - listArticles: pagination and filter support
 *  - getArticleById: throws 404 if not found
 *  - validateArticle: returns 422 when required fields are missing
 */

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Prisma mock ───────────────────────────────────────────────────────────────

const prismaMock = vi.hoisted(() => ({
  learningArticle: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
}));

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

// ── Slug mock: always return the base slug so tests are deterministic ─────────

vi.mock('../src/utils/slugify.js', () => ({
  generateUniqueSlug: vi.fn(async (title: string) =>
    title.toLowerCase().replace(/\s+/g, '-')
  ),
  generateSlug: vi.fn((title: string) =>
    title.toLowerCase().replace(/\s+/g, '-')
  ),
}));

vi.setConfig({ testTimeout: 15_000 });

// ── Lazy imports ──────────────────────────────────────────────────────────────

let createArticle: typeof import('../src/services/learningAdminService.js').createArticle;
let updateArticle: typeof import('../src/services/learningAdminService.js').updateArticle;
let deleteArticle: typeof import('../src/services/learningAdminService.js').deleteArticle;
let listArticles: typeof import('../src/services/learningAdminService.js').listArticles;
let getArticleById: typeof import('../src/services/learningAdminService.js').getArticleById;
let validateArticle: typeof import('../src/validators/learningValidator.js').validateArticle;

const AUTHOR_ID = 'author-uuid-1111';
const ARTICLE_ID = 'article-uuid-1111';

const BASE_ARTICLE = {
  id: ARTICLE_ID,
  title: 'Test Article',
  slug: 'test-article',
  body: 'Test body content',
  category: 'kmc',
  tags: [],
  status: 'draft',
  authorId: AUTHOR_ID,
  coverImageUrl: null,
  imageUrls: [],
  audioUrl: null,
  videoUrl: null,
  publishedAt: null,
  createdAt: new Date('2026-07-01'),
  updatedAt: new Date('2026-07-01'),
};

beforeAll(async () => {
  process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/test';
  process.env['JWT_ACCESS_SECRET'] = 'test-secret-long-enough';
  process.env['NODE_ENV'] = 'test';

  ({
    createArticle,
    updateArticle,
    deleteArticle,
    listArticles,
    getArticleById,
  } = await import('../src/services/learningAdminService.js'));
  ({ validateArticle } = await import('../src/validators/learningValidator.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ── createArticle ─────────────────────────────────────────────────────────────

describe('createArticle', () => {
  it('creates an article with status=draft, generates slug, and stores authorId', async () => {
    prismaMock.learningArticle.create.mockResolvedValue({
      ...BASE_ARTICLE,
      slug: 'test-article',
    });

    const result = await createArticle(
      { title: 'Test Article', body: 'Test body content', category: 'kmc' },
      AUTHOR_ID,
      prismaMock as never
    );

    expect(prismaMock.learningArticle.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Test Article',
        slug: 'test-article',
        body: 'Test body content',
        category: 'kmc',
        status: 'draft',
        authorId: AUTHOR_ID,
      }),
    });
    expect(result.authorId).toBe(AUTHOR_ID);
    expect(result.status).toBe('draft');
    expect(result.slug).toBe('test-article');
  });

  it('defaults tags to empty array when not provided', async () => {
    prismaMock.learningArticle.create.mockResolvedValue(BASE_ARTICLE);
    await createArticle(
      { title: 'Test', body: 'Body', category: 'feeding' },
      AUTHOR_ID,
      prismaMock as never
    );
    expect(prismaMock.learningArticle.create.mock.calls[0][0].data.tags).toEqual([]);
  });
});

// ── updateArticle — publishedAt transitions ───────────────────────────────────

describe('updateArticle — publishedAt state transitions', () => {
  it('sets publishedAt when transitioning to published and publishedAt is null', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'draft',
      publishedAt: null,
    });
    prismaMock.learningArticle.update.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'published',
      publishedAt: new Date(),
    });

    await updateArticle(ARTICLE_ID, { status: 'published' }, prismaMock as never);

    const updateCall = prismaMock.learningArticle.update.mock.calls[0][0];
    expect(updateCall.data.status).toBe('published');
    expect(updateCall.data.publishedAt).toBeInstanceOf(Date);
  });

  it('preserves existing publishedAt when re-publishing', async () => {
    const originalPublishedAt = new Date('2026-06-01');
    prismaMock.learningArticle.findUnique.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'published',
      publishedAt: originalPublishedAt,
    });
    prismaMock.learningArticle.update.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'published',
      publishedAt: originalPublishedAt,
    });

    await updateArticle(ARTICLE_ID, { status: 'published' }, prismaMock as never);

    const updateCall = prismaMock.learningArticle.update.mock.calls[0][0];
    expect(updateCall.data.publishedAt).toBe(originalPublishedAt);
  });

  it('clears publishedAt when transitioning to draft', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'published',
      publishedAt: new Date('2026-06-01'),
    });
    prismaMock.learningArticle.update.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'draft',
      publishedAt: null,
    });

    await updateArticle(ARTICLE_ID, { status: 'draft' }, prismaMock as never);

    const updateCall = prismaMock.learningArticle.update.mock.calls[0][0];
    expect(updateCall.data.publishedAt).toBeNull();
  });

  it('preserves publishedAt when transitioning to archived', async () => {
    const originalPublishedAt = new Date('2026-06-01');
    prismaMock.learningArticle.findUnique.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'published',
      publishedAt: originalPublishedAt,
    });
    prismaMock.learningArticle.update.mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'archived',
      publishedAt: originalPublishedAt,
    });

    await updateArticle(ARTICLE_ID, { status: 'archived' }, prismaMock as never);

    const updateCall = prismaMock.learningArticle.update.mock.calls[0][0];
    expect(updateCall.data.publishedAt).toBe(originalPublishedAt);
  });

  it('throws 404 when article does not exist', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(null);

    await expect(
      updateArticle(ARTICLE_ID, { status: 'published' }, prismaMock as never)
    ).rejects.toMatchObject({
      statusCode: 404,
      code: 'ARTICLE_NOT_FOUND',
    });
  });
});

// ── deleteArticle ─────────────────────────────────────────────────────────────

describe('deleteArticle', () => {
  it('hard-deletes the article', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(BASE_ARTICLE);
    prismaMock.learningArticle.delete.mockResolvedValue(BASE_ARTICLE);

    await deleteArticle(ARTICLE_ID, prismaMock as never);

    expect(prismaMock.learningArticle.delete).toHaveBeenCalledWith({
      where: { id: ARTICLE_ID },
    });
  });

  it('throws 404 when article does not exist', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(null);

    await expect(deleteArticle(ARTICLE_ID, prismaMock as never)).rejects.toMatchObject({
      statusCode: 404,
      code: 'ARTICLE_NOT_FOUND',
    });

    expect(prismaMock.learningArticle.delete).not.toHaveBeenCalled();
  });
});

// ── listArticles ──────────────────────────────────────────────────────────────

describe('listArticles', () => {
  it('returns paginated results with total count', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([BASE_ARTICLE]);
    prismaMock.learningArticle.count.mockResolvedValue(1);

    const result = await listArticles({}, prismaMock as never);

    expect(result.total).toBe(1);
    expect(result.articles).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('passes status filter to Prisma', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([]);
    prismaMock.learningArticle.count.mockResolvedValue(0);

    await listArticles({ status: 'draft' }, prismaMock as never);

    const findManyCall = prismaMock.learningArticle.findMany.mock.calls[0][0];
    expect(findManyCall.where.status).toBe('draft');
  });

  it('passes category filter to Prisma', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([]);
    prismaMock.learningArticle.count.mockResolvedValue(0);

    await listArticles({ category: 'kmc' }, prismaMock as never);

    const findManyCall = prismaMock.learningArticle.findMany.mock.calls[0][0];
    expect(findManyCall.where.category).toBe('kmc');
  });

  it('respects page and limit parameters', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([]);
    prismaMock.learningArticle.count.mockResolvedValue(50);

    const result = await listArticles({ page: 2, limit: 10 }, prismaMock as never);

    const findManyCall = prismaMock.learningArticle.findMany.mock.calls[0][0];
    expect(findManyCall.skip).toBe(10);
    expect(findManyCall.take).toBe(10);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
  });

  it('caps limit at 100', async () => {
    prismaMock.learningArticle.findMany.mockResolvedValue([]);
    prismaMock.learningArticle.count.mockResolvedValue(0);

    const result = await listArticles({ limit: 999 }, prismaMock as never);

    expect(result.limit).toBe(100);
    const findManyCall = prismaMock.learningArticle.findMany.mock.calls[0][0];
    expect(findManyCall.take).toBe(100);
  });
});

// ── getArticleById ────────────────────────────────────────────────────────────

describe('getArticleById', () => {
  it('returns article when found', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(BASE_ARTICLE);

    const result = await getArticleById(ARTICLE_ID, prismaMock as never);

    expect(result.id).toBe(ARTICLE_ID);
  });

  it('throws 404 when article does not exist', async () => {
    prismaMock.learningArticle.findUnique.mockResolvedValue(null);

    await expect(getArticleById(ARTICLE_ID, prismaMock as never)).rejects.toMatchObject({
      statusCode: 404,
      code: 'ARTICLE_NOT_FOUND',
    });
  });
});

// ── validateArticle — 422 cases ───────────────────────────────────────────────

describe('validateArticle', () => {
  it('returns errors when title is missing', () => {
    const errors = validateArticle({ body: 'body', category: 'kmc' }, true);
    expect(errors.some((e) => e.field === 'title')).toBe(true);
  });

  it('returns errors when body is missing', () => {
    const errors = validateArticle({ title: 'Title', category: 'kmc' }, true);
    expect(errors.some((e) => e.field === 'body')).toBe(true);
  });

  it('returns errors when category is missing', () => {
    const errors = validateArticle({ title: 'Title', body: 'body' }, true);
    expect(errors.some((e) => e.field === 'category')).toBe(true);
  });

  it('returns errors when category is invalid', () => {
    const errors = validateArticle({ title: 'Title', body: 'body', category: 'invalid' }, true);
    expect(errors.some((e) => e.field === 'category')).toBe(true);
  });

  it('returns no errors for a valid article', () => {
    const errors = validateArticle({ title: 'Title', body: 'body', category: 'kmc' }, true);
    expect(errors).toHaveLength(0);
  });

  it('returns errors for coverImageUrl not starting with https://', () => {
    const errors = validateArticle(
      { title: 'T', body: 'B', category: 'kmc', coverImageUrl: 'http://example.com/img.jpg' },
      true
    );
    expect(errors.some((e) => e.field === 'coverImageUrl')).toBe(true);
  });
});
