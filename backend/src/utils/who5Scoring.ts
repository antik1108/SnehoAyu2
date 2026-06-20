import { WHO5_MAX_SCORE, type Who5Interpretation, type Who5QuestionId, type Who5ResponseValue } from '../content/who5Questions.js';

export interface Who5ScoreResult {
  rawScore: number;
  maxScore: number;
  percentageScore: number;
  poorWellbeingFlag: boolean;
  interpretation: Who5Interpretation;
}

export function scoreWho5(responses: Record<Who5QuestionId, Who5ResponseValue>): Who5ScoreResult {
  const rawScore = Object.values(responses).reduce<number>((sum, value) => sum + value, 0);
  const poorWellbeingFlag = rawScore < 13;

  return {
    rawScore,
    maxScore: WHO5_MAX_SCORE,
    percentageScore: rawScore * 4,
    poorWellbeingFlag,
    interpretation: poorWellbeingFlag ? 'needs_researcher_attention' : 'no_flag',
  };
}
