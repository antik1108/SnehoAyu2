export type DashboardOnboardingState =
  | 'complete'
  | 'mother_profile_required'
  | 'baby_profile_required'
  | 'hospital_link_required'
  | 'participant_code_required'
  | 'onboarding_incomplete';

export interface DashboardHomeResponse {
  status: 'ok';
  data: DashboardHomeData;
}

export interface DashboardHomeData {
  onboardingState: DashboardOnboardingState;
  baby: DashboardBabySummary | null;
  participant: DashboardParticipantSummary | null;
  hospital: DashboardHospitalSummary | null;
  careToday: DashboardCareTodaySummary;
  feeding: DashboardFeedingSummary;
  healthStats: DashboardHealthStats;
  nextReminder: DashboardReminderSummary;
  dailyMessage: DashboardDailyMessage;
}

export interface DashboardBabySummary {
  name: string | null;
  displayName: string;
  sex: 'male' | 'female';
  dateOfBirth: string;
  dischargeDate: string;
  gestationalAgeWeeks: number;
  chronologicalAgeDays: number;
  chronologicalAgeWeeks: number;
  correctedAgeDays: number;
  correctedAgeWeeks: number;
  ageDisplay: string;
  correctedAgeDisplay: string;
  latestWeightGrams: number | null;
  latestWeightSource: 'discharge' | 'growth' | 'none';
}

export interface DashboardParticipantSummary {
  participantCode: string;
  studyGroup: 'study' | 'control';
}

export interface DashboardHospitalSummary {
  code: string;
  name: string;
  emergencyPhone: string | null;
}

export interface DashboardCareTodaySummary {
  date: string;
  available: boolean;
  completedCount: number;
  totalCount: number;
  completionPercent: number;
  source: 'daily_log' | 'not_configured';
}

export interface DashboardFeedingSummary {
  available: boolean;
  completedFeeds: number | null;
  targetFeedsMin: number;
  targetFeedsMax: number;
  source: 'daily_log' | 'not_configured';
}

export interface DashboardHealthStats {
  lastTemperatureC: number | null;
  lastWeightGrams: number | null;
  lastSpO2Percent: number | null;
  weightSource: 'discharge' | 'growth' | 'none';
}

export interface DashboardReminderSummary {
  type: 'follow_up' | 'vaccination' | 'none';
  title: string | null;
  date: string | null;
  daysRemaining: number | null;
  status: string | null;
}

export interface DashboardDailyMessage {
  available: boolean;
  text: string | null;
  language: 'bn' | 'hi' | 'en';
  source: 'message_scheduler' | 'not_configured';
}
