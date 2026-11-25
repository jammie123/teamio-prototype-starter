import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Typography } from '../Typography'
import { getScoreSummaryV2Copy } from './copy'
import { ScoreSummaryV2Match } from './ScoreSummaryV2Match'
import type { ScoreMatchItem, ScoreUiLanguage } from './types'

export interface ScoreSummaryV2MatchesProps
  extends StyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  matches: ScoreMatchItem[]
  heading?: string
  uiLanguage?: ScoreUiLanguage
}

export const ScoreSummaryV2Matches = forwardRef<HTMLDivElement, ScoreSummaryV2MatchesProps>(
  function ScoreSummaryV2Matches(
    { matches, heading, uiLanguage = 'cs', className, ...rest },
    ref,
  ) {
    const resolvedHeading = heading ?? getScoreSummaryV2Copy(uiLanguage).matchesHeading

    return (
      <div
        ref={ref}
        data-testid="score-summary-v2-matches"
        className={cn('tm-flex tm-flex-col tm-gap-1', className)}
        {...rest}
      >
        <Typography as="h3" variant="h4" className="tm-mb-0 tm-pb-2">
          {resolvedHeading}
        </Typography>
        <ul className="tm-mb-0 tm-flex tm-list-none tm-flex-col tm-p-0">
          {matches.map((match) => (
            <ScoreSummaryV2Match key={match.id} match={match} uiLanguage={uiLanguage} />
          ))}
        </ul>
      </div>
    )
  },
)

ScoreSummaryV2Matches.displayName = 'ScoreSummaryV2Matches'
