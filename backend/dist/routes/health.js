/**
 * @file health.ts
 * @description `GET /api/health` route for the SnehoAyu Express server.
 *
 * Executes a raw `SELECT 1` against the PostgreSQL database through Prisma
 * to verify:
 *   1. The Node server itself is alive and routing correctly.
 *   2. The Prisma connection pool can reach the database.
 *
 * The response body is intentionally minimal so it can be polled cheaply by
 * load-balancers, uptime monitors, and Kubernetes liveness / readiness probes.
 *
 * ## Response shapes
 *
 * ### Healthy  (HTTP 200)
 * ```json
 * {
 *   "success": true,
 *   "status": "healthy",
 *   "database": "connected",
 *   "environment": "development",
 *   "timestamp": "2026-06-16T15:00:00.000Z",
 *   "uptime": 42.3
 * }
 * ```
 *
 * ### Unhealthy  (HTTP 503)
 * ```json
 * {
 *   "success": false,
 *   "status": "unhealthy",
 *   "database": "disconnected",
 *   "error": "Connection refused",
 *   "timestamp": "2026-06-16T15:00:00.000Z",
 *   "uptime": 42.3
 * }
 * ```
 */
import { Router } from 'express';
import prisma from '../lib/prisma.js';
const router = Router();
// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------
router.get('/', async (_req, res) => {
    const timestamp = new Date().toISOString();
    const uptime = Math.round(process.uptime() * 10) / 10; // seconds, 1 decimal
    const environment = process.env['NODE_ENV'] ?? 'development';
    try {
        // Execute a lightweight query to confirm the database connection is alive.
        // `SELECT 1` is the canonical "ping" query and has negligible cost.
        await prisma.$queryRaw `SELECT 1`;
        res.status(200).json({
            success: true,
            status: 'healthy',
            database: 'connected',
            environment,
            timestamp,
            uptime,
        });
    }
    catch (error) {
        // Log the error server-side so on-call engineers can trace it, but send
        // only the message string to avoid leaking internal topology to clients.
        const message = error instanceof Error ? error.message : 'Unknown database error';
        console.error('[HealthCheck] Database connection failed:', message);
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            database: 'disconnected',
            error: message,
            timestamp,
            uptime,
        });
    }
});
export default router;
