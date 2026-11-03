import { forwardRef } from 'react'
import { Card } from '../Card'
import { ScoreSummaryBody } from './ScoreSummaryBody'
import { ScoreSummaryHeader } from './ScoreSummaryHeader'
import type { ScoreSummaryProps } from './types'

export type { ScoreSummaryProps }

export const ScoreSummary = forwardRef<HTMLElement, ScoreSummaryProps>(function ScoreSummary(
  props,
  ref,
) {
  const { type, title, onEvaluate, evaluateLabel, helpHref, className } = props
  const scored = type === 'scored' ? props : undefined

  return (
    <Card ref={ref} data-testid="score-summary" data-type={type} className={className}>
      <ScoreSummaryHeader
        type={type}
        title={title}
        score={scored?.score}
        onEvaluate={onEvaluate}
        evaluateLabel={evaluateLabel}
      />
      <ScoreSummaryBody
        type={type}
        summary={scored?.summary}
        criteria={scored?.criteria}
        questions={scored?.questions}
        helpHref={helpHref}
        summaryHeading={scored?.summaryHeading}
        criteriaHeading={scored?.criteriaHeading}
        questionsHeading={scored?.questionsHeading}
      />
    </Card>
  )
})

ScoreSummary.displayName = 'ScoreSummary'
