import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getTdscItems, postTdscSubmission, getTdscAssessmentHistory } from '../controllers/tdscController.js';

const router = Router();

router.get('/items', requireAuth, getTdscItems);
router.post('/submit', requireAuth, postTdscSubmission);
router.get('/history', requireAuth, getTdscAssessmentHistory);

export default router;
