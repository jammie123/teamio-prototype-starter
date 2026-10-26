import type { EvaluationCriterionPriority } from './types'

export const EVALUATION_PRIORITY_LABELS: Record<EvaluationCriterionPriority, string> = {
  high: 'Vysoká',
  low: 'Nižší',
}

export const EVALUATION_PRIORITY_ORDER: EvaluationCriterionPriority[] = ['high', 'low']
