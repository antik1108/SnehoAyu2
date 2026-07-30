import ExcelJS from 'exceljs';
import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { recordAudit } from './auditService.js';
import {
  CohortFilter,
  buildWhereClause,
  computeEngagementScore,
  computeEngagementTier,
  DailyLogRow,
} from './analyticsService.js';
import { Sex } from '../content/whoGrowthStandards.js';
import { mapGrowthReading } from './growthService.js';

export async function buildParticipantExportWorkbook(anonymize: boolean): Promise<ExcelJS.Workbook> {
  const mothers = await prisma.motherProfile.findMany({
    include: {
      hospital: { select: { name: true, code: true } },
      babyProfile: true,
      growthReadings: { orderBy: { readingDate: 'desc' }, take: 1 },
      knowledgeAssessments: true,
      who5Assessments: true,
      psocAssessments: true,
      tdscAssessments: true,
      breastfeedingAssessments: true,
    },
    orderBy: { enrolledAt: 'asc' },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Participants');

  sheet.columns = [
    { header: 'Participant Code', key: 'participantCode', width: 18 },
    ...(anonymize ? [] : [{ header: 'Name', key: 'name', width: 20 }]),
    { header: 'Hospital', key: 'hospital', width: 24 },
    { header: 'Study Group', key: 'studyGroup', width: 12 },
    { header: 'Age Range', key: 'ageRange', width: 12 },
    { header: 'Birth Weight Stratum', key: 'birthWeightStratum', width: 18 },
    { header: 'Baby Sex', key: 'sex', width: 10 },
    { header: 'Gestational Age (wks)', key: 'gestationalAgeWeeks', width: 18 },
    { header: 'Birth Weight (g)', key: 'birthWeightGrams', width: 16 },
    { header: 'Latest Weight (g)', key: 'latestWeightGrams', width: 16 },
    { header: 'Knowledge MCQ (baseline)', key: 'knowledgeBaseline', width: 22 },
    { header: 'WHO-5 % (baseline)', key: 'who5Baseline', width: 18 },
    { header: 'PSOC Total (baseline)', key: 'psocBaseline', width: 18 },
    { header: 'TDSC Suspected Delay', key: 'tdscDelay', width: 18 },
    { header: 'Breastfeeding Grade (baseline)', key: 'bfGrade', width: 22 },
    { header: 'Enrolled At', key: 'enrolledAt', width: 14 },
    { header: 'Onboarding Complete', key: 'onboardingComplete', width: 16 },
  ];

  for (const m of mothers) {
    const knowledgeBaseline = m.knowledgeAssessments.find((k) => k.timePoint === 'baseline');
    const who5Baseline = m.who5Assessments.find((w) => w.timePoint === 'baseline');
    const psocBaseline = m.psocAssessments.find((p) => p.timePoint === 'baseline');
    const tdscAny = m.tdscAssessments.find((t) => t.suspectedDelay);
    const bfBaseline = m.breastfeedingAssessments.find((b) => b.timePoint === 'baseline');

    sheet.addRow({
      participantCode: m.participantCode ?? '',
      ...(anonymize ? {} : { name: m.fullName ?? '' }),
      hospital: m.hospital?.name ?? '',
      studyGroup: m.studyGroup ?? '',
      ageRange: m.ageRange,
      birthWeightStratum: m.babyProfile?.birthWeightStratum ?? '',
      sex: m.babyProfile?.sex ?? '',
      gestationalAgeWeeks: m.babyProfile?.gestationalAgeWeeks?.toString() ?? '',
      birthWeightGrams: m.babyProfile?.birthWeightGrams ?? '',
      latestWeightGrams: m.growthReadings[0]?.weightGrams ?? '',
      knowledgeBaseline: knowledgeBaseline ? `${knowledgeBaseline.score}/${knowledgeBaseline.maxScore}` : '',
      who5Baseline: who5Baseline ? who5Baseline.percentageScore : '',
      psocBaseline: psocBaseline ? psocBaseline.totalScore : '',
      tdscDelay: tdscAny ? 'Yes' : 'No',
      bfGrade: bfBaseline ? bfBaseline.grade : '',
      enrolledAt: m.enrolledAt.toISOString().slice(0, 10),
      onboardingComplete: m.onboardingCompletedAt ? 'Yes' : 'No',
    });
  }

  sheet.getRow(1).font = { bold: true };

  return workbook;
}

/**
 * Task 12: Generate a 5-sheet workbook for a single participant
 */
export async function generateParticipantExport(
  motherProfileId: string,
  actorInfo?: { actorId?: string; actorRole?: string }
): Promise<Buffer> {
  const mother = await prisma.motherProfile.findUnique({
    where: { id: motherProfileId },
    include: {
      hospital: true,
      user: true,
      babyProfile: true,
      followUpSchedules: { orderBy: { scheduledDate: 'asc' } },
      growthReadings: { orderBy: { readingDate: 'asc' } },
      knowledgeAssessments: true,
      who5Assessments: true,
      psocAssessments: true,
      tdscAssessments: true,
      breastfeedingAssessments: true,
      vaccineRecords: { orderBy: { dueDate: 'asc' } },
      dailyLogs: { orderBy: { careDate: 'asc' } },
      dangerSignAlerts: { orderBy: { raisedAt: 'desc' } },
    },
  });

  if (!mother) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  const workbook = new ExcelJS.Workbook();

  // Sheet 1: Demographics
  const demoSheet = workbook.addWorksheet('Demographics');
  demoSheet.columns = [
    { header: 'Field', key: 'field', width: 28 },
    { header: 'Value', key: 'value', width: 35 },
  ];
  demoSheet.getRow(1).font = { bold: true };

  const baby = mother.babyProfile;
  const demoRows = [
    { field: 'Participant ID', value: mother.id },
    { field: 'Participant Code', value: mother.participantCode ?? '' },
    { field: 'Full Name', value: mother.fullName ?? '' },
    { field: 'Phone Number', value: mother.user.phone },
    { field: 'Preferred Language', value: mother.user.preferredLanguage },
    { field: 'Study Group', value: mother.studyGroup ?? 'Unassigned' },
    { field: 'Hospital Name', value: mother.hospital?.name ?? '' },
    { field: 'Hospital Code', value: mother.hospital?.code ?? '' },
    { field: 'Enrolled At', value: mother.enrolledAt.toISOString() },
    { field: 'Onboarding Completed At', value: mother.onboardingCompletedAt?.toISOString() ?? 'Pending' },
    { field: 'Baby Name', value: baby?.babyName ?? '' },
    { field: 'Baby Sex', value: baby?.sex ?? '' },
    { field: 'Date of Birth', value: baby?.dateOfBirth ? baby.dateOfBirth.toISOString().split('T')[0] : '' },
    { field: 'Gestational Age (weeks)', value: baby?.gestationalAgeWeeks?.toString() ?? '' },
    { field: 'Birth Weight (g)', value: baby?.birthWeightGrams ?? '' },
    { field: 'Birth Weight Stratum', value: baby?.birthWeightStratum ?? '' },
    { field: 'Discharge Weight (g)', value: baby?.weightAtDischargeGrams ?? '' },
    { field: 'Discharge Date', value: baby?.dischargeDate ? baby.dischargeDate.toISOString().split('T')[0] : '' },
  ];

  demoRows.forEach((r) => demoSheet.addRow(r));

  // Sheet 2: Assessment Scores
  const scoreSheet = workbook.addWorksheet('Assessment Scores');
  scoreSheet.columns = [
    { header: 'Checkpoint', key: 'checkpoint', width: 15 },
    { header: 'Instrument', key: 'instrument', width: 22 },
    { header: 'Score / Value', key: 'score', width: 20 },
    { header: 'Grade / Details', key: 'details', width: 25 },
    { header: 'Completed At', key: 'completedAt', width: 20 },
  ];
  scoreSheet.getRow(1).font = { bold: true };

  mother.knowledgeAssessments.forEach((k) => {
    scoreSheet.addRow({
      checkpoint: k.timePoint,
      instrument: 'Knowledge MCQ',
      score: `${k.score}/${k.maxScore}`,
      details: k.grade,
      completedAt: k.submittedAt ? k.submittedAt.toISOString().split('T')[0] : k.createdAt.toISOString().split('T')[0],
    });
  });

  mother.who5Assessments.forEach((w) => {
    scoreSheet.addRow({
      checkpoint: w.timePoint,
      instrument: 'WHO-5 Well-being',
      score: `${w.percentageScore}%`,
      details: w.poorWellbeingFlag ? 'Poor Wellbeing Alert' : 'Normal',
      completedAt: w.submittedAt ? w.submittedAt.toISOString().split('T')[0] : w.createdAt.toISOString().split('T')[0],
    });
  });

  mother.psocAssessments.forEach((p) => {
    scoreSheet.addRow({
      checkpoint: p.timePoint,
      instrument: 'PSOC Parenting Efficacy',
      score: p.totalScore,
      details: `Efficacy: ${p.efficacyScore}, Satisfaction: ${p.satisfactionScore}`,
      completedAt: p.submittedAt ? p.submittedAt.toISOString().split('T')[0] : p.createdAt.toISOString().split('T')[0],
    });
  });

  mother.tdscAssessments.forEach((t) => {
    scoreSheet.addRow({
      checkpoint: t.timePoint,
      instrument: 'TDSC Development',
      score: t.suspectedDelay ? 'Suspected Delay' : 'Normal',
      details: `Assessment Date: ${t.assessmentDate.toISOString().split('T')[0]}`,
      completedAt: t.createdAt.toISOString().split('T')[0],
    });
  });

  mother.breastfeedingAssessments.forEach((b) => {
    scoreSheet.addRow({
      checkpoint: b.timePoint,
      instrument: 'Breastfeeding LATCH',
      score: b.totalScore,
      details: b.grade,
      completedAt: b.submittedAt ? b.submittedAt.toISOString().split('T')[0] : '',
    });
  });

  // Sheet 3: Growth Readings
  const growthSheet = workbook.addWorksheet('Growth Readings');
  growthSheet.columns = [
    { header: 'Reading Date', key: 'readingDate', width: 14 },
    { header: 'Weight (g)', key: 'weightGrams', width: 14 },
    { header: 'Length (cm)', key: 'lengthCm', width: 14 },
    { header: 'Head Circ (cm)', key: 'headCircumferenceCm', width: 16 },
    { header: 'Chronological Age (wks)', key: 'chronologicalAgeWeeks', width: 22 },
    { header: 'Corrected Age (wks)', key: 'correctedAgeWeeks', width: 20 },
    { header: 'Source', key: 'source', width: 12 },
    { header: 'Notes', key: 'notes', width: 25 },
  ];
  growthSheet.getRow(1).font = { bold: true };

  const sex = (baby?.sex as Sex) || 'boy';
  mother.growthReadings.forEach((r) => {
    const mapped = mapGrowthReading(r as any, sex);
    growthSheet.addRow({
      readingDate: mapped.readingDate,
      weightGrams: mapped.weightGrams,
      lengthCm: mapped.lengthCm ?? '',
      headCircumferenceCm: mapped.headCircumferenceCm ?? '',
      chronologicalAgeWeeks: mapped.chronologicalAge.weeks,
      correctedAgeWeeks: mapped.correctedAge.weeks,
      source: mapped.source,
      notes: mapped.notes ?? '',
    });
  });

  // Sheet 4: Immunization
  const vaccineSheet = workbook.addWorksheet('Immunization');
  vaccineSheet.columns = [
    { header: 'Vaccine Name', key: 'vaccineName', width: 25 },
    { header: 'Due Date', key: 'dueDate', width: 14 },
    { header: 'Completion Date', key: 'completedDate', width: 16 },
    { header: 'Status', key: 'status', width: 14 },
  ];
  vaccineSheet.getRow(1).font = { bold: true };

  mother.vaccineRecords.forEach((v) => {
    vaccineSheet.addRow({
      vaccineName: v.vaccineName,
      dueDate: v.dueDate.toISOString().split('T')[0],
      completedDate: v.completedDate ? v.completedDate.toISOString().split('T')[0] : '',
      status: v.status,
    });
  });

  // Sheet 5: Daily Log Summary
  const logSheet = workbook.addWorksheet('Daily Log Summary');
  logSheet.columns = [
    { header: 'Care Date', key: 'careDate', width: 14 },
    { header: 'Log Recorded', key: 'logRecorded', width: 14 },
    { header: 'Completed Tasks', key: 'completedCount', width: 16 },
    { header: 'Breastfeeding', key: 'breastfeedingDone', width: 14 },
    { header: 'KMC', key: 'kmcDone', width: 10 },
    { header: 'Temperature', key: 'temperatureDone', width: 14 },
    { header: 'Weight Check', key: 'weightCheckDone', width: 14 },
    { header: 'Skin/Cord Care', key: 'skinCordCareDone', width: 16 },
    { header: 'Sleep', key: 'sleepDone', width: 10 },
    { header: 'Stool', key: 'stoolDone', width: 10 },
  ];
  logSheet.getRow(1).font = { bold: true };

  mother.dailyLogs.forEach((l) => {
    const tasks = [
      l.breastfeedingDone,
      l.kmcDone,
      l.temperatureDone,
      l.weightCheckDone,
      l.skinCordCareDone,
      l.sleepDone,
      l.stoolDone,
    ];
    const completedCount = tasks.filter(Boolean).length;

    logSheet.addRow({
      careDate: l.careDate.toISOString().split('T')[0],
      logRecorded: 'Yes',
      completedCount: `${completedCount}/7`,
      breastfeedingDone: l.breastfeedingDone ? 'Yes' : 'No',
      kmcDone: l.kmcDone ? 'Yes' : 'No',
      temperatureDone: l.temperatureDone ? 'Yes' : 'No',
      weightCheckDone: l.weightCheckDone ? 'Yes' : 'No',
      skinCordCareDone: l.skinCordCareDone ? 'Yes' : 'No',
      sleepDone: l.sleepDone ? 'Yes' : 'No',
      stoolDone: l.stoolDone ? 'Yes' : 'No',
    });
  });

  // Call audit logging on success only
  try {
    await recordAudit({
      actorId: actorInfo?.actorId,
      actorRole: actorInfo?.actorRole,
      action: 'admin.participant_export_generated',
      entityType: 'MotherProfile',
      entityId: motherProfileId,
    });
  } catch (auditErr) {
    console.error('Audit logging failed for participant export:', auditErr);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Task 13: Generate a 6-sheet workbook for a filtered cohort
 */
export async function generateCohortExport(
  filter: CohortFilter,
  actorInfo?: { actorId?: string; actorRole?: string }
): Promise<Buffer> {
  const baseWhere = buildWhereClause(filter);

  // Apply engagement tier filtering if specified
  let targetMotherIds: string[] | undefined;
  if (filter.engagementTier) {
    const studyMothers = await prisma.motherProfile.findMany({
      where: { ...baseWhere, studyGroup: 'study' },
      select: { id: true },
    });
    const candidateIds = studyMothers.map((m) => m.id);

    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 27);
    twentyEightDaysAgo.setHours(0, 0, 0, 0);

    const logs = await prisma.dailyLog.findMany({
      where: {
        motherProfileId: { in: candidateIds },
        careDate: { gte: twentyEightDaysAgo },
      },
      select: {
        motherProfileId: true,
        breastfeedingDone: true,
        kmcDone: true,
        temperatureDone: true,
        weightCheckDone: true,
        skinCordCareDone: true,
        sleepDone: true,
        stoolDone: true,
      },
    });

    const logsByMother: Record<string, DailyLogRow[]> = {};
    logs.forEach((log) => {
      if (!logsByMother[log.motherProfileId]) logsByMother[log.motherProfileId] = [];
      logsByMother[log.motherProfileId].push(log);
    });

    targetMotherIds = candidateIds.filter((id) => {
      const score = computeEngagementScore(logsByMother[id] || []);
      return computeEngagementTier(score) === filter.engagementTier;
    });
  }

  const finalWhere = targetMotherIds ? { ...baseWhere, id: { in: targetMotherIds } } : baseWhere;

  const mothers = await prisma.motherProfile.findMany({
    where: finalWhere,
    include: {
      hospital: { select: { name: true, code: true } },
      user: { select: { phone: true, lastLoginAt: true } },
      babyProfile: true,
      followUpSchedules: { orderBy: { scheduledDate: 'asc' } },
      knowledgeAssessments: true,
      who5Assessments: true,
      psocAssessments: true,
      growthReadings: { orderBy: { readingDate: 'asc' } },
      dailyLogs: { orderBy: { careDate: 'desc' } },
    },
    orderBy: { enrolledAt: 'asc' },
  });

  if (mothers.length === 0) {
    throw createError(400, 'NO_PARTICIPANTS_MATCH', 'No participants match the current filter — export aborted');
  }

  const workbook = new ExcelJS.Workbook();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 27);
  twentyEightDaysAgo.setHours(0, 0, 0, 0);

  // Sheet 1: Participant Overview
  const overviewSheet = workbook.addWorksheet('Participant Overview');
  overviewSheet.columns = [
    { header: 'Participant Code', key: 'participantCode', width: 18 },
    { header: 'Site Name', key: 'siteName', width: 25 },
    { header: 'Group', key: 'group', width: 12 },
    { header: 'Stratum', key: 'stratum', width: 18 },
    { header: 'Enrolled Date', key: 'enrolledDate', width: 14 },
    { header: 'Days Since Enrollment', key: 'daysSinceEnrollment', width: 22 },
    { header: 'Onboarding Status', key: 'onboardingStatus', width: 18 },
    { header: 'Last Active Date', key: 'lastActiveDate', width: 16 },
    { header: 'Engagement Tier', key: 'engagementTier', width: 16 },
  ];
  overviewSheet.getRow(1).font = { bold: true };

  mothers.forEach((m) => {
    const enrolledDate = new Date(m.enrolledAt);
    const diffTime = Math.max(0, today.getTime() - enrolledDate.getTime());
    const daysSinceEnrollment = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let lastActiveDate: string = 'N/A';
    if (m.studyGroup === 'study') {
      lastActiveDate = m.dailyLogs[0] ? m.dailyLogs[0].careDate.toISOString().split('T')[0] : 'N/A';
    } else {
      lastActiveDate = m.user.lastLoginAt ? m.user.lastLoginAt.toISOString().split('T')[0] : 'N/A';
    }

    let engagementTier: string = 'N/A';
    if (m.studyGroup === 'study') {
      const logsPast28 = m.dailyLogs.filter((l) => new Date(l.careDate) >= twentyEightDaysAgo);
      const score = computeEngagementScore(logsPast28);
      engagementTier = computeEngagementTier(score);
    }

    overviewSheet.addRow({
      participantCode: m.participantCode ?? '',
      siteName: m.hospital?.name ?? '',
      group: m.studyGroup ?? '',
      stratum: m.babyProfile?.birthWeightStratum ?? '',
      enrolledDate: m.enrolledAt.toISOString().split('T')[0],
      daysSinceEnrollment,
      onboardingStatus: m.onboardingCompletedAt ? 'Onboarded' : 'Pending',
      lastActiveDate,
      engagementTier,
    });
  });

  // Sheet 2: Knowledge MCQ Scores
  const kSheet = workbook.addWorksheet('Knowledge MCQ Scores');
  kSheet.columns = [
    { header: 'Participant Code', key: 'participantCode', width: 18 },
    { header: 'Site Name', key: 'siteName', width: 22 },
    { header: 'Group', key: 'group', width: 12 },
    { header: 'Baseline', key: 'baseline', width: 14 },
    { header: '1 Month', key: 'oneMonth', width: 14 },
    { header: '3 Month', key: 'threeMonth', width: 14 },
    { header: '6 Month', key: 'sixMonth', width: 14 },
  ];
  kSheet.getRow(1).font = { bold: true };

  mothers.forEach((m) => {
    const kMap: Record<string, string> = {};
    m.knowledgeAssessments.forEach((k) => {
      kMap[k.timePoint] = `${k.score}/${k.maxScore}`;
    });
    kSheet.addRow({
      participantCode: m.participantCode ?? '',
      siteName: m.hospital?.name ?? '',
      group: m.studyGroup ?? '',
      baseline: kMap['baseline'] ?? '',
      oneMonth: kMap['1_month'] ?? '',
      threeMonth: kMap['3_month'] ?? '',
      sixMonth: kMap['6_month'] ?? '',
    });
  });

  // Sheet 3: WHO-5 Scores
  const wSheet = workbook.addWorksheet('WHO-5 Scores');
  wSheet.columns = [
    { header: 'Participant Code', key: 'participantCode', width: 18 },
    { header: 'Site Name', key: 'siteName', width: 22 },
    { header: 'Group', key: 'group', width: 12 },
    { header: 'Baseline (%)', key: 'baseline', width: 14 },
    { header: '1 Month (%)', key: 'oneMonth', width: 14 },
    { header: '3 Month (%)', key: 'threeMonth', width: 14 },
    { header: '6 Month (%)', key: 'sixMonth', width: 14 },
  ];
  wSheet.getRow(1).font = { bold: true };

  mothers.forEach((m) => {
    const wMap: Record<string, string> = {};
    m.who5Assessments.forEach((w) => {
      wMap[w.timePoint] = `${w.percentageScore}%`;
    });
    wSheet.addRow({
      participantCode: m.participantCode ?? '',
      siteName: m.hospital?.name ?? '',
      group: m.studyGroup ?? '',
      baseline: wMap['baseline'] ?? '',
      oneMonth: wMap['1_month'] ?? '',
      threeMonth: wMap['3_month'] ?? '',
      sixMonth: wMap['6_month'] ?? '',
    });
  });

  // Sheet 4: PSOC Scores
  const pSheet = workbook.addWorksheet('PSOC Scores');
  pSheet.columns = [
    { header: 'Participant Code', key: 'participantCode', width: 18 },
    { header: 'Site Name', key: 'siteName', width: 22 },
    { header: 'Group', key: 'group', width: 12 },
    { header: 'Baseline Total', key: 'baseline', width: 16 },
    { header: '1 Month Total', key: 'oneMonth', width: 16 },
    { header: '3 Month Total', key: 'threeMonth', width: 16 },
    { header: '6 Month Total', key: 'sixMonth', width: 16 },
  ];
  pSheet.getRow(1).font = { bold: true };

  mothers.forEach((m) => {
    const pMap: Record<string, number> = {};
    m.psocAssessments.forEach((p) => {
      pMap[p.timePoint] = p.totalScore;
    });
    pSheet.addRow({
      participantCode: m.participantCode ?? '',
      siteName: m.hospital?.name ?? '',
      group: m.studyGroup ?? '',
      baseline: pMap['baseline'] ?? '',
      oneMonth: pMap['1_month'] ?? '',
      threeMonth: pMap['3_month'] ?? '',
      sixMonth: pMap['6_month'] ?? '',
    });
  });

  // Sheet 5: Growth Readings
  const gSheet = workbook.addWorksheet('Growth Readings');
  gSheet.columns = [
    { header: 'Participant Code', key: 'participantCode', width: 18 },
    { header: 'Site Name', key: 'siteName', width: 22 },
    { header: 'Reading Date', key: 'readingDate', width: 14 },
    { header: 'Weight (g)', key: 'weightGrams', width: 14 },
    { header: 'Length (cm)', key: 'lengthCm', width: 14 },
    { header: 'Head Circ (cm)', key: 'headCircumferenceCm', width: 16 },
    { header: 'Corrected Age (wks)', key: 'correctedAgeWeeks', width: 20 },
  ];
  gSheet.getRow(1).font = { bold: true };

  mothers.forEach((m) => {
    const sex = (m.babyProfile?.sex as Sex) || 'boy';
    m.growthReadings.forEach((r) => {
      const mapped = mapGrowthReading(r as any, sex);
      gSheet.addRow({
        participantCode: m.participantCode ?? '',
        siteName: m.hospital?.name ?? '',
        readingDate: mapped.readingDate,
        weightGrams: mapped.weightGrams,
        lengthCm: mapped.lengthCm ?? '',
        headCircumferenceCm: mapped.headCircumferenceCm ?? '',
        correctedAgeWeeks: mapped.correctedAge.weeks,
      });
    });
  });

  // Sheet 6: Missing Data Report
  const missingSheet = workbook.addWorksheet('Missing Data Report');
  missingSheet.columns = [
    { header: 'Participant Code', key: 'participantCode', width: 18 },
    { header: 'Site Name', key: 'siteName', width: 22 },
    { header: 'Phone', key: 'phone', width: 18 },
    { header: 'Checkpoint', key: 'checkpoint', width: 15 },
    { header: 'Missing Instrument(s)', key: 'missingInstruments', width: 35 },
  ];
  missingSheet.getRow(1).font = { bold: true };

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  mothers.forEach((m) => {
    const dueSchedules = m.followUpSchedules.filter((s) => s.scheduledDate <= endOfToday);

    dueSchedules.forEach((s) => {
      const missing: string[] = [];
      const hasKnowledge = m.knowledgeAssessments.some((k) => k.timePoint === s.timePoint);
      const hasWho5 = m.who5Assessments.some((w) => w.timePoint === s.timePoint);
      const hasPsoc = m.psocAssessments.some((p) => p.timePoint === s.timePoint);

      if (!hasKnowledge) missing.push('Knowledge MCQ');
      if (!hasWho5) missing.push('WHO-5');
      if (!hasPsoc) missing.push('PSOC');

      if (missing.length > 0) {
        missingSheet.addRow({
          participantCode: m.participantCode ?? 'Pending Code',
          siteName: m.hospital?.name ?? '',
          phone: m.user.phone ?? 'Not available',
          checkpoint: s.timePoint,
          missingInstruments: missing.join(', '),
        });
      }
    });
  });

  // Audit log on full success only
  await recordAudit({
    actorId: actorInfo?.actorId,
    actorRole: actorInfo?.actorRole,
    action: 'admin.cohort_export_generated',
    entityType: 'MotherProfile',
    metadata: { filter },
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
