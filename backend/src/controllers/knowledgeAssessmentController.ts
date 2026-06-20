import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import {
  getKnowledgeQuestionsForMother,
  getKnowledgeStatusForMother,
  getKnowledgeSubmissionForMother,
  submitKnowledgeAssessmentForMother,
} from '../services/knowledgeAssessmentService.js';
import {
  validateKnowledgeLanguage,
  validateKnowledgeSubmitInput,
  validateKnowledgeTimePoint,
} from '../validators/knowledgeAssessmentValidator.js';

export async function getKnowledgeQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const timePointValidation = validateKnowledgeTimePoint(req.query['timePoint']);
    if (!timePointValidation.valid || !timePointValidation.data) {
      next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
      return;
    }

    const language = validateKnowledgeLanguage(req.query['lang'], req.user.preferredLanguage);
    const result = await getKnowledgeQuestionsForMother(req.user, timePointValidation.data, language);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const timePointValidation = validateKnowledgeTimePoint(req.query['timePoint']);
    if (!timePointValidation.valid || !timePointValidation.data) {
      next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
      return;
    }

    const result = await getKnowledgeStatusForMother(req.user, timePointValidation.data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const timePointValidation = validateKnowledgeTimePoint(req.params['timePoint']);
    if (!timePointValidation.valid || !timePointValidation.data) {
      next(createError(400, 'INVALID_TIME_POINT', 'Invalid assessment time point.'));
      return;
    }

    const result = await getKnowledgeSubmissionForMother(req.user, timePointValidation.data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function postKnowledgeSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const validation = validateKnowledgeSubmitInput(req.body);
    if (!validation.valid || !validation.data) {
      const hasTimePointError = validation.errors.some((error) => error.field === 'timePoint');
      next(createError(
        400,
        hasTimePointError ? 'INVALID_TIME_POINT' : 'INVALID_ASSESSMENT_RESPONSES',
        validation.errors.map((error) => error.message).join(' '),
        validation.errors
      ));
      return;
    }

    const result = await submitKnowledgeAssessmentForMother(req.user, validation.data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
