import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { Prisma } from '../../generated/prisma/index.js';

export interface CohortFilter {
  hospitalId?: string;
  studyGroup?: 'study' | 'control';
  birthWeightStratum?: string;
  onboardingStatus?: 'onboarded' | 'pending';
  enrolledAfter?: Date;
  enrolledBefore?: Date;
  checkpointWindow?: 'overdue' | 'due_this_week' | 'due_this_month' | 'due_next_month';
  engagementTier?: 'high' | 'medium' | 'low' | 'inactive';
}

export interface DailyLogRow {
  breastfeedingDone: boolean;
  kmcDone: boolean;
  temperatureDone: boolean;
  weightCheckDone: boolean;
  skinCordCareDone: boolean;
  sleepDone: boolean;
  stoolDone: boolean;
}

/**
 * Pure utility function to compute engagement score over past 28 days.
 * Engagement score = (count of DailyLog records with completedCount >= 5 in past 28 days) / 28 * 100
 */
export function computeEngagementScore(logs: DailyLogRow[]): number {
  const activeDays = logs.filter((log) => {
    const completedCount = [
      log.breastfeedingDone,
      log.kmcDone,
      log.temperatureDone,
      log.weightCheckDone,
      log.skinCordCareDone,
      log.sleepDone,
      log.stoolDone,
    ].filter(Boolean).length;
    return completedCount >= 5;
  }).length;

  return Number(((activeDays / 28) * 100).toFixed(1));
}

/**
 * Pure utility function to map engagement score to engagement tier.
 * High >= 75, Medium 40–74, Low 10–39, Inactive < 10
 */
export function computeEngagementTier(score: number): 'high' | 'medium' | 'low' | 'inactive' {
  if (score >= 75) return 'high';
  if (score >= 40) return 'medium';
  if (score >= 10) return 'low';
  return 'inactive';
}

/**
 * Helper to build Prisma MotherProfile `where` condition object from CohortFilter.
 */
export function buildWhereClause(filter: CohortFilter): Prisma.MotherProfileWhereInput {
  if (filter.enrolledAfter && filter.enrolledBefore && filter.enrolledAfter > filter.enrolledBefore) {
    throw createError(400, 'INVALID_DATE_RANGE', 'enrolledAfter cannot be later than enrolledBefore');
  }

  const where: Prisma.MotherProfileWhereInput = {};

  if (filter.hospitalId) {
    where.hospitalId = filter.hospitalId;
  }

  if (filter.studyGroup) {
    where.studyGroup = filter.studyGroup;
  }

  if (filter.birthWeightStratum) {
    where.babyProfile = { birthWeightStratum: filter.birthWeightStratum };
  }

  if (filter.onboardingStatus === 'onboarded') {
    where.onboardingCompletedAt = { not: null };
  } else if (filter.onboardingStatus === 'pending') {
    where.onboardingCompletedAt = null;
  }

  if (filter.enrolledAfter || filter.enrolledBefore) {
    where.enrolledAt = {
      ...(filter.enrolledAfter ? { gte: filter.enrolledAfter } : {}),
      ...(filter.enrolledBefore ? { lte: filter.enrolledBefore } : {}),
    };
  }

  if (filter.checkpointWindow) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter.checkpointWindow === 'overdue') {
      where.followUpSchedules = {
        some: {
          status: 'pending',
          scheduledDate: { lt: today },
        },
      };
    } else if (filter.checkpointWindow === 'due_this_week') {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      where.followUpSchedules = {
        some: {
          status: 'pending',
          scheduledDate: { gte: today, lte: endOfWeek },
        },
      };
    } else if (filter.checkpointWindow === 'due_this_month') {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

      where.followUpSchedules = {
        some: {
          status: 'pending',
          scheduledDate: { gte: today, lte: endOfMonth },
        },
      };
    } else if (filter.checkpointWindow === 'due_next_month') {
      const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1, 0, 0, 0, 0);
      const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59, 999);

      where.followUpSchedules = {
        some: {
          status: 'pending',
          scheduledDate: { gte: startOfNextMonth, lte: endOfNextMonth },
        },
      };
    }
  }

  return where;
}

