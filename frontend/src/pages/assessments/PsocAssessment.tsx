import React, { useState } from 'react';
import { LikertAssessmentPage } from '../../components/assessments/LikertAssessmentPage';
import { getPsocQuestions, getPsocResult, getPsocStatus, submitPsocAssessment } from '../../features/assessments/psoc/api';
import type { PsocResult } from '../../features/assessments/psoc/types';

const PsocResultCard: React.FC<{ result: PsocResult }> = ({ result }) => (
  <section aria-live="polite" className="rounded-xl border border-success/40 bg-success/5 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-success">Assessment submitted</p>
    <h2 className="mt-2 text-lg font-semibold text-text">This assessment is now locked.</h2>
    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
      <div className="rounded-lg bg-surface p-3">
        <p className="text-xl font-bold text-text">{result.efficacyScore}</p>
        <p className="text-xs text-text-muted">Efficacy</p>
      </div>
      <div className="rounded-lg bg-surface p-3">
        <p className="text-xl font-bold text-text">{result.satisfactionScore}</p>
        <p className="text-xs text-text-muted">Satisfaction</p>
      </div>
      <div className="rounded-lg bg-surface p-3">
        <p className="text-xl font-bold text-text">{result.totalScore} / {result.maxScore}</p>
        <p className="text-xs text-text-muted">Total</p>
      </div>
    </div>
    <p className="mt-3 text-sm leading-6 text-text-muted">
      Thank you. Your response has been recorded.
    </p>
    <p className="mt-2 text-xs text-text-muted">Submitted {new Date(result.submittedAt).toLocaleString()}</p>
  </section>
);

export const PsocAssessment: React.FC = () => {
  const [result, setResult] = useState<PsocResult | null>(null);

  return (
    <LikertAssessmentPage
      title="Self-Efficacy Assessment"
      subtitle="These questions ask how you feel about caring for your baby."
      toolLabel="Tool V"
      intro="These questions ask how you feel about caring for your baby."
      result={result}
      setResult={setResult}
      getStatus={getPsocStatus}
      getQuestions={getPsocQuestions}
      getResult={getPsocResult}
      submitAssessment={submitPsocAssessment}
      renderResult={(nextResult) => <PsocResultCard result={nextResult} />}
      contentNotReadyMessage="Approved PSOC item wording and Bengali/Hindi translations are required before production submission."
    />
  );
};
