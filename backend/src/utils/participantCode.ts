export type StudyGroup = 'study' | 'control';

/**
 * Resolves the short group prefix.
 */
export function getGroupPrefix(group: StudyGroup): 'S' | 'C' {
  if (group === 'study') return 'S';
  if (group === 'control') return 'C';
  throw new Error(`Invalid study group: ${group}`);
}

/**
 * Formats a participant code canonically.
 * Format: [HOSPITAL_CODE]-[GROUP_PREFIX]-[SEQUENCE]
 * e.g., BNK-S-001
 */
export function formatParticipantCode(
  hospitalCode: string,
  group: StudyGroup,
  sequence: number
): string {
  if (!Number.isInteger(sequence) || sequence <= 0) {
    throw new Error(`Sequence must be a positive integer (received ${sequence})`);
  }
  const prefix = getGroupPrefix(group);
  const paddedSeq = String(sequence).padStart(3, '0');
  return `${hospitalCode.toUpperCase()}-${prefix}-${paddedSeq}`;
}

/**
 * Extracts sequence number from a formatted participant code.
 * Returns null if the format is invalid.
 */
export function extractSequenceFromParticipantCode(
  participantCode: string
): number | null {
  const parts = participantCode.split('-');
  if (parts.length !== 3) return null;
  const seqStr = parts[2];
  if (!/^\d+$/.test(seqStr)) return null;
  const num = Number(seqStr);
  return Number.isInteger(num) && num > 0 ? num : null;
}
