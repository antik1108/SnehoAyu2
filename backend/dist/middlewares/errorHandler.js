/**
 * @file errorHandler.ts
 * @description Global error-handling and 404 middlewares for SnehoAyu's
 * Express server.
 *
 * ## Design decisions
 * - All errors are normalised into a consistent JSON envelope so front-end
 *   clients (and the researcher dashboard) can pattern-match on `success` /
 *   `code` without parsing free-form strings.
 * - Prisma-specific error codes are mapped to HTTP status codes, preventing
 *   raw Prisma stack traces from leaking to the client.
 * - Stack traces are **never** sent to the client in production.
 * - All unhandled errors are logged to stderr with the originating request
 *   metadata to aid debugging.
 *
 * ## Error envelope shape
 * ```json
 * {
 *   "success": false,
 *   "code": "VALIDATION_ERROR",
 *   "message": "Human-readable reason",
 *   "details": { ... }           // optional, only in development
 * }
 * ```
 */
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isDev = process.env['NODE_ENV'] !== 'production';
/**
 * Maps Prisma `PrismaClientKnownRequestError` codes to HTTP status codes
 * and human-readable messages without exposing internal query details.
 *
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference
 */
function parsePrismaError(err) {
    // Duck-type check for Prisma errors (avoids importing @prisma/client here)
    const prismaCode = err['code'];
    if (typeof prismaCode !== 'string')
        return null;
    const map = {
        P2000: { status: 400, message: 'Input value is too long for the field.' },
        P2001: { status: 404, message: 'Record not found.' },
        P2002: { status: 409, message: 'A record with that value already exists.' },
        P2003: { status: 400, message: 'Foreign-key constraint violation.' },
        P2004: { status: 400, message: 'A database constraint was violated.' },
        P2025: { status: 404, message: 'Record not found.' },
    };
    const matched = map[prismaCode];
    if (!matched)
        return null;
    return {
        status: matched.status,
        code: `DB_${prismaCode}`,
        message: matched.message,
    };
}
// ---------------------------------------------------------------------------
// 404 handler  (must be placed AFTER all valid routes)
// ---------------------------------------------------------------------------
/**
 * Catches any request that did not match a registered route and returns a
 * consistent 404 JSON response.
 *
 * @example
 * // Place at the very end of route registrations:
 * app.use(notFoundHandler);
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
}
// ---------------------------------------------------------------------------
// Global error handler  (must be the LAST middleware, with 4 parameters)
// ---------------------------------------------------------------------------
/**
 * Centralised Express error-handling middleware.
 *
 * Express identifies error-handling middleware by its 4-parameter signature.
 * Attach this **after** all routes and the `notFoundHandler`.
 *
 * @example
 * app.use(notFoundHandler);
 * app.use(globalErrorHandler);
 */
export const globalErrorHandler = (err, req, res, _next) => {
    // ── 1. Log to stderr with request context ────────────────────────────────
    const reqMeta = {
        method: req.method,
        url: req.originalUrl,
        reqId: req.headers['x-request-id'] ?? undefined,
    };
    console.error('[GlobalErrorHandler]', {
        ...reqMeta,
        name: err.name,
        message: err.message,
        ...(isDev && { stack: err.stack }),
    });
    // ── 2. CORS errors from the CORS middleware surface here ──────────────────
    if (err.message.startsWith('CORS policy:')) {
        res.status(403).json({
            success: false,
            code: 'CORS_BLOCKED',
            message: err.message,
        });
        return;
    }
    // ── 3. Prisma-specific errors ─────────────────────────────────────────────
    const prismaResult = parsePrismaError(err);
    if (prismaResult) {
        res.status(prismaResult.status).json({
            success: false,
            code: prismaResult.code,
            message: prismaResult.message,
            ...(isDev && { stack: err.stack }),
        });
        return;
    }
    // ── 4. Operational / custom AppErrors ────────────────────────────────────
    if (err.isOperational === true) {
        res.status(err.statusCode ?? 400).json({
            success: false,
            code: err.code ?? 'APPLICATION_ERROR',
            message: err.message,
            ...(isDev && { stack: err.stack }),
        });
        return;
    }
    // ── 5. Express body-parser errors (JSON syntax) ───────────────────────────
    if (err.name === 'SyntaxError' && err.statusCode === 400) {
        res.status(400).json({
            success: false,
            code: 'MALFORMED_JSON',
            message: 'Request body contains invalid JSON.',
        });
        return;
    }
    // ── 6. Unknown / programmer errors – hide details in production ───────────
    res.status(err.statusCode ?? 500).json({
        success: false,
        code: err.code ?? 'INTERNAL_SERVER_ERROR',
        message: isDev
            ? err.message
            : 'An unexpected error occurred. Please try again.',
        ...(isDev && { stack: err.stack }),
    });
};
// ---------------------------------------------------------------------------
// Factory helpers for throwing consistent AppErrors from controllers
// ---------------------------------------------------------------------------
/**
 * Creates an operational AppError to be passed to `next(err)` in controllers.
 *
 * @example
 * if (!hospital) {
 *   return next(createError(404, 'NOT_FOUND', 'Hospital not found.'));
 * }
 */
export function createError(statusCode, code, message) {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.code = code;
    err.isOperational = true;
    return err;
}
