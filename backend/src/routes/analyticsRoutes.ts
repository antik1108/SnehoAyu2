import { Router } from 'express';
import {
  getOverview,
  getEnrollmentTrend,
  getAssessmentCompletion,
  getEngagementTrend,
  getSiteComparison,
  getOutcomeScores,
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/overview', getOverview);
router.get('/enrollment-trend', getEnrollmentTrend);
router.get('/assessment-completion', getAssessmentCompletion);
router.get('/engagement-trend', getEngagementTrend);
router.get('/site-comparison', getSiteComparison);
router.get('/outcome-scores', getOutcomeScores);

export default router;
