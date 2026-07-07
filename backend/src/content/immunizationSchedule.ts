/**
 * Immunization schedule — Phase 5 audit against KB §8.
 *
 * Source: SnehoAyu_Content_Knowledge_Base.md §8 (Dr. P. Ponnarasi)
 * Cross-referenced against India's Universal Immunization Programme (UIP).
 *
 * KEY CHANGES from previous version:
 * - OPV-1/2/3 doses added (were missing; KB §8 explicitly lists them at 6/10/14 weeks)
 * - Hepatitis B-3 moved from 180 days → 98 days (14 weeks), matching KB §8 table
 * - Pentavalent replaces DTwP + separate Hib (KB §8 uses "Pentavalent" which bundles
 *   DTP + HepB + Hib — kept as separate entries for clarity but corrected naming)
 * - Measles/MR/MMR at 9 months (273 days) added — was missing entirely
 * - `postVaccineFeverNote` field added per KB §8 + §5.1 cross-reference:
 *   mild fever up to 24 hrs after Hep B / Pentavalent is EXPECTED and NOT a
 *   danger sign — this note must be surfaced in the UI to prevent false alerts.
 *
 * TODO: confirm with researcher — KB §21 item 2 — this schedule uses
 * CHRONOLOGICAL age (from birth date) per India's UIP convention for
 * preterm infants. Confirm with Dr. Ponnarasi before the reminder engine
 * is finalized. The comment in immunizationService.ts is the authoritative note.
 */
export interface VaccineDefinition {
  id: string;
  name: string;
  /** Days from birth (chronological age) when this dose is due. */
  dueOffsetDays: number;
  description: string;
  sideEffects: string;
  /**
   * If set, shown as a contextual note in the detail sheet after marking done.
   * Used for the KB §8/§5.1 post-vaccine fever warning.
   */
  postVaccineFeverNote?: string;
}

