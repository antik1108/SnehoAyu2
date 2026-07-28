import api from '../../lib/api';
import type {
  AdminArticle,
  ArticleListAdminResponse,
  CreateArticleInput,
  UpdateArticleInput,
  UploadResponse,
} from './types';

export async function adminFetchArticles(params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}): Promise<ArticleListAdminResponse> {
  const res = await api.get<{ success: boolean; data: ArticleListAdminResponse }>(
    '/admin/learning',
    { params }
  );
  return res.data.data;
}

export async function adminFetchArticle(id: string): Promise<AdminArticle> {
  const res = await api.get<{ success: boolean; data: AdminArticle }>(`/admin/learning/${id}`);
  return res.data.data;
}

export async function createArticle(input: CreateArticleInput): Promise<AdminArticle> {
  const res = await api.post<{ success: boolean; data: AdminArticle }>('/admin/learning', input);
  return res.data.data;
}

export async function updateArticle(id: string, input: UpdateArticleInput): Promise<AdminArticle> {
  const res = await api.put<{ success: boolean; data: AdminArticle }>(
    `/admin/learning/${id}`,
    input
  );
  return res.data.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/admin/learning/${id}`);
}

export async function uploadMedia(formData: FormData): Promise<UploadResponse> {
  const res = await api.post<{ success: boolean; data: UploadResponse }>(
    '/admin/learning/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data.data;
}
