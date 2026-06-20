export type GrowthTimePoint = 'baseline' | '1_month' | '3_months' | '6_months';

export interface CreateGrowthReadingInput {
  readingDate?: string;
  weightGrams: number;
  lengthCm: number;
  headCircumferenceCm: number;
  timePoint?: GrowthTimePoint | null;
  notes?: string | null;
}

export interface GrowthAge {
  days: number;
  weeks: number;
}

export interface GrowthReading {
  readingDate: string | null;
  weightGrams: number | null;
  lengthCm: number | null;
  headCircumferenceCm: number | null;
  chronologicalAge?: GrowthAge;
  correctedAge?: GrowthAge;
  timePoint?: GrowthTimePoint | null;
  source: 'manual' | 'growth' | 'discharge' | 'none';
  notes?: string | null;
  createdAt?: string;
}

export interface GrowthHistoryResponse {
  baseline: GrowthReading | null;
  readings: GrowthReading[];
}

export interface GrowthLatestResponse {
  source: 'growth' | 'discharge' | 'none';
  readingDate: string | null;
  weightGrams: number | null;
  lengthCm: number | null;
  headCircumferenceCm: number | null;
  chronologicalAge?: GrowthAge;
  correctedAge?: GrowthAge;
}
