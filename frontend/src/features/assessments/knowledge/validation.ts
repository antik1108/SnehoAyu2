import { KNOWLEDGE_TIME_POINTS, type KnowledgeTimePoint } from './types';

export function isKnowledgeTimePoint(value: string | null): value is KnowledgeTimePoint {
  return value !== null && KNOWLEDGE_TIME_POINTS.includes(value as KnowledgeTimePoint);
}
