import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { getDashboard, getParticipantDetail } from '../controllers/nurseController.js';

const router = Router();

router.use(requireAuth, requireRole('nurse'));

router.get('/dashboard', getDashboard);
router.get('/participants/:id', getParticipantDetail);

export default router;
