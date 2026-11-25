import { forwardRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { Typography } from '../Typography'
import { getScoreSummaryV2Copy } from './copy'
import { countMatchStatuses } from './matchCounts'
import { ScoreSummaryV2Header } from './ScoreSummaryV2Header'
import { ScoreSummaryV2Matches } from './ScoreSummaryV2Matches'
import { ScoreSummaryV2Overview } from './ScoreSummaryV2Overview'
import { ScoreSummaryV2Questions } from './ScoreSummaryV2Questions'
import type { ScoreEvaluationLanguage, ScoreSummaryV2Props } from './types'

export type { ScoreSummaryV2Props }

export const ScoreSummaryV2 = forwardRef<HTMLElement, ScoreSummaryV2Props>(function ScoreSummaryV2(
  props,
  ref,
) {
  const {
    type,
    title,
    onEvaluate,
    evaluateLabel,
    onOpenCriteria,
    criteriaLabel,
    helpHref,
    isEvaluating = false,
    isTranslate = false,
    translateLanguage,
    uiLanguage = 'cs',
    showTranslationOffer = false,
    onTranslate,
    className,
  } = props
  const copy = getScoreSummaryV2Copy(uiLanguage)
  const scored = type === 'scored' ? props : undefined

  const isExpandedControlled = scored?.expanded !== undefined
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(scored?.defaultExpanded ?? false)
  const expanded = scored ? (isExpandedControlled ? scored.expanded : uncontrolledExpanded) : false

  const isLanguageControlled = scored?.evaluationLanguage !== undefined
  const [uncontrolledLanguage, setUncontrolledLanguage] = useState<ScoreEvaluationLanguage>(
    scored?.evaluationLanguage ?? 'cs',
  )
  const evaluationLanguage = scored
    ? isLanguageControlled
      ? scored.evaluationLanguage
      : uncontrolledLanguage
    : undefined

  const setExpanded = (next: boolean) => {
    if (!isExpandedControlled) {
      setUncontrolledExpanded(next)
    }
    scored?.onExpandedChange?.(next)
  }

  const setLanguage = (language: ScoreEvaluationLanguage) => {
    if (!isLanguageControlled) {
      setUncontrolledLanguage(language)
    }
    scored?.onEvaluationLanguageChange?.(language)
  }

  const counts = scored ? countMatchStatuses(scored.matches) : undefined
  const isBusy = isEvaluating || isTranslate
  const showTranslationBanner = Boolean(scored) && showTranslationOffer && !expanded && !isBusy
  const showCollapsedSummary = Boolean(scored?.summary) && !expanded && !isBusy
  const showCompactToggle = Boolean(scored) && !expanded && !isBusy && (showTranslationBanner || showCollapsedSummary)
  const showExpandedBody = isBusy
    ? false
    : type === 'scored'
      ? expanded
      : type !== 'notEvaluated'

  return (
    <Card
      ref={ref}
      data-testid="score-summary-v2"
      data-type={type}
      data-evaluating={isEvaluating || undefined}
      data-translating={isTranslate || undefined}
      className={cn('tm-flex tm-flex-col tm-gap-6 !tm-px-8 !tm-py-6', className)}
    >
      <div className="tm-flex tm-flex-col tm-gap-4">
        <ScoreSummaryV2Header
          type={type}
          title={title}
          score={scored?.score}
          counts={counts}
          onEvaluate={onEvaluate}
          evaluateLabel={evaluateLabel}
          onOpenCriteria={onOpenCriteria}
          criteriaLabel={criteriaLabel}
          evaluationLanguage={evaluationLanguage}
          onEvaluationLanguageChange={setLanguage}
          isEvaluating={isEvaluating}
          isTranslate={isTranslate}
          translateLanguage={translateLanguage}
          uiLanguage={uiLanguage}
        />

        {showCompactToggle ? (
          <div
            className={cn(
              'tm-flex tm-flex-col',
              showTranslationBanner ? 'tm-gap-3' : 'tm-gap-1.5',
            )}
          >
            {showTranslationBanner ? (
              <Alert variant="info" isCentered data-testid="score-summary-v2-translation-offer">
                <div className="tm-flex tm-flex-wrap tm-items-center tm-justify-between tm-gap-3">
                  <Typography as="span" className="tm-text-sm tm-font-normal">
                    {copy.translationOffer}
                  </Typography>
                  <Button variant="primary" onClick={onTranslate} className="tm-shrink-0">
                    <Icon name="translate" className="tm-text-base" />
                    {copy.translateAction}
                  </Button>
                </div>
              </Alert>
            ) : null}
            <div className="tm-flex tm-flex-col tm-gap-1.5">
              {showCollapsedSummary ? (
                <Typography className="tm-mb-0 tm-line-clamp-2 tm-max-w-[80ch] tm-text-sm tm-text-secondary-default">
                  {scored?.summary}
                </Typography>
              ) : null}
              <Link
                onClick={() => setExpanded(true)}
                aria-expanded={false}
                className="tm-inline-flex tm-items-center tm-gap-1 tm-self-start tm-text-sm"
              >
                {copy.showDetail}
                <Icon name="chevron-down" className="tm-text-sm" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {showExpandedBody ? (
        <div className="tm-flex tm-flex-col tm-gap-6 tm-border-t tm-border-secondary tm-pt-6">
          <ScoreSummaryV2Overview
            type={type}
            summary={scored?.summary}
            summaryHeading={scored?.summaryHeading}
            helpHref={helpHref}
            uiLanguage={uiLanguage}
          />
          {scored ? (
            <>
              <ScoreSummaryV2Matches
                matches={scored.matches}
                heading={scored.matchesHeading}
                uiLanguage={uiLanguage}
              />
              <ScoreSummaryV2Questions
                questions={scored.questions}
                heading={scored.questionsHeading}
                uiLanguage={uiLanguage}
              />
              <div className="tm-border-t tm-border-secondary tm-pt-4">
                <Link
                  onClick={() => setExpanded(false)}
                  aria-expanded={true}
                  className="tm-inline-flex tm-items-center tm-gap-1"
                >
                  {copy.hideDetail}
                  <Icon name="chevron-up" className="tm-text-base" />
                </Link>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </Card>
  )
})

ScoreSummaryV2.displayName = 'ScoreSummaryV2'
