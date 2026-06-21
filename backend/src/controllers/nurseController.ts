import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { getNurseDashboard, getNurseParticipantDetail } from '../services/nurseService.js';

export async function getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getNurseDashboard(req.user);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getParticipantDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Participant id is required.'));
      return;
    }
    const data = await getNurseParticipantDetail(req.user, id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
