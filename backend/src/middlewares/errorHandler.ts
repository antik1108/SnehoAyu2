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

import {
  type Request,
  type Response,
  type NextFunction,
  type ErrorRequestHandler,
} from 'express';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Extended Error that middleware can populate to customise HTTP behaviour. */
export interface AppError extends Error {
  /** HTTP status code to return to the client (default: 500). */
  statusCode?: number;
  /** Short, machine-readable error code for client-side handling. */
  code?: string;
  /** Whether this error is "expected" (operational) vs a programmer bug. */
  isOperational?: boolean;
  /** Extra validation details if any */
  details?: unknown;
}

/** JSON shape of every error response this server emits. */
interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  /** Optional structured validation details */
  details?: unknown;
  /** Only included when NODE_ENV !== 'production' */
  stack?: string;
}

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
function parsePrismaError(err: AppError): { status: number; code: string; message: string } | null {
  // Duck-type check for Prisma errors (avoids importing @prisma/client here).
  // Prisma's own codes are always "P" + 4 digits (e.g. P2002, P2025) — this
  // MUST be specific, not just "is err.code a string", because every
  // operational AppError from createError() also has a string `.code`
  // (e.g. 'PARTICIPANT_NOT_FOUND'). A loose check here would swallow every
  // operational error into this branch's generic 500 fallback, before it
  // ever reaches the `isOperational` handler below.
  const prismaCode: unknown = (err as unknown as Record<string, unknown>)['code'];
  if (typeof prismaCode !== 'string' || !/^P\d{4}$/.test(prismaCode)) return null;

  const map: Record<string, { status: number; message: string }> = {
    P2000: { status: 400, message: 'Input value is too long for the field.' },
    P2001: { status: 404, message: 'Record not found.' },
    P2002: { status: 409, message: 'A record with that value already exists.' },
    P2003: { status: 400, message: 'Foreign-key constraint violation.' },
    P2004: { status: 400, message: 'A database constraint was violated.' },
    P2021: { status: 503, message: 'The service is temporarily unavailable. Please try again shortly.' },
    P2022: { status: 503, message: 'The service is temporarily unavailable. Please try again shortly.' },
    P2025: { status: 404, message: 'Record not found.' },
  };

  // Any unmapped Prisma error code still gets a safe, generic message —
  // never the raw Prisma message, which includes file paths and SQL context.
  const matched = map[prismaCode] ?? {
    status: 500,
    message: 'Something went wrong on our end. Please try again in a moment.',
  };

  if (isDev && (prismaCode === 'P2021' || prismaCode === 'P2022')) {
    console.error(
      `[Database] Schema drift detected (${prismaCode}). Your local database is likely missing recent migrations.\n` +
        '  Run: cd backend && npx prisma migrate deploy   (or `npx prisma migrate dev` in development)'
    );
  }

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
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  } satisfies ErrorResponse);
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
export const globalErrorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
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
    } satisfies ErrorResponse);
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
    } satisfies ErrorResponse);
    return;
  }

  // ── 4. Operational / custom AppErrors ────────────────────────────────────
  if (err.isOperational === true) {
    res.status(err.statusCode ?? 400).json({
      success: false,
      code: err.code ?? 'INVALID_REQUEST',
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
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
    } satisfies ErrorResponse);
    return;
  }

  // ── 6. Unknown / programmer errors ─────────────────────────────────────────
  // Never send the raw err.message to the client — it can contain internal
  // file paths, SQL, or other implementation details. The full message and
  // stack are already logged above for developers. The `stack` field below
  // (dev-only) is for local debugging in API clients like Postman/curl.
  res.status(err.statusCode ?? 500).json({
    success: false,
    code: err.code ?? 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong on our end. Please try again in a moment.',
    ...(isDev && { stack: err.stack }),
  } satisfies ErrorResponse);
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
export function createError(
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.code = code;
  err.isOperational = true;
  if (details !== undefined) {
    err.details = details;
  }
  return err;
}
