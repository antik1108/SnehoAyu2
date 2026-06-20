import prisma from '../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/index.js';

export interface AuditEvent {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Writes an append-only audit record. Never throws — a failed audit write
 * must not block the primary research/care operation it is describing.
 */
export async function recordAudit(event: AuditEvent): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: event.actorId ?? null,
        actorRole: event.actorRole ?? null,
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId ?? null,
        metadata: (event.metadata as Prisma.InputJsonValue | undefined) ?? undefined,
      },
    });
  } catch (err) {
    console.error('[AuditLog] failed to record event', event.action, err);
  }
}
