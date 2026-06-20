import api from '../../lib/api';
import { normalizeApiError } from '../../lib/apiError';
import type { DashboardHomeResponse } from './types';

export async function getDashboardHome(): Promise<DashboardHomeResponse> {
  try {
    const response = await api.get<DashboardHomeResponse>('/dashboard/home');
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}
