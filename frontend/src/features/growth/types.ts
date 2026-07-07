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
  /** KB §7 narrative weight-gain validation note. null when source is discharge. */
  weightGainNote?: {
    flag: 'NORMAL' | 'REVIEW' | 'INFO';
    messageKey: string;
  } | null;
}

export type GrowthMetric = 'weight' | 'length' | 'headCircumference';

export interface PercentileCurvePoint {
  weeks: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

export interface GrowthChartReadingPoint {
  readingDate: string;
  correctedAgeWeeks: number;
  value: number;
  zScore?: number;
}

export interface GrowthChartResponse {
  metric: GrowthMetric;
  sex: 'male' | 'female';
  percentileCurve: PercentileCurvePoint[];
  readings: GrowthChartReadingPoint[];
  alert: boolean;
}
