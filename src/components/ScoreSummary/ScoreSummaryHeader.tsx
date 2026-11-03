import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Typography } from '../Typography'
import { SCORE_SUMMARY_COPY } from './copy'
import { ScoreSummaryBadge } from './ScoreSummaryBadge'
import type { ScoreSummaryType } from './types'

export interface ScoreSummaryHeaderProps
  extends StyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title'> {
  type: ScoreSummaryType
  title?: string
  score?: number
  onEvaluate?: () => void
  evaluateLabel?: string
}

export const ScoreSummaryHeader = forwardRef<HTMLDivElement, ScoreSummaryHeaderProps>(
  function ScoreSummaryHeader(
    {
      type,
      title = SCORE_SUMMARY_COPY.title,
      score,
      onEvaluate,
      evaluateLabel = SCORE_SUMMARY_COPY.evaluateLabel,
      className,
      ...rest
    },
    ref,
  ) {
    const isEvaluating = type === 'evaluating'

    return (
      <div
        ref={ref}
        data-testid="score-summary-header"
        className={cn('tm-flex tm-flex-wrap tm-items-center tm-gap-4', className)}
        {...rest}
      >
        <div className="tm-flex tm-min-w-0 tm-flex-wrap tm-items-center tm-gap-3">
          <Typography as="h2" variant="h4" className="tm-mb-0">
            {title}
          </Typography>
          {type === 'scored' && score !== undefined ? (
            <ScoreSummaryBadge type="scored" score={score} />
          ) : null}
          {type === 'insufficientData' || type === 'error' ? (
            <ScoreSummaryBadge type={type} />
          ) : null}
        </div>
        <Button
          variant={type === 'scored' ? 'tertiary' : 'secondary'}
          className="tm-ml-auto"
          onClick={onEvaluate}
          isLoading={isEvaluating}
        >
          {!isEvaluating ? (
            <Icon name={type === 'error' ? 'refresh-cw' : 'sparkles'} className="tm-text-base" />
          ) : null}
          {evaluateLabel}
        </Button>
      </div>
    )
  },
)

ScoreSummaryHeader.displayName = 'ScoreSummaryHeader'
