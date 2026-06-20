import api from '../../lib/api';

export interface MessageHistoryItem {
  deliveredAt: string;
  channel: string;
  text: string | null;
}

export async function getMessageHistory(): Promise<MessageHistoryItem[]> {
  const res = await api.get<{ success: boolean; data: MessageHistoryItem[] }>('/messages/history');
  return res.data.data;
}
