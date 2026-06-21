import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ParticipantDetail } from '../../features/admin/types';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-border bg-surface p-4">
    <h3 className="text-sm font-bold text-text mb-3">{title}</h3>
    {children}
  </div>
);

export const ParticipantDetailView: React.FC<{ data: ParticipantDetail }> = ({ data }) => (
  <div className="space-y-4">
    <div className="rounded-xl border border-border bg-surface p-5">
      <h1 className="text-xl font-bold text-text">{data.participantCode ?? 'Unassigned'}</h1>
      <p className="text-sm text-text-muted mt-1">
        {data.hospital?.name} · {data.studyGroup ?? 'No group'} · Age {data.ageRange}
      </p>
    </div>

    {data.babyProfile && (
      <Section title="Baby Profile">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-text-muted text-xs">Sex</dt><dd className="text-text">{data.babyProfile.sex}</dd></div>
          <div><dt className="text-text-muted text-xs">DOB</dt><dd className="text-text">{data.babyProfile.dateOfBirth}</dd></div>
          <div><dt className="text-text-muted text-xs">Gestational Age</dt><dd className="text-text">{data.babyProfile.gestationalAgeWeeks} wks</dd></div>
          <div><dt className="text-text-muted text-xs">Birth Weight</dt><dd className="text-text">{data.babyProfile.birthWeightGrams} g ({data.babyProfile.birthWeightStratum})</dd></div>
        </dl>
      </Section>
    )}

    <Section title="Follow-Up Schedule">
      <ul className="space-y-1 text-sm">
        {data.followUpSchedules.map((f, i) => (
          <li key={i} className="flex justify-between">
            <span className="text-text capitalize">{f.timePoint.replace('_', ' ')}</span>
            <span className="text-text-muted">{f.scheduledDate} · {f.status}</span>
          </li>
        ))}
      </ul>
    </Section>

    <Section title="Growth Readings">
      {data.growthReadings.length === 0 ? <p className="text-sm text-text-muted">No readings yet.</p> : (
        <ul className="space-y-1 text-sm">
          {data.growthReadings.map((g, i) => (
            <li key={i} className="flex justify-between">
              <span className="text-text">{g.readingDate}</span>
              <span className="text-text-muted">{g.weightGrams}g · {g.lengthCm}cm · {g.headCircumferenceCm}cm</span>
            </li>
          ))}
        </ul>
      )}
    </Section>

    <Section title="Research Instruments">
      <div className="space-y-2 text-sm">
        <p className="text-text-muted text-xs font-semibold">Knowledge MCQ</p>
        {data.knowledgeAssessments.map((k, i) => (
          <p key={i} className="text-text">{k.timePoint}: {k.score}/{k.maxScore} ({k.grade})</p>
        ))}
        <p className="text-text-muted text-xs font-semibold mt-2">WHO-5</p>
        {data.who5Assessments.map((w, i) => (
          <p key={i} className="flex items-center gap-1 text-text">
            {w.timePoint}: {w.percentageScore}%
            {w.poorWellbeingFlag && (
              <span className="flex items-center gap-1 text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> flagged
              </span>
            )}
          </p>
        ))}
        <p className="text-text-muted text-xs font-semibold mt-2">PSOC</p>
        {data.psocAssessments.map((p, i) => (
          <p key={i} className="text-text">{p.timePoint}: {p.totalScore} (efficacy {p.efficacyScore}, satisfaction {p.satisfactionScore})</p>
        ))}
        <p className="text-text-muted text-xs font-semibold mt-2">TDSC</p>
        {data.tdscAssessments.map((t, i) => (
          <p key={i} className="flex items-center gap-1 text-text">
            {t.timePoint}:
            {t.suspectedDelay ? (
              <span className="flex items-center gap-1 text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> suspected delay
              </span>
            ) : (
              'no concerns'
            )}
          </p>
        ))}
        <p className="text-text-muted text-xs font-semibold mt-2">Breastfeeding</p>
        {data.breastfeedingAssessments.map((b, i) => (
          <p key={i} className="text-text">{b.timePoint}: {b.totalScore}/28 ({b.grade})</p>
        ))}
      </div>
    </Section>

    <Section title="Immunization">
      <ul className="space-y-1 text-sm">
        {data.vaccineRecords.map((v, i) => (
          <li key={i} className="flex justify-between">
            <span className="text-text">{v.vaccineName}</span>
            <span className="text-text-muted">{v.status === 'completed' ? `Given ${v.completedDate}` : `Due ${v.dueDate}`}</span>
          </li>
        ))}
      </ul>
    </Section>
  </div>
);
