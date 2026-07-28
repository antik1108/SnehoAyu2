import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import {
  listArticlesHandler,
  getArticleHandler,
} from '../controllers/learningController.js';

const router = Router();

// All public learning routes require authentication
router.use(requireAuth);

router.get('/', listArticlesHandler);
router.get('/:slug', getArticleHandler);

export default router;
