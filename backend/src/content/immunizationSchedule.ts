/**
 * IAP 2023 immunization schedule, birth through 6 months (PRD Section 5.6).
 * Due dates are calculated from chronological date of birth — NOT corrected age.
 */
export interface VaccineDefinition {
  id: string;
  name: string;
  dueOffsetDays: number;
  description: string;
  sideEffects: string;
}

export const immunizationSchedule: VaccineDefinition[] = [
  { id: 'bcg', name: 'BCG', dueOffsetDays: 0, description: 'Protects against tuberculosis.', sideEffects: 'Small sore at injection site, mild fever.' },
  { id: 'opv0', name: 'OPV-0 (Birth dose)', dueOffsetDays: 0, description: 'Protects against polio.', sideEffects: 'Rarely any side effects.' },
  { id: 'hepb1', name: 'Hepatitis B-1', dueOffsetDays: 0, description: 'Protects against hepatitis B.', sideEffects: 'Mild soreness, low-grade fever.' },
  { id: 'dtwp1', name: 'DTwP-1', dueOffsetDays: 42, description: 'Protects against diphtheria, tetanus, pertussis.', sideEffects: 'Fever, soreness, fussiness.' },
  { id: 'ipv1', name: 'IPV-1', dueOffsetDays: 42, description: 'Protects against polio (injectable).', sideEffects: 'Mild soreness at injection site.' },
  { id: 'hib1', name: 'Hib-1', dueOffsetDays: 42, description: 'Protects against Haemophilus influenzae type b.', sideEffects: 'Mild fever, soreness.' },
  { id: 'hepb2', name: 'Hepatitis B-2', dueOffsetDays: 42, description: 'Protects against hepatitis B.', sideEffects: 'Mild soreness, low-grade fever.' },
  { id: 'rota1', name: 'Rotavirus-1', dueOffsetDays: 42, description: 'Protects against rotavirus diarrhea.', sideEffects: 'Mild irritability, rarely vomiting.' },
  { id: 'pcv1', name: 'PCV-1', dueOffsetDays: 42, description: 'Protects against pneumococcal disease.', sideEffects: 'Soreness, mild fever.' },
  { id: 'dtwp2', name: 'DTwP-2', dueOffsetDays: 70, description: 'Protects against diphtheria, tetanus, pertussis.', sideEffects: 'Fever, soreness, fussiness.' },
  { id: 'ipv2', name: 'IPV-2', dueOffsetDays: 70, description: 'Protects against polio (injectable).', sideEffects: 'Mild soreness at injection site.' },
  { id: 'hib2', name: 'Hib-2', dueOffsetDays: 70, description: 'Protects against Haemophilus influenzae type b.', sideEffects: 'Mild fever, soreness.' },
  { id: 'rota2', name: 'Rotavirus-2', dueOffsetDays: 70, description: 'Protects against rotavirus diarrhea.', sideEffects: 'Mild irritability, rarely vomiting.' },
  { id: 'pcv2', name: 'PCV-2', dueOffsetDays: 70, description: 'Protects against pneumococcal disease.', sideEffects: 'Soreness, mild fever.' },
  { id: 'dtwp3', name: 'DTwP-3', dueOffsetDays: 98, description: 'Protects against diphtheria, tetanus, pertussis.', sideEffects: 'Fever, soreness, fussiness.' },
  { id: 'ipv3', name: 'IPV-3', dueOffsetDays: 98, description: 'Protects against polio (injectable).', sideEffects: 'Mild soreness at injection site.' },
  { id: 'hib3', name: 'Hib-3', dueOffsetDays: 98, description: 'Protects against Haemophilus influenzae type b.', sideEffects: 'Mild fever, soreness.' },
  { id: 'rota3', name: 'Rotavirus-3', dueOffsetDays: 98, description: 'Protects against rotavirus diarrhea.', sideEffects: 'Mild irritability, rarely vomiting.' },
  { id: 'pcv3', name: 'PCV-3', dueOffsetDays: 98, description: 'Protects against pneumococcal disease.', sideEffects: 'Soreness, mild fever.' },
  { id: 'hepb3', name: 'Hepatitis B-3', dueOffsetDays: 180, description: 'Protects against hepatitis B.', sideEffects: 'Mild soreness, low-grade fever.' },
];
