export type EvaluationCriterionPriority = 'high' | 'low'

export interface EvaluationCriterion {
  id: string
  text: string
  priority: EvaluationCriterionPriority
}