/**
 * Filter mother IDs by engagement tier if specified.
 */
async function applyEngagementTierFilter(
  initialWhere: Prisma.MotherProfileWhereInput,
  engagementTier?: 'high' | 'medium' | 'low' | 'inactive'
): Promise<Prisma.MotherProfileWhereInput> {
  if (!engagementTier) return initialWhere;

  // Engagement tier filter applies to study group only
  const candidates = await prisma.motherProfile.findMany({
    where: {
      ...initialWhere,
      studyGroup: 'study',
    },
    select: { id: true },
  });

  if (candidates.length === 0) {
    return { ...initialWhere, id: { in: [] } };
  }

  const candidateIds = candidates.map((c) => c.id);
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
    if (!logsByMother[log.motherProfileId]) {
      logsByMother[log.motherProfileId] = [];
    }
    logsByMother[log.motherProfileId].push(log);
  });

  const matchingIds = candidateIds.filter((id) => {
    const motherLogs = logsByMother[id] || [];
    const score = computeEngagementScore(motherLogs);
    const tier = computeEngagementTier(score);
    return tier === engagementTier;
  });

  return {
    ...initialWhere,
    id: { in: matchingIds },
  };
}

/**
 * Task 4: Cohort Overview KPI counts and overdue participants list
 */
export async function getCohortOverview(filter: CohortFilter) {
  const baseWhere = buildWhereClause(filter);
  const where = await applyEngagementTierFilter(baseWhere, filter.engagementTier);

  // Group by studyGroup
  const groupCounts = await prisma.motherProfile.groupBy({
    by: ['studyGroup'],
    where,
    _count: { id: true },
  });

  let studyCount = 0;
  let controlCount = 0;
  let awaitingAssignment = 0;

  groupCounts.forEach((g) => {
    if (g.studyGroup === 'study') studyCount = g._count.id;
    else if (g.studyGroup === 'control') controlCount = g._count.id;
    else awaitingAssignment += g._count.id;
  });

  const totalEnrolled = studyCount + controlCount + awaitingAssignment;

  // Onboarding status count
  const onboardedCount = await prisma.motherProfile.count({
    where: {
      ...where,
      onboardingCompletedAt: { not: null },
    },
  });

  const pendingCount = totalEnrolled - onboardedCount;
  const onboardedPct = totalEnrolled > 0 ? Number(((onboardedCount / totalEnrolled) * 100).toFixed(1)) : 0;

  // Active in last 7 days (Study group only)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const studyMothers = await prisma.motherProfile.findMany({
    where: {
      ...where,
      studyGroup: 'study',
    },
    select: { id: true },
  });
  const studyMotherIds = studyMothers.map((m) => m.id);

  let activeLastSevenDays = 0;
  if (studyMotherIds.length > 0) {
    const activeMothers = await prisma.dailyLog.groupBy({
      by: ['motherProfileId'],
      where: {
        motherProfileId: { in: studyMotherIds },
        careDate: { gte: sevenDaysAgo },
      },
    });
    activeLastSevenDays = activeMothers.length;
  }

  // Open / Acknowledged Danger Sign alerts count
  const filteredMothers = await prisma.motherProfile.findMany({
    where,
    select: { id: true },
  });
  const filteredMotherIds = filteredMothers.map((m) => m.id);

  let openDangerSignCount = 0;
  if (filteredMotherIds.length > 0) {
    openDangerSignCount = await prisma.dangerSignAlert.count({
      where: {
        motherProfileId: { in: filteredMotherIds },
        status: { in: ['OPEN', 'ACKNOWLEDGED'] },
      },
    });
  }

  // Overdue checkpoints
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueSchedules = await prisma.followUpSchedule.findMany({
    where: {
      motherProfileId: { in: filteredMotherIds },
      status: 'pending',
      scheduledDate: { lt: today },
    },
    include: {
      motherProfile: {
        select: {
          id: true,
          participantCode: true,
          hospital: { select: { name: true } },
        },
      },
    },
  });

  const overdueMap: Record<
    string,
    { id: string; participantCode: string; hospitalName: string; overdueCheckpoints: string[] }
  > = {};

  overdueSchedules.forEach((sched) => {
    const id = sched.motherProfileId;
    if (!overdueMap[id]) {
      overdueMap[id] = {
        id,
        participantCode: sched.motherProfile.participantCode ?? 'UNKNOWN',
        hospitalName: sched.motherProfile.hospital?.name ?? 'Unknown Hospital',
        overdueCheckpoints: [],
      };
    }
    overdueMap[id].overdueCheckpoints.push(sched.timePoint);
  });

  const overdueParticipants = Object.values(overdueMap);
  const overdueCheckpointCount = overdueSchedules.length;

  return {
    totalEnrolled,
    studyCount,
    controlCount,
    awaitingAssignment,
    onboardedCount,
    pendingCount,
    onboardedPct,
    activeLastSevenDays,
    openDangerSignCount,
    overdueCheckpointCount,
    overdueParticipants,
  };
}

