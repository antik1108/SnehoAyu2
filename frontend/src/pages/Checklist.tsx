import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Milk,
  Heart,
  Thermometer,
  Scale,
  Bandage,
  Pill,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  PartyPopper,
  CircleAlert,
  type LucideIcon,
} from 'lucide-react';
import { AiAssistantButton } from '../components/dashboard/AiAssistantButton';
import { getTodayChecklist, updateTodayChecklist } from '../features/checklist/api';
import type {
  TodayChecklist,
  ChecklistLogInput,
} from '../features/checklist/types';
import {
  validateBreastfeeding,
  validateKmc,
  validateTemperature,
  validateWeight,
  validateMedication,
} from '../features/checklist/validation';

// ─── helpers ────────────────────────────────────────────────────────────────

type FocusSection = 'feeding' | 'temperature' | 'kmc' | null;

function clampPercent(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(100, Math.max(0, Math.round(v)));
}

// ─── Progress ring ───────────────────────────────────────────────────────────

const ProgressRing: React.FC<{ percent: number; done: number; total: number }> = ({
  percent,
  done,
  total,
}) => {
  const { t } = useTranslation();
  const safe = clampPercent(percent);
  const r = 40;
  const stroke = 7;
  const circ = 2 * Math.PI * r;
  const offset = circ - (safe / 100) * circ;
  const isComplete = safe >= 100;

  return (
    <div className="surface-brand shadow-brand flex items-center gap-4 rounded-2xl p-5">
      <svg
        width="84"
        height="84"
        viewBox="0 0 100 100"
        role="img"
        aria-label={t('checklist.progress.todayProgress') + ' ' + safe + '%'}
        className="shrink-0"
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/20" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="text-white transition-all duration-500"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="46" textAnchor="middle" className="fill-white text-[17px] font-bold">{safe}%</text>
        <text x="50" y="63" textAnchor="middle" className="fill-white/80 text-[9px] font-medium">{done}/{total}</text>
      </svg>
      <div>
        <p className="text-base font-semibold text-white">{t('checklist.progress.todayProgress')}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
          {isComplete ? (
            <>
              <PartyPopper className="h-4 w-4" aria-hidden="true" />
              {t('checklist.progress.allDone', "All caught up for today!")}
            </>
          ) : (
            `${done}/${total} ${t('checklist.progress.completed')}`
          )}
        </p>
      </div>
    </div>
  );
};

// ─── Section wrapper ─────────────────────────────────────────────────────────

interface SectionCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  done: boolean;
  optional?: boolean;
  children: React.ReactNode;
  saving: boolean;
  onSave: () => void;
  error?: string | null;
  saveLabel?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  id,
  title,
  icon: Icon,
  done,
  optional,
  children,
  saving,
  onSave,
  error,
  saveLabel,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(!done);

  // Auto-collapse the card once it transitions to "done" (i.e. right after
  // a successful save) — gives a satisfying sense of progress without the
  // user needing to manually close every section on a long checklist.
  useEffect(() => {
    if (done) setExpanded(false);
  }, [done]);

  return (
    <section
      id={id}
      className={`overflow-hidden rounded-2xl border bg-surface transition-colors duration-300 ${
        done ? 'border-success/40 bg-success/5' : 'border-border'
      }`}
      aria-label={title}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            done ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'
          }`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-text">{title}</h2>
          {optional && (
            <span className="text-xs text-text-muted">{t('checklist.fields.optional')}</span>
          )}
        </div>
        {done && (
          <span
            aria-label="completed"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="space-y-3">{children}</div>

          {error && (
            <p role="alert" className="mt-2 text-xs text-error">{error}</p>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="mt-4 w-full min-h-[48px] rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-80"
          >
            {saving ? t('checklist.actions.saving') : (saveLabel ?? t('checklist.actions.save'))}
          </button>
        </div>
      )}
    </section>
  );
};

// ─── Field components ────────────────────────────────────────────────────────

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-xs font-medium text-text-muted mb-1">
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full min-h-[48px] rounded-xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${props.className ?? ''}`}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none ${props.className ?? ''}`}
  />
);

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p role="alert" className="text-xs text-error mt-1">{msg}</p> : null;

// Big toggle button (Yes / No / N/A)
const ToggleGroup: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}> = ({ options, value, onChange, name }) => (
  <div className="flex gap-2" role="group">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        id={`${name}-${opt.value}`}
        aria-pressed={value === opt.value}
        onClick={() => onChange(opt.value)}
        className={`flex-1 min-h-[48px] rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          value === opt.value
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background text-text'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// ─── Section: Breastfeeding ──────────────────────────────────────────────────

