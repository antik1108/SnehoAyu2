/**
 * @file prisma.ts
 * @description Singleton PrismaClient instance.
 *
 * Ensures a single database connection pool is shared across the
 * entire server lifetime, preventing connection exhaustion in
 * long-running Node processes.
 */
import { PrismaClient } from '../../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config/env.js';
// ---------------------------------------------------------------------------
// Global singleton
// ---------------------------------------------------------------------------
const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
});
/**
 * A single PrismaClient instance reused for every request.
 * Logging is scoped to 'warn' and 'error' in production to reduce noise.
 */
const prisma = new PrismaClient({
    adapter,
    log: process.env['NODE_ENV'] === 'production'
        ? ['warn', 'error']
        : ['query', 'warn', 'error'],
});
// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
/**
 * Disconnect cleanly when the process is terminated (e.g. SIGINT / SIGTERM).
 * This prevents connection-pool leaks in containerised environments.
 */
async function disconnectPrisma() {
    await prisma.$disconnect();
}
process.on('beforeExit', disconnectPrisma);
process.on('SIGINT', () => {
    void disconnectPrisma().then(() => process.exit(0));
});
process.on('SIGTERM', () => {
    void disconnectPrisma().then(() => process.exit(0));
});
export default prisma;
