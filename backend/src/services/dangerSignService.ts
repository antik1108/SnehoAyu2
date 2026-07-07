/**
 * Danger Sign Rules Engine
 * Source: SnehoAyu_Content_Knowledge_Base.md §4.1–4.2
 *
 * This module is a pure function — no DB reads or writes.
 * It receives a list of reported symptom codes and returns a severity
 * classification with the exact messaging mandated by the source material.
 *
 * TODO: confirm with researcher — KB §21 item 5 — CRITICAL results should
 * eventually be visible to the researcher panel for RCT safety monitoring.
 * That requires ethics-approved data-collection scope confirmation before
 * the researcher-facing log stream is built. The `notifyResearchTeam` flag
 * is returned in the response for future wiring but not acted on here yet.
 */

// ─── Symptom catalogue ────────────────────────────────────────────────────────

/** Every symptom code recognised by the rules engine. Maps 1-to-1 with KB §4.1. */
export const SYMPTOM_CODES = [
  'cold_and_feeding_poorly',
  'breathing_abnormal',        // <30 or >60 breaths/min
  'gasping_noisy_breathing',   // grunting, chest indrawing, nostril flaring
  'blue_discoloration',        // lips, tongue, or skin appear blue
  'feels_cold',                // axillary temp <36°C
  'fever',                     // axillary temp >37°C
  'cord_infection_signs',      // redness, swelling, pus, or foul smell
  'convulsions',               // any seizure activity
  'limp_floppy',               // arms and legs not flexed
  'lethargic',                 // inactive, difficult to wake
  'eye_discharge',             // red swollen eyelids with pus
  'jaundice',                  // yellow skin or eyes
  'excessive_sleepiness',      // very hard to wake, missing feeds (HIGH)
  'watery_stool',              // persistent watery/loose stool (HIGH)
  'persistent_vomiting',       // large-volume vomiting repeatedly (MEDIUM)
  'poor_feeding',              // unable to suck, tires quickly (CRITICAL if combined)
] as const;

export type SymptomCode = typeof SYMPTOM_CODES[number];

export interface SymptomInput {
  code: SymptomCode;
}

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';

export interface DangerSignResult {
  severity: Severity;
  /** Mother-facing message — use the source material's exact phrasing. */
  message: string;
  showEmergencyCallButton: boolean;
  /**
   * Flag for future researcher-panel escalation (KB §21 item 5).
   * Not yet acted on — confirmed with researcher required before building
   * the researcher-facing stream.
   */
  notifyResearchTeam: boolean;
  /** Which of the submitted symptoms triggered the classification. */
  triggeredBy: SymptomCode[];
}

// ─── Severity sets (KB §4.1) ─────────────────────────────────────────────────

const CRITICAL_SIGNS = new Set<SymptomCode>([
  'cold_and_feeding_poorly',
  'breathing_abnormal',
  'gasping_noisy_breathing',
  'blue_discoloration',
  'feels_cold',
  'fever',
  'cord_infection_signs',
  'convulsions',
  'limp_floppy',
  'lethargic',
  'poor_feeding',
]);

const HIGH_SIGNS = new Set<SymptomCode>([
  'eye_discharge',
  'jaundice',
  'excessive_sleepiness',
  'watery_stool',
]);

const MEDIUM_SIGNS = new Set<SymptomCode>([
  'persistent_vomiting',
]);

// ─── Rules engine (KB §4.2) ──────────────────────────────────────────────────

/**
 * Evaluate a list of reported symptoms and return a severity classification.
 * Follows the pseudocode in KB §4.2 exactly.
 */
export function evaluateDangerSigns(reportedSymptoms: SymptomInput[]): DangerSignResult {
  const codes = reportedSymptoms.map((s) => s.code);

  const criticalTriggered = codes.filter((c) => CRITICAL_SIGNS.has(c));
  if (criticalTriggered.length > 0) {
    return {
      severity: 'CRITICAL',
      // Source: KB §4.2 design note — keep instruction concrete and singular
      message:
        'Seek medical care immediately. Go to the nearest hospital or contact your ASHA/ANM worker now.',
      showEmergencyCallButton: true,
      notifyResearchTeam: true, // TODO: KB §21 item 5 — wire after ethics confirmation
      triggeredBy: criticalTriggered,
    };
  }

  const highTriggered = codes.filter((c) => HIGH_SIGNS.has(c));
  if (highTriggered.length > 0) {
    return {
      severity: 'HIGH',
      message:
        'Please consult your doctor or health worker soon — today if possible.',
      showEmergencyCallButton: true,
      notifyResearchTeam: false,
      triggeredBy: highTriggered,
    };
  }

  const mediumTriggered = codes.filter((c) => MEDIUM_SIGNS.has(c));
  if (mediumTriggered.length > 0) {
    return {
      severity: 'MEDIUM',
      message:
        'Keep watching your baby carefully. If this continues or gets worse, consult your doctor.',
      showEmergencyCallButton: false,
      notifyResearchTeam: false,
      triggeredBy: mediumTriggered,
    };
  }

  return {
    severity: 'NORMAL',
    message:
      'No danger signs reported. Continue routine care and your daily checklist.',
    showEmergencyCallButton: false,
    notifyResearchTeam: false,
    triggeredBy: [],
  };
}

// ─── Input validation ─────────────────────────────────────────────────────────

const VALID_CODES = new Set<string>(SYMPTOM_CODES);

export interface DangerSignValidationResult {
  valid: boolean;
  errors: string[];
  data?: SymptomInput[];
}

export function validateDangerSignInput(body: unknown): DangerSignValidationResult {
  if (!Array.isArray(body)) {
    return { valid: false, errors: ['Request body must be an array of symptom objects.'] };
  }

  if (body.length > SYMPTOM_CODES.length) {
    return { valid: false, errors: [`Too many symptoms — maximum is ${SYMPTOM_CODES.length}.`] };
  }

  const errors: string[] = [];
  const data: SymptomInput[] = [];

  for (const item of body) {
    if (typeof item !== 'object' || item === null || typeof (item as Record<string, unknown>).code !== 'string') {
      errors.push('Each symptom must be an object with a "code" string field.');
      continue;
    }
    const code = (item as Record<string, unknown>).code as string;
    if (!VALID_CODES.has(code)) {
      errors.push(`Unknown symptom code: "${code}".`);
      continue;
    }
    data.push({ code: code as SymptomCode });
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true, errors: [], data };
}
