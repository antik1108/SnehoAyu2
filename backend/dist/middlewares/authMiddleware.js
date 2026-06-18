/**
 * @file middlewares/authMiddleware.ts
 * @description JWT access-token verification middleware.
 *
 * Usage:
 * ```ts
 * import { requireAuth } from '../middlewares/authMiddleware.js';
 * router.get('/protected', requireAuth, handler);
 * ```
 *
 * ## Behaviour
 *  1. Reads `Authorization: Bearer <token>` header.
 *  2. Verifies the JWT signature using `JWT_ACCESS_SECRET`.
 *  3. Checks that `tokenType === "access"` (rejects refresh tokens).
 *  4. Loads the active user from the database.
 *  5. Attaches `req.user` for use in downstream handlers.
 *  6. Passes generic 401 errors to `next()` — never leaks JWT internals.
 *
 * ## TypeScript typing
 * Express's `Request` interface is extended via declaration merging in
 * `src/types/express.d.ts` so `req.user` is strongly typed.
 */
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { verifyAccessToken } from '../utils/token.js';
import { createError } from './errorHandler.js';
// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
const AUTH_ERROR_MESSAGE = 'Authentication required. Please log in.';
/**
 * Middleware that enforces a valid access token on protected routes.
 *
 * On success: attaches `req.user` and calls `next()`.
 * On failure: calls `next(error)` with a 401 AppError — no internals exposed.
 */
export async function requireAuth(req, _res, next) {
    try {
        // 1. Extract Bearer token
        const authHeader = req.headers['authorization'];
        if (!authHeader || !/^Bearer [^\s]+$/.test(authHeader)) {
            next(createError(401, 'AUTH_TOKEN_REQUIRED', AUTH_ERROR_MESSAGE));
            return;
        }
        const token = authHeader.slice(7);
        // 2. Verify signature, expiry, and tokenType
        // verifyAccessToken throws JsonWebTokenError or TokenExpiredError on failure.
        let payload;
        try {
            payload = verifyAccessToken(token);
        }
        catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                next(createError(401, 'AUTH_TOKEN_EXPIRED', 'Your session has expired. Please log in again.'));
            }
            else {
                // Do NOT forward the raw JWT error — it may contain internal details.
                next(createError(401, 'AUTH_TOKEN_INVALID', AUTH_ERROR_MESSAGE));
            }
            return;
        }
        // 3. Load the user to verify they still exist and are active
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                phone: true,
                role: true,
                preferredLanguage: true,
                isActive: true,
                deletedAt: true,
                hospitalId: true,
            },
        });
        if (!user || !user.isActive || user.deletedAt !== null) {
            next(createError(401, 'AUTH_TOKEN_INVALID', AUTH_ERROR_MESSAGE));
            return;
        }
        // 4. Attach to request for downstream handlers
        req.user = {
            id: user.id,
            phone: user.phone,
            role: user.role,
            preferredLanguage: user.preferredLanguage,
            isActive: user.isActive,
            hospitalId: user.hospitalId,
        };
        next();
    }
    catch (err) {
        // Catch any unexpected errors (e.g. DB timeout) and forward generically.
        next(err);
    }
}
/**
 * Convenience middleware that reads the token if present but does NOT reject
 * unauthenticated requests. Useful for routes that behave differently for
 * logged-in vs anonymous users.
 */
export async function optionalAuth(req, _res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !/^Bearer [^\s]+$/.test(authHeader)) {
        next();
        return;
    }
    try {
        const token = authHeader.slice(7);
        const payload = verifyAccessToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                phone: true,
                role: true,
                preferredLanguage: true,
                isActive: true,
                deletedAt: true,
            },
        });
        if (user && user.isActive && user.deletedAt === null) {
            req.user = {
                id: user.id,
                phone: user.phone,
                role: user.role,
                preferredLanguage: user.preferredLanguage,
                isActive: user.isActive,
            };
        }
    }
    catch {
        // Silently ignore invalid tokens in optional mode.
    }
    next();
}
