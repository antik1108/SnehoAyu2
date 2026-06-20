import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../../components/layout/AppShell';
import { createGrowthReading } from '../../features/growth/api';
import { todayDateInputValue } from '../../features/growth/format';
import { validateGrowthForm, type GrowthFormState } from '../../features/growth/validation';
import { normalizeApiError, type AppApiError } from '../../lib/apiError';
import { ROUTES } from '../../routes/paths';

type FieldName = keyof GrowthFormState;

const initialState = (): GrowthFormState => ({
  readingDate: todayDateInputValue(),
  weightGrams: '',
  lengthCm: '',
  headCircumferenceCm: '',
  timePoint: '',
  notes: '',
});

export const AddReading: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState<GrowthFormState>(() => initialState());
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [serverError, setServerError] = useState<AppApiError | null>(null);
  const [saving, setSaving] = useState(false);
  const readingDateRef = useRef<HTMLInputElement>(null);
  const weightGramsRef = useRef<HTMLInputElement>(null);
  const lengthCmRef = useRef<HTMLInputElement>(null);
  const headCircumferenceCmRef = useRef<HTMLInputElement>(null);
  const timePointRef = useRef<HTMLSelectElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const setField = (field: FieldName, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const focusFirstError = (nextErrors: Partial<Record<FieldName, string>>) => {
    const first = (['readingDate', 'weightGrams', 'lengthCm', 'headCircumferenceCm', 'timePoint', 'notes'] as FieldName[])
      .find((field) => nextErrors[field]);
    const fieldRefs = {
      readingDate: readingDateRef,
      weightGrams: weightGramsRef,
      lengthCm: lengthCmRef,
      headCircumferenceCm: headCircumferenceCmRef,
      timePoint: timePointRef,
      notes: notesRef,
    };
    if (first) fieldRefs[first].current?.focus();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    const today = todayDateInputValue();
    const validation = validateGrowthForm(state, today);

    if (!validation.valid || !validation.data) {
      setErrors(validation.errors);
      focusFirstError(validation.errors);
      return;
    }

    setSaving(true);
    setServerError(null);
    try {
      await createGrowthReading(validation.data);
      navigate(ROUTES.GROWTH, { replace: true });
    } catch (err) {
      setServerError(normalizeApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const fieldError = (field: FieldName) => {
    const code = errors[field];
    return code ? t(`growth.validation.${code}`) : undefined;
  };

  return (
    <AppShell title={t('growth.form.title')} subtitle={t('growth.subtitle')}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {serverError ? (
          <section role="alert" className="rounded-xl border border-error/30 bg-error/5 p-4">
            <p className="text-sm font-semibold text-error">{serverError.code}</p>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              {serverError.code === 'GROWTH_READING_ALREADY_EXISTS'
                ? t('growth.errors.duplicate')
                : serverError.message}
            </p>
          </section>
        ) : null}

        <GrowthInput
          ref={readingDateRef}
          id="readingDate"
          label={t('growth.fields.readingDate')}
          type="date"
          value={state.readingDate}
          max={todayDateInputValue()}
          error={fieldError('readingDate')}
          onChange={(value) => setField('readingDate', value)}
        />
        <GrowthInput
          ref={weightGramsRef}
          id="weightGrams"
          label={t('growth.fields.weight')}
          unit={t('growth.units.grams')}
          inputMode="numeric"
          value={state.weightGrams}
          error={fieldError('weightGrams')}
          onChange={(value) => setField('weightGrams', value)}
        />
        <GrowthInput
          ref={lengthCmRef}
          id="lengthCm"
          label={t('growth.fields.length')}
          unit={t('growth.units.cm')}
          inputMode="decimal"
          value={state.lengthCm}
          error={fieldError('lengthCm')}
          onChange={(value) => setField('lengthCm', value)}
        />
        <GrowthInput
          ref={headCircumferenceCmRef}
          id="headCircumferenceCm"
          label={t('growth.fields.head')}
          unit={t('growth.units.cm')}
          inputMode="decimal"
          value={state.headCircumferenceCm}
          error={fieldError('headCircumferenceCm')}
          onChange={(value) => setField('headCircumferenceCm', value)}
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-text">{t('growth.fields.timePoint')}</span>
          <select
            ref={timePointRef}
            id="timePoint"
            value={state.timePoint}
            onChange={(event) => setField('timePoint', event.target.value)}
            className="min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">{t('growth.timePoint.none')}</option>
            <option value="baseline">{t('growth.timePoint.baseline')}</option>
            <option value="1_month">{t('growth.timePoint.1_month')}</option>
            <option value="3_months">{t('growth.timePoint.3_months')}</option>
            <option value="6_months">{t('growth.timePoint.6_months')}</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-text">{t('growth.fields.notes')}</span>
          <textarea
            ref={notesRef}
            id="notes"
            value={state.notes}
            onChange={(event) => setField('notes', event.target.value)}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
            rows={3}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {fieldError('notes') ? <p id="notes-error" className="mt-1 text-xs text-error">{fieldError('notes')}</p> : null}
        </label>

        <button
          type="submit"
          disabled={saving}
          className="min-h-12 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? t('growth.actions.saving') : t('growth.actions.save')}
        </button>
        <Link
          to={ROUTES.GROWTH}
          className="flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text"
        >
          {t('growth.actions.back')}
        </Link>
      </form>
    </AppShell>
  );
};

interface GrowthInputProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  unit?: string;
  max?: string;
  onChange: (value: string) => void;
}

const GrowthInput = React.forwardRef<HTMLInputElement, GrowthInputProps>(({
  id,
  label,
  value,
  error,
  type = 'text',
  inputMode,
  unit,
  max,
  onChange,
}, ref) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-text">{label}</span>
    <div className="flex items-center rounded-xl border border-border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      <input
        ref={ref}
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-12 w-full rounded-xl bg-transparent px-4 text-base text-text focus:outline-none"
      />
      {unit ? <span className="pr-4 text-sm font-medium text-text-muted">{unit}</span> : null}
    </div>
    {error ? <p id={`${id}-error`} className="mt-1 text-xs text-error">{error}</p> : null}
  </label>
));

GrowthInput.displayName = 'GrowthInput';
