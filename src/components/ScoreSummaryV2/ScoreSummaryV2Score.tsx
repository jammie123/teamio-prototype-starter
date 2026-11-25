import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { clampScore, getScoreBadgeTone } from '../ScoreSummary/scoreBadgeTone'
import type { ScoreBadgeTone } from '../ScoreSummary/types'
import { getScoreSummaryV2Copy } from './copy'
import type { ScoreUiLanguage } from './types'

const SIZE = 56
const STROKE = 6
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const TONE_TEXT: Record<ScoreBadgeTone, string> = {
  success: 'tm-text-emotion-success-emphasis',
  warning: 'tm-text-emotion-warning-emphasis',
  danger: 'tm-text-emotion-danger-emphasis',
}

const TONE_STROKE: Record<ScoreBadgeTone, string> = {
  success: 'tm-text-emotion-success-active',
  warning: 'tm-text-emotion-warning-active',
  danger: 'tm-text-emotion-danger-active',
}

type ScoreSummaryV2ScoreBaseProps = StyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'color'> & {
    uiLanguage?: ScoreUiLanguage
  }

export type ScoreSummaryV2ScoreProps =
  | (ScoreSummaryV2ScoreBaseProps & { pending?: false; score: number })
  | (ScoreSummaryV2ScoreBaseProps & { pending: true; score?: never })

export const ScoreSummaryV2Score = forwardRef<HTMLDivElement, ScoreSummaryV2ScoreProps>(
  function ScoreSummaryV2Score(props, ref) {
    const { className, pending: pendingProp, score, uiLanguage = 'cs', ...rest } = props
    const copy = getScoreSummaryV2Copy(uiLanguage)
    const pending = pendingProp === true
    const value = pending ? 0 : clampScore(score ?? 0)
    const tone = pending ? undefined : getScoreBadgeTone(value)
    const quality = tone ? copy.matchQuality[tone] : undefined
    const dash = (value / 100) * CIRCUMFERENCE
    const label = pending
      ? copy.scorePendingLabel
      : copy.scoreRingLabel(value, quality ?? '')

    return (
      <div
        ref={ref}
        role="img"
        data-testid="score-summary-v2-score"
        data-pending={pending || undefined}
        aria-label={label}
        className={cn('tm-relative tm-size-14 tm-shrink-0', className)}
        {...rest}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="tm-size-14 -tm-rotate-90" aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="tm-text-gray-300"
          />
          {!pending ? (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
              className={TONE_STROKE[tone ?? 'success']}
            />
          ) : null}
        </svg>
        <span
          className={cn(
            'tm-absolute tm-inset-0 tm-flex tm-items-center tm-justify-center tm-tracking-tight',
            pending
              ? 'tm-text-lg tm-font-medium tm-text-secondary-default'
              : cn('tm-text-sm tm-font-bold', tone ? TONE_TEXT[tone] : null),
          )}
        >
          {pending ? '?' : `${value} %`}
        </span>
      </div>
    )
  },
)

ScoreSummaryV2Score.displayName = 'ScoreSummaryV2Score'
