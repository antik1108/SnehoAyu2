import { type Request, type Response, type NextFunction } from 'express';
import {
  buildParticipantExportWorkbook,
  generateParticipantExport,
  generateCohortExport,
} from '../services/exportService.js';
import { recordAudit } from '../services/auditService.js';
import { createError } from '../middlewares/errorHandler.js';

export async function getExport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const anonymize = req.query['anonymize'] === 'true';
    const workbook = await buildParticipantExportWorkbook(anonymize);

    void recordAudit({
      actorId: req.user?.id,
      actorRole: req.user?.role,
      action: 'admin.export_generated',
      entityType: 'MotherProfile',
      metadata: { anonymize },
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="snehoayu-export-${Date.now()}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
}

export async function getParticipantExport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Participant id is required.'));
      return;
    }

    const buffer = await generateParticipantExport(id, {
      actorId: req.user?.id,
      actorRole: req.user?.role,
    });

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="participant_${id}_${dateStr}.xlsx"`);

    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

export async function postCohortExport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = req.body?.filters || req.body || {};

    const buffer = await generateCohortExport(filters, {
      actorId: req.user?.id,
      actorRole: req.user?.role,
    });

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="snehoayu-cohort-export-${dateStr}.xlsx"`);

    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
