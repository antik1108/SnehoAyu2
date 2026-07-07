// Source: KB §4.1–4.2 — Danger Sign Rules Engine

export const SYMPTOM_CODES = [
  'cold_and_feeding_poorly',
  'breathing_abnormal',
  'gasping_noisy_breathing',
  'blue_discoloration',
  'feels_cold',
  'fever',
  'cord_infection_signs',
  'convulsions',
  'limp_floppy',
  'lethargic',
  'eye_discharge',
  'jaundice',
  'excessive_sleepiness',
  'watery_stool',
  'persistent_vomiting',
  'poor_feeding',
] as const;

export type SymptomCode = typeof SYMPTOM_CODES[number];

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';

export interface DangerSignResult {
  severity: Severity;
  message: string;
  showEmergencyCallButton: boolean;
  notifyResearchTeam: boolean;
  triggeredBy: SymptomCode[];
}

export interface DangerSignCheckResponse {
  success: true;
  data: DangerSignResult;
}
