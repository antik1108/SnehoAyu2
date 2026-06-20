import axios from 'axios';
import api from '../../lib/api';
import { TodayChecklist, ChecklistLogInput, ChecklistHistory } from './types';
import { queueChecklistUpdate, flushChecklistQueue } from '../../lib/offlineQueue';

export async function getTodayChecklist(): Promise<TodayChecklist> {
  const response = await api.get<{ success: boolean; data: TodayChecklist }>('/checklist/today');
  return response.data.data;
}

async function sendChecklistUpdate(input: unknown): Promise<TodayChecklist> {
  const response = await api.post<{ success: boolean; data: TodayChecklist }>('/checklist/log', input);
  return response.data.data;
}

export async function updateTodayChecklist(input: ChecklistLogInput): Promise<TodayChecklist> {
  try {
    return await sendChecklistUpdate(input);
  } catch (err) {
    const isOffline = !navigator.onLine || (axios.isAxiosError(err) && err.code === 'ERR_NETWORK');
    if (isOffline) {
      await queueChecklistUpdate(input);
    }
    throw err;
  }
}

export function syncOfflineChecklistQueue(): Promise<void> {
  return flushChecklistQueue((payload) => sendChecklistUpdate(payload));
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void syncOfflineChecklistQueue();
  });
}

export async function getChecklistHistory(days: 7 | 30): Promise<ChecklistHistory> {
  const response = await api.get<{ success: boolean; data: ChecklistHistory }>(`/checklist/history?days=${days}`);
  return response.data.data;
}
