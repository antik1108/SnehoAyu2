import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import {
  postKnowledgeForStaff,
  postWho5ForStaff,
  postPsocForStaff,
  getTdscForStaff,
  postTdscForStaff,
  postGrowthForStaff,
  getImmunizationForStaff,
  postImmunizationMarkCompleteForStaff,
  postBreastfeedingForStaff,
  getKnowledgeContent,
  getWho5Content,
  getPsocContent,
} from '../controllers/staffController.js';

/**
 * Shared by nurses and researchers entering data on a participant's behalf
 * at a follow-up visit (PRD §8.3) — e.g. a nurse takes growth measurements
 * and administers TDSC, or interviews the mother for the Knowledge MCQ /
 * WHO-5 / PSOC. Every handler resolves and authorizes the target
 * participant via `resolveStaffMotherContext` (nurse: own hospital only;
 * researcher: any), not via the caller's own profile.
 */
const router = Router();

router.use(requireAuth, requireRole('nurse', 'researcher'));

router.get('/content/knowledge', getKnowledgeContent);
router.get('/content/who5', getWho5Content);
router.get('/content/psoc', getPsocContent);

router.post('/participants/:motherProfileId/knowledge', postKnowledgeForStaff);
router.post('/participants/:motherProfileId/who5', postWho5ForStaff);
router.post('/participants/:motherProfileId/psoc', postPsocForStaff);
router.get('/participants/:motherProfileId/tdsc', getTdscForStaff);
router.post('/participants/:motherProfileId/tdsc', postTdscForStaff);
router.post('/participants/:motherProfileId/growth', postGrowthForStaff);
router.get('/participants/:motherProfileId/immunization', getImmunizationForStaff);
router.post('/participants/:motherProfileId/immunization/mark-complete', postImmunizationMarkCompleteForStaff);
router.post('/participants/:motherProfileId/breastfeeding', postBreastfeedingForStaff);

export default router;
