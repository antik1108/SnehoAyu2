/**
 * Trivandrum Developmental Screening Chart (TDSC) — 18 items (PRD Section 5.5).
 * Age limits are converted from "Xm Yd" notation to days (1 month = 30 days)
 * to allow direct comparison against the baby's corrected age in days.
 */
export interface TdscItem {
  id: number;
  task: string;
  lowerLimitDays: number;
  upperLimitDays: number;
}

export const tdscItems: TdscItem[] = [
  { id: 1, task: 'Social smile', lowerLimitDays: 1, upperLimitDays: 60 },
  { id: 2, task: 'Eyes follow pen/pencil', lowerLimitDays: 33, upperLimitDays: 90 },
  { id: 3, task: 'Holds head steady', lowerLimitDays: 33, upperLimitDays: 114 },
  { id: 4, task: 'Rolls from back to stomach', lowerLimitDays: 81, upperLimitDays: 144 },
  { id: 5, task: 'Turns head to sound of bell', lowerLimitDays: 90, upperLimitDays: 174 },
  { id: 6, task: 'Transfer objects hand to hand', lowerLimitDays: 123, upperLimitDays: 210 },
  { id: 7, task: 'Raises self to sitting', lowerLimitDays: 174, upperLimitDays: 330 },
  { id: 8, task: 'Standing up by furniture', lowerLimitDays: 189, upperLimitDays: 330 },
  { id: 9, task: 'Fine prehension (pellet)', lowerLimitDays: 204, upperLimitDays: 330 },
  { id: 10, task: 'Pat-a-cake', lowerLimitDays: 204, upperLimitDays: 381 },
  { id: 11, task: 'Walks with help', lowerLimitDays: 234, upperLimitDays: 390 },
  { id: 12, task: 'Throws ball', lowerLimitDays: 285, upperLimitDays: 504 },
  { id: 13, task: 'Walks alone', lowerLimitDays: 297, upperLimitDays: 522 },
  { id: 14, task: 'Says two words', lowerLimitDays: 336, upperLimitDays: 570 },
  { id: 15, task: 'Walk backwards', lowerLimitDays: 336, upperLimitDays: 585 },
  { id: 16, task: 'Walk upstairs with help', lowerLimitDays: 366, upperLimitDays: 735 },
  { id: 17, task: 'Points to 3 parts of doll', lowerLimitDays: 459, upperLimitDays: 735 },
  { id: 18, task: 'Remove garments', lowerLimitDays: 630, upperLimitDays: 750 },
];

/** Items whose upper age limit has been reached — these should always be assessed. */
export function getApplicableTdscItems(correctedAgeDays: number): TdscItem[] {
  return tdscItems.filter((item) => correctedAgeDays >= item.lowerLimitDays - 30);
}
