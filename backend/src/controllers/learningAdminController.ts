import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { getFileSizeLimit } from '../middlewares/uploadMiddleware.js';
import * as learningAdminService from '../services/learningAdminService.js';
import { validateArticle } from '../validators/learningValidator.js';
import { uploadToR2 } from '../services/r2Service.js';

// ── List articles ─────────────────────────────────────────────────────────────

export async function listArticlesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 20;
    const status = typeof req.query['status'] === 'string' ? req.query['status'] : undefined;
    const category = typeof req.query['category'] === 'string' ? req.query['category'] : undefined;

    const data = await learningAdminService.listArticles({ page, limit, status, category }, prisma);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ── Get article by ID ─────────────────────────────────────────────────────────

export async function getArticleByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Article id is required.'));
      return;
    }
    const data = await learningAdminService.getArticleById(id, prisma);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ── Create article ────────────────────────────────────────────────────────────

export async function createArticleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const errors = validateArticle(body, true);
    if (errors.length > 0) {
      res.status(422).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors,
      });
      return;
    }

    const authorId = req.user!.id;
    const article = await learningAdminService.createArticle(
      {
        title: body['title'] as string,
        body: body['body'] as string,
        category: body['category'] as string,
        tags: Array.isArray(body['tags']) ? (body['tags'] as string[]) : [],
        status: typeof body['status'] === 'string' ? body['status'] : undefined,
        coverImageUrl: typeof body['coverImageUrl'] === 'string' ? body['coverImageUrl'] : null,
        imageUrls: Array.isArray(body['imageUrls']) ? (body['imageUrls'] as string[]) : [],
        audioUrl: typeof body['audioUrl'] === 'string' ? body['audioUrl'] : null,
        videoUrl: typeof body['videoUrl'] === 'string' ? body['videoUrl'] : null,
      },
      authorId,
      prisma
    );

    res.status(201).json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
}

// ── Update article ────────────────────────────────────────────────────────────

export async function updateArticleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Article id is required.'));
      return;
    }

    const body = req.body as Record<string, unknown>;
    const errors = validateArticle(body, false);
    if (errors.length > 0) {
      res.status(422).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors,
      });
      return;
    }

    const input: learningAdminService.UpdateArticleInput = {};
    if (body['title'] !== undefined) input.title = body['title'] as string;
    if (body['body'] !== undefined) input.body = body['body'] as string;
    if (body['category'] !== undefined) input.category = body['category'] as string;
    if (body['tags'] !== undefined) input.tags = body['tags'] as string[];
    if (body['status'] !== undefined) input.status = body['status'] as string;
    if (body['coverImageUrl'] !== undefined) input.coverImageUrl = body['coverImageUrl'] as string | null;
    if (body['imageUrls'] !== undefined) input.imageUrls = body['imageUrls'] as string[];
    if (body['audioUrl'] !== undefined) input.audioUrl = body['audioUrl'] as string | null;
    if (body['videoUrl'] !== undefined) input.videoUrl = body['videoUrl'] as string | null;

    const article = await learningAdminService.updateArticle(id, input, prisma);
    res.status(200).json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
}

// ── Delete article ────────────────────────────────────────────────────────────

export async function deleteArticleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Article id is required.'));
      return;
    }
    await learningAdminService.deleteArticle(id, prisma);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ── Upload media ──────────────────────────────────────────────────────────────

export async function uploadMediaHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      next(createError(400, 'INVALID_REQUEST', 'No file provided. Include a file field in the multipart/form-data request.'));
      return;
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // Per-type size check (multer outer cap is 200 MB; this enforces per-type limits)
    const sizeLimit = getFileSizeLimit(mimetype);
    if (size > sizeLimit) {
      next(
        createError(
          413,
          'FILE_TOO_LARGE',
          `File size ${size} bytes exceeds the ${Math.round(sizeLimit / 1024 / 1024)} MB limit for type ${mimetype}.`
        )
      );
      return;
    }

    const result = await uploadToR2(buffer, originalname, mimetype);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
