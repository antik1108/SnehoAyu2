import React, { useEffect, useState } from 'react';
import { ChevronDown, Check, ClipboardPlus } from 'lucide-react';
import {
  getKnowledgeContent,
  getWho5Content,
  getPsocContent,
  getTdscItemsForStaff,
  getImmunizationForStaff,
  submitGrowthForStaff,
  submitTdscForStaff,
  markVaccineCompleteForStaff,
  submitBreastfeedingForStaff,
  submitKnowledgeForStaff,
  submitWho5ForStaff,
  submitPsocForStaff,
  type QuestionContent,
  type ScaleOption,
  type TdscItem,
  type ImmunizationEntry,
} from '../../features/staff/api';
import { normalizeApiError } from '../../lib/apiError';

const TIME_POINTS = [
  { value: 'baseline', label: 'Baseline' },
  { value: '1_month', label: '1 Month' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
];

const InstrumentSection: React.FC<{
  title: string;
  children: (props: { onDone: () => void }) => React.ReactNode;
}> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 p-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text">
          {done && <Check className="h-4 w-4 text-success" aria-hidden="true" />}
          {title}
        </span>
        <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && <div className="border-t border-border p-3">{children({ onDone: () => setDone(true) })}</div>}
    </div>
  );
};

const FormShell: React.FC<{ onSubmit: () => void; submitting: boolean; error: string | null; success: boolean; children: React.ReactNode }> = ({
  onSubmit,
  submitting,
  error,
  success,
  children,
}) => (
  <div className="space-y-3">
    {children}
    {error && <p role="alert" className="text-xs text-error">{error}</p>}
    {success ? (
      <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
        <Check className="h-3.5 w-3.5" aria-hidden="true" /> Recorded successfully.
      </p>
    ) : (
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full min-h-10 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Save'}
      </button>
    )}
  </div>
);

const inputClass = 'w-full min-h-10 rounded-lg border border-border px-3 text-sm';

// ── Growth ──────────────────────────────────────────────────────────────
const GrowthForm: React.FC<{ motherProfileId: string; onDone: () => void; onRefresh: () => void }> = ({ motherProfileId, onDone, onRefresh }) => {
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [hc, setHc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitGrowthForStaff(motherProfileId, {
        weightGrams: Number(weight),
        lengthCm: Number(length),
        headCircumferenceCm: Number(hc),
      });
      setSuccess(true);
      onDone();
      onRefresh();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell onSubmit={submit} submitting={submitting} error={error} success={success}>
      <input type="number" placeholder="Weight (g)" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} />
      <input type="number" step="0.1" placeholder="Length (cm)" value={length} onChange={(e) => setLength(e.target.value)} className={inputClass} />
      <input type="number" step="0.1" placeholder="Head circumference (cm)" value={hc} onChange={(e) => setHc(e.target.value)} className={inputClass} />
    </FormShell>
  );
};

// ── TDSC ────────────────────────────────────────────────────────────────
const TdscForm: React.FC<{ motherProfileId: string; timePoint: string; onDone: () => void }> = ({ motherProfileId, timePoint, onDone }) => {
  const [items, setItems] = useState<TdscItem[]>([]);
  const [results, setResults] = useState<Record<string, 'pass' | 'fail'>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getTdscItemsForStaff(motherProfileId).then((res) => setItems(res.items)).catch(() => undefined);
  }, [motherProfileId]);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitTdscForStaff(motherProfileId, timePoint, results);
      setSuccess(true);
      onDone();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell onSubmit={submit} submitting={submitting} error={error} success={success}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
          <span className="text-text">{item.task}</span>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setResults((r) => ({ ...r, [item.id]: 'pass' }))}
              className={`rounded-md border px-2 py-1 text-xs font-semibold ${results[item.id] === 'pass' ? 'border-success bg-success/10 text-success' : 'border-border text-text-muted'}`}
            >
              Pass
            </button>
            <button
              type="button"
              onClick={() => setResults((r) => ({ ...r, [item.id]: 'fail' }))}
              className={`rounded-md border px-2 py-1 text-xs font-semibold ${results[item.id] === 'fail' ? 'border-error bg-error/10 text-error' : 'border-border text-text-muted'}`}
            >
              Fail
            </button>
          </div>
        </div>
      ))}
    </FormShell>
  );
};

