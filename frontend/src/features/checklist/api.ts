import api from '../../lib/api';
import { TodayChecklist, ChecklistLogInput, ChecklistHistory } from './types';

export async function getTodayChecklist(): Promise<TodayChecklist> {
  const response = await api.get<{ success: boolean; data: TodayChecklist }>('/checklist/today');
  return response.data.data;
}

export async function updateTodayChecklist(input: ChecklistLogInput): Promise<TodayChecklist> {
  const response = await api.post<{ success: boolean; data: TodayChecklist }>('/checklist/log', input);
  return response.data.data;
}

export async function getChecklistHistory(days: 7 | 30): Promise<ChecklistHistory> {
  const response = await api.get<{ success: boolean; data: ChecklistHistory }>(`/checklist/history?days=${days}`);
  return response.data.data;
}
