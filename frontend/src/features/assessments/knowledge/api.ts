import api from '../../../lib/api';
import type {
  KnowledgeQuestionsResponse,
  KnowledgeStatus,
  KnowledgeSubmissionResult,
  KnowledgeSubmitInput,
  KnowledgeTimePoint,
} from './types';

export async function getKnowledgeQuestions(
  timePoint: KnowledgeTimePoint,
  language: string
): Promise<KnowledgeQuestionsResponse> {
  const response = await api.get<{ success: boolean; data: KnowledgeQuestionsResponse }>(
    '/assessments/knowledge/questions',
    { params: { timePoint, lang: language } }
  );
  return response.data.data;
}

export async function getKnowledgeStatus(timePoint: KnowledgeTimePoint): Promise<KnowledgeStatus> {
  const response = await api.get<{ success: boolean; data: KnowledgeStatus }>(
    '/assessments/knowledge/status',
    { params: { timePoint } }
  );
  return response.data.data;
}

export async function getKnowledgeSubmission(timePoint: KnowledgeTimePoint): Promise<KnowledgeSubmissionResult> {
  const response = await api.get<{ success: boolean; data: KnowledgeSubmissionResult }>(
    `/assessments/knowledge/${timePoint}`
  );
  return response.data.data;
}

export async function submitKnowledgeAssessment(input: KnowledgeSubmitInput): Promise<KnowledgeSubmissionResult> {
  const response = await api.post<{ success: boolean; data: KnowledgeSubmissionResult }>(
    '/assessments/knowledge',
    input
  );
  return response.data.data;
}