// ── Immunization ────────────────────────────────────────────────────────
const ImmunizationForm: React.FC<{ motherProfileId: string; onDone: () => void }> = ({ motherProfileId, onDone }) => {
  const [vaccines, setVaccines] = useState<ImmunizationEntry[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    getImmunizationForStaff(motherProfileId).then((res) => setVaccines(res.vaccines)).catch(() => undefined);
  };
  useEffect(load, [motherProfileId]);

  const markDone = async (vaccineId: string) => {
    setBusyId(vaccineId);
    setError(null);
    try {
      await markVaccineCompleteForStaff(motherProfileId, vaccineId);
      onDone();
      load();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setBusyId(null);
    }
  };

  const pending = vaccines.filter((v) => v.status === 'pending');

  return (
    <div className="space-y-2">
      {error && <p role="alert" className="text-xs text-error">{error}</p>}
      {pending.length === 0 ? (
        <p className="text-xs text-text-muted">All vaccines up to date.</p>
      ) : (
        pending.map((v) => (
          <div key={v.vaccineId} className="flex items-center justify-between text-sm">
            <span className="text-text">{v.name}</span>
            <button
              type="button"
              disabled={busyId === v.vaccineId}
              onClick={() => markDone(v.vaccineId)}
              className="rounded-md border border-primary px-2 py-1 text-xs font-semibold text-primary disabled:opacity-50"
            >
              Mark Done
            </button>
          </div>
        ))
      )}
    </div>
  );
};

// ── Breastfeeding ───────────────────────────────────────────────────────
const BreastfeedingForm: React.FC<{ motherProfileId: string; timePoint: string; onDone: () => void }> = ({ motherProfileId, timePoint, onDone }) => {
  const [current, setCurrent] = useState('exclusive');
  const [freq, setFreq] = useState('8');
  const [duration, setDuration] = useState('15');
  const [nightFeeds, setNightFeeds] = useState('2');
  const [cues, setCues] = useState('always');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitBreastfeedingForStaff(motherProfileId, timePoint, {
        currentlyBreastfeeding: current,
        frequencyPer24h: Number(freq),
        sessionDurationMinutes: Number(duration),
        nightFeedsCount: Number(nightFeeds),
        feedingOnCues: cues,
        feedingProblems: [],
        expressedMilkUsed: false,
        alternativeFeedingMethodsUsed: false,
      });
      setSuccess(true);
      onDone();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell onSubmit={submit} submitting={submitting} error={error} success={success}>
      <select value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass}>
        <option value="exclusive">Exclusive breastfeeding</option>
        <option value="predominant">Predominantly breastfeeding</option>
        <option value="mixed">Mixed feeding</option>
        <option value="not_breastfeeding">Not breastfeeding</option>
      </select>
      <input type="number" placeholder="Feeds per 24h" value={freq} onChange={(e) => setFreq(e.target.value)} className={inputClass} />
      <input type="number" placeholder="Session duration (min)" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} />
      <input type="number" placeholder="Night feeds" value={nightFeeds} onChange={(e) => setNightFeeds(e.target.value)} className={inputClass} />
      <select value={cues} onChange={(e) => setCues(e.target.value)} className={inputClass}>
        <option value="always">Feeds on cues: Always</option>
        <option value="sometimes">Feeds on cues: Sometimes</option>
        <option value="fixed_schedule">Fixed schedule only</option>
      </select>
    </FormShell>
  );
};