// KB §8 schedule — chronological age basis
// TODO: confirm with researcher — KB §21 item 2 — chronological vs corrected age
export const immunizationSchedule: VaccineDefinition[] = [
  // ── At Birth ──────────────────────────────────────────────────────────────
  {
    id: 'bcg',
    name: 'BCG',
    dueOffsetDays: 0,
    description: 'Protects against tuberculosis. Given at birth. A small pustule forms at the injection site within a few weeks and later leaves a scar — this is expected and not a sign of infection.',
    sideEffects: 'Small sore or pustule at injection site (expected). Mild fever possible.',
  },
  {
    id: 'opv0',
    name: 'OPV-0 (Birth dose)',
    dueOffsetDays: 0,
    description: 'Oral polio vaccine — birth dose. Protects against poliomyelitis.',
    sideEffects: 'Rarely any side effects.',
  },
  {
    id: 'hepb1',
    name: 'Hepatitis B — 1st dose',
    dueOffsetDays: 0,
    description: 'Protects against hepatitis B infection. First of three doses.',
    sideEffects: 'Mild soreness at injection site, low-grade fever for up to 24 hours.',
    // KB §8 + §5.1: mild fever up to 24 hrs post Hep B is expected, not a danger sign
    postVaccineFeverNote: 'A mild fever for up to 24 hours after this vaccine is expected and is not a danger sign. Continue breastfeeding — it strengthens the immune response.',
  },

  // ── 6 Weeks ───────────────────────────────────────────────────────────────
  {
    id: 'pentavalent1',
    name: 'Pentavalent — 1st dose',
    dueOffsetDays: 42,
    description: 'Combination vaccine protecting against diphtheria, tetanus, pertussis (whooping cough), hepatitis B, and Haemophilus influenzae type b (Hib). First of three doses.',
    sideEffects: 'Fever, soreness and swelling at injection site, fussiness. Mild fever for up to 24 hours is expected.',
    postVaccineFeverNote: 'A mild fever for up to 24 hours after Pentavalent is expected and is not a danger sign. Continue breastfeeding — it strengthens the immune response.',
  },
  {
    id: 'opv1',
    name: 'OPV-1',
    dueOffsetDays: 42,
    description: 'Oral polio vaccine — 1st dose. Protects against poliomyelitis.',
    sideEffects: 'Rarely any side effects.',
  },
  {
    id: 'rota1',
    name: 'Rotavirus — 1st dose',
    dueOffsetDays: 42,
    description: 'Protects against rotavirus diarrhea, a leading cause of severe diarrhea in infants.',
    sideEffects: 'Mild irritability, rarely loose stools or vomiting.',
  },
  {
    id: 'pcv1',
    name: 'PCV — 1st dose',
    dueOffsetDays: 42,
    description: 'Pneumococcal conjugate vaccine. Protects against pneumonia, meningitis, and ear infections caused by Streptococcus pneumoniae.',
    sideEffects: 'Soreness at injection site, mild fever.',
  },

  // ── 10 Weeks ──────────────────────────────────────────────────────────────
  {
    id: 'pentavalent2',
    name: 'Pentavalent — 2nd dose',
    dueOffsetDays: 70,
    description: 'Second dose of the Pentavalent combination vaccine (DTP + HepB + Hib).',
    sideEffects: 'Fever, soreness, fussiness. Mild fever for up to 24 hours is expected.',
    postVaccineFeverNote: 'A mild fever for up to 24 hours after Pentavalent is expected and is not a danger sign. Continue breastfeeding — it strengthens the immune response.',
  },
  {
    id: 'opv2',
    name: 'OPV-2',
    dueOffsetDays: 70,
    description: 'Oral polio vaccine — 2nd dose.',
    sideEffects: 'Rarely any side effects.',
  },
  {
    id: 'rota2',
    name: 'Rotavirus — 2nd dose',
    dueOffsetDays: 70,
    description: 'Second dose of rotavirus vaccine.',
    sideEffects: 'Mild irritability, rarely loose stools or vomiting.',
  },
  {
    id: 'pcv2',
    name: 'PCV — 2nd dose',
    dueOffsetDays: 70,
    description: 'Second dose of pneumococcal conjugate vaccine.',
    sideEffects: 'Soreness at injection site, mild fever.',
  },

  // ── 14 Weeks ──────────────────────────────────────────────────────────────
  {
    id: 'pentavalent3',
    name: 'Pentavalent — 3rd dose',
    dueOffsetDays: 98,
    description: 'Third and final primary dose of the Pentavalent combination vaccine (DTP + HepB + Hib).',
    sideEffects: 'Fever, soreness, fussiness. Mild fever for up to 24 hours is expected.',
    postVaccineFeverNote: 'A mild fever for up to 24 hours after Pentavalent is expected and is not a danger sign. Continue breastfeeding — it strengthens the immune response.',
  },
  {
    id: 'opv3',
    name: 'OPV-3',
    dueOffsetDays: 98,
    description: 'Oral polio vaccine — 3rd dose.',
    sideEffects: 'Rarely any side effects.',
  },
  {
    id: 'hepb3',
    name: 'Hepatitis B — 3rd dose',
    dueOffsetDays: 98, // KB §8: 14 weeks; was incorrectly set to 180 days in the previous version
    description: 'Third and final primary dose of hepatitis B vaccine.',
    sideEffects: 'Mild soreness at injection site, low-grade fever for up to 24 hours.',
    postVaccineFeverNote: 'A mild fever for up to 24 hours after this vaccine is expected and is not a danger sign.',
  },
  {
    id: 'pcv3',
    name: 'PCV — 3rd dose',
    dueOffsetDays: 98,
    description: 'Third dose of pneumococcal conjugate vaccine.',
    sideEffects: 'Soreness at injection site, mild fever.',
  },

  // ── 9 Months ─────────────────────────────────────────────────────────────
  // KB §8 explicitly includes Measles/MR/MMR at 9 months — was missing in previous version
  {
    id: 'measles_mr',
    name: 'Measles / MR',
    dueOffsetDays: 273, // 9 months × 30.44 days ≈ 273 days
    description: 'Measles and Rubella (MR) vaccine. Protects against measles and rubella. Mark this date on your calendar now — it is an important milestone vaccine.',
    sideEffects: 'Mild fever and rash 7–12 days after vaccination is common and expected. Mild soreness at injection site.',
  },
];
