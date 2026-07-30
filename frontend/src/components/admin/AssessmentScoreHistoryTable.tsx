import React from 'react';
import { ParticipantDetail } from '../../features/admin/types';
import { AlertTriangle } from 'lucide-react';

const CHECKPOINTS = ['baseline', '1_month', '3_month', '6_month'] as const;
const CHECKPOINT_LABELS: Record<string, string> = {
  baseline: 'Baseline',
  '1_month': '1-Month',
  '3_month': '3-Month',
  '6_month': '6-Month',
};

export const AssessmentScoreHistoryTable: React.FC<{ data: ParticipantDetail }> = ({ data }) => {
  const getMcqCell = (cp: string) => {
    const record = data.knowledgeAssessments?.find((k) => k.timePoint === cp);
    if (!record) return <span className="text-text-muted">Not recorded</span>;

    const isAnomaly = record.score > 15;
    return (
      <div className="flex items-center gap-1 font-medium">
        <span>
          {record.score}/{record.maxScore} ({record.grade})
        </span>
        {isAnomaly && (
          <span
            title="Score exceeds expected maximum of 15"
            className="inline-flex items-center rounded-full bg-amber-100 px-1 py-0.2 text-[10px] font-extrabold text-amber-800 cursor-help"
          >
            !
          </span>
        )}
      </div>
    );
  };

  const getWho5Cell = (cp: string) => {
    const record = data.who5Assessments?.find((w) => w.timePoint === cp);
    if (!record) return <span className="text-text-muted">Not recorded</span>;

    return (
      <div className="flex items-center gap-1.5 font-medium">
        <span>{record.percentageScore}%</span>
        {record.poorWellbeingFlag && (
          <span
            title="Poor Wellbeing Flag (Score < 50%)"
            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800"
          >
            <AlertTriangle className="h-3 w-3" />
            Alert
          </span>
        )}
      </div>
    );
  };

  const getPsocCell = (cp: string) => {
    const record = data.psocAssessments?.find((p) => p.timePoint === cp);
    if (!record) return <span className="text-text-muted">Not recorded</span>;

    return (
      <div className="font-medium">
        <span>Total: {record.totalScore}</span>
        <div className="text-[10px] text-text-muted">
          Eff: {record.efficacyScore} · Sat: {record.satisfactionScore}
        </div>
      </div>
    );
  };

  const getTdscCell = (cp: string) => {
    const record = data.tdscAssessments?.find((t) => t.timePoint === cp);
    if (!record) return <span className="text-text-muted">Not recorded</span>;

    return (
      <div className="flex items-center gap-1.5 font-medium">
        <span>{record.suspectedDelay ? 'Suspected Delay' : 'Normal'}</span>
        {record.suspectedDelay && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            <AlertTriangle className="h-3 w-3" />
            Delay
          </span>
        )}
      </div>
    );
  };

  const getBreastfeedingCell = (cp: string) => {
    const record = data.breastfeedingAssessments?.find((b) => b.timePoint === cp);
    if (!record) return <span className="text-text-muted">Not recorded</span>;

    return (
      <div className="font-medium">
        <span>
          {record.totalScore}/28 ({record.grade})
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="mb-1 font-sans text-sm font-extrabold text-text-main">Assessment Score History</h3>
      <p className="mb-4 text-[11px] font-medium text-text-muted">
        Longitudinal scores across study instruments and follow-up checkpoints
      </p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="care-table w-full text-left text-xs">
          <thead className="border-b border-border bg-neutral-50 text-[11px] font-extrabold uppercase text-text-muted">
            <tr>
              <th className="px-4 py-3">Instrument</th>
              {CHECKPOINTS.map((cp) => (
                <th key={cp} className="px-4 py-3">
                  {CHECKPOINT_LABELS[cp]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 font-bold text-text-main">Knowledge MCQ</td>
              {CHECKPOINTS.map((cp) => (
                <td key={cp} className="px-4 py-3">
                  {getMcqCell(cp)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-text-main">WHO-5 Well-being</td>
              {CHECKPOINTS.map((cp) => (
                <td key={cp} className="px-4 py-3">
                  {getWho5Cell(cp)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-text-main">PSOC Efficacy</td>
              {CHECKPOINTS.map((cp) => (
                <td key={cp} className="px-4 py-3">
                  {getPsocCell(cp)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-text-main">TDSC Development</td>
              {CHECKPOINTS.map((cp) => (
                <td key={cp} className="px-4 py-3">
                  {getTdscCell(cp)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-text-main">Breastfeeding LATCH</td>
              {CHECKPOINTS.map((cp) => (
                <td key={cp} className="px-4 py-3">
                  {getBreastfeedingCell(cp)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
