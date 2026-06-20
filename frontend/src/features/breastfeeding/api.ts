import api from '../../lib/api';
import type { BreastfeedingResponses, BreastfeedingSubmissionResult } from './types';

export async function submitBreastfeedingAssessment(
  timePoint: string,
  responses: BreastfeedingResponses
): Promise<BreastfeedingSubmissionResult> {
  const res = await api.post<{ success: boolean; data: BreastfeedingSubmissionResult }>('/breastfeeding/submit', {
    timePoint,
    responses,
  });
  return res.data.data;
}
