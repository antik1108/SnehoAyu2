export interface TdscItem {
  id: number;
  task: string;
  lowerLimitDays: number;
  upperLimitDays: number;
}

export type TdscResult = 'pass' | 'fail';

export interface TdscItemsResponse {
  correctedAgeDays: number;
  items: TdscItem[];
}

export interface TdscSubmissionResult {
  timePoint: string;
  assessmentDate: string;
  suspectedDelay: boolean;
  results: Record<string, TdscResult>;
  locked: boolean;
}