interface BFState {
  done: string; // 'yes' | 'no' | ''
  feedsCount: string;
  volumeMl: string;
}

const BreastfeedingSection: React.FC<{
  initial: TodayChecklist['items']['breastfeeding'];
  onSaved: (updated: TodayChecklist) => void;
  focusRef?: React.Ref<HTMLElement>;
}> = ({ initial, onSaved, focusRef }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<BFState>({
    done: initial.done ? 'yes' : initial.feedsCount !== null ? 'yes' : '',
    feedsCount: initial.feedsCount !== null ? String(initial.feedsCount) : '',
    volumeMl: initial.volumeMl !== null ? String(initial.volumeMl) : '',
  });
  const [errors, setErrors] = useState<{ feedsCount?: string; volumeMl?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    const v = validateBreastfeeding(state.feedsCount, state.volumeMl);
    if (!v.valid) {
      setErrors({
        feedsCount: v.feedsCount ? t(`checklist.validation.${v.feedsCount}`) : undefined,
        volumeMl: v.volumeMl ? t(`checklist.validation.${v.volumeMl}`) : undefined,
      });
      return;
    }
    setErrors({});
    setSaving(true);
    setSaveError(null);
    try {
      const input: ChecklistLogInput = {
        breastfeeding: {
          done: state.done === 'yes',
          feedsCount: state.feedsCount.trim() !== '' ? Number(state.feedsCount) : null,
          volumeMl: state.volumeMl.trim() !== '' ? Number(state.volumeMl) : null,
        },
      };
      const updated = await updateTodayChecklist(input);
      onSaved(updated);
    } catch {
      setSaveError(t('checklist.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const isDone = initial.done;

  return (
    <SectionCard
      id="section-breastfeeding"
      icon={Milk}
      title={t('checklist.sections.breastfeeding')}
      done={isDone}
      saving={saving}
      onSave={save}
      error={saveError}
    >
      <div ref={focusRef as React.Ref<HTMLDivElement>} tabIndex={-1} />
      <ToggleGroup
        name="bf-done"
        options={[
          { value: 'yes', label: t('onboarding.common.yes') },
          { value: 'no', label: t('onboarding.common.no') },
        ]}
        value={state.done}
        onChange={(v) => setState((s) => ({ ...s, done: v }))}
      />
      <div>
        <Label htmlFor="bf-feeds-count">{t('checklist.fields.feedsCount')}</Label>
        <Input
          id="bf-feeds-count"
          type="number"
          inputMode="numeric"
          min={0}
          max={30}
          placeholder="e.g. 8"
          value={state.feedsCount}
          onChange={(e) => setState((s) => ({ ...s, feedsCount: e.target.value }))}
        />
        <FieldError msg={errors.feedsCount} />
        <p className="text-xs text-text-muted mt-1">{t('checklist.fields.feedingTargetHint')}</p>
      </div>
      <div>
        <Label htmlFor="bf-volume">{t('checklist.fields.volumeMl')}</Label>
        <Input
          id="bf-volume"
          type="number"
          inputMode="numeric"
          min={0}
          max={2000}
          placeholder="e.g. 120"
          value={state.volumeMl}
          onChange={(e) => setState((s) => ({ ...s, volumeMl: e.target.value }))}
        />
        <FieldError msg={errors.volumeMl} />
      </div>
    </SectionCard>
  );
};

// ─── Section: KMC ───────────────────────────────────────────────────────────

const KmcSection: React.FC<{
  initial: TodayChecklist['items']['kmc'];
  onSaved: (updated: TodayChecklist) => void;
  focusRef?: React.Ref<HTMLElement>;
}> = ({ initial, onSaved, focusRef }) => {
  const { t } = useTranslation();
  const [done, setDone] = useState(initial.done ? 'yes' : '');
  const [minutes, setMinutes] = useState(initial.minutes !== null ? String(initial.minutes) : '');
  const [errors, setErrors] = useState<{ minutes?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    const v = validateKmc(minutes);
    if (!v.valid) {
      setErrors({ minutes: v.minutes ? t(`checklist.validation.${v.minutes}`) : undefined });
      return;
    }
    setErrors({});
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateTodayChecklist({
        kmc: {
          done: done === 'yes',
          minutes: minutes.trim() !== '' ? Number(minutes) : null,
        },
      });
      onSaved(updated);
    } catch {
      setSaveError(t('checklist.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="section-kmc"
      icon={Heart}
      title={t('checklist.sections.kmc')}
      done={initial.done}
      saving={saving}
      onSave={save}
      error={saveError}
    >
      <div ref={focusRef as React.Ref<HTMLDivElement>} tabIndex={-1} />
      <ToggleGroup
        name="kmc-done"
        options={[
          { value: 'yes', label: t('onboarding.common.yes') },
          { value: 'no', label: t('onboarding.common.no') },
        ]}
        value={done}
        onChange={setDone}
      />
      <div>
        <Label htmlFor="kmc-minutes">{t('checklist.fields.kmcMinutes')}</Label>
        <Input
          id="kmc-minutes"
          type="number"
          inputMode="numeric"
          min={0}
          max={1440}
          placeholder="e.g. 90"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
        <FieldError msg={errors.minutes} />
        <p className="text-xs text-text-muted mt-1">{t('checklist.fields.kmcTargetHint')}</p>
      </div>
    </SectionCard>
  );
};

// ─── Section: Temperature ────────────────────────────────────────────────────

const TemperatureSection: React.FC<{
  initial: TodayChecklist['items']['temperature'];
  onSaved: (updated: TodayChecklist) => void;
  focusRef?: React.Ref<HTMLElement>;
}> = ({ initial, onSaved, focusRef }) => {
  const { t } = useTranslation();
  const [done, setDone] = useState(initial.done ? 'yes' : '');
  const [morningC, setMorningC] = useState(initial.morningC !== null ? String(initial.morningC) : '');
  const [eveningC, setEveningC] = useState(initial.eveningC !== null ? String(initial.eveningC) : '');
  const [errors, setErrors] = useState<{ morning?: string; evening?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    const v = validateTemperature(morningC, eveningC);
    if (!v.valid) {
      setErrors({
        morning: v.morning ? t('checklist.validation.morningTemp') : undefined,
        evening: v.evening ? t('checklist.validation.eveningTemp') : undefined,
      });
      return;
    }
    setErrors({});
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateTodayChecklist({
        temperature: {
          done: done === 'yes',
          morningC: morningC.trim() !== '' ? Number(morningC) : null,
          eveningC: eveningC.trim() !== '' ? Number(eveningC) : null,
        },
      });
      onSaved(updated);
    } catch {
      setSaveError(t('checklist.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="section-temperature"
      icon={Thermometer}
      title={t('checklist.sections.temperature')}
      done={initial.done}
      saving={saving}
      onSave={save}
      error={saveError}
    >
      <div ref={focusRef as React.Ref<HTMLDivElement>} tabIndex={-1} />
      <ToggleGroup
        name="temp-done"
        options={[
          { value: 'yes', label: t('onboarding.common.yes') },
          { value: 'no', label: t('onboarding.common.no') },
        ]}
        value={done}
        onChange={setDone}
      />
      <div>
        <Label htmlFor="temp-morning">{t('checklist.fields.tempMorning')}</Label>
        <Input
          id="temp-morning"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={30}
          max={43}
          placeholder="e.g. 36.8"
          value={morningC}
          onChange={(e) => setMorningC(e.target.value)}
        />
        <FieldError msg={errors.morning} />
      </div>
      <div>
        <Label htmlFor="temp-evening">{t('checklist.fields.tempEvening')}</Label>
        <Input
          id="temp-evening"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={30}
          max={43}
          placeholder="e.g. 36.6"
          value={eveningC}
          onChange={(e) => setEveningC(e.target.value)}
        />
        <FieldError msg={errors.evening} />
      </div>
    </SectionCard>
  );
};

// ─── Section: Weight ─────────────────────────────────────────────────────────

const WeightSection: React.FC<{
  initial: TodayChecklist['items']['weight'];
  onSaved: (updated: TodayChecklist) => void;
}> = ({ initial, onSaved }) => {
  const { t } = useTranslation();
  const [done, setDone] = useState(initial.done ? 'yes' : '');
  const [grams, setGrams] = useState(initial.grams !== null ? String(initial.grams) : '');
  const [errors, setErrors] = useState<{ grams?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    const v = validateWeight(grams);
    if (!v.valid) {
      setErrors({ grams: v.grams ? t(`checklist.validation.weightGrams`) : undefined });
      return;
    }
    setErrors({});
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateTodayChecklist({
        weight: {
          done: done === 'yes',
          grams: grams.trim() !== '' ? Number(grams) : null,
        },
      });
      onSaved(updated);
    } catch {
      setSaveError(t('checklist.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="section-weight"
      icon={Scale}
      title={t('checklist.sections.weight')}
      done={initial.done}
      optional
      saving={saving}
      onSave={save}
      error={saveError}
    >
      <ToggleGroup
        name="weight-done"
        options={[
          { value: 'yes', label: t('onboarding.common.yes') },
          { value: 'no', label: t('onboarding.common.no') },
        ]}
        value={done}
        onChange={setDone}
      />
      <div>
        <Label htmlFor="weight-grams">{t('checklist.fields.weightGrams')}</Label>
        <Input
          id="weight-grams"
          type="number"
          inputMode="numeric"
          min={400}
          max={7000}
          placeholder="e.g. 2100"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
        />
        <FieldError msg={errors.grams} />
      </div>
    </SectionCard>
  );
};

// ─── Section: Skin & Cord Care ───────────────────────────────────────────────

const SkinCordCareSection: React.FC<{
  initial: TodayChecklist['items']['skinCordCare'];
  onSaved: (updated: TodayChecklist) => void;
}> = ({ initial, onSaved }) => {
  const { t } = useTranslation();
  const [done, setDone] = useState(initial.done ? 'yes' : '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateTodayChecklist({ skinCordCare: { done: done === 'yes' } });
      onSaved(updated);
    } catch {
      setSaveError(t('checklist.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="section-skin-cord"
      icon={Bandage}
      title={t('checklist.sections.skinCordCare')}
      done={initial.done}
      saving={saving}
      onSave={save}
      error={saveError}
    >
      <ToggleGroup
        name="skin-done"
        options={[
          { value: 'yes', label: t('onboarding.common.yes') },
          { value: 'no', label: t('onboarding.common.no') },
        ]}
        value={done}
        onChange={setDone}
      />
      <p className="text-xs text-text-muted">{t('checklist.fields.skinCordCareDone')}</p>
    </SectionCard>
  );
};

// ─── Section: Medication ─────────────────────────────────────────────────────

type MedDoneVal = 'yes' | 'no' | 'na' | '';

const MedicationSection: React.FC<{
  initial: TodayChecklist['items']['medication'];
  onSaved: (updated: TodayChecklist) => void;
}> = ({ initial, onSaved }) => {
  const { t } = useTranslation();
  const initDone: MedDoneVal =
    initial.done === true ? 'yes' : initial.done === false ? 'no' : initial.done === null ? 'na' : '';
  const [done, setDone] = useState<MedDoneVal>(initDone);
  const [notes, setNotes] = useState(initial.notes ?? '');
  const [errors, setErrors] = useState<{ notes?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    const v = validateMedication(notes);
    if (!v.valid) {
      setErrors({ notes: t('checklist.validation.medicationNotes') });
      return;
    }
    setErrors({});
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateTodayChecklist({
        medication: {
          done: done === 'yes' ? true : done === 'no' ? false : null,
          notes: notes.trim() || null,
        },
      });
      onSaved(updated);
    } catch {
      setSaveError(t('checklist.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="section-medication"
      icon={Pill}
      title={t('checklist.sections.medication')}
      done={initial.done !== null && initial.done !== undefined ? (initial.done as boolean) : false}
      optional
      saving={saving}
      onSave={save}
      error={saveError}
    >
      <ToggleGroup
        name="med-done"
        options={[
          { value: 'yes', label: t('checklist.fields.medicationYes') },
          { value: 'no', label: t('checklist.fields.medicationNo') },
          { value: 'na', label: t('checklist.fields.medicationNA') },
        ]}
        value={done}
        onChange={(v) => setDone(v as MedDoneVal)}
      />
      <div>
        <Label htmlFor="med-notes">{t('checklist.fields.medicationNotes')}</Label>
        <Textarea
          id="med-notes"
          rows={3}
          maxLength={300}
          placeholder={t('checklist.fields.medicationNotesPlaceholder')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <FieldError msg={errors.notes} />
        <p className="text-xs text-text-muted mt-1 text-right">{notes.length}/300</p>
      </div>
    </SectionCard>
  );
};

// ─── Section: Danger Signs ───────────────────────────────────────────────────

const DangerSignsSection: React.FC<{
  initial: TodayChecklist['items']['dangerSigns'];
  onSaved: (updated: TodayChecklist) => void;
}> = ({ initial, onSaved }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reviewed, setReviewed] = useState(initial.reviewed ? 'yes' : '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateTodayChecklist({ dangerSigns: { reviewed: reviewed === 'yes' } });
      onSaved(updated);
    } catch {
      setSaveError(t('checklist.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="section-danger-signs"
      icon={AlertTriangle}
      title={t('checklist.sections.dangerSigns')}
      done={initial.reviewed}
      saving={saving}
      onSave={save}
      error={saveError}
    >
      <ToggleGroup
        name="danger-reviewed"
        options={[
          { value: 'yes', label: t('onboarding.common.yes') },
          { value: 'no', label: t('onboarding.common.no') },
        ]}
        value={reviewed}
        onChange={setReviewed}
      />
      <p className="text-xs text-text-muted">{t('checklist.fields.dangerSignsReviewed')}</p>
      <button
        type="button"
        onClick={() => navigate('/learn?section=danger-signs')}
        className="flex w-full min-h-[44px] items-center justify-center gap-1 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t('checklist.fields.viewDangerSignsGuide')}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </SectionCard>
  );
};

// ─── Error state ─────────────────────────────────────────────────────────────

const ChecklistError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
        <CircleAlert className="h-7 w-7" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-text">{t('checklist.errors.loadFailed')}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 min-h-[48px] rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        {t('checklist.actions.tryAgain')}
      </button>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ChecklistSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-24 rounded-2xl bg-border/30" />
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div key={i} className="h-44 rounded-2xl bg-border/30" />
    ))}
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const Checklist: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const focusParam = new URLSearchParams(location.search).get('focus') as FocusSection;

  const [checklist, setChecklist] = useState<TodayChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Refs for focus deep-linking
  const feedingRef = useRef<HTMLElement>(null);
  const tempRef = useRef<HTMLElement>(null);
  const kmcRef = useRef<HTMLElement>(null);

  const loadChecklist = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getTodayChecklist();
      setChecklist(data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const retryLoad = () => {
    const id = window.setTimeout(() => {
      void loadChecklist();
    }, 0);
    return id;
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadChecklist();
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Focus the right section after load when ?focus= is set
  useEffect(() => {
    if (!checklist || !focusParam) return;
    const refMap: Record<string, React.RefObject<HTMLElement>> = {
      feeding: feedingRef,
      temperature: tempRef,
      kmc: kmcRef,
    };
    const ref = refMap[focusParam];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      ref.current.focus({ preventScroll: true });
    }
  }, [checklist, focusParam]);

  const handleSaved = (updated: TodayChecklist) => {
    setChecklist(updated);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-sm px-4 py-4">
        <h1 className="text-base font-bold text-text">{t('checklist.title')}</h1>
        <p className="text-xs text-text-muted">{t('checklist.subtitle')}</p>
      </header>
      {/* Rendered outside the header (backdrop-blur creates a containing
          block for fixed-position descendants) so it positions correctly. */}
      <AiAssistantButton />

      <main className="mx-auto max-w-md px-4 py-5 space-y-4">
        {loading && <ChecklistSkeleton />}

        {!loading && loadError && <ChecklistError onRetry={retryLoad} />}

        {!loading && !loadError && checklist && (
          <>
            {/* Progress summary */}
            <ProgressRing
              percent={checklist.completion.percent}
              done={checklist.completion.completedCount}
              total={checklist.completion.totalCount}
            />

            {/* Date badge */}
            <p className="text-xs text-center text-text-muted font-medium">
              {new Date(checklist.careDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            {/* Sections */}
            <BreastfeedingSection
              initial={checklist.items.breastfeeding}
              onSaved={handleSaved}
              focusRef={feedingRef}
            />
            <KmcSection
              initial={checklist.items.kmc}
              onSaved={handleSaved}
              focusRef={kmcRef}
            />
            <TemperatureSection
              initial={checklist.items.temperature}
              onSaved={handleSaved}
              focusRef={tempRef}
            />
            <WeightSection
              initial={checklist.items.weight}
              onSaved={handleSaved}
            />
            <SkinCordCareSection
              initial={checklist.items.skinCordCare}
              onSaved={handleSaved}
            />
            <MedicationSection
              initial={checklist.items.medication}
              onSaved={handleSaved}
            />
            <DangerSignsSection
              initial={checklist.items.dangerSigns}
              onSaved={handleSaved}
            />
          </>
        )}
      </main>
    </div>
  );
};
