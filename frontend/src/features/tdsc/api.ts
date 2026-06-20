import api from '../../lib/api';
import type { TdscItemsResponse, TdscResult, TdscSubmissionResult } from './types';

export async function getTdscItems(): Promise<TdscItemsResponse> {
  const res = await api.get<{ success: boolean; data: TdscItemsResponse }>('/tdsc/items');
  return res.data.data;
}

export async function submitTdscAssessment(
  timePoint: string,
  results: Record<string, TdscResult>
): Promise<TdscSubmissionResult> {
  const res = await api.post<{ success: boolean; data: TdscSubmissionResult }>('/tdsc/submit', {
    timePoint,
    results,
  });
  return res.data.data;
}
