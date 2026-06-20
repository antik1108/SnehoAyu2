import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import {
  getKnowledgeQuestions,
  getKnowledgeStatus,
  getKnowledgeSubmission,
  postKnowledgeSubmission,
} from '../controllers/knowledgeAssessmentController.js';
import {
  getWho5Questions,
  getWho5Status,
  getWho5Submission,
  postWho5Submission,
} from '../controllers/who5AssessmentController.js';
import {
  getPsocQuestions,
  getPsocStatus,
  getPsocSubmission,
  postPsocSubmission,
} from '../controllers/psocAssessmentController.js';

const router = Router();

router.get('/knowledge/questions', requireAuth, getKnowledgeQuestions);
router.get('/knowledge/status', requireAuth, getKnowledgeStatus);
router.post('/knowledge', requireAuth, postKnowledgeSubmission);
router.get('/knowledge/:timePoint', requireAuth, getKnowledgeSubmission);
router.get('/who5/questions', requireAuth, getWho5Questions);
router.get('/who5/status', requireAuth, getWho5Status);
router.post('/who5', requireAuth, postWho5Submission);
router.get('/who5/:timePoint', requireAuth, getWho5Submission);
router.get('/psoc/questions', requireAuth, getPsocQuestions);
router.get('/psoc/status', requireAuth, getPsocStatus);
router.post('/psoc', requireAuth, postPsocSubmission);
router.get('/psoc/:timePoint', requireAuth, getPsocSubmission);

export default router;
