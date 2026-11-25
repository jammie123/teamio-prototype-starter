import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import { Spinner } from '../Spinner'
import { Typography } from '../Typography'
import { getScoreSummaryV2Copy } from './copy'
import type { MatchCounts } from './matchCounts'
import { ScoreSummaryV2Score } from './ScoreSummaryV2Score'
import type { ScoreEvaluationLanguage, ScoreSummaryV2Type, ScoreUiLanguage } from './types'

export interface ScoreSummaryV2HeaderProps
  extends StyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title'> {
  type: ScoreSummaryV2Type
  title?: string
  score?: number
  counts?: MatchCounts
  onEvaluate?: () => void
  evaluateLabel?: string
  onOpenCriteria?: () => void
  criteriaLabel?: string
  evaluationLanguage?: ScoreEvaluationLanguage
  onEvaluationLanguageChange?: (language: ScoreEvaluationLanguage) => void
  isEvaluating?: boolean
  isTranslate?: boolean
  translateLanguage?: string
  uiLanguage?: ScoreUiLanguage
}

function statusCopy(
  type: ScoreSummaryV2Type,
  copy: ReturnType<typeof getScoreSummaryV2Copy>,
): string | null {
  switch (type) {
    case 'notEvaluated':
      return copy.notEvaluatedStatus
    case 'insufficientData':
      return copy.insufficientDataStatus
    case 'error':
      return copy.errorStatus
    default:
      return null
  }
}

export const ScoreSummaryV2Header = forwardRef<HTMLDivElement, ScoreSummaryV2HeaderProps>(
  function ScoreSummaryV2Header(
    {
      type,
      title,
      score,
      counts,
      onEvaluate,
      evaluateLabel,
      onOpenCriteria,
      criteriaLabel,
      evaluationLanguage = 'cs',
      onEvaluationLanguageChange,
      isEvaluating = false,
      isTranslate = false,
      translateLanguage = 'ENG',
      uiLanguage = 'cs',
      className,
      ...rest
    },
    ref,
  ) {
    const copy = getScoreSummaryV2Copy(uiLanguage)
    const resolvedTitle = title ?? copy.title
    const resolvedEvaluateLabel = evaluateLabel ?? copy.evaluateLabel
    const resolvedCriteriaLabel = criteriaLabel ?? copy.criteriaLabel
    const isScored = type === 'scored'
    const isBusy = isEvaluating || isTranslate
    const evaluateVariant = type === 'notEvaluated' || type === 'insufficientData' ? 'primary' : 'secondary'
    const translatingTitle = copy.translatingTitle(translateLanguage)
    const status = isEvaluating || isTranslate
      ? copy.evaluatingDescription
      : statusCopy(type, copy)
    const heading = isEvaluating
      ? copy.evaluatingTitle
      : isTranslate
        ? translatingTitle
        : resolvedTitle
    const spinnerLabel = isEvaluating ? copy.evaluatingTitle : translatingTitle

    return (
      <div
        ref={ref}
        data-testid="score-summary-v2-header"
        className={cn('tm-flex tm-items-center tm-gap-4', className)}
        {...rest}
      >
        {isBusy ? (
          <div
            className="tm-inline-flex tm-size-14 tm-shrink-0 tm-items-center tm-justify-center"
            data-testid="score-summary-v2-score"
          >
            <Spinner
              label={spinnerLabel}
              className="tm-text-[2rem] tm-text-teamio-pink before:!tm-border-[3px] after:!tm-border-[3px]"
            />
          </div>
        ) : null}
        {!isBusy && isScored && score !== undefined ? (
          <ScoreSummaryV2Score score={score} uiLanguage={uiLanguage} />
        ) : null}
        {!isBusy && type === 'insufficientData' ? (
          <ScoreSummaryV2Score pending uiLanguage={uiLanguage} />
        ) : null}

        <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-1">
          <Typography as="h2" variant="h4" className="tm-mb-0">
            {heading}
          </Typography>

          {!isBusy && isScored && counts ? (
            <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-4 tm-text-13 tm-text-secondary-default">
              <span className="tm-inline-flex tm-items-center tm-gap-1.5">
                <span className="tm-size-2 tm-rounded-full tm-bg-emotion-success-active" aria-hidden="true" />
                {copy.matchCount.met(counts.met)}
              </span>
              <span className="tm-inline-flex tm-items-center tm-gap-1.5">
                <span className="tm-size-2 tm-rounded-full tm-bg-emotion-warning-hover" aria-hidden="true" />
                {copy.matchCount.partial(counts.partial)}
              </span>
              <span className="tm-inline-flex tm-items-center tm-gap-1.5">
                <span className="tm-size-2 tm-rounded-full tm-bg-emotion-danger-active" aria-hidden="true" />
                {copy.matchCount.unmet(counts.unmet)}
              </span>
            </div>
          ) : null}

          {status ? (
            <Typography variant="caption" className="tm-mb-0">
              {status}
            </Typography>
          ) : null}
        </div>

        <div className="tm-flex tm-shrink-0 tm-items-center tm-gap-2">
          <Button variant="secondary" onClick={onOpenCriteria} isDisabled={isTranslate}>
            <Icon name="list-checks" className="tm-text-base" />
            {resolvedCriteriaLabel}
          </Button>
          <Button
            variant={evaluateVariant}
            onClick={onEvaluate}
            isLoading={isEvaluating}
            isDisabled={isTranslate}
          >
            {!isEvaluating ? (
              <Icon name={type === 'error' ? 'refresh-cw' : 'sparkles'} className="tm-text-base" />
            ) : null}
            {resolvedEvaluateLabel}
          </Button>
          {isScored && !isBusy ? (
            <Dropdown placement="bottom-end">
              <DropdownToggle
                variant="button-tertiary-circle"
                aria-label={copy.moreActionsLabel}
              >
                <Icon name="more-horizontal" className="tm-text-lg" />
              </DropdownToggle>
              <DropdownBody>
                <div className="tm-px-2 tm-py-1 tm-text-xs tm-font-semibold tm-text-secondary-default">
                  {copy.languageHeading}
                </div>
                <OptionList>
                  <Option
                    isSelected={evaluationLanguage === 'en'}
                    onClick={() => onEvaluationLanguageChange?.('en')}
                  >
                    {copy.languageEn}
                  </Option>
                  <Option
                    isSelected={evaluationLanguage === 'cs'}
                    onClick={() => onEvaluationLanguageChange?.('cs')}
                  >
                    {copy.languageCs}
                  </Option>
                </OptionList>
              </DropdownBody>
            </Dropdown>
          ) : null}
        </div>
      </div>
    )
  },
)

ScoreSummaryV2Header.displayName = 'ScoreSummaryV2Header'
