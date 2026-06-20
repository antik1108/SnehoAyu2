import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { postBreastfeedingSubmission, getBreastfeedingAssessmentHistory } from '../controllers/breastfeedingController.js';

const router = Router();

router.post('/submit', requireAuth, postBreastfeedingSubmission);
router.get('/history', requireAuth, getBreastfeedingAssessmentHistory);

export default router;
