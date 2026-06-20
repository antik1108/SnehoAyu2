import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { postTelehealthSession, getTelehealthActiveSession } from '../controllers/telehealthController.js';

const router = Router();

router.get('/active', requireAuth, getTelehealthActiveSession);
router.post('/session', requireAuth, requireRole('researcher'), postTelehealthSession);

export default router;
