/**
 * @file services/learningAdminService.ts
 * @description Admin CRUD operations for LearningArticle records.
 * Requirements: 5.2, 5.3, 5.4, 5.6, 5.7, 1.4, 18.2
 */
import { PrismaClient } from '../../generated/prisma/index.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { createError } from '../middlewares/errorHandler.js';

export interface CreateArticleInput {
  title: string;
  body: string;
  category: string;
  tags?: string[];
  status?: string;
  coverImageUrl?: string | null;
  imageUrls?: string[];
  audioUrl?: string | null;
  videoUrl?: string | null;
}

export type UpdateArticleInput = Partial<CreateArticleInput>;

export interface ListArticlesParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}

// ── createArticle ─────────────────────────────────────────────────────────────

export async function createArticle(
  input: CreateArticleInput,
  authorId: string,
  prisma: PrismaClient
) {
  const slug = await generateUniqueSlug(input.title, prisma);
  return prisma.learningArticle.create({
    data: {
      title: input.title,
      slug,
      body: input.body,
      category: input.category,
      tags: input.tags ?? [],
      status: input.status ?? 'draft',
      authorId,
      coverImageUrl: input.coverImageUrl ?? null,
      imageUrls: input.imageUrls ?? [],
      audioUrl: input.audioUrl ?? null,
      videoUrl: input.videoUrl ?? null,
    },
  });
}

// ── updateArticle ─────────────────────────────────────────────────────────────

export async function updateArticle(
  id: string,
  input: UpdateArticleInput,
  prisma: PrismaClient
) {
  const existing = await prisma.learningArticle.findUnique({ where: { id } });
  if (!existing) {
    throw createError(404, 'ARTICLE_NOT_FOUND', 'Article not found.');
  }

  // Determine publishedAt based on status transition
  let publishedAt = existing.publishedAt;
  if (input.status !== undefined) {
    if (input.status === 'published') {
      // Set publishedAt only if it's not already set
      if (publishedAt === null) {
        publishedAt = new Date();
      }
    } else if (input.status === 'draft') {
      // Clear publishedAt when moving to draft
      publishedAt = null;
    }
    // archived: preserve existing publishedAt (no change)
  }

  return prisma.learningArticle.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.body !== undefined && { body: input.body }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.coverImageUrl !== undefined && { coverImageUrl: input.coverImageUrl }),
      ...(input.imageUrls !== undefined && { imageUrls: input.imageUrls }),
      ...(input.audioUrl !== undefined && { audioUrl: input.audioUrl }),
      ...(input.videoUrl !== undefined && { videoUrl: input.videoUrl }),
      publishedAt,
    },
  });
}

// ── deleteArticle ─────────────────────────────────────────────────────────────

export async function deleteArticle(id: string, prisma: PrismaClient) {
  const existing = await prisma.learningArticle.findUnique({ where: { id } });
  if (!existing) {
    throw createError(404, 'ARTICLE_NOT_FOUND', 'Article not found.');
  }
  await prisma.learningArticle.delete({ where: { id } });
}

// ── listArticles ──────────────────────────────────────────────────────────────

export async function listArticles(
  params: ListArticlesParams,
  prisma: PrismaClient
) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params.status) where['status'] = params.status;
  if (params.category) where['category'] = params.category;

  const [articles, total] = await Promise.all([
    prisma.learningArticle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.learningArticle.count({ where }),
  ]);

  return { articles, total, page, limit };
}

// ── getArticleById ────────────────────────────────────────────────────────────

export async function getArticleById(id: string, prisma: PrismaClient) {
  const article = await prisma.learningArticle.findUnique({ where: { id } });
  if (!article) {
    throw createError(404, 'ARTICLE_NOT_FOUND', 'Article not found.');
  }
  return article;
}
