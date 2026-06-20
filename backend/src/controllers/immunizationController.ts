import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { getImmunizationScheduleForMother, markVaccineComplete } from '../services/immunizationService.js';

export async function getImmunizationSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const result = await getImmunizationScheduleForMother(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function postMarkVaccineComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const { vaccineId, completedDate, batchNumber, administeredBy } = req.body as {
      vaccineId?: string;
      completedDate?: string;
      batchNumber?: string;
      administeredBy?: string;
    };
    if (!vaccineId) {
      next(createError(400, 'INVALID_REQUEST', 'vaccineId is required.'));
      return;
    }
    const result = await markVaccineComplete(req.user, { vaccineId, completedDate, batchNumber, administeredBy });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
