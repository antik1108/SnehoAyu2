export interface ChecklistCompletion {
  completedCount: number;
  totalCount: number;
  percent: number;
}

export interface BreastfeedingItem {
  done: boolean;
  feedsCount: number | null;
  volumeMl: number | null;
}

export interface KmcItem {
  done: boolean;
  minutes: number | null;
}

export interface TemperatureItem {
  done: boolean;
  morningC: number | null;
  eveningC: number | null;
}

export interface WeightItem {
  done: boolean;
  grams: number | null;
  optional: true;
}

export interface SkinCordCareItem {
  done: boolean;
}

export interface MedicationItem {
  done: boolean | null;
  notes: string | null;
  optional: true;
}

export interface DangerSignsItem {
  reviewed: boolean;
}

export interface ChecklistItems {
  breastfeeding: BreastfeedingItem;
  kmc: KmcItem;
  temperature: TemperatureItem;
  weight: WeightItem;
  skinCordCare: SkinCordCareItem;
  medication: MedicationItem;
  dangerSigns: DangerSignsItem;
}

export interface TodayChecklist {
  careDate: string;
  completion: ChecklistCompletion;
  items: ChecklistItems;
}

export interface ChecklistHistoryRecord {
  careDate: string;
  completedCount: number;
  totalCount: number;
  completionPercent: number;
}

export interface ChecklistHistory {
  days: 7 | 30;
  records: ChecklistHistoryRecord[];
}

export interface ChecklistLogInput {
  breastfeeding?: {
    done?: boolean;
    feedsCount?: number | null;
    volumeMl?: number | null;
  };
  kmc?: {
    done?: boolean;
    minutes?: number | null;
  };
  temperature?: {
    done?: boolean;
    morningC?: number | null;
    eveningC?: number | null;
  };
  weight?: {
    done?: boolean;
    grams?: number | null;
  };
  skinCordCare?: {
    done?: boolean;
  };
  medication?: {
    done?: boolean | null;
    notes?: string | null;
  };
  dangerSigns?: {
    reviewed?: boolean;
  };
}
