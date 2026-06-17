/**
 * @file index.ts
 * @description Primary entry point for the SnehoAyu Express backend server.
 *
 * ## Server architecture (request lifecycle)
 * ```
 *  Incoming Request
 *       │
 *       ▼
 *  ┌─────────────────────────────────────────────┐
 *  │  corsMiddleware                             │  ← CORS pre-flight & origin check
 *  ├─────────────────────────────────────────────┤
 *  │  express.json({ limit: '10kb' })            │  ← JSON body parser with size cap
 *  ├─────────────────────────────────────────────┤
 *  │  express.urlencoded({ extended: true })     │  ← Form body parser
 *  ├─────────────────────────────────────────────┤
 *  │  requestLogger                              │  ← HTTP request/response logger
 *  ├─────────────────────────────────────────────┤
 *  │  Routes                                     │
 *  │    GET  /                → API banner       │
 *  │    GET  /api/health      → DB health check  │
 *  ├─────────────────────────────────────────────┤
 *  │  notFoundHandler                            │  ← 404 fallback
 *  ├─────────────────────────────────────────────┤
 *  │  globalErrorHandler                         │  ← Centralised error handler
 *  └─────────────────────────────────────────────┘
 * ```
 *
 * Environment variables (see `backend/.env`):
 *   PORT         – TCP port the server binds to (default: 4000)
 *   NODE_ENV     – Runtime environment (development | production | test)
 *   DATABASE_URL – PostgreSQL connection string (consumed by Prisma)
 *   CORS_ORIGINS – Comma-separated list of allowed CORS origins
 *   JWT_SECRET   – Secret used to sign/verify JWTs (used in auth routes)
 */

import 'dotenv/config'; // Must be the very first import to populate process.env

import app from './app.js';
import prisma from './lib/prisma.js';

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------

const PORT = parseInt(process.env['PORT'] ?? '4000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

async function startServer(): Promise<void> {
  try {
    // Verify the database is reachable before accepting traffic.
    // This prevents the server from starting up in a broken state that would
    // silently return 500s on every authenticated request.
    await prisma.$connect();
    console.log('[Database] ✓ Connected to PostgreSQL successfully.');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Database] ✗ Failed to connect to PostgreSQL:', message);
    console.warn(
      '[Server]   Starting without confirmed database connection. ' +
        'Health checks will report "unhealthy" until the database is reachable.'
    );
    // We intentionally do NOT exit here. The server can still serve the health
    // endpoint, which allows orchestration tools to detect the DB failure and
    // restart the relevant container rather than losing the server entirely.
  }

  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  SnehoAyu Backend Server                     ║
╠══════════════════════════════════════════════════════════════╣
║  Status      : Running                                       ║
║  Environment : ${NODE_ENV.padEnd(45)}║
║  Port        : ${String(PORT).padEnd(45)}║
║  Base URL    : http://localhost:${String(PORT).padEnd(29)}║
║  Health      : http://localhost:${PORT}/api/health${' '.repeat(Math.max(0, 17 - String(PORT).length))}║
╚══════════════════════════════════════════════════════════════╝
`);
  });
}

// Entry point
void startServer();

// ---------------------------------------------------------------------------
// Unhandled rejection / exception safety nets
// ---------------------------------------------------------------------------

/**
 * Catches Promise rejections that were not handled by any `.catch()` or
 * `try/catch`. These represent programmer errors and should crash the process
 * in production so orchestrators (Docker, PM2, k8s) restart a clean instance.
 */
process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Process] Unhandled Promise rejection:', reason);
  process.exit(1);
});

/**
 * Catches synchronous exceptions that escaped all try/catch blocks.
 * Same crash policy as unhandledRejection.
 */
process.on('uncaughtException', (err: Error) => {
  console.error('[Process] Uncaught exception:', err);
  process.exit(1);
});
