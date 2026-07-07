import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { postDangerSignCheck, getDangerSignSymptoms } from '../controllers/dangerSignController.js';

const router = Router();

// Symptom catalogue — public within auth (any authenticated user can read)
router.get('/symptoms', requireAuth, getDangerSignSymptoms);

// Danger sign evaluation — mothers only
router.post('/check', requireAuth, requireRole('mother'), postDangerSignCheck);

export default router;
