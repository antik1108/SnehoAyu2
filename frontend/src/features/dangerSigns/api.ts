import api from '../../lib/api';
import type { DangerSignCheckResponse, SymptomCode } from './types';

export async function checkDangerSigns(
  symptoms: SymptomCode[],
): Promise<DangerSignCheckResponse> {
  const body = symptoms.map((code) => ({ code }));
  const res = await api.post<DangerSignCheckResponse>('/danger-signs/check', body);
  return res.data;
}
