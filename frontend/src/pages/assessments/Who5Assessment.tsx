import React, { useState } from 'react';
import { LikertAssessmentPage } from '../../components/assessments/LikertAssessmentPage';
import { getWho5Questions, getWho5Result, getWho5Status, submitWho5Assessment } from '../../features/assessments/who5/api';
import type { Who5Result } from '../../features/assessments/who5/types';

const Who5ResultCard: React.FC<{ result: Who5Result }> = ({ result }) => (
  <section aria-live="polite" className="rounded-xl border border-success/40 bg-success/5 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-success">Assessment submitted</p>
    <h2 className="mt-2 text-lg font-semibold text-text">This assessment is now locked.</h2>
    <div className="mt-4 grid grid-cols-2 gap-2 text-center">
      <div className="rounded-lg bg-surface p-3">
        <p className="text-xl font-bold text-text">{result.rawScore} / {result.maxScore}</p>
        <p className="text-xs text-text-muted">Raw score</p>
      </div>
      <div className="rounded-lg bg-surface p-3">
        <p className="text-xl font-bold text-text">{result.percentageScore}%</p>
        <p className="text-xs text-text-muted">Well-being score</p>
      </div>
    </div>
    <p className="mt-3 text-sm leading-6 text-text-muted">
      {result.poorWellbeingFlag
        ? 'Your responses suggest you may need extra support. Please contact the study nurse or researcher.'
        : 'Thank you. Your response has been recorded.'}
    </p>
    <p className="mt-2 text-xs text-text-muted">Submitted {new Date(result.submittedAt).toLocaleString()}</p>
  </section>
);

export const Who5Assessment: React.FC = () => {
  const [result, setResult] = useState<Who5Result | null>(null);

  return (
    <LikertAssessmentPage
      title="Mental Well-Being Assessment"
      subtitle="These questions ask how you have felt over the past two weeks."
      toolLabel="Tool IV"
      intro="These questions ask how you have felt over the past two weeks."
      result={result}
      setResult={setResult}
      getStatus={getWho5Status}
      getQuestions={getWho5Questions}
      getResult={getWho5Result}
      submitAssessment={submitWho5Assessment}
      renderResult={(nextResult) => <Who5ResultCard result={nextResult} />}
      contentNotReadyMessage="Approved WHO-5 item translations are required before production submission."
    />
  );
};
