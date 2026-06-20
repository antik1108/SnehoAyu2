import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getDashboardHome } from '../controllers/dashboardController.js';

const router = Router();

router.get('/home', requireAuth, getDashboardHome);

export default router;
