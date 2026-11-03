import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Tag } from '../Tag'
import { SCORE_SUMMARY_COPY } from './copy'
import { clampScore, getScoreBadgeTone } from './scoreBadgeTone'
import { ScoreSummarySparklePending } from './ScoreSummarySparklePending'
import type { ScoreSummaryType } from './types'

export type ScoreSummaryBadgeType = Exclude<ScoreSummaryType, 'notEvaluated'>

type BadgeBaseProps = StyleProps & Omit<HTMLAttributes<HTMLSpanElement>, 'color'>

export type ScoreSummaryBadgeProps =
  | (BadgeBaseProps & { type?: 'scored'; score: number })
  | (BadgeBaseProps & { type: Exclude<ScoreSummaryBadgeType, 'scored'>; score?: never })

const PILL_CLASS =
  'tm-inline-flex tm-items-center tm-justify-center tm-gap-1 tm-min-h-6 tm-px-2 tm-py-0.5 tm-rounded-full tm-font-poppins tm-text-sm tm-font-normal tm-border-0'

const CoverLightBadge = forwardRef<
  HTMLSpanElement,
  BadgeBaseProps & { badgeType: ScoreSummaryBadgeType; label: string; children: ReactNode }
>(function CoverLightBadge({ badgeType, label, className, children, ...rest }, ref) {
  return (
    <span
      ref={ref}
      data-testid="score-summary-badge"
      data-badge-type={badgeType}
      aria-label={label}
      className={cn(PILL_CLASS, 'tm-bg-cover-light tm-text-secondary-default', className)}
      {...rest}
    >
      {children}
    </span>
  )
})

export const ScoreSummaryBadge = forwardRef<HTMLSpanElement, ScoreSummaryBadgeProps>(
  function ScoreSummaryBadge(props, ref) {
    const { className, type = 'scored', ...rest } = props

    if (type === 'insufficientData') {
      return (
        <CoverLightBadge
          ref={ref}
          badgeType="insufficientData"
          label={SCORE_SUMMARY_COPY.insufficientDataBadge}
          className={className}
          {...rest}
        >
          <Icon name="sparkles" className="tm-text-xs" />
          <Icon name="circle-help" className="tm-text-sm" />
        </CoverLightBadge>
      )
    }

    if (type === 'evaluating') {
      return (
        <CoverLightBadge
          ref={ref}
          badgeType="evaluating"
          label={SCORE_SUMMARY_COPY.evaluatingStatus}
          className={className}
          {...rest}
        >
          <ScoreSummarySparklePending />
        </CoverLightBadge>
      )
    }

    if (type === 'error') {
      return (
        <Tag
          ref={ref}
          color="danger"
          isSubtle
          data-testid="score-summary-badge"
          data-badge-type="error"
          aria-label={SCORE_SUMMARY_COPY.errorBadge}
          className={cn('tm-gap-1', className)}
          {...rest}
        >
          <Icon name="sparkles" className="tm-text-xs" />
        </Tag>
      )
    }

    const value = clampScore('score' in props && typeof props.score === 'number' ? props.score : 0)

    return (
      <Tag
        ref={ref}
        color={getScoreBadgeTone(value)}
        isSubtle
        data-testid="score-summary-badge"
        data-badge-type="scored"
        aria-label={SCORE_SUMMARY_COPY.scoreBadgeLabel(value)}
        className={cn('tm-gap-1', className)}
        {...rest}
      >
        <Icon name="sparkles" className="tm-text-xs" />
        {value} %
      </Tag>
    )
  },
)

CoverLightBadge.displayName = 'CoverLightBadge'
ScoreSummaryBadge.displayName = 'ScoreSummaryBadge'
