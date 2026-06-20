import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import {
  getTodayChecklistForMother,
  logTodayChecklistForMother,
  getChecklistHistoryForMother,
} from '../services/checklistService.js';
import {
  validateChecklistLogInput,
  validateChecklistHistoryDays,
} from '../validators/checklistValidator.js';

export async function getChecklistToday(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const result = await getTodayChecklistForMother(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function postChecklistLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const validation = validateChecklistLogInput(req.body);
    if (!validation.valid || !validation.data) {
      next(createError(400, 'INVALID_REQUEST', validation.errors.map((error) => error.message).join(' '), validation.errors));
      return;
    }

    const result = await logTodayChecklistForMother(req.user, validation.data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getChecklistHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const validation = validateChecklistHistoryDays(req.query['days']);
    if (!validation.valid || validation.data === undefined) {
      next(createError(400, 'INVALID_REQUEST', validation.errors.map((error) => error.message).join(' '), validation.errors));
      return;
    }

    const result = await getChecklistHistoryForMother(req.user, validation.data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}