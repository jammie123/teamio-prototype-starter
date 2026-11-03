import type { StyleProps } from '../../lib/types'

export type ScoreSummaryType =
  | 'scored'
  | 'insufficientData'
  | 'notEvaluated'
  | 'error'
  | 'evaluating'

export type EvaluationItemStatus = 'met' | 'partial' | 'unmet'

export type ScoreBadgeTone = 'danger' | 'warning' | 'success'

export interface EvaluationItemData {
  id: string
  label: string
  status: EvaluationItemStatus
}

export interface ScoreSummarySharedProps extends StyleProps {
  title?: string
  onEvaluate?: () => void
  evaluateLabel?: string
  helpHref?: string
}

export interface ScoreSummaryScoredProps extends ScoreSummarySharedProps {
  type: 'scored'
  score: number
  summary: string
  criteria: EvaluationItemData[]
  questions: string[]
  summaryHeading?: string
  criteriaHeading?: string
  questionsHeading?: string
}

export interface ScoreSummaryInsufficientDataProps extends ScoreSummarySharedProps {
  type: 'insufficientData'
}

export interface ScoreSummaryNotEvaluatedProps extends ScoreSummarySharedProps {
  type: 'notEvaluated'
}

export interface ScoreSummaryErrorProps extends ScoreSummarySharedProps {
  type: 'error'
}

export interface ScoreSummaryEvaluatingProps extends ScoreSummarySharedProps {
  type: 'evaluating'
}

export type ScoreSummaryProps =
  | ScoreSummaryScoredProps
  | ScoreSummaryInsufficientDataProps
  | ScoreSummaryNotEvaluatedProps
  | ScoreSummaryErrorProps
  | ScoreSummaryEvaluatingProps
