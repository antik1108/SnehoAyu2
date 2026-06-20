import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { generateCareInsight } from '../services/insightsService.js';

export async function postGenerateInsight(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const { question } = req.body as { question?: unknown };
    if (question !== undefined && typeof question !== 'string') {
      next(createError(400, 'INVALID_REQUEST', 'question must be a string.'));
      return;
    }
    const result = await generateCareInsight(req.user, question);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
