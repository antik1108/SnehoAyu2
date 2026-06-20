import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { postGenerateInsight } from '../controllers/insightsController.js';

const router = Router();

/**
 * AI insight generation calls a paid external API — limit per-user request
 * rate to prevent runaway cost from a buggy client retry loop or abuse.
 */
const insightsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many AI insight requests. Please try again in a few minutes.',
  },
});

router.post('/generate', requireAuth, insightsLimiter, postGenerateInsight);

export default router;
