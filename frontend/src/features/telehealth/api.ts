import api from '../../lib/api';

export interface ActiveTelehealthSession {
  id: string;
  scheduledAt: string | null;
}

export async function getActiveTelehealthSession(): Promise<ActiveTelehealthSession | null> {
  const res = await api.get<{ success: boolean; data: ActiveTelehealthSession | null }>('/telehealth/active');
  return res.data.data;
}

export async function scheduleTelehealthSession(motherProfileId: string): Promise<void> {
  await api.post('/telehealth/session', { motherProfileId });
}
