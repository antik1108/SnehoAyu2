import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import {
  saveMotherProfile,
  saveBabyProfile,
  linkHospital,
  getOrCreateParticipantCode,
  completeOnboarding,
} from '../controllers/onboardingController.js';

const router = Router();

router.post('/mother-profile', requireAuth, saveMotherProfile);
router.post('/baby-profile', requireAuth, saveBabyProfile);
router.post('/hospital-code', requireAuth, linkHospital);
router.get('/participant-code', requireAuth, getOrCreateParticipantCode);
router.post('/complete', requireAuth, completeOnboarding);

export default router;
