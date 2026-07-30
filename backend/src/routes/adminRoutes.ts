import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import {
  getParticipants,
  getParticipantDetail,
  getParticipantGrowth,
  assignStudyGroup,
  getHospitals,
  getHospitalDetail,
  postHospital,
  patchHospital,
} from '../controllers/adminController.js';
import { getExport, getParticipantExport, postCohortExport } from '../controllers/exportController.js';
import analyticsRouter from './analyticsRoutes.js';

const router = Router();

router.use(requireAuth, requireRole('researcher'));

router.use('/analytics', analyticsRouter);

router.get('/participants', getParticipants);
router.get('/participants/:id/growth', getParticipantGrowth);
router.get('/participants/:id/export', getParticipantExport);
router.get('/participants/:id', getParticipantDetail);
router.post('/participants/:id/study-group', assignStudyGroup);
router.get('/hospitals', getHospitals);
router.post('/hospitals', postHospital);
router.get('/hospitals/:id', getHospitalDetail);
router.patch('/hospitals/:id', patchHospital);
router.get('/export', getExport);
router.post('/export/cohort', postCohortExport);

export default router;
