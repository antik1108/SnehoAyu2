export interface Hospital {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  type: string;
  emergencyPhone: string | null;
  isActive: boolean;
  participantCount?: number;
  nurseCount?: number;
}

export interface HospitalNurse {
  id: string;
  fullName: string;
  employeeId: string | null;
  phone: string;
  isActive: boolean;
  lastLoginAt: string | null;
}

export interface HospitalDetail {
  hospital: Hospital;
  nurses: HospitalNurse[];
  participants: ParticipantListItem[];
}

export interface ParticipantListItem {
  id: string;
  participantCode: string | null;
  studyGroup: 'study' | 'control' | null;
  hospital: { id: string; name: string; code: string } | null;
  birthWeightStratum: string | null;
  enrolledAt: string;
  onboardingCompletedAt: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  followUpSchedules: Array<{ timePoint: string; status: string; scheduledDate: string }>;
  daysSinceEnrollment: number;
  lastActiveDate: string | null;
  engagementScore: number | null;
  engagementTier: 'high' | 'medium' | 'low' | 'inactive' | null;
  nextCheckpoint: { timePoint: string; scheduledDate: string; status: string } | null;
  isOverdue: boolean;
  isDueSoon: boolean;
  hasDangerSignFlag: boolean;
}

export interface DangerSignAlertItem {
  id: string;
  raisedAt: string;
  category: string;
  description: string | null;
  notes?: string | null;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
}

export interface DailyLog30DayItem {
  careDate: string;
  completedCount: number;
  hasLog?: boolean;
  dangerSignsReviewed?: boolean;
}

export interface GrowthReading {
  readingDate: string;
  weightGrams: number;
  lengthCm: string | number;
  headCircumferenceCm: string | number;
  correctedAgeWeeks?: number;
  timePoint?: string;
  source?: string;
}

export interface BabyProfile {
  babyName: string | null;
  sex: string;
  dateOfBirth: string;
  gestationalAgeWeeks: string;
  birthWeightGrams: number;
  birthWeightStratum: string;
  weightAtDischargeGrams?: number;
}

export interface ParticipantDetail {
  id: string;
  fullName: string | null;
  participantCode: string | null;
  studyGroup: 'study' | 'control' | null;
  ageRange: string;
  contactNumber: string | null;
  enrolledAt: string;
  daysSinceEnrollment: number;
  lastActiveDate: string | null;
  onboardingCompletedAt: string | null;
  hospital: { name: string; code: string } | null;
  babyProfile: BabyProfile | null;
  followUpSchedules: Array<{ timePoint: string; status: string; scheduledDate: string }>;
  growthReadings: GrowthReading[];
  knowledgeAssessments: Array<{ timePoint: string; score: number; maxScore: number; grade: string }>;
  who5Assessments: Array<{ timePoint: string; rawScore: number; percentageScore: number; poorWellbeingFlag: boolean }>;
  psocAssessments: Array<{ timePoint: string; totalScore: number; efficacyScore: number; satisfactionScore: number }>;
  tdscAssessments: Array<{ timePoint: string; suspectedDelay: boolean; assessmentDate: string }>;
  vaccineRecords: Array<{ vaccineName: string; dueDate: string; completedDate: string | null; status: string }>;
  breastfeedingAssessments: Array<{ timePoint: string; totalScore: number; grade: string }>;
  dailyLogs30Day: DailyLog30DayItem[];
  engagementScore: number | null;
  engagementTier: 'high' | 'medium' | 'low' | 'inactive' | null;
  dangerSignAlerts: DangerSignAlertItem[];
}
