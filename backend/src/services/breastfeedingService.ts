import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { scoreBreastfeedingAssessment, type BreastfeedingResponses } from '../content/breastfeedingAssessment.js';
import { recordAudit } from './auditService.js';

type RequestUser = { id: string; role: string };

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  if (user.role !== 'mother') throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can submit this assessment.');
  return user;
}

async function resolveMotherProfile(user: RequestUser) {
  const motherProfile = await prisma.motherProfile.findUnique({ where: { userId: user.id } });
  if (!motherProfile) throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile first.');
  return motherProfile;
}

export async function submitBreastfeedingAssessment(
  user: RequestUser,
  timePoint: string,
  responses: BreastfeedingResponses
) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherProfile(currentUser);

  const existing = await prisma.breastfeedingAssessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint } },
  });
  if (existing) {
    throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This breastfeeding assessment has already been submitted and is locked.');
  }

  const { totalScore, grade } = scoreBreastfeedingAssessment(responses);

  const record = await prisma.breastfeedingAssessment.create({
    data: {
      motherProfileId: motherProfile.id,
      timePoint,
      responses: responses as unknown as object,
      totalScore,
      grade,
    },
  });

  void recordAudit({
    actorId: currentUser.id,
    actorRole: currentUser.role,
    action: 'breastfeeding.submitted',
    entityType: 'BreastfeedingAssessment',
    entityId: record.id,
    metadata: { timePoint, totalScore, grade },
  });

  return {
    success: true,
    message: 'Breastfeeding assessment submitted successfully.',
    data: { timePoint, totalScore, grade, submittedAt: record.submittedAt.toISOString(), locked: true },
  };
}

export async function getBreastfeedingHistory(user: RequestUser) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherProfile(currentUser);

  const records = await prisma.breastfeedingAssessment.findMany({
    where: { motherProfileId: motherProfile.id },
    orderBy: { submittedAt: 'asc' },
  });

  return {
    success: true,
    data: records.map((r) => ({
      timePoint: r.timePoint,
      totalScore: r.totalScore,
      grade: r.grade,
      submittedAt: r.submittedAt.toISOString(),
    })),
  };
}
