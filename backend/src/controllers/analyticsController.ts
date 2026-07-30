import { Request, Response, NextFunction } from 'express';
import {
  CohortFilter,
  getCohortOverview,
  getEnrollmentTrend as fetchEnrollmentTrend,
  getAssessmentCompletion as fetchAssessmentCompletion,
  getEngagementTrend as fetchEngagementTrend,
  getSiteComparison as fetchSiteComparison,
  getOutcomeScores as fetchOutcomeScores,
} from '../services/analyticsService.js';
import { createError } from '../middlewares/errorHandler.js';

function parseCohortFilter(req: Request): CohortFilter {
  const {
    hospitalId,
    studyGroup,
    birthWeightStratum,
    onboardingStatus,
    enrolledAfter,
    enrolledBefore,
    checkpointWindow,
    engagementTier,
  } = req.query;

  const filter: CohortFilter = {};

  if (typeof hospitalId === 'string' && hospitalId.trim()) {
    filter.hospitalId = hospitalId.trim();
  }

  if (studyGroup === 'study' || studyGroup === 'control') {
    filter.studyGroup = studyGroup;
  }

  if (typeof birthWeightStratum === 'string' && birthWeightStratum.trim()) {
    filter.birthWeightStratum = birthWeightStratum.trim();
  }

  if (onboardingStatus === 'onboarded' || onboardingStatus === 'pending') {
    filter.onboardingStatus = onboardingStatus;
  }

  if (typeof enrolledAfter === 'string' && enrolledAfter.trim()) {
    const d = new Date(enrolledAfter.trim());
    if (!isNaN(d.getTime())) filter.enrolledAfter = d;
  }

  if (typeof enrolledBefore === 'string' && enrolledBefore.trim()) {
    const d = new Date(enrolledBefore.trim());
    if (!isNaN(d.getTime())) filter.enrolledBefore = d;
  }

  if (
    checkpointWindow === 'overdue' ||
    checkpointWindow === 'due_this_week' ||
    checkpointWindow === 'due_this_month' ||
    checkpointWindow === 'due_next_month'
  ) {
    filter.checkpointWindow = checkpointWindow;
  }

  if (
    engagementTier === 'high' ||
    engagementTier === 'medium' ||
    engagementTier === 'low' ||
    engagementTier === 'inactive'
  ) {
    filter.engagementTier = engagementTier;
  }

  if (filter.enrolledAfter && filter.enrolledBefore && filter.enrolledAfter > filter.enrolledBefore) {
    throw createError(400, 'INVALID_DATE_RANGE', 'enrolledAfter cannot be later than enrolledBefore');
  }

  return filter;
}

async function handleAnalyticsRequest(
  req: Request,
  res: Response,
  next: NextFunction,
  serviceCall: (filter: CohortFilter) => Promise<any>
) {
  try {
    const filter = parseCohortFilter(req);
    const data = await serviceCall(filter);
    res.json({ success: true, data });
  } catch (err: any) {
    if (err.statusCode === 400 || err.code === 'INVALID_DATE_RANGE') {
      return next(err);
    }
    // Database or service unavailability fallback to 503
    return next(createError(503, 'SERVICE_UNAVAILABLE', 'Analytics service temporarily unavailable'));
  }
}

export async function getOverview(req: Request, res: Response, next: NextFunction) {
  return handleAnalyticsRequest(req, res, next, getCohortOverview);
}

export async function getEnrollmentTrend(req: Request, res: Response, next: NextFunction) {
  return handleAnalyticsRequest(req, res, next, fetchEnrollmentTrend);
}

export async function getAssessmentCompletion(req: Request, res: Response, next: NextFunction) {
  return handleAnalyticsRequest(req, res, next, fetchAssessmentCompletion);
}

export async function getEngagementTrend(req: Request, res: Response, next: NextFunction) {
  return handleAnalyticsRequest(req, res, next, fetchEngagementTrend);
}

export async function getSiteComparison(req: Request, res: Response, next: NextFunction) {
  return handleAnalyticsRequest(req, res, next, fetchSiteComparison);
}

export async function getOutcomeScores(req: Request, res: Response, next: NextFunction) {
  return handleAnalyticsRequest(req, res, next, fetchOutcomeScores);
}
