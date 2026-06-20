import api from '../../../lib/api';
import type { KnowledgeTimePoint } from '../knowledge/types';
import type { PsocQuestionsResponse, PsocResult, PsocStatus, PsocSubmitInput } from './types';

export async function getPsocQuestions(timePoint: KnowledgeTimePoint, language: string): Promise<PsocQuestionsResponse> {
  const response = await api.get<{ success: boolean; data: PsocQuestionsResponse }>(
    '/assessments/psoc/questions',
    { params: { timePoint, lang: language } }
  );
  return response.data.data;
}

export async function getPsocStatus(timePoint: KnowledgeTimePoint): Promise<PsocStatus> {
  const response = await api.get<{ success: boolean; data: PsocStatus }>(
    '/assessments/psoc/status',
    { params: { timePoint } }
  );
  return response.data.data;
}

export async function getPsocResult(timePoint: KnowledgeTimePoint): Promise<PsocResult> {
  const response = await api.get<{ success: boolean; data: PsocResult }>(`/assessments/psoc/${timePoint}`);
  return response.data.data;
}

export async function submitPsocAssessment(input: PsocSubmitInput): Promise<PsocResult> {
  const response = await api.post<{ success: boolean; data: PsocResult }>('/assessments/psoc', input);
  return response.data.data;
}