/**
 * Task 5: Enrollment Trend
 */
export async function getEnrollmentTrend(filter: CohortFilter) {
  const baseWhere = buildWhereClause(filter);
  const where = await applyEngagementTierFilter(baseWhere, filter.engagementTier);

  const filteredMothers = await prisma.motherProfile.findMany({
    where,
    select: { enrolledAt: true },
    orderBy: { enrolledAt: 'asc' },
  });

  if (filteredMothers.length === 0) {
    return { weeks: [], target: 272 };
  }

  // Group enrollments by ISO week (Monday start)
  const weekMap: Record<string, number> = {};

  filteredMothers.forEach((m) => {
    const d = new Date(m.enrolledAt);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const weekKey = monday.toISOString().split('T')[0];

    weekMap[weekKey] = (weekMap[weekKey] || 0) + 1;
  });

  const sortedWeeks = Object.keys(weekMap).sort();
  let cumulative = 0;

  const weeks = sortedWeeks.map((weekStart) => {
    const newEnrollments = weekMap[weekStart];
    cumulative += newEnrollments;
    return {
      weekStart,
      newEnrollments,
      cumulative,
    };
  });

  return { weeks, target: 272 };
}

/**
 * Task 5: Assessment Completion Rates
 */
export async function getAssessmentCompletion(filter: CohortFilter) {
  const baseWhere = buildWhereClause(filter);
  const where = await applyEngagementTierFilter(baseWhere, filter.engagementTier);

  const filteredMothers = await prisma.motherProfile.findMany({
    where,
    select: { id: true },
  });
  const motherIds = filteredMothers.map((m) => m.id);

  if (motherIds.length === 0) {
    return { rates: [] };
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Fetch due schedules
  const dueSchedules = await prisma.followUpSchedule.findMany({
    where: {
      motherProfileId: { in: motherIds },
      scheduledDate: { lte: today },
    },
    select: { motherProfileId: true, timePoint: true },
  });

  // Count due per checkpoint
  const dueByCheckpoint: Record<string, number> = {};
  dueSchedules.forEach((s) => {
    dueByCheckpoint[s.timePoint] = (dueByCheckpoint[s.timePoint] || 0) + 1;
  });

  // Fetch completed assessment counts per checkpoint
  const [knowledge, who5, psoc, tdsc, breastfeeding] = await Promise.all([
    prisma.knowledgeAssessment.groupBy({
      by: ['timePoint'],
      where: { motherProfileId: { in: motherIds } },
      _count: { id: true },
    }),
    prisma.who5Assessment.groupBy({
      by: ['timePoint'],
      where: { motherProfileId: { in: motherIds } },
      _count: { id: true },
    }),
    prisma.psocAssessment.groupBy({
      by: ['timePoint'],
      where: { motherProfileId: { in: motherIds } },
      _count: { id: true },
    }),
    prisma.tdscAssessment.groupBy({
      by: ['timePoint'],
      where: { motherProfileId: { in: motherIds } },
      _count: { id: true },
    }),
    prisma.breastfeedingAssessment.groupBy({
      by: ['timePoint'],
      where: { motherProfileId: { in: motherIds } },
      _count: { id: true },
    }),
  ]);

  const mapToDict = (items: { timePoint: string; _count: { id: number } }[]) => {
    const dict: Record<string, number> = {};
    items.forEach((i) => {
      dict[i.timePoint] = i._count.id;
    });
    return dict;
  };

  const completedMap: Record<string, Record<string, number>> = {
    knowledge_mcq: mapToDict(knowledge),
    who5: mapToDict(who5),
    psoc: mapToDict(psoc),
    tdsc: mapToDict(tdsc),
    breastfeeding: mapToDict(breastfeeding),
  };

  const checkpoints = ['baseline', '1_month', '3_month', '6_month'];
  const instruments = ['knowledge_mcq', 'who5', 'psoc', 'tdsc', 'breastfeeding'];

  const rates: { checkpoint: string; instrument: string; due: number; completed: number; pct: number }[] = [];

  checkpoints.forEach((checkpoint) => {
    const due = dueByCheckpoint[checkpoint] || 0;
    instruments.forEach((instrument) => {
      const completed = completedMap[instrument]?.[checkpoint] || 0;
      const pct = due > 0 ? Number(((completed / due) * 100).toFixed(1)) : 0;
      rates.push({
        checkpoint,
        instrument,
        due,
        completed,
        pct,
      });
    });
  });

  return { rates };
}

/**
 * Task 6: Engagement Trend (Study group only)
 */
export async function getEngagementTrend(filter: CohortFilter) {
  const baseWhere = buildWhereClause(filter);
  const where = await applyEngagementTierFilter(
    { ...baseWhere, studyGroup: 'study' },
    filter.engagementTier
  );

  const studyMothers = await prisma.motherProfile.findMany({
    where,
    select: { id: true },
  });
  const motherIds = studyMothers.map((m) => m.id);

  if (motherIds.length === 0) {
    return { weeks: [] };
  }

  const logs = await prisma.dailyLog.findMany({
    where: { motherProfileId: { in: motherIds } },
    select: {
      careDate: true,
      breastfeedingDone: true,
      kmcDone: true,
      temperatureDone: true,
      weightCheckDone: true,
      skinCordCareDone: true,
      sleepDone: true,
      stoolDone: true,
    },
  });

  // Group by ISO week (Monday start)
  const weekStats: Record<string, { totalDays: number; activeDays: number }> = {};

  logs.forEach((log) => {
    const d = new Date(log.careDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const weekKey = monday.toISOString().split('T')[0];

    if (!weekStats[weekKey]) {
      weekStats[weekKey] = { totalDays: 0, activeDays: 0 };
    }

    weekStats[weekKey].totalDays += 1;
    const completedCount = [
      log.breastfeedingDone,
      log.kmcDone,
      log.temperatureDone,
      log.weightCheckDone,
      log.skinCordCareDone,
      log.sleepDone,
      log.stoolDone,
    ].filter(Boolean).length;

    if (completedCount >= 5) {
      weekStats[weekKey].activeDays += 1;
    }
  });

  const sortedWeeks = Object.keys(weekStats).sort();
  const weeks = sortedWeeks.map((weekStart) => {
    const stat = weekStats[weekStart];
    const meanEngagementPct = stat.totalDays > 0 ? Number(((stat.activeDays / stat.totalDays) * 100).toFixed(1)) : 0;
    return {
      weekStart,
      meanEngagementPct,
    };
  });

  return { weeks };
}

/**
 * Task 6: Site Comparison
 */
export async function getSiteComparison(filter: CohortFilter) {
  const hospitals = await prisma.hospital.findMany({
    where: filter.hospitalId ? { id: filter.hospitalId } : { isActive: true },
    select: { id: true, name: true },
  });

  const baseWhere = buildWhereClause(filter);
  const where = await applyEngagementTierFilter(baseWhere, filter.engagementTier);

  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 27);
  twentyEightDaysAgo.setHours(0, 0, 0, 0);

  const sites = await Promise.all(
    hospitals.map(async (h) => {
      const siteWhere = { ...where, hospitalId: h.id };

      const groupCounts = await prisma.motherProfile.groupBy({
        by: ['studyGroup'],
        where: siteWhere,
        _count: { id: true },
      });

      let studyCount = 0;
      let controlCount = 0;

      groupCounts.forEach((g) => {
        if (g.studyGroup === 'study') studyCount = g._count.id;
        else if (g.studyGroup === 'control') controlCount = g._count.id;
      });

      // Study group mean engagement
      const studyMothers = await prisma.motherProfile.findMany({
        where: { ...siteWhere, studyGroup: 'study' },
        select: { id: true },
      });
      const studyIds = studyMothers.map((m) => m.id);

      let meanEngagementPct = 0;
      if (studyIds.length > 0) {
        const logs = await prisma.dailyLog.findMany({
          where: {
            motherProfileId: { in: studyIds },
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

        const scores = studyIds.map((id) => computeEngagementScore(logsByMother[id] || []));
        const totalScore = scores.reduce((sum, val) => sum + val, 0);
        meanEngagementPct = Number((totalScore / studyIds.length).toFixed(1));
      }

      // Assessment completion percentage
      const allMothers = await prisma.motherProfile.findMany({
        where: siteWhere,
        select: { id: true },
      });
      const allIds = allMothers.map((m) => m.id);

      let assessmentCompletionPct = 0;
      if (allIds.length > 0) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const dueCount = await prisma.followUpSchedule.count({
          where: {
            motherProfileId: { in: allIds },
            scheduledDate: { lte: today },
          },
        });

        if (dueCount > 0) {
          const [k, w, p] = await Promise.all([
            prisma.knowledgeAssessment.count({ where: { motherProfileId: { in: allIds } } }),
            prisma.who5Assessment.count({ where: { motherProfileId: { in: allIds } } }),
            prisma.psocAssessment.count({ where: { motherProfileId: { in: allIds } } }),
          ]);
          const completedTotal = k + w + p;
          assessmentCompletionPct = Number(((completedTotal / (dueCount * 3)) * 100).toFixed(1));
        }
      }

      return {
        hospitalId: h.id,
        hospitalName: h.name,
        studyCount,
        controlCount,
        meanEngagementPct,
        assessmentCompletionPct,
      };
    })
  );

  return { sites };
}

/**
 * Task 7: Outcome Scores (WHO-5, PSOC, Knowledge MCQ)
 */
export async function getOutcomeScores(filter: CohortFilter) {
  const baseWhere = buildWhereClause(filter);
  const where = await applyEngagementTierFilter(baseWhere, filter.engagementTier);

  const studyMothers = await prisma.motherProfile.findMany({
    where: { ...where, studyGroup: 'study' },
    select: { id: true },
  });
  const studyIds = studyMothers.map((m) => m.id);

  const checkpoints = ['baseline', '1_month', '3_month', '6_month'];

  const getGroupedScores = async (
    model: 'who5Assessment' | 'psocAssessment' | 'knowledgeAssessment',
    scoreField: 'percentageScore' | 'totalScore' | 'score'
  ) => {
    if (studyIds.length === 0) {
      return checkpoints.map((checkpoint) => ({
        checkpoint,
        study: { mean: null, n: 0, sparse: true },
        control: null,
      }));
    }

    const prismaModel = prisma[model] as any;
    const aggregated = await prismaModel.groupBy({
      by: ['timePoint'],
      where: { motherProfileId: { in: studyIds } },
      _avg: { [scoreField]: true },
      _count: { id: true },
    });

    const aggMap: Record<string, { mean: number | null; n: number }> = {};
    aggregated.forEach((a: any) => {
      aggMap[a.timePoint] = {
        mean: a._avg[scoreField] !== null ? Number(a._avg[scoreField].toFixed(1)) : null,
        n: a._count.id,
      };
    });

    return checkpoints.map((checkpoint) => {
      const data = aggMap[checkpoint] || { mean: null, n: 0 };
      const sparse = data.n < 5;
      return {
        checkpoint,
        study: {
          mean: sparse ? null : data.mean,
          n: data.n,
          ...(sparse ? { sparse: true } : {}),
        },
        control: null,
      };
    });
  };

  const [who5, psoc, knowledge] = await Promise.all([
    getGroupedScores('who5Assessment', 'percentageScore'),
    getGroupedScores('psocAssessment', 'totalScore'),
    getGroupedScores('knowledgeAssessment', 'score'),
  ]);

  return { who5, psoc, knowledge };
}
