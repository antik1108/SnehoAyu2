import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import {
  getParticipants,
  getParticipantDetail,
  assignStudyGroup,
  getHospitals,
  postHospital,
  patchHospital,
} from '../controllers/adminController.js';
import { getExport } from '../controllers/exportController.js';

const router = Router();

router.use(requireAuth, requireRole('researcher'));

router.get('/participants', getParticipants);
router.get('/participants/:id', getParticipantDetail);
router.post('/participants/:id/study-group', assignStudyGroup);
router.get('/hospitals', getHospitals);
router.post('/hospitals', postHospital);
router.patch('/hospitals/:id', patchHospital);
router.get('/export', getExport);

export default router;
