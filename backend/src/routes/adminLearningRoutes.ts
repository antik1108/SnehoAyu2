import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import {
  listArticlesHandler,
  getArticleByIdHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
  uploadMediaHandler,
} from '../controllers/learningAdminController.js';

const router = Router();

// All routes require authentication and researcher role
router.use(requireAuth, requireRole('researcher'));

// Upload endpoint — multer runs first, then the controller
router.post('/upload', upload.single('file'), uploadMediaHandler);

// CRUD endpoints
router.get('/', listArticlesHandler);
router.get('/:id', getArticleByIdHandler);
router.post('/', createArticleHandler);
router.put('/:id', updateArticleHandler);
router.delete('/:id', deleteArticleHandler);

export default router;
