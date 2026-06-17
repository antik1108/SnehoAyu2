/**
 * @file routes/authRoutes.ts
 * @description Express router for authentication endpoints.
 *
 * Mounted at `/api/auth` in `src/index.ts`.
 *
 * ## Rate limiting
 * A per-IP limiter (100 req / 15 min) is applied globally to the auth router.
 * A stricter per-IP limiter (10 req / 15 min) is applied only to the login
 * endpoint to slow credential-stuffing attacks.
 *
 * ## Routes
 *  POST /api/auth/register  – Create account with phone + password
 *  POST /api/auth/login     – Authenticate with phone + password
 *  POST /api/auth/create-pin – Create a 4-digit PIN after password auth
 *  POST /api/auth/login-pin  – Authenticate returning user with phone + PIN
 *  POST /api/auth/change-pin – Change PIN after password confirmation
 *  DELETE /api/auth/remove-pin – Remove PIN after password confirmation
 */

import { Router, type Request } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import {
  register,
  login,
  createPin,
  loginPin,
  changePin,
  removePin,
} from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { normalizePhone } from '../utils/phoneNumber.js';

const router = Router();

// ---------------------------------------------------------------------------
// Rate limiters
// ---------------------------------------------------------------------------

/**
 * Broad auth-router limiter: 100 requests per IP per 15 minutes.
 * Protects registration from automated account-creation floods.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message:
      'Too many requests from this IP address. Please try again in 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

/**
 * Strict login limiter: 10 attempts per IP per 15 minutes.
 * Slows credential-stuffing and brute-force attacks on the login endpoint.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message:
      'Too many login attempts from this IP address. Please try again in 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

const pinLoginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message:
      'Too many PIN login attempts from this IP address. Please try again in 15 minutes.',
  },
  keyGenerator: (req: Request): string => ipKeyGenerator(req.ip ?? ''),
  skipSuccessfulRequests: false,
});

const pinLoginPhoneLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message:
      'Too many PIN login attempts for this phone number. Please try again in 15 minutes.',
  },
  keyGenerator: (req: Request): string => {
    const phone = (req.body as Record<string, unknown>)['phone'];

    try {
      return typeof phone === 'string' ? normalizePhone(phone) : ipKeyGenerator(req.ip ?? '');
    } catch {
      return ipKeyGenerator(req.ip ?? '');
    }
  },
  skipSuccessfulRequests: false,
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Apply broad limiter to all auth routes
router.use(authLimiter);

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login  (also gets the strict login limiter)
router.post('/login', loginLimiter, login);

// POST /api/auth/create-pin
router.post('/create-pin', requireAuth, createPin);

// POST /api/auth/login-pin
router.post('/login-pin', pinLoginIpLimiter, pinLoginPhoneLimiter, loginPin);

// POST /api/auth/change-pin
router.post('/change-pin', requireAuth, changePin);

// DELETE /api/auth/remove-pin
router.delete('/remove-pin', requireAuth, removePin);

export default router;
