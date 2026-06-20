import { type Request, type Response, type NextFunction } from 'express';
import { buildParticipantExportWorkbook } from '../services/exportService.js';
import { recordAudit } from '../services/auditService.js';

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
