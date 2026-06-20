import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getGrowthHistory, getGrowthLatest, postGrowthLog } from '../controllers/growthController.js';

const router = Router();

router.post('/log', requireAuth, postGrowthLog);
router.get('/history', requireAuth, getGrowthHistory);
router.get('/latest', requireAuth, getGrowthLatest);

export default router;
