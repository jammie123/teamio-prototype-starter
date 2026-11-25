import { forwardRef, type LiHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon, type IconName } from '../Icon'
import { Tag, type TagColor } from '../Tag'
import { Typography } from '../Typography'
import { getScoreSummaryV2Copy } from './copy'
import type { ScoreMatchItem, ScoreMatchStatus, ScoreUiLanguage } from './types'

export interface ScoreSummaryV2MatchProps
  extends StyleProps, Omit<LiHTMLAttributes<HTMLLIElement>, 'color' | 'title'> {
  match: ScoreMatchItem
  uiLanguage?: ScoreUiLanguage
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

const STATUS_TAG: Record<ScoreMatchStatus, TagColor> = {
  met: 'success',
  partial: 'warning',
  unmet: 'danger',
}

export const ScoreSummaryV2Match = forwardRef<HTMLLIElement, ScoreSummaryV2MatchProps>(
  function ScoreSummaryV2Match({ match, uiLanguage = 'cs', className, ...rest }, ref) {
    const statusLabel = getScoreSummaryV2Copy(uiLanguage).matchStatus[match.status]

    return (
      <li
        ref={ref}
        data-testid="score-summary-v2-match"
        data-status={match.status}
        className={cn(
          'tm-grid tm-grid-cols-[1.75rem_minmax(0,1fr)_auto] tm-items-start tm-gap-x-4 tm-border-t tm-border-secondary tm-py-4',
          className,
        )}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cn(
            'tm-mt-px tm-inline-flex tm-size-7 tm-shrink-0 tm-items-center tm-justify-center tm-rounded-full',
            STATUS_CIRCLE[match.status],
          )}
        >
          <Icon name={STATUS_ICON[match.status]} className="tm-text-sm" />
        </span>
        <div className="tm-flex tm-min-w-0 tm-flex-col tm-gap-1">
          <Typography as="div" className="tm-mb-0 tm-font-medium tm-text-primary-default">
            {match.title}
          </Typography>
          <Typography className="tm-mb-0 tm-max-w-[78ch] tm-text-sm tm-text-secondary-default">
            {match.description}
          </Typography>
        </div>
        <Tag color={STATUS_TAG[match.status]} isSubtle className="tm-mt-px">
          {statusLabel}
        </Tag>
      </li>
    )
  },
)

ScoreSummaryV2Match.displayName = 'ScoreSummaryV2Match'
