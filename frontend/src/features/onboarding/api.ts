import api from '../../lib/api';
import {
  MotherProfileInput,
  BabyProfileInput,
  HospitalInfo,
  ParticipantCodeAllocation,
  OnboardingCompletionResponse,
} from './types';

export async function saveMotherProfile(data: MotherProfileInput): Promise<unknown> {
  const res = await api.post('/onboarding/mother-profile', data);
  return res.data;
}

export async function saveBabyProfile(data: BabyProfileInput): Promise<unknown> {
  const res = await api.post('/onboarding/baby-profile', data);
  return res.data;
}

export async function linkHospital(code: string): Promise<{ success: boolean; data: HospitalInfo }> {
  const res = await api.post<{ success: boolean; data: HospitalInfo }>('/onboarding/hospital-code', { code });
  return res.data;
}

export async function getParticipantCode(): Promise<{ success: boolean; data: ParticipantCodeAllocation }> {
  const res = await api.get<{ success: boolean; data: ParticipantCodeAllocation }>('/onboarding/participant-code');
  return res.data;
}

export async function completeOnboarding(): Promise<OnboardingCompletionResponse> {
  const res = await api.post<OnboardingCompletionResponse>('/onboarding/complete', {});
  return res.data;
}
