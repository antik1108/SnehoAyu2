import api from '../../../lib/api';
import type { KnowledgeTimePoint } from '../knowledge/types';
import type { Who5QuestionsResponse, Who5Result, Who5Status, Who5SubmitInput } from './types';

export async function getWho5Questions(timePoint: KnowledgeTimePoint, language: string): Promise<Who5QuestionsResponse> {
  const response = await api.get<{ success: boolean; data: Who5QuestionsResponse }>(
    '/assessments/who5/questions',
    { params: { timePoint, lang: language } }
  );
  return response.data.data;
}

export async function getWho5Status(timePoint: KnowledgeTimePoint): Promise<Who5Status> {
  const response = await api.get<{ success: boolean; data: Who5Status }>(
    '/assessments/who5/status',
    { params: { timePoint } }
  );
  return response.data.data;
}

export async function getWho5Result(timePoint: KnowledgeTimePoint): Promise<Who5Result> {
  const response = await api.get<{ success: boolean; data: Who5Result }>(`/assessments/who5/${timePoint}`);
  return response.data.data;
}

export async function submitWho5Assessment(input: Who5SubmitInput): Promise<Who5Result> {
  const response = await api.post<{ success: boolean; data: Who5Result }>('/assessments/who5', input);
  return response.data.data;
}
