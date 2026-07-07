/**
 * Danger Signs page — Phase 4
 *
 * Two panels on one page:
 *  1. "Check My Baby" — interactive symptom checker (KB §4.1–4.2 rules engine)
 *  2. Full reference accordion — replaces the old hardcoded DANGER_SIGNS array
 *     with KB §4.1 content.
 *
 * The checker calls POST /api/danger-signs/check and shows a severity result
 * (CRITICAL / HIGH / MEDIUM / NORMAL) with the exact messaging from the KB.
 * Emergency call button is shown for CRITICAL and HIGH results.
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { getDashboardHome } from '../features/dashboard/api';
import { checkDangerSigns } from '../features/dangerSigns/api';
import {
  SYMPTOM_CODES,
  type SymptomCode,
  type Severity,
  type DangerSignResult,
} from '../features/dangerSigns/types';

// ─── Reference data (KB §4.1) ─────────────────────────────────────────────────
// observe / action text is sourced from KB §4.1 Master Danger Sign Table.

interface DangerSignRef {
  id: string;
  severity: Severity;
  observe: string;
  action: string;
}

const DANGER_SIGN_REFS: DangerSignRef[] = [
  { id: 'cold_and_feeding_poorly', severity: 'CRITICAL',
    observe: 'Baby stops feeding well and feels cold to touch.',
    action: 'Seek medical care immediately. Go to the nearest hospital or contact ASHA/ANM staff now.' },
  { id: 'breathing_abnormal', severity: 'CRITICAL',
    observe: 'Breathing rate less than 30 or more than 60 breaths per minute.',
    action: 'Seek medical care immediately.' },
  { id: 'gasping_noisy_breathing', severity: 'CRITICAL',
    observe: 'Grunting, gasping, chest indrawing, or nostrils flaring.',
    action: 'Respiratory distress — seek medical care immediately.' },
  { id: 'blue_discoloration', severity: 'CRITICAL',
    observe: 'Tongue, lips, or skin appear blue.',
    action: 'Possible hypoxia — seek medical care immediately.' },
  { id: 'feels_cold', severity: 'CRITICAL',
    observe: 'Body (abdomen/back) cooler than normal; axillary temperature below 36°C.',
    action: 'Hypothermia — seek medical care immediately.' },
  { id: 'fever', severity: 'CRITICAL',
    observe: 'Body feels hot; axillary temperature above 37.5°C.',
    action: 'Possible infection — seek medical care immediately.' },
  { id: 'cord_infection_signs', severity: 'CRITICAL',
    observe: 'Redness, swelling, pus, or foul smell around the cord or umbilicus.',
    action: 'Umbilical infection / sepsis risk — contact health worker or go to hospital immediately.' },
  { id: 'convulsions', severity: 'CRITICAL',
    observe: 'Any seizure activity — jerky, uncontrolled movements or stiffening.',
    action: 'Seek medical care immediately.' },
  { id: 'limp_floppy', severity: 'CRITICAL',
    observe: 'Arms and legs not flexed — body is limp or floppy.',
    action: 'Possible illness or neurological concern — seek medical care immediately.' },
  { id: 'lethargic', severity: 'CRITICAL',
    observe: 'Inactive, very difficult to wake, does not respond when awake.',
    action: 'Possible illness or infection — seek medical care immediately.' },
  { id: 'poor_feeding', severity: 'CRITICAL',
    observe: 'Unable to suck, poor suck, tires quickly, or refuses feeds.',
    action: 'Possible infection or weakness — seek medical care immediately.' },
  { id: 'eye_discharge', severity: 'HIGH',
    observe: 'Red or swollen eyelids with pus-like discharge.',
    action: 'Eye infection — consult a doctor.' },
  { id: 'jaundice', severity: 'HIGH',
    observe: 'Yellow skin or eyes.',
    action: 'Possible jaundice — seek medical advice promptly.' },
  { id: 'excessive_sleepiness', severity: 'HIGH',
    observe: 'Very hard to wake, or sleeping far more than usual and missing feeds.',
    action: 'Possible illness — seek medical help immediately.' },
  { id: 'watery_stool', severity: 'HIGH',
    observe: 'Persistent watery or loose stool (not the normal soft yellow stool of day 3+).',
    action: 'Diarrhea / infection — seek medical advice.' },
  { id: 'persistent_vomiting', severity: 'MEDIUM',
    observe: 'Vomiting large quantities repeatedly (small spit-up after feeds is normal).',
    action: 'Consult a doctor to investigate the underlying cause.' },
];

// ─── Severity colour helpers ──────────────────────────────────────────────────

function severityBg(s: Severity): string {
  if (s === 'CRITICAL') return 'bg-red-50 border-red-300';
  if (s === 'HIGH')     return 'bg-orange-50 border-orange-300';
  if (s === 'MEDIUM')   return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-300';
}

function severityText(s: Severity): string {
  if (s === 'CRITICAL') return 'text-red-700';
  if (s === 'HIGH')     return 'text-orange-700';
  if (s === 'MEDIUM')   return 'text-yellow-700';
  return 'text-green-700';
}

function severityIcon(s: Severity): string {
  if (s === 'CRITICAL') return 'text-red-600';
  if (s === 'HIGH')     return 'text-orange-500';
  if (s === 'MEDIUM')   return 'text-yellow-500';
  return 'text-green-600';
}

function refSeverityBadge(s: Severity): string {
  if (s === 'CRITICAL') return 'bg-red-100 text-red-700';
  if (s === 'HIGH')     return 'bg-orange-100 text-orange-700';
  return 'bg-yellow-100 text-yellow-700';
}

// ─── Result card ──────────────────────────────────────────────────────────────

const ResultCard: React.FC<{
  result: DangerSignResult;
  emergencyPhone: string | null;
  onClear: () => void;
}> = ({ result, emergencyPhone, onClear }) => {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);

  const handleCall = () => {
    if (!confirming) { setConfirming(true); return; }
    if (emergencyPhone) window.location.href = `tel:${emergencyPhone}`;
    setConfirming(false);
  };

  return (
    <div className={`rounded-2xl border-2 p-5 ${severityBg(result.severity)}`}>
      <div className="flex items-start gap-3">
        {result.severity === 'NORMAL'
          ? <CheckCircle2 className={`mt-0.5 h-6 w-6 shrink-0 ${severityIcon(result.severity)}`} aria-hidden="true" />
          : <ShieldAlert className={`mt-0.5 h-6 w-6 shrink-0 ${severityIcon(result.severity)}`} aria-hidden="true" />
        }
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-extrabold ${severityText(result.severity)}`}>
            {t(`dangerSignsFull.severity.${result.severity}`)}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text">{result.message}</p>

          {result.triggeredBy.length > 0 && (
            <ul className="mt-3 space-y-1">
              {result.triggeredBy.map((code) => (
                <li key={code} className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />
                  {t(`dangerSignsFull.symptoms.${code}`)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {result.showEmergencyCallButton && (
          <button
            type="button"
            onClick={handleCall}
            disabled={!emergencyPhone}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 active:opacity-80"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {confirming ? t('dangerSignsFull.confirmCall') : t('dangerSignsFull.callButton')}
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-80"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {t('dangerSignsFull.clearButton')}
        </button>
      </div>
    </div>
  );
};

// ─── Symptom pill ─────────────────────────────────────────────────────────────

const SymptomPill: React.FC<{
  code: SymptomCode;
  selected: boolean;
  onToggle: (code: SymptomCode) => void;
}> = ({ code, selected, onToggle }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(code)}
      className={`w-full min-h-[48px] rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected
          ? 'border-red-400 bg-red-500 text-white'
          : 'border-border bg-surface text-text hover:border-red-300 hover:bg-red-50'
      }`}
    >
      {t(`dangerSignsFull.symptoms.${code}`)}
    </button>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const DangerSigns: React.FC = () => {
  const { t } = useTranslation();

  // Checker state
  const [selected, setSelected] = useState<Set<SymptomCode>>(new Set());
  const [result, setResult] = useState<DangerSignResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Reference accordion state
  const [expanded, setExpanded] = useState<string | null>(null);

  // Emergency phone (fetched once from dashboard)
  const [emergencyPhone, setEmergencyPhone] = useState<string | null>(null);

  useEffect(() => {
    getDashboardHome()
      .then((res) => setEmergencyPhone(res.data.hospital?.emergencyPhone ?? null))
      .catch(() => setEmergencyPhone(null));
  }, []);

  const toggleSymptom = (code: SymptomCode) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
    // Clear any previous result when the selection changes
    setResult(null);
    setCheckError(null);
  };

  const handleCheck = async () => {
    if (selected.size === 0) {
      setCheckError(t('dangerSignsFull.noSymptomsSelected'));
      return;
    }
    setCheckError(null);
    setChecking(true);
    try {
      const res = await checkDangerSigns(Array.from(selected));
      setResult(res.data);
    } catch {
      setCheckError(t('checklist.errors.saveFailed'));
    } finally {
      setChecking(false);
    }
  };

  const handleClear = () => {
    setSelected(new Set());
    setResult(null);
    setCheckError(null);
  };

  return (
    <AppShell title={t('dangerSignsFull.title')} subtitle={t('dangerSignsFull.subtitle')}>
      <div className="space-y-6 pb-24">

        {/* ── Section 1: Interactive Checker ── */}
        <section aria-label={t('dangerSignsFull.checkerTitle')}>
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" aria-hidden="true" />
              <h2 className="text-base font-extrabold text-red-700">
                {t('dangerSignsFull.checkerTitle')}
              </h2>
            </div>
            <p className="text-sm text-red-600 mb-4">
              {t('dangerSignsFull.checkerInstruction')}
            </p>

            {/* Result — shown above pills once available */}
            {result && (
              <div className="mb-4">
                <ResultCard
                  result={result}
                  emergencyPhone={emergencyPhone}
                  onClear={handleClear}
                />
              </div>
            )}

            {/* Symptom pills — hidden once result is shown (show again via Clear) */}
            {!result && (
              <>
                <div className="space-y-2">
                  {SYMPTOM_CODES.map((code) => (
                    <SymptomPill
                      key={code}
                      code={code}
                      selected={selected.has(code)}
                      onToggle={toggleSymptom}
                    />
                  ))}
                </div>

                {checkError && (
                  <p role="alert" className="mt-3 text-xs font-medium text-red-700">
                    {checkError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => void handleCheck()}
                  disabled={checking || selected.size === 0}
                  className="mt-4 w-full min-h-[52px] rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 active:opacity-80"
                >
                  {checking ? t('dangerSignsFull.checking') : t('dangerSignsFull.checkButton')}
                </button>
              </>
            )}
          </div>
        </section>

        {/* ── Section 2: Full Reference Accordion (KB §4.1) ── */}
        <section aria-label={t('dangerSignsFull.referenceTitle')}>
          <h2 className="text-sm font-extrabold text-text mb-1">
            {t('dangerSignsFull.referenceTitle')}
          </h2>
          <p className="text-xs text-text-muted mb-3">
            {t('dangerSignsFull.referenceSubtitle')}
          </p>

          <div className="space-y-2">
            {DANGER_SIGN_REFS.map((sign) => (
              <div
                key={sign.id}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === sign.id ? null : sign.id)}
                  aria-expanded={expanded === sign.id}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${refSeverityBadge(sign.severity)}`}
                    >
                      {sign.severity}
                    </span>
                    <span className="text-sm font-semibold text-text truncate">
                      {t(`dangerSignsFull.symptoms.${sign.id}`)}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${
                      expanded === sign.id ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {expanded === sign.id && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
                        {t('dangerSignsFull.observe')}
                      </p>
                      <p className="mt-1 text-sm text-text leading-relaxed">{sign.observe}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
                        {t('dangerSignsFull.action')}
                      </p>
                      <p className="mt-1 text-sm text-text leading-relaxed">{sign.action}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};
