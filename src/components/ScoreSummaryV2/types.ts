import type { StyleProps } from '../../lib/types'

export type ScoreSummaryV2Type = 'scored' | 'notEvaluated' | 'insufficientData' | 'error'

export type ScoreMatchStatus = 'met' | 'partial' | 'unmet'

export type ScoreEvaluationLanguage = 'cs' | 'en'

export type ScoreUiLanguage = 'cs' | 'en'

export interface ScoreMatchItem {
  id: string
  title: string
  description: string
  status: ScoreMatchStatus
}

export interface ScoreQuestionItem {
  id: string
  text: string
  verifies: string
}

export interface ScoreSummaryV2SharedProps extends StyleProps {
  title?: string
  onEvaluate?: () => void
  evaluateLabel?: string
  onOpenCriteria?: () => void
  criteriaLabel?: string
  helpHref?: string
  isEvaluating?: boolean
  isTranslate?: boolean
  translateLanguage?: string
  /** App chrome language. Evaluation content (summary, matches) is passed separately. */
  uiLanguage?: ScoreUiLanguage
  /** Compact scored card: English UI, Czech evaluation copy — offer to translate. */
  showTranslationOffer?: boolean
  onTranslate?: () => void
}

export interface ScoreSummaryV2ScoredProps extends ScoreSummaryV2SharedProps {
  type: 'scored'
  score: number
  summary: string
  matches: ScoreMatchItem[]
  questions: ScoreQuestionItem[]
  summaryHeading?: string
  matchesHeading?: string
  questionsHeading?: string
  defaultExpanded?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  evaluationLanguage?: ScoreEvaluationLanguage
  onEvaluationLanguageChange?: (language: ScoreEvaluationLanguage) => void
}

export interface ScoreSummaryV2NotEvaluatedProps extends ScoreSummaryV2SharedProps {
  type: 'notEvaluated'
}

export interface ScoreSummaryV2InsufficientDataProps extends ScoreSummaryV2SharedProps {
  type: 'insufficientData'
}

export interface ScoreSummaryV2ErrorProps extends ScoreSummaryV2SharedProps {
  type: 'error'
}

export type ScoreSummaryV2Props =
  | ScoreSummaryV2ScoredProps
  | ScoreSummaryV2NotEvaluatedProps
  | ScoreSummaryV2InsufficientDataProps
  | ScoreSummaryV2ErrorProps
