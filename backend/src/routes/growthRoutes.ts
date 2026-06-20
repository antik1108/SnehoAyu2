import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getGrowthHistory, getGrowthLatest, postGrowthLog, getGrowthChart } from '../controllers/growthController.js';

const router = Router();

router.post('/log', requireAuth, postGrowthLog);
router.get('/history', requireAuth, getGrowthHistory);
router.get('/latest', requireAuth, getGrowthLatest);
router.get('/chart', requireAuth, getGrowthChart);

export default router;
