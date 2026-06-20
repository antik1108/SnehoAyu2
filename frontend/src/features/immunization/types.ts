export interface VaccineEntry {
  vaccineId: string;
  name: string;
  dueDate: string;
  completedDate: string | null;
  batchNumber: string | null;
  administeredBy: string | null;
  status: 'pending' | 'completed';
  description: string;
  sideEffects: string;
}

export interface ImmunizationScheduleResponse {
  progressPercent: number;
  totalCount: number;
  completedCount: number;
  vaccines: VaccineEntry[];
}
