import api from '../../lib/api';

export interface CareInsight {
  message: string;
  hasFlag: boolean;
  generatedAt: string;
}

export async function generateCareInsight(question?: string): Promise<CareInsight> {
  const res = await api.post<{ success: boolean; data: CareInsight }>('/insights/generate', question ? { question } : {});
  return res.data.data;
}
