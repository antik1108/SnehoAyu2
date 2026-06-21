import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { submitKnowledgeAssessmentForStaff, getPublicKnowledgeQuestions } from '../services/knowledgeAssessmentService.js';
import { submitWho5AssessmentForStaff, getPublicWho5Questions } from '../services/who5AssessmentService.js';
import { submitPsocAssessmentForStaff, getPublicPsocQuestions } from '../services/psocAssessmentService.js';
import { isKnowledgeLanguage } from '../content/knowledgeQuestions.js';
import { getTdscItemsForStaff, submitTdscAssessmentForStaff } from '../services/tdscService.js';
import { createGrowthReadingForStaff } from '../services/growthService.js';
import { getImmunizationScheduleForStaff, markVaccineCompleteForStaff } from '../services/immunizationService.js';
import { submitBreastfeedingAssessmentForStaff } from '../services/breastfeedingService.js';
import { validateKnowledgeSubmitInput } from '../validators/knowledgeAssessmentValidator.js';
import { validateWho5SubmitInput } from '../validators/who5AssessmentValidator.js';
import { validatePsocSubmitInput } from '../validators/psocAssessmentValidator.js';
import { validateCreateGrowthReadingInput } from '../validators/growthValidator.js';
import type { BreastfeedingResponses } from '../content/breastfeedingAssessment.js';

const VALID_BF_CURRENT = ['exclusive', 'predominant', 'mixed', 'not_breastfeeding'];
const VALID_BF_CUES = ['always', 'sometimes', 'fixed_schedule'];

function requireMotherProfileId(req: Request, next: NextFunction): string | null {
  const { motherProfileId } = req.params;
  if (!motherProfileId) {
    next(createError(400, 'INVALID_REQUEST', 'motherProfileId is required.'));
    return null;
  }
  return motherProfileId;
}

function resolveLanguage(req: Request): 'bn' | 'hi' | 'en' {
  const lang = req.query['lang'];
  return isKnowledgeLanguage(lang) ? lang : 'en';
}

// ── Static question content (no participant context needed) ──────────────
export function getKnowledgeContent(req: Request, res: Response): void {
  res.status(200).json({ success: true, data: getPublicKnowledgeQuestions(resolveLanguage(req)) });
}

export function getWho5Content(req: Request, res: Response): void {
  res.status(200).json({ success: true, data: getPublicWho5Questions(resolveLanguage(req)) });
}

export function getPsocContent(req: Request, res: Response): void {
  res.status(200).json({ success: true, data: getPublicPsocQuestions(resolveLanguage(req)) });
}

// ── Knowledge MCQ ────────────────────────────────────────────────────────
export async function postKnowledgeForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;

    const validation = validateKnowledgeSubmitInput(req.body);
    if (!validation.valid || !validation.data) {
      next(createError(400, 'INVALID_ASSESSMENT_RESPONSES', validation.errors.map((e) => e.message).join(' '), validation.errors));
      return;
    }

    const result = await submitKnowledgeAssessmentForStaff(req.user, motherProfileId, validation.data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ── WHO-5 ────────────────────────────────────────────────────────────────
export async function postWho5ForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;

    const validation = validateWho5SubmitInput(req.body);
    if (!validation.valid || !validation.data) {
      next(createError(400, 'INVALID_WHO5_RESPONSES', validation.errors.map((e) => e.message).join(' '), validation.errors));
      return;
    }

    const result = await submitWho5AssessmentForStaff(req.user, motherProfileId, validation.data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ── PSOC ─────────────────────────────────────────────────────────────────
export async function postPsocForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;

    const validation = validatePsocSubmitInput(req.body);
    if (!validation.valid || !validation.data) {
      next(createError(400, 'INVALID_PSOC_RESPONSES', validation.errors.map((e) => e.message).join(' '), validation.errors));
      return;
    }

    const result = await submitPsocAssessmentForStaff(req.user, motherProfileId, validation.data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ── TDSC ─────────────────────────────────────────────────────────────────
export async function getTdscForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;
    const result = await getTdscItemsForStaff(req.user, motherProfileId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function postTdscForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;

    const { timePoint, results } = req.body as { timePoint?: string; results?: Record<string, string> };
    if (!timePoint || typeof results !== 'object' || results === null) {
      next(createError(400, 'INVALID_REQUEST', 'timePoint and results are required.'));
      return;
    }
    const sanitized: Record<string, 'pass' | 'fail'> = {};
    for (const [key, value] of Object.entries(results)) {
      if (value !== 'pass' && value !== 'fail') {
        next(createError(400, 'INVALID_TDSC_RESULTS', `Result for item ${key} must be 'pass' or 'fail'.`));
        return;
      }
      sanitized[key] = value;
    }

    const result = await submitTdscAssessmentForStaff(req.user, motherProfileId, { timePoint, results: sanitized });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ── Growth ───────────────────────────────────────────────────────────────
export async function postGrowthForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;

    const validation = validateCreateGrowthReadingInput(req.body);
    if (!validation.valid || !validation.data) {
      next(createError(400, 'INVALID_GROWTH_READING', validation.errors.map((e) => e.message).join(' '), validation.errors));
      return;
    }

    const result = await createGrowthReadingForStaff(req.user, motherProfileId, validation.data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ── Immunization ─────────────────────────────────────────────────────────
export async function getImmunizationForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;
    const result = await getImmunizationScheduleForStaff(req.user, motherProfileId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function postImmunizationMarkCompleteForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;

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

    const result = await markVaccineCompleteForStaff(req.user, motherProfileId, { vaccineId, completedDate, batchNumber, administeredBy });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ── Breastfeeding ────────────────────────────────────────────────────────
export async function postBreastfeedingForStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const motherProfileId = requireMotherProfileId(req, next);
    if (!motherProfileId) return;

    const body = req.body as { timePoint?: string; responses?: Partial<BreastfeedingResponses> };
    const { timePoint, responses } = body;
    if (!timePoint || !responses) {
      next(createError(400, 'INVALID_REQUEST', 'timePoint and responses are required.'));
      return;
    }
    if (!responses.currentlyBreastfeeding || !VALID_BF_CURRENT.includes(responses.currentlyBreastfeeding)) {
      next(createError(400, 'INVALID_BREASTFEEDING_RESPONSES', 'currentlyBreastfeeding is invalid.'));
      return;
    }
    if (!responses.feedingOnCues || !VALID_BF_CUES.includes(responses.feedingOnCues)) {
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

    const result = await submitBreastfeedingAssessmentForStaff(req.user, motherProfileId, timePoint, sanitized);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
