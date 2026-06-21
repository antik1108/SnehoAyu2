import api from '../../lib/api';

export interface QuestionContent {
  id: string;
  order: number;
  text: string | null;
  topic?: string;
  contentStatus: string;
  options?: Array<{ id: string; text: string | null }>;
}

export interface ScaleOption {
  value: number;
  label: string;
}

async function getContent(path: string) {
  const res = await api.get<{ success: boolean; data: { contentReady: boolean; questions: QuestionContent[]; scale?: ScaleOption[] } }>(
    `/staff/content/${path}`,
    { params: { lang: 'en' } }
  );
  return res.data.data;
}

export const getKnowledgeContent = () => getContent('knowledge');
export const getWho5Content = () => getContent('who5');
export const getPsocContent = () => getContent('psoc');

export interface TdscItem {
  id: number;
  task: string;
  lowerLimitDays: number;
  upperLimitDays: number;
}

export async function getTdscItemsForStaff(motherProfileId: string): Promise<{ correctedAgeDays: number; items: TdscItem[] }> {
  const res = await api.get<{ success: boolean; data: { correctedAgeDays: number; items: TdscItem[] } }>(
    `/staff/participants/${motherProfileId}/tdsc`
  );
  return res.data.data;
}

export interface ImmunizationEntry {
  vaccineId: string;
  name: string;
  status: 'pending' | 'completed';
  dueDate: string;
}

export async function getImmunizationForStaff(motherProfileId: string) {
  const res = await api.get<{ success: boolean; data: { vaccines: ImmunizationEntry[] } }>(
    `/staff/participants/${motherProfileId}/immunization`
  );
  return res.data.data;
}

async function post(motherProfileId: string, path: string, body: unknown) {
  const res = await api.post<{ success: boolean; message: string; data: unknown }>(
    `/staff/participants/${motherProfileId}/${path}`,
    body
  );
  return res.data;
}

export const submitGrowthForStaff = (motherProfileId: string, body: { weightGrams: number; lengthCm: number; headCircumferenceCm: number; readingDate?: string }) =>
  post(motherProfileId, 'growth', body);

export const submitTdscForStaff = (motherProfileId: string, timePoint: string, results: Record<string, 'pass' | 'fail'>) =>
  post(motherProfileId, 'tdsc', { timePoint, results });

export const markVaccineCompleteForStaff = (motherProfileId: string, vaccineId: string) =>
  post(motherProfileId, 'immunization/mark-complete', { vaccineId });

export const submitBreastfeedingForStaff = (motherProfileId: string, timePoint: string, responses: Record<string, unknown>) =>
  post(motherProfileId, 'breastfeeding', { timePoint, responses });

export const submitKnowledgeForStaff = (motherProfileId: string, timePoint: string, responses: Record<string, string>) =>
  post(motherProfileId, 'knowledge', { timePoint, responses });

export const submitWho5ForStaff = (motherProfileId: string, timePoint: string, responses: Record<string, number>) =>
  post(motherProfileId, 'who5', { timePoint, responses });

export const submitPsocForStaff = (motherProfileId: string, timePoint: string, responses: Record<string, number>) =>
  post(motherProfileId, 'psoc', { timePoint, responses });
