import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { getDashboardHomeForMother } from '../services/dashboardService.js';

export async function getDashboardHome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const data = await getDashboardHomeForMother(req.user);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
