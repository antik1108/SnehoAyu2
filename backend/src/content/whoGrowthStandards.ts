/**
 * WHO Child Growth Standards reference points (0-26 weeks, by sex).
 * Mean (M) and standard deviation (SD) checkpoints for weight-for-age (kg),
 * length-for-age (cm), and head-circumference-for-age (cm), sourced from the
 * WHO Child Growth Standards tables. Values between checkpoints are linearly
 * interpolated — sufficient for an early-warning z-score flag, not a
 * replacement for the full LMS clinical tables.
 */

export type GrowthMetric = 'weight' | 'length' | 'headCircumference';
export type Sex = 'male' | 'female';

interface ReferencePoint {
  weeks: number;
  mean: number;
  sd: number;
}

const WEIGHT_KG: Record<Sex, ReferencePoint[]> = {
  male: [
    { weeks: 0, mean: 3.3, sd: 0.45 },
    { weeks: 2, mean: 3.9, sd: 0.5 },
    { weeks: 4, mean: 4.5, sd: 0.55 },
    { weeks: 8, mean: 5.6, sd: 0.65 },
    { weeks: 13, mean: 6.4, sd: 0.75 },
    { weeks: 17, mean: 7.0, sd: 0.82 },
    { weeks: 21, mean: 7.5, sd: 0.88 },
    { weeks: 26, mean: 7.9, sd: 0.93 },
  ],
  female: [
    { weeks: 0, mean: 3.2, sd: 0.43 },
    { weeks: 2, mean: 3.6, sd: 0.47 },
    { weeks: 4, mean: 4.2, sd: 0.52 },
    { weeks: 8, mean: 5.1, sd: 0.6 },
    { weeks: 13, mean: 5.8, sd: 0.7 },
    { weeks: 17, mean: 6.4, sd: 0.77 },
    { weeks: 21, mean: 6.9, sd: 0.82 },
    { weeks: 26, mean: 7.3, sd: 0.87 },
  ],
};

const LENGTH_CM: Record<Sex, ReferencePoint[]> = {
  male: [
    { weeks: 0, mean: 49.9, sd: 1.9 },
    { weeks: 2, mean: 52.6, sd: 2.0 },
    { weeks: 4, mean: 54.7, sd: 2.1 },
    { weeks: 8, mean: 58.4, sd: 2.2 },
    { weeks: 13, mean: 61.9, sd: 2.3 },
    { weeks: 17, mean: 64.6, sd: 2.4 },
    { weeks: 21, mean: 66.8, sd: 2.5 },
    { weeks: 26, mean: 68.6, sd: 2.6 },
  ],
  female: [
    { weeks: 0, mean: 49.1, sd: 1.9 },
    { weeks: 2, mean: 51.6, sd: 2.0 },
    { weeks: 4, mean: 53.7, sd: 2.1 },
    { weeks: 8, mean: 57.1, sd: 2.2 },
    { weeks: 13, mean: 60.6, sd: 2.3 },
    { weeks: 17, mean: 63.3, sd: 2.4 },
    { weeks: 21, mean: 65.5, sd: 2.5 },
    { weeks: 26, mean: 67.3, sd: 2.6 },
  ],
};

const HEAD_CIRCUMFERENCE_CM: Record<Sex, ReferencePoint[]> = {
  male: [
    { weeks: 0, mean: 34.5, sd: 1.3 },
    { weeks: 2, mean: 36.2, sd: 1.3 },
    { weeks: 4, mean: 37.3, sd: 1.3 },
    { weeks: 8, mean: 39.1, sd: 1.4 },
    { weeks: 13, mean: 40.6, sd: 1.4 },
    { weeks: 17, mean: 41.7, sd: 1.4 },
    { weeks: 21, mean: 42.6, sd: 1.4 },
    { weeks: 26, mean: 43.3, sd: 1.5 },
  ],
  female: [
    { weeks: 0, mean: 33.9, sd: 1.3 },
    { weeks: 2, mean: 35.5, sd: 1.3 },
    { weeks: 4, mean: 36.6, sd: 1.3 },
    { weeks: 8, mean: 38.3, sd: 1.3 },
    { weeks: 13, mean: 39.7, sd: 1.4 },
    { weeks: 17, mean: 40.7, sd: 1.4 },
    { weeks: 21, mean: 41.6, sd: 1.4 },
    { weeks: 26, mean: 42.2, sd: 1.4 },
  ],
};

const TABLES: Record<GrowthMetric, Record<Sex, ReferencePoint[]>> = {
  weight: WEIGHT_KG,
  length: LENGTH_CM,
  headCircumference: HEAD_CIRCUMFERENCE_CM,
};

/** Percentile bands rendered on the growth chart (3rd, 15th, 50th, 85th, 97th). */
export const PERCENTILE_Z_SCORES: Record<string, number> = {
  p3: -1.881,
  p15: -1.036,
  p50: 0,
  p85: 1.036,
  p97: 1.881,
};

function interpolate(points: ReferencePoint[], weeks: number): { mean: number; sd: number } {
  const clampedWeeks = Math.max(0, Math.min(weeks, points[points.length - 1].weeks));

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (clampedWeeks >= a.weeks && clampedWeeks <= b.weeks) {
      const t = b.weeks === a.weeks ? 0 : (clampedWeeks - a.weeks) / (b.weeks - a.weeks);
      return {
        mean: a.mean + t * (b.mean - a.mean),
        sd: a.sd + t * (b.sd - a.sd),
      };
    }
  }

  const last = points[points.length - 1];
  return { mean: last.mean, sd: last.sd };
}

export function getReferenceMeanSd(metric: GrowthMetric, sex: Sex, correctedAgeWeeks: number) {
  return interpolate(TABLES[metric][sex], correctedAgeWeeks);
}

export function calculateZScore(metric: GrowthMetric, sex: Sex, correctedAgeWeeks: number, value: number): number {
  const { mean, sd } = getReferenceMeanSd(metric, sex, correctedAgeWeeks);
  return Number(((value - mean) / sd).toFixed(2));
}

export function getPercentileCurve(metric: GrowthMetric, sex: Sex, maxWeeks = 26) {
  const points = TABLES[metric][sex];
  const weeksSeries = Array.from({ length: maxWeeks + 1 }, (_, i) => i);

  return weeksSeries.map((weeks) => {
    const { mean, sd } = interpolate(points, weeks);
    return {
      weeks,
      p3: Number((mean + PERCENTILE_Z_SCORES['p3'] * sd).toFixed(2)),
      p15: Number((mean + PERCENTILE_Z_SCORES['p15'] * sd).toFixed(2)),
      p50: Number((mean + PERCENTILE_Z_SCORES['p50'] * sd).toFixed(2)),
      p85: Number((mean + PERCENTILE_Z_SCORES['p85'] * sd).toFixed(2)),
      p97: Number((mean + PERCENTILE_Z_SCORES['p97'] * sd).toFixed(2)),
    };
  });
}
