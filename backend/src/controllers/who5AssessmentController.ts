import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { validateKnowledgeLanguage, validateKnowledgeTimePoint } from '../validators/knowledgeAssessmentValidator.js';
import { validateWho5SubmitInput } from '../validators/who5AssessmentValidator.js';
import {
  getWho5QuestionsForMother,
  getWho5StatusForMother,
  getWho5SubmissionForMother,
  submitWho5AssessmentForMother,
} from '../services/who5AssessmentService.js';

export async function getWho5Questions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const timePoint = validateKnowledgeTimePoint(req.query['timePoint']);
    if (!timePoint.valid || !timePoint.data) return next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
    const language = validateKnowledgeLanguage(req.query['lang'], req.user.preferredLanguage);
    res.status(200).json(await getWho5QuestionsForMother(req.user, timePoint.data, language));
  } catch (error) {
    next(error);
  }
}

export async function getWho5Status(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const timePoint = validateKnowledgeTimePoint(req.query['timePoint']);
    if (!timePoint.valid || !timePoint.data) return next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
    res.status(200).json(await getWho5StatusForMother(req.user, timePoint.data));
  } catch (error) {
    next(error);
  }
}

export async function getWho5Submission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const timePoint = validateKnowledgeTimePoint(req.params['timePoint']);
    if (!timePoint.valid || !timePoint.data) return next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
    res.status(200).json(await getWho5SubmissionForMother(req.user, timePoint.data));
  } catch (error) {
    next(error);
  }
}

export async function postWho5Submission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
    const validation = validateWho5SubmitInput(req.body);
    if (!validation.valid || !validation.data) {
      const hasTimePointError = validation.errors.some((error) => error.field === 'timePoint');
      return next(createError(
        400,
        hasTimePointError ? 'INVALID_TIME_POINT' : 'INVALID_WHO5_RESPONSES',
        validation.errors.map((error) => error.message).join(' '),
        validation.errors
      ));
    }
    res.status(201).json(await submitWho5AssessmentForMother(req.user, validation.data));
  } catch (error) {
    next(error);
  }
}
