import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { recordContentView, getViewedSlugs } from '../services/contentService.js';

export async function postContentView(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const { slug, category } = req.body as { slug?: string; category?: string };
    if (!slug || !category) {
      next(createError(400, 'INVALID_REQUEST', 'slug and category are required.'));
      return;
    }
    const result = await recordContentView(req.user, slug, category);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getContentViews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const result = await getViewedSlugs(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
