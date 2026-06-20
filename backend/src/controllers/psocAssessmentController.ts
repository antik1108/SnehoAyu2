import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { validateKnowledgeLanguage, validateKnowledgeTimePoint } from '../validators/knowledgeAssessmentValidator.js';
import { validatePsocSubmitInput } from '../validators/psocAssessmentValidator.js';
import {
  getPsocQuestionsForMother,
  getPsocStatusForMother,
  getPsocSubmissionForMother,
  submitPsocAssessmentForMother,
} from '../services/psocAssessmentService.js';

export async function getPsocQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const timePoint = validateKnowledgeTimePoint(req.query['timePoint']);
    if (!timePoint.valid || !timePoint.data) return next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
    const language = validateKnowledgeLanguage(req.query['lang'], req.user.preferredLanguage);
    res.status(200).json(await getPsocQuestionsForMother(req.user, timePoint.data, language));
  } catch (error) {
    next(error);
  }
}

export async function getPsocStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const timePoint = validateKnowledgeTimePoint(req.query['timePoint']);
    if (!timePoint.valid || !timePoint.data) return next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
    res.status(200).json(await getPsocStatusForMother(req.user, timePoint.data));
  } catch (error) {
    next(error);
  }
}

export async function getPsocSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const timePoint = validateKnowledgeTimePoint(req.params['timePoint']);
    if (!timePoint.valid || !timePoint.data) return next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
    res.status(200).json(await getPsocSubmissionForMother(req.user, timePoint.data));
  } catch (error) {
    next(error);
  }
}

export async function postPsocSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const validation = validatePsocSubmitInput(req.body);
    if (!validation.valid || !validation.data) {
      const hasTimePointError = validation.errors.some((error) => error.field === 'timePoint');
      return next(createError(
        400,
        hasTimePointError ? 'INVALID_TIME_POINT' : 'INVALID_PSOC_RESPONSES',
        validation.errors.map((error) => error.message).join(' '),
        validation.errors
      ));
    }
    res.status(201).json(await submitPsocAssessmentForMother(req.user, validation.data));
  } catch (error) {
    next(error);
  }
}
