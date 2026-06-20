import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { submitBreastfeedingAssessment, getBreastfeedingHistory } from '../services/breastfeedingService.js';
import type { BreastfeedingResponses } from '../content/breastfeedingAssessment.js';

const VALID_CURRENT = ['exclusive', 'predominant', 'mixed', 'not_breastfeeding'];
const VALID_CUES = ['always', 'sometimes', 'fixed_schedule'];

export async function postBreastfeedingSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const body = req.body as { timePoint?: string; responses?: Partial<BreastfeedingResponses> };
    const { timePoint, responses } = body;

    if (!timePoint || !responses) {
      next(createError(400, 'INVALID_REQUEST', 'timePoint and responses are required.'));
      return;
    }

    if (!responses.currentlyBreastfeeding || !VALID_CURRENT.includes(responses.currentlyBreastfeeding)) {
      next(createError(400, 'INVALID_BREASTFEEDING_RESPONSES', 'currentlyBreastfeeding is invalid.'));
      return;
    }
    if (!responses.feedingOnCues || !VALID_CUES.includes(responses.feedingOnCues)) {
      next(createError(400, 'INVALID_BREASTFEEDING_RESPONSES', 'feedingOnCues is invalid.'));
      return;
    }
    if (typeof responses.frequencyPer24h !== 'number' || typeof responses.sessionDurationMinutes !== 'number' || typeof responses.nightFeedsCount !== 'number') {
      next(createError(400, 'INVALID_BREASTFEEDING_RESPONSES', 'frequencyPer24h, sessionDurationMinutes, and nightFeedsCount must be numbers.'));
      return;
    }
    if (!Array.isArray(responses.feedingProblems)) {
      next(createError(400, 'INVALID_BREASTFEEDING_RESPONSES', 'feedingProblems must be an array.'));
      return;
    }

    const sanitized: BreastfeedingResponses = {
      currentlyBreastfeeding: responses.currentlyBreastfeeding,
      reasonIfNotExclusive: responses.reasonIfNotExclusive,
      frequencyPer24h: responses.frequencyPer24h,
      sessionDurationMinutes: responses.sessionDurationMinutes,
      nightFeedsCount: responses.nightFeedsCount,
      feedingOnCues: responses.feedingOnCues,
      feedingProblems: responses.feedingProblems,
      expressedMilkUsed: Boolean(responses.expressedMilkUsed),
      alternativeFeedingMethodsUsed: Boolean(responses.alternativeFeedingMethodsUsed),
    };

    const result = await submitBreastfeedingAssessment(req.user, timePoint, sanitized);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getBreastfeedingAssessmentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }
    const result = await getBreastfeedingHistory(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