// ── Generic MCQ / scale grid (Knowledge MCQ, WHO-5, PSOC) ─────────────────
const QuestionGridForm: React.FC<{
  loadContent: () => Promise<{ contentReady: boolean; questions: QuestionContent[]; scale?: ScaleOption[] }>;
  onSubmit: (responses: Record<string, string>) => Promise<unknown>;
  onDone: () => void;
  mode: 'mcq' | 'scale';
}> = ({ loadContent, onSubmit, onDone, mode }) => {
  const [questions, setQuestions] = useState<QuestionContent[]>([]);
  const [scale, setScale] = useState<ScaleOption[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadContent().then((res) => {
      setQuestions(res.questions);
      setScale(res.scale ?? []);
    }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (Object.keys(responses).length < questions.length) {
      setError('Please answer every question before saving.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(responses);
      setSuccess(true);
      onDone();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell onSubmit={submit} submitting={submitting} error={error} success={success}>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {questions.map((q, i) => (
          <div key={q.id}>
            <label className="text-xs text-text-muted">{i + 1}. {q.text}</label>
            <select
              value={responses[q.id] ?? ''}
              onChange={(e) => setResponses((r) => ({ ...r, [q.id]: e.target.value }))}
              className={inputClass}
            >
              <option value="" disabled>Select…</option>
              {mode === 'mcq'
                ? q.options?.map((opt) => <option key={opt.id} value={opt.id}>{opt.text}</option>)
                : scale.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        ))}
      </div>
    </FormShell>
  );
};

export const StaffDataEntryPanel: React.FC<{ motherProfileId: string; onRefresh: () => void }> = ({ motherProfileId, onRefresh }) => {
  const [timePoint, setTimePoint] = useState('baseline');

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <ClipboardPlus className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold text-text">Record Follow-Up Data</h3>
      </div>

      <label className="text-xs font-semibold text-text">Time point</label>
      <select value={timePoint} onChange={(e) => setTimePoint(e.target.value)} className={`${inputClass} mb-3 mt-1`}>
        {TIME_POINTS.map((tp) => (
          <option key={tp.value} value={tp.value}>{tp.label}</option>
        ))}
      </select>

      <div className="space-y-2">
        <InstrumentSection title="Growth Reading">
          {({ onDone }) => <GrowthForm motherProfileId={motherProfileId} onDone={onDone} onRefresh={onRefresh} />}
        </InstrumentSection>

        <InstrumentSection title="TDSC Developmental Screening">
          {({ onDone }) => <TdscForm motherProfileId={motherProfileId} timePoint={timePoint} onDone={onDone} />}
        </InstrumentSection>

        <InstrumentSection title="Immunization">
          {({ onDone }) => <ImmunizationForm motherProfileId={motherProfileId} onDone={onDone} />}
        </InstrumentSection>

        <InstrumentSection title="Breastfeeding Assessment">
          {({ onDone }) => <BreastfeedingForm motherProfileId={motherProfileId} timePoint={timePoint} onDone={onDone} />}
        </InstrumentSection>

        <InstrumentSection title="Knowledge MCQ (Tool III)">
          {({ onDone }) => (
            <QuestionGridForm
              loadContent={getKnowledgeContent}
              onSubmit={(responses) => submitKnowledgeForStaff(motherProfileId, timePoint, responses)}
              onDone={onDone}
              mode="mcq"
            />
          )}
        </InstrumentSection>

        <InstrumentSection title="WHO-5 Well-Being (Tool IV)">
          {({ onDone }) => (
            <QuestionGridForm
              loadContent={getWho5Content}
              onSubmit={(responses) =>
                submitWho5ForStaff(
                  motherProfileId,
                  timePoint,
                  Object.fromEntries(Object.entries(responses).map(([k, v]) => [k, Number(v)]))
                )
              }
              onDone={onDone}
              mode="scale"
            />
          )}
        </InstrumentSection>

        <InstrumentSection title="PSOC Self-Efficacy (Tool V)">
          {({ onDone }) => (
            <QuestionGridForm
              loadContent={getPsocContent}
              onSubmit={(responses) =>
                submitPsocForStaff(
                  motherProfileId,
                  timePoint,
                  Object.fromEntries(Object.entries(responses).map(([k, v]) => [k, Number(v)]))
                )
              }
              onDone={onDone}
              mode="scale"
            />
          )}
        </InstrumentSection>
      </div>
    </div>
  );
};
