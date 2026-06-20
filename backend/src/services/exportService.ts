import ExcelJS from 'exceljs';
import prisma from '../lib/prisma.js';

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
