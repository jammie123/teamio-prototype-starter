import { forwardRef, type LiHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon, type IconName } from '../Icon'
import { Typography } from '../Typography'
import { SCORE_SUMMARY_V2_COPY } from './copy'
import type { ScoreMatchItem, ScoreMatchStatus } from './types'

export type ScoreSummaryV2MatchCompactItem = Pick<ScoreMatchItem, 'id' | 'title' | 'status'>

export interface ScoreSummaryV2MatchCompactProps
  extends StyleProps, Omit<LiHTMLAttributes<HTMLLIElement>, 'color' | 'title'> {
  match: ScoreSummaryV2MatchCompactItem
}

const STATUS_ICON: Record<ScoreMatchStatus, IconName> = {
  met: 'check',
  partial: 'minus',
  unmet: 'x',
}

const STATUS_CIRCLE: Record<ScoreMatchStatus, string> = {
  met: 'tm-bg-emotion-success-active tm-text-primary-inverted-default',
  partial: 'tm-bg-emotion-warning-hover tm-text-primary-default',
  unmet: 'tm-bg-emotion-danger-active tm-text-primary-inverted-default',
}

export const ScoreSummaryV2MatchCompact = forwardRef<HTMLLIElement, ScoreSummaryV2MatchCompactProps>(
  function ScoreSummaryV2MatchCompact({ match, className, ...rest }, ref) {
    const statusLabel = SCORE_SUMMARY_V2_COPY.matchStatus[match.status]

    return (
      <li
        ref={ref}
        data-testid="score-summary-v2-match-compact"
        data-status={match.status}
        aria-label={`${match.title} (${statusLabel})`}
        className={cn('tm-flex tm-items-center tm-gap-1.5 tm-py-1', className)}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cn(
            'tm-inline-flex tm-size-4 tm-shrink-0 tm-items-center tm-justify-center tm-rounded-full',
            STATUS_CIRCLE[match.status],
          )}
        >
          <Icon name={STATUS_ICON[match.status]} className="tm-text-[0.625rem]" />
        </span>
        <Typography as="span" className="tm-mb-0 tm-text-xs tm-leading-snug">
          {match.title}
        </Typography>
      </li>
    )
  },
)

ScoreSummaryV2MatchCompact.displayName = 'ScoreSummaryV2MatchCompact'
