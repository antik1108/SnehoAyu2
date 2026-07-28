import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import * as learningService from '../services/learningService.js';

// ── List published articles ───────────────────────────────────────────────────

export async function listArticlesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = typeof req.query['category'] === 'string' ? req.query['category'] : undefined;
    const search = typeof req.query['search'] === 'string' ? req.query['search'] : undefined;
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 20;

    const userId = req.user!.id;
    const role = req.user!.role;

    const data = await learningService.listPublishedArticles(
      { category, search, page, limit },
      userId,
      role,
      prisma
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ── Get published article by slug ─────────────────────────────────────────────

export async function getArticleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const data = await learningService.getPublishedArticleBySlug(slug, userId, role, prisma);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
