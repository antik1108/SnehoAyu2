import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { getTdscItemsForMother, submitTdscAssessment, getTdscHistory } from '../services/tdscService.js';

export async function getTdscItems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const result = await getTdscItemsForMother(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function postTdscSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const { timePoint, results } = req.body as { timePoint?: string; results?: Record<string, string> };
    if (!timePoint || typeof results !== 'object' || results === null) {
      next(createError(400, 'INVALID_REQUEST', 'timePoint and results are required.'));
      return;
    }
    const sanitized: Record<string, 'pass' | 'fail'> = {};
    for (const [key, value] of Object.entries(results)) {
      if (value !== 'pass' && value !== 'fail') {
        next(createError(400, 'INVALID_TDSC_RESULTS', `Result for item ${key} must be 'pass' or 'fail'.`));
        return;
      }
      sanitized[key] = value;
    }

    const result = await submitTdscAssessment(req.user, { timePoint, results: sanitized });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTdscAssessmentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const result = await getTdscHistory(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
