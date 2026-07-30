import api from '../../lib/api';
import type { ParticipantListItem, ParticipantDetail, Hospital, HospitalDetail } from './types';
import type { FilterState } from './FilterContext';

export async function fetchParticipants(filters?: Partial<FilterState>): Promise<ParticipantListItem[]> {
  const res = await api.get<{ success: boolean; data: ParticipantListItem[] }>('/admin/participants', {
    params: filters,
  });
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

export async function fetchHospitalDetail(id: string): Promise<HospitalDetail> {
  const res = await api.get<{ success: boolean; data: HospitalDetail }>(`/admin/hospitals/${id}`);
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

export async function downloadCohortExport(filters: Partial<FilterState>): Promise<void> {
  const res = await api.post('/admin/export/cohort', { filters }, { responseType: 'blob' });
  const dateStr = new Date().toISOString().split('T')[0];
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `snehoayu-cohort-export-${dateStr}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadParticipantExport(id: string, participantCode?: string): Promise<void> {
  const res = await api.get(`/admin/participants/${id}/export`, { responseType: 'blob' });
  const dateStr = new Date().toISOString().split('T')[0];
  const code = participantCode || id;
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `participant_${code}_${dateStr}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
