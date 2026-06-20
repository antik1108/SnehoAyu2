import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getChecklistToday, postChecklistLog, getChecklistHistory } from '../controllers/checklistController.js';

const router = Router();

router.get('/today', requireAuth, getChecklistToday);
router.post('/log', requireAuth, postChecklistLog);
router.get('/history', requireAuth, getChecklistHistory);

export default router;