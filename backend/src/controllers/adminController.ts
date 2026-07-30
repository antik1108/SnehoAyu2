import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import { recordAudit } from '../services/auditService.js';
import * as adminService from '../services/adminService.js';

export async function getParticipants(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      hospitalId,
      studyGroup,
      birthWeightStratum,
      onboardingStatus,
      enrolledAfter,
      enrolledBefore,
      checkpointWindow,
      engagementTier,
    } = req.query;

    const filter: any = {};

    if (typeof hospitalId === 'string' && hospitalId.trim()) filter.hospitalId = hospitalId.trim();
    if (studyGroup === 'study' || studyGroup === 'control') filter.studyGroup = studyGroup;
    if (typeof birthWeightStratum === 'string' && birthWeightStratum.trim()) filter.birthWeightStratum = birthWeightStratum.trim();
    if (onboardingStatus === 'onboarded' || onboardingStatus === 'pending') filter.onboardingStatus = onboardingStatus;

    if (typeof enrolledAfter === 'string' && enrolledAfter.trim()) {
      const d = new Date(enrolledAfter.trim());
      if (!isNaN(d.getTime())) filter.enrolledAfter = d;
    }
    if (typeof enrolledBefore === 'string' && enrolledBefore.trim()) {
      const d = new Date(enrolledBefore.trim());
      if (!isNaN(d.getTime())) filter.enrolledBefore = d;
    }
    if (
      checkpointWindow === 'overdue' ||
      checkpointWindow === 'due_this_week' ||
      checkpointWindow === 'due_this_month' ||
      checkpointWindow === 'due_next_month'
    ) {
      filter.checkpointWindow = checkpointWindow;
    }
    if (
      engagementTier === 'high' ||
      engagementTier === 'medium' ||
      engagementTier === 'low' ||
      engagementTier === 'inactive'
    ) {
      filter.engagementTier = engagementTier;
    }

    const data = await adminService.listParticipants(filter);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getParticipantDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Participant id is required.'));
      return;
    }
    const data = await adminService.getParticipantDetail(id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getParticipantGrowth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Participant id is required.'));
      return;
    }
    const data = await adminService.getAdminParticipantGrowth(id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function assignStudyGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { studyGroup } = req.body as { studyGroup?: string };

    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Participant id is required.'));
      return;
    }
    if (studyGroup !== 'study' && studyGroup !== 'control') {
      next(createError(400, 'INVALID_REQUEST', "studyGroup must be 'study' or 'control'."));
      return;
    }

    const updated = await adminService.assignStudyGroup(id, studyGroup);

    void recordAudit({
      actorId: req.user?.id,
      actorRole: req.user?.role,
      action: 'admin.assign_study_group',
      entityType: 'MotherProfile',
      entityId: id,
      metadata: { studyGroup },
    });

    res.status(200).json({
      success: true,
      message: 'Study group assigned successfully.',
      data: { id: updated.id, studyGroup: updated.studyGroup },
    });
  } catch (err) {
    next(err);
  }
}

export async function getHospitals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.listHospitals();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getHospitalDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Hospital id is required.'));
      return;
    }
    const data = await adminService.getHospitalDetail(id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postHospital(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, code, district, state, type, emergencyPhone } = req.body as {
      name?: string;
      code?: string;
      district?: string;
      state?: string;
      type?: string;
      emergencyPhone?: string;
    };

    if (!name || !code || !district || !type) {
      next(createError(400, 'INVALID_REQUEST', 'name, code, district, and type are required.'));
      return;
    }

    const hospital = await adminService.createHospital({ name, code, district, state, type, emergencyPhone });

    void recordAudit({
      actorId: req.user?.id,
      actorRole: req.user?.role,
      action: 'admin.hospital_created',
      entityType: 'Hospital',
      entityId: hospital.id,
      metadata: { code: hospital.code },
    });

    res.status(201).json({ success: true, message: 'Hospital created successfully.', data: hospital });
  } catch (err) {
    next(err);
  }
}

export async function patchHospital(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      next(createError(400, 'INVALID_REQUEST', 'Hospital id is required.'));
      return;
    }
    const { name, district, emergencyPhone, isActive } = req.body as {
      name?: string;
      district?: string;
      emergencyPhone?: string;
      isActive?: boolean;
    };

    const hospital = await adminService.updateHospital(id, { name, district, emergencyPhone, isActive });

    void recordAudit({
      actorId: req.user?.id,
      actorRole: req.user?.role,
      action: 'admin.hospital_updated',
      entityType: 'Hospital',
      entityId: hospital.id,
      metadata: { isActive: hospital.isActive },
    });

    res.status(200).json({ success: true, message: 'Hospital updated successfully.', data: hospital });
  } catch (err) {
    next(err);
  }
}
