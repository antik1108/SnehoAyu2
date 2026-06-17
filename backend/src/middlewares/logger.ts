/**
 * @file logger.ts
 * @description HTTP request logging middleware for the SnehoAyu Express server.
 *
 * Behaviour:
 *  - Development: Human-readable coloured output including method, URL, status,
 *    response time, and content-length.
 *  - Production: Compact JSON-lines format suitable for log aggregators
 *    (e.g. Cloud Logging, Datadog, Loki).
 *
 * No third-party logging library is required; keeping the dependency surface
 * small is intentional for a healthcare PWA that must build on restricted
 * hospital networks.
 */

import { type Request, type Response, type NextFunction } from 'express';

// ---------------------------------------------------------------------------
// ANSI colour helpers (development only)
// ---------------------------------------------------------------------------

const colour = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
} as const;

function statusColour(status: number): string {
  if (status >= 500) return colour.red;
  if (status >= 400) return colour.yellow;
  if (status >= 300) return colour.cyan;
  return colour.green;
}

// ---------------------------------------------------------------------------
// Log helpers
// ---------------------------------------------------------------------------

function formatDev(
  method: string,
  url: string,
  status: number,
  durationMs: number,
  contentLength: string | undefined
): string {
  const sc = statusColour(status);
  const length = contentLength ? ` ${colour.dim}${contentLength}b${colour.reset}` : '';
  return (
    `${colour.dim}[${new Date().toISOString()}]${colour.reset} ` +
    `${colour.magenta}${method.padEnd(7)}${colour.reset} ` +
    `${colour.white}${url}${colour.reset} ` +
    `${sc}${status}${colour.reset} ` +
    `${colour.cyan}${durationMs.toFixed(1)}ms${colour.reset}` +
    length
  );
}

function logProd(
  method: string,
  url: string,
  status: number,
  durationMs: number,
  contentLength: string | undefined,
  reqId: string | undefined
): void {
  const entry: Record<string, unknown> = {
    ts: new Date().toISOString(),
    method,
    url,
    status,
    durationMs: Math.round(durationMs),
  };
  if (contentLength) entry['contentLength'] = Number(contentLength);
  if (reqId) entry['reqId'] = reqId;
  console.log(JSON.stringify(entry));
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

const isDev = process.env['NODE_ENV'] !== 'production';

/**
 * Express request-logging middleware.
 *
 * Attach **before** route definitions so every matched and unmatched request
 * is logged.  Response duration is measured using `process.hrtime.bigint()`
 * for sub-millisecond precision.
 *
 * @example
 * import { requestLogger } from './middlewares/logger.js';
 * app.use(requestLogger);
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = process.hrtime.bigint();

  // Capture the finish event once the response has been fully sent
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const contentLength = res.getHeader('content-length') as string | undefined;
    const reqId = req.headers['x-request-id'] as string | undefined;

    if (isDev) {
      console.log(formatDev(method, originalUrl, statusCode, durationMs, contentLength));
    } else {
      logProd(method, originalUrl, statusCode, durationMs, contentLength, reqId);
    }
  });

  next();
}
