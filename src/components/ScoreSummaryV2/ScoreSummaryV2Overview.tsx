import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Alert } from '../Alert'
import { Link } from '../Link'
import { Typography } from '../Typography'
import { SCORE_SUMMARY_HELP_URL, getScoreSummaryV2Copy } from './copy'
import type { ScoreSummaryV2Type, ScoreUiLanguage } from './types'

export interface ScoreSummaryV2OverviewProps
  extends StyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  type: ScoreSummaryV2Type
  summary?: string
  summaryHeading?: string
  helpHref?: string
  uiLanguage?: ScoreUiLanguage
}

export const ScoreSummaryV2Overview = forwardRef<HTMLDivElement, ScoreSummaryV2OverviewProps>(
  function ScoreSummaryV2Overview(
    {
      type,
      summary,
      summaryHeading,
      helpHref = SCORE_SUMMARY_HELP_URL,
      uiLanguage = 'cs',
      className,
      ...rest
    },
    ref,
  ) {
    const copy = getScoreSummaryV2Copy(uiLanguage)
    const resolvedSummaryHeading = summaryHeading ?? copy.summaryHeading
    return (
      <div
        ref={ref}
        data-testid="score-summary-v2-overview"
        className={cn(className)}
        {...rest}
      >
        {type === 'scored' ? (
          <div className="tm-flex tm-flex-col tm-gap-1.5 tm-rounded tm-bg-cover-light tm-px-5 tm-py-4">
            <Typography as="h3" variant="h5" className="tm-mb-0">
              {resolvedSummaryHeading}
            </Typography>
            <Typography className="tm-mb-0 tm-max-w-[80ch]">{summary}</Typography>
          </div>
        ) : null}

        {type === 'insufficientData' ? (
          <Alert variant="warning">
            {copy.insufficientData}{' '}
            <Link href={helpHref} target="_blank">
              {copy.insufficientDataHelpLink}
            </Link>
          </Alert>
        ) : null}

        {type === 'error' ? <Alert variant="error">{copy.error}</Alert> : null}
      </div>
    )
  },
)

ScoreSummaryV2Overview.displayName = 'ScoreSummaryV2Overview'
