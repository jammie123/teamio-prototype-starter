import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Typography } from '../Typography'
import { getScoreSummaryV2Copy } from './copy'
import type { ScoreQuestionItem, ScoreUiLanguage } from './types'

export interface ScoreSummaryV2QuestionsProps
  extends StyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  questions: ScoreQuestionItem[]
  heading?: string
  uiLanguage?: ScoreUiLanguage
}

export const ScoreSummaryV2Questions = forwardRef<HTMLDivElement, ScoreSummaryV2QuestionsProps>(
  function ScoreSummaryV2Questions(
    { questions, heading, uiLanguage = 'cs', className, ...rest },
    ref,
  ) {
    const copy = getScoreSummaryV2Copy(uiLanguage)
    const resolvedHeading = heading ?? copy.questionsHeading
    return (
      <div
        ref={ref}
        data-testid="score-summary-v2-questions"
        className={cn('tm-flex tm-flex-col tm-gap-3 tm-border-t tm-border-secondary tm-pt-6', className)}
        {...rest}
      >
        <Typography as="h3" variant="h4" className="tm-mb-0">
          {resolvedHeading}
        </Typography>
        <ol className="tm-mb-0 tm-flex tm-list-none tm-flex-col tm-gap-3 tm-p-0">
          {questions.map((question, index) => (
            <li
              key={question.id}
              className="tm-grid tm-grid-cols-[1.75rem_minmax(0,1fr)] tm-items-start tm-gap-x-4"
            >
              <span
                aria-hidden="true"
                className="tm-inline-flex tm-size-7 tm-shrink-0 tm-items-center tm-justify-center tm-rounded-full tm-bg-emotion-info-background tm-text-13 tm-font-semibold tm-text-emotion-info-emphasis"
              >
                {index + 1}
              </span>
              <div className="tm-flex tm-flex-col tm-gap-0.5">
                <Typography className="tm-mb-0">{question.text}</Typography>
                <Typography variant="caption" className="tm-mb-0">
                  {copy.verifiesPrefix} {question.verifies}
                </Typography>
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  },
)

ScoreSummaryV2Questions.displayName = 'ScoreSummaryV2Questions'
