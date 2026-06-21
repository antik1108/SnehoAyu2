import api from '../../lib/api';
import type { Hospital, ParticipantDetail, ParticipantListItem } from '../admin/types';

export interface NurseDashboard {
  hospital: Hospital;
  stats: { totalEnrolled: number; onboardedCount: number; pendingCount: number };
  participants: ParticipantListItem[];
}

export async function fetchNurseDashboard(): Promise<NurseDashboard> {
  const res = await api.get<{ success: boolean; data: NurseDashboard }>('/nurse/dashboard');
  return res.data.data;
}

export async function fetchNurseParticipantDetail(id: string): Promise<ParticipantDetail> {
  const res = await api.get<{ success: boolean; data: ParticipantDetail }>(`/nurse/participants/${id}`);
  return res.data.data;
}
