import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { postContentView, getContentViews } from '../controllers/contentController.js';

const router = Router();

router.post('/view', requireAuth, postContentView);
router.get('/views', requireAuth, getContentViews);

export default router;
