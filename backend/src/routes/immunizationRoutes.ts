import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getImmunizationSchedule, postMarkVaccineComplete } from '../controllers/immunizationController.js';

const router = Router();

router.get('/schedule', requireAuth, getImmunizationSchedule);
router.post('/mark-complete', requireAuth, postMarkVaccineComplete);

export default router;
