import api from '../../lib/api';
import type { ParticipantListItem, ParticipantDetail, Hospital } from './types';

export async function fetchParticipants(): Promise<ParticipantListItem[]> {
  const res = await api.get<{ success: boolean; data: ParticipantListItem[] }>('/admin/participants');
  return res.data.data;
}

export async function fetchParticipantDetail(id: string): Promise<ParticipantDetail> {
  const res = await api.get<{ success: boolean; data: ParticipantDetail }>(`/admin/participants/${id}`);
  return res.data.data;
}

export async function assignStudyGroup(
  participantId: string,
  studyGroup: 'study' | 'control'
): Promise<void> {
  await api.post(`/admin/participants/${participantId}/study-group`, { studyGroup });
}

export async function fetchHospitals(): Promise<Hospital[]> {
  const res = await api.get<{ success: boolean; data: Hospital[] }>('/admin/hospitals');
  return res.data.data;
}

export async function createHospital(input: {
  name: string;
  code: string;
  district: string;
  type: string;
  emergencyPhone?: string;
}): Promise<Hospital> {
  const res = await api.post<{ success: boolean; data: Hospital }>('/admin/hospitals', input);
  return res.data.data;
}

export async function updateHospital(
  id: string,
  input: Partial<Pick<Hospital, 'name' | 'district' | 'emergencyPhone' | 'isActive'>>
): Promise<Hospital> {
  const res = await api.patch<{ success: boolean; data: Hospital }>(`/admin/hospitals/${id}`, input);
  return res.data.data;
}

export async function downloadExport(anonymize: boolean): Promise<void> {
  const res = await api.get('/admin/export', {
    params: { anonymize },
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `snehoayu-export-${Date.now()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
