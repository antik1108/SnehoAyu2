import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { getMessageHistoryForMother } from '../services/messageService.js';

export async function getMessageHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const result = await getMessageHistoryForMother(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
