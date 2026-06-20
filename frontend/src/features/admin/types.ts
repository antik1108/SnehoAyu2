export interface Hospital {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  type: string;
  emergencyPhone: string | null;
  isActive: boolean;
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
}

export interface ParticipantDetail {
  id: string;
  fullName: string | null;
  participantCode: string | null;
  studyGroup: 'study' | 'control' | null;
  ageRange: string;
  hospital: { name: string; code: string } | null;
  babyProfile: {
    babyName: string | null;
    sex: string;
    dateOfBirth: string;
    gestationalAgeWeeks: string;
    birthWeightGrams: number;
    birthWeightStratum: string;
  } | null;
  followUpSchedules: Array<{ timePoint: string; status: string; scheduledDate: string }>;
  growthReadings: Array<{ readingDate: string; weightGrams: number; lengthCm: string; headCircumferenceCm: string }>;
  knowledgeAssessments: Array<{ timePoint: string; score: number; maxScore: number; grade: string }>;
  who5Assessments: Array<{ timePoint: string; rawScore: number; percentageScore: number; poorWellbeingFlag: boolean }>;
  psocAssessments: Array<{ timePoint: string; totalScore: number; efficacyScore: number; satisfactionScore: number }>;
  tdscAssessments: Array<{ timePoint: string; suspectedDelay: boolean; assessmentDate: string }>;
  vaccineRecords: Array<{ vaccineName: string; dueDate: string; completedDate: string | null; status: string }>;
  breastfeedingAssessments: Array<{ timePoint: string; totalScore: number; grade: string }>;
}
