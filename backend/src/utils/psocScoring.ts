import {
  PSOC_MAX_SCORE,
  psocQuestions,
  type PsocQuestionId,
  type PsocResponseValue,
} from '../content/psocQuestions.js';

export interface PsocScoreResult {
  scoredResponses: Record<PsocQuestionId, number>;
  efficacyScore: number;
  satisfactionScore: number;
  totalScore: number;
  maxScore: number;
  classification: null;
  classificationMethod: 'requires_cohort_norms';
}

export function scorePsoc(responses: Record<PsocQuestionId, PsocResponseValue>): PsocScoreResult {
  const scoredResponses = {} as Record<PsocQuestionId, number>;
  let efficacyScore = 0;
  let satisfactionScore = 0;

  for (const question of psocQuestions) {
    const rawValue = responses[question.id];
    const scoredValue = question.scoringDirection === 'reverse' ? 7 - rawValue : rawValue;
    scoredResponses[question.id] = scoredValue;

    if (question.subscale === 'efficacy') {
      efficacyScore += scoredValue;
    } else {
      satisfactionScore += scoredValue;
    }
  }

  return {
    scoredResponses,
    efficacyScore,
    satisfactionScore,
    totalScore: efficacyScore + satisfactionScore,
    maxScore: PSOC_MAX_SCORE,
    classification: null,
    classificationMethod: 'requires_cohort_norms',
  };
}
