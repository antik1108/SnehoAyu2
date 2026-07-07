import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { evaluateDangerSigns, validateDangerSignInput, SYMPTOM_CODES } from '../services/dangerSignService.js';

/**
 * POST /api/danger-signs/check
 * Body: SymptomInput[]  — array of { code: SymptomCode }
 * Returns the severity classification and mother-facing message.
 * Requires mother role (enforced by requireAuth + requireRole in the router).
 */
export async function postDangerSignCheck(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required.'));
      return;
    }

    const validation = validateDangerSignInput(req.body);
    if (!validation.valid || !validation.data) {
      next(createError(400, 'INVALID_REQUEST', validation.errors.join(' ')));
      return;
    }

    const result = evaluateDangerSigns(validation.data);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/danger-signs/symptoms
 * Returns the full catalogue of recognisable symptom codes.
 * Useful for the frontend to validate locally before submitting.
 */
export function getDangerSignSymptoms(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    res.status(200).json({ success: true, data: { symptoms: SYMPTOM_CODES } });
  } catch (error) {
    next(error);
  }
}
