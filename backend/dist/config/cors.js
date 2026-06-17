/**
 * @file cors.ts
 * @description CORS configuration factory for the SnehoAyu Express server.
 *
 * Reads allowed origin(s) from the environment so the same binary can run
 * safely in development (localhost Vite dev-server), staging, and production
 * without code changes.
 *
 * Environment variables:
 *   CORS_ORIGINS   – Comma-separated list of allowed origins.
 *                    Defaults to `http://localhost:5173` (Vite default).
 *   NODE_ENV       – `production` enables strict origin validation;
 *                    other values also allow `http://localhost:*` origins.
 */
import cors from 'cors';
// ---------------------------------------------------------------------------
// Allowed-origin resolver
// ---------------------------------------------------------------------------
function resolveAllowedOrigins() {
    const raw = process.env['CORS_ORIGINS'] ?? '';
    // Parse comma-separated values from the environment variable
    const envOrigins = raw
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    // Always include the local Vite dev-server in non-production environments
    const defaults = process.env['NODE_ENV'] !== 'production'
        ? [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
        ]
        : [];
    return [...new Set([...defaults, ...envOrigins])];
}
// ---------------------------------------------------------------------------
// CORS options
// ---------------------------------------------------------------------------
const allowedOrigins = resolveAllowedOrigins();
/**
 * Returns a fully configured CORS middleware.
 * - Validates the `Origin` header against the resolved allow-list.
 * - Supports credentials (cookies / Bearer tokens sent cross-origin).
 * - Exposes `X-Request-Id` to allow clients to correlate log entries.
 */
export function buildCorsOptions() {
    return {
        origin: (origin, callback) => {
            // Allow same-origin requests (no Origin header) and server-to-server calls
            if (!origin) {
                callback(null, true);
                return;
            }
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error(`CORS policy: Origin "${origin}" is not in the allowed list.`));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
        exposedHeaders: ['X-Request-Id'],
        maxAge: 86_400, // Preflight cache: 24 hours
    };
}
/**
 * Pre-built CORS middleware ready to attach to Express.
 *
 * @example
 * import { corsMiddleware } from './config/cors.js';
 * app.use(corsMiddleware);
 */
export const corsMiddleware = cors(buildCorsOptions());
