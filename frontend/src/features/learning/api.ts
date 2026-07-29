import api from '../../lib/api';
import type { ArticleDetail, ArticleListResponse } from './types';

export async function fetchArticles(filters?: {
  category?: string;
  search?: string;
}): Promise<ArticleListResponse> {
  const res = await api.get<{ success: boolean; data: ArticleListResponse }>('/learning', {
    params: { limit: 500, ...filters },
  });
  return res.data.data;
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail> {
  const res = await api.get<{ success: boolean; data: ArticleDetail }>(`/learning/${slug}`);
  return res.data.data;
}
