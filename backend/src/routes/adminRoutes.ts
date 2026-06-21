import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import {
  getParticipants,
  getParticipantDetail,
  assignStudyGroup,
  getHospitals,
  getHospitalDetail,
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
router.get('/hospitals/:id', getHospitalDetail);
router.patch('/hospitals/:id', patchHospital);
router.get('/export', getExport);

export default router;
