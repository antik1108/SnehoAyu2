import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { saveMotherProfile, saveBabyProfile, } from '../controllers/onboardingController.js';
const router = Router();
router.post('/mother-profile', requireAuth, saveMotherProfile);
router.post('/baby-profile', requireAuth, saveBabyProfile);
export default router;
