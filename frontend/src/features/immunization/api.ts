import api from '../../lib/api';
import type { ImmunizationScheduleResponse } from './types';

export async function getImmunizationSchedule(): Promise<ImmunizationScheduleResponse> {
  const res = await api.get<{ success: boolean; data: ImmunizationScheduleResponse }>('/immunization/schedule');
  return res.data.data;
}

export async function markVaccineComplete(vaccineId: string): Promise<void> {
  await api.post('/immunization/mark-complete', { vaccineId });
}
