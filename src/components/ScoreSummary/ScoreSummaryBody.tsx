import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Alert } from '../Alert'
import { Link } from '../Link'
import { Spinner } from '../Spinner'
import { Typography } from '../Typography'
import { SCORE_SUMMARY_COPY, SCORE_SUMMARY_HELP_URL } from './copy'
import { EvaluationItem } from './EvaluationItem'
import type { EvaluationItemData, ScoreSummaryType } from './types'

export interface ScoreSummaryBodyProps
  extends StyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  type: ScoreSummaryType
  summary?: string
  criteria?: EvaluationItemData[]
  questions?: string[]
  helpHref?: string
  summaryHeading?: string
  criteriaHeading?: string
  questionsHeading?: string
}

function HelpLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} target="_blank">
      {children}
    </Link>
  )
}

export const ScoreSummaryBody = forwardRef<HTMLDivElement, ScoreSummaryBodyProps>(
  function ScoreSummaryBody(
    {
      type,
      summary,
      criteria = [],
      questions = [],
      helpHref = SCORE_SUMMARY_HELP_URL,
      summaryHeading = SCORE_SUMMARY_COPY.summaryHeading,
      criteriaHeading = SCORE_SUMMARY_COPY.criteriaHeading,
      questionsHeading = SCORE_SUMMARY_COPY.questionsHeading,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-testid="score-summary-body"
        className={cn('tm-mt-4', className)}
        {...rest}
      >
        {type === 'scored' ? (
          <div className="tm-flex tm-flex-col tm-gap-4">
            <div
              data-testid="score-summary-summary"
              className="tm-rounded tm-border tm-border-secondary tm-p-4"
            >
              <Typography as="h3" variant="h4">
                {summaryHeading}
              </Typography>
              <Typography className="tm-mb-0">{summary}</Typography>
            </div>
            <div>
              <Typography as="h3" variant="h4">
                {criteriaHeading}
              </Typography>
              <div
                data-testid="score-summary-criteria"
                className="tm-grid tm-grid-cols-1 tm-gap-x-6 tm-gap-y-3 sm:tm-grid-cols-2"
              >
                {criteria.map((item) => (
                  <EvaluationItem key={item.id} label={item.label} status={item.status} />
                ))}
              </div>
            </div>
            <div>
              <Typography as="h3" variant="h4">
                {questionsHeading}
              </Typography>
              <ul data-testid="score-summary-questions" className="tm-mb-0">
                {questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {type === 'insufficientData' ? (
          <Alert variant="warning">
            {SCORE_SUMMARY_COPY.insufficientData}{' '}
            <HelpLink href={helpHref}>{SCORE_SUMMARY_COPY.insufficientDataHelpLink}</HelpLink>
          </Alert>
        ) : null}

        {type === 'notEvaluated' ? (
          <Typography className="tm-mb-0">
            {SCORE_SUMMARY_COPY.notEvaluated}{' '}
            <HelpLink href={helpHref}>{SCORE_SUMMARY_COPY.helpLink}</HelpLink>
          </Typography>
        ) : null}

        {type === 'error' ? <Alert variant="error">{SCORE_SUMMARY_COPY.error}</Alert> : null}

        {type === 'evaluating' ? (
          <div className="tm-flex tm-items-start tm-gap-3">
            <Spinner label={SCORE_SUMMARY_COPY.evaluatingStatus} className="tm-mt-1 tm-text-base" />
            <Typography className="tm-mb-0">{SCORE_SUMMARY_COPY.evaluating}</Typography>
          </div>
        ) : null}
      </div>
    )
  },
)

ScoreSummaryBody.displayName = 'ScoreSummaryBody'
