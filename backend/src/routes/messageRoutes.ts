import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getMessageHistory } from '../controllers/messageController.js';

const router = Router();

router.get('/history', requireAuth, getMessageHistory);

export default router;
