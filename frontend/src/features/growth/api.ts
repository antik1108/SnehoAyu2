import api from '../../lib/api';
import type {
  CreateGrowthReadingInput,
  GrowthHistoryResponse,
  GrowthLatestResponse,
  GrowthReading,
  GrowthChartResponse,
  GrowthMetric,
} from './types';

export async function getGrowthHistory(limit = 30): Promise<GrowthHistoryResponse> {
  const response = await api.get<{ success: boolean; data: GrowthHistoryResponse }>('/growth/history', {
    params: { limit },
  });
  return response.data.data;
}

export async function getLatestGrowthReading(): Promise<GrowthLatestResponse> {
  const response = await api.get<{ success: boolean; data: GrowthLatestResponse }>('/growth/latest');
  return response.data.data;
}

export async function createGrowthReading(input: CreateGrowthReadingInput): Promise<GrowthReading> {
  const response = await api.post<{ success: boolean; data: GrowthReading }>('/growth/log', input);
  return response.data.data;
}

export async function getGrowthChart(metric: GrowthMetric): Promise<GrowthChartResponse> {
  const response = await api.get<{ success: boolean; data: GrowthChartResponse }>('/growth/chart', {
    params: { metric },
  });
  return response.data.data;
}
