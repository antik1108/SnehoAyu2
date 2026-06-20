import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { createTelehealthSession, getActiveTelehealthSessionForMother } from '../services/telehealthService.js';

export async function postTelehealthSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const { motherProfileId, scheduledAt, notes } = req.body as {
      motherProfileId?: string;
      scheduledAt?: string;
      notes?: string;
    };
    if (!motherProfileId) {
      next(createError(400, 'INVALID_REQUEST', 'motherProfileId is required.'));
      return;
    }
    const result = await createTelehealthSession(req.user, motherProfileId, scheduledAt, notes);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTelehealthActiveSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const result = await getActiveTelehealthSessionForMother(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
