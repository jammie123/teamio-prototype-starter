import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SCORE_SUMMARY_HELP_URL, SCORE_SUMMARY_V2_COPY, SCORE_SUMMARY_V2_COPY_EN } from './copy'
import {
  sampleScoreSummaryV2Matches,
  sampleScoreSummaryV2Questions,
  sampleScoreSummaryV2Text,
} from './fixtures'
import { countMatchStatuses } from './matchCounts'
import { ScoreSummaryV2 } from './ScoreSummaryV2'
import type { ScoreSummaryV2Type } from './types'

const SCORED_PROPS = {
  type: 'scored' as const,
  score: 92,
  summary: sampleScoreSummaryV2Text,
  matches: sampleScoreSummaryV2Matches,
  questions: sampleScoreSummaryV2Questions,
}

const NON_SCORED_TYPES = [
  'notEvaluated',
  'insufficientData',
  'error',
] as const satisfies readonly Exclude<ScoreSummaryV2Type, 'scored'>[]

describe('countMatchStatuses', () => {
  it('counts met, partial and unmet matches', () => {
    expect(countMatchStatuses(sampleScoreSummaryV2Matches)).toEqual({
      met: 2,
      partial: 2,
      unmet: 1,
    })
  })
})

describe('ScoreSummaryV2', () => {
  it.each(['scored', ...NON_SCORED_TYPES] as const)('renders the title for type=%s', (type) => {
    if (type === 'scored') {
      render(<ScoreSummaryV2 {...SCORED_PROPS} />)
    } else {
      render(<ScoreSummaryV2 type={type} />)
    }

    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY.title })).toBeInTheDocument()
  })

  it('shows the empty-state status and actions without a description or language menu', () => {
    render(<ScoreSummaryV2 type="notEvaluated" />)

    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.notEvaluatedStatus)).toBeInTheDocument()
    expect(screen.queryByTestId('score-summary-v2-overview')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.criteriaLabel })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel })).toHaveClass(
      'tm-bg-action-primary-default',
    )
    expect(screen.queryByRole('button', { name: SCORE_SUMMARY_V2_COPY.moreActionsLabel })).not.toBeInTheDocument()
    expect(screen.queryByTestId('score-summary-v2-score')).not.toBeInTheDocument()
    expect(screen.queryByText('?')).not.toBeInTheDocument()
    expect(screen.getByTestId('score-summary-v2-header')).toHaveClass('tm-items-center')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('replaces the graph with a spinner and evaluating copy when isEvaluating', () => {
    render(<ScoreSummaryV2 type="notEvaluated" isEvaluating onEvaluate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY.evaluatingTitle })).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.evaluatingDescription)).toBeInTheDocument()
    expect(screen.getByRole('status', { name: SCORE_SUMMARY_V2_COPY.evaluatingTitle })).toBeInTheDocument()
    expect(screen.queryByText('?')).not.toBeInTheDocument()
    expect(screen.queryByText(SCORE_SUMMARY_V2_COPY.notEvaluatedStatus)).not.toBeInTheDocument()
    expect(screen.queryByTestId('score-summary-v2-overview')).not.toBeInTheDocument()
    const evaluate = screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel })
    expect(evaluate).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('score-summary-v2')).toHaveAttribute('data-evaluating', 'true')
  })

  it('replaces the score with a spinner and translating copy when isTranslate', () => {
    render(
      <ScoreSummaryV2
        {...SCORED_PROPS}
        isTranslate
        translateLanguage="ENG"
        defaultExpanded
        onEvaluate={vi.fn()}
      />,
    )

    const heading = SCORE_SUMMARY_V2_COPY.translatingTitle('ENG')
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.evaluatingDescription)).toBeInTheDocument()
    expect(screen.getByRole('status', { name: heading })).toBeInTheDocument()
    expect(screen.queryByText('92 %')).not.toBeInTheDocument()
    expect(screen.queryByTestId('score-summary-v2-overview')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: SCORE_SUMMARY_V2_COPY.moreActionsLabel })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.criteriaLabel })).toBeDisabled()
    const evaluate = screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel })
    expect(evaluate).toBeDisabled()
    expect(evaluate).not.toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('score-summary-v2')).toHaveAttribute('data-translating', 'true')
  })

  it('shows an informative translation offer under the compact header', async () => {
    const user = userEvent.setup()
    const onTranslate = vi.fn()
    render(
      <ScoreSummaryV2
        {...SCORED_PROPS}
        uiLanguage="en"
        showTranslationOffer
        onTranslate={onTranslate}
      />,
    )

    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY_EN.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.criteriaLabel })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.evaluateLabel })).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY_EN.matchCount.met(2))).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY_EN.matchCount.partial(2))).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY_EN.matchCount.unmet(1))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.showDetail })).toBeInTheDocument()
    expect(screen.getByText(sampleScoreSummaryV2Text)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: SCORE_SUMMARY_V2_COPY.title })).not.toBeInTheDocument()
    expect(screen.queryByText(SCORE_SUMMARY_V2_COPY.matchCount.met(2))).not.toBeInTheDocument()

    const offer = screen.getByTestId('score-summary-v2-translation-offer')
    const header = screen.getByTestId('score-summary-v2-header')
    const offerCopy = screen.getByText(SCORE_SUMMARY_V2_COPY_EN.translationOffer)
    const showDetail = screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.showDetail })
    expect(offer).toHaveTextContent(SCORE_SUMMARY_V2_COPY_EN.translationOffer)
    expect(header).not.toContainElement(offer)
    expect(header).not.toHaveTextContent(SCORE_SUMMARY_V2_COPY_EN.showDetail)
    expect(offer.compareDocumentPosition(header)).toBe(Node.DOCUMENT_POSITION_PRECEDING)
    const summary = screen.getByText(sampleScoreSummaryV2Text)
    expect(offer.compareDocumentPosition(summary)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(summary.compareDocumentPosition(showDetail)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY_EN.title })).toHaveClass('h4')
    expect(offerCopy.tagName).toBe('SPAN')
    expect(offerCopy).toHaveClass('tm-text-sm', 'tm-font-normal')
    expect(offerCopy).not.toHaveClass('h4', 'tm-text-base')
    expect(showDetail).toHaveClass('tm-text-sm')
    const translate = screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.translateAction })
    expect(translate).toHaveClass('tm-bg-action-primary-default')
    expect(within(translate).getByTestId('icon')).toHaveAttribute('data-icon-name', 'translate')

    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.showDetail }))
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY_EN.summaryHeading })).toBeInTheDocument()
    expect(screen.getByText(sampleScoreSummaryV2Text)).toBeInTheDocument()
    expect(screen.getByText(sampleScoreSummaryV2Matches[0].title)).toBeInTheDocument()
    expect(
      within(screen.getAllByTestId('score-summary-v2-match')[2]).getByText(SCORE_SUMMARY_V2_COPY_EN.matchStatus.met),
    ).toBeInTheDocument()
    expect(screen.queryByText(SCORE_SUMMARY_V2_COPY.matchStatus.met)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.hideDetail }))
    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY_EN.translateAction }))
    expect(onTranslate).toHaveBeenCalledTimes(1)
  })

  it('hides the translation offer when expanded or translating', () => {
    const { rerender } = render(<ScoreSummaryV2 {...SCORED_PROPS} showTranslationOffer defaultExpanded />)
    expect(screen.queryByTestId('score-summary-v2-translation-offer')).not.toBeInTheDocument()

    rerender(<ScoreSummaryV2 {...SCORED_PROPS} showTranslationOffer isTranslate />)
    expect(screen.queryByTestId('score-summary-v2-translation-offer')).not.toBeInTheDocument()
  })

  it('renders a warning alert, V1 copy and help link for insufficient data', () => {
    render(<ScoreSummaryV2 type="insufficientData" />)

    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.insufficientDataStatus)).toBeInTheDocument()
    const pendingRing = screen.getByTestId('score-summary-v2-score')
    expect(pendingRing).toHaveAccessibleName(SCORE_SUMMARY_V2_COPY.scorePendingLabel)
    expect(pendingRing).toHaveTextContent('?')
    expect(pendingRing).toHaveAttribute('data-pending', 'true')
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(SCORE_SUMMARY_V2_COPY.insufficientData)
    const help = screen.getByRole('link', { name: SCORE_SUMMARY_V2_COPY.insufficientDataHelpLink })
    expect(help).toHaveAttribute('href', SCORE_SUMMARY_HELP_URL)
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel })).toHaveClass(
      'tm-bg-action-primary-default',
    )
    expect(screen.queryByRole('button', { name: SCORE_SUMMARY_V2_COPY.moreActionsLabel })).not.toBeInTheDocument()
  })

  it('renders a danger alert for error, retry icon and no language menu', () => {
    render(<ScoreSummaryV2 type="error" />)

    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.errorStatus)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(SCORE_SUMMARY_V2_COPY.error)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    const evaluate = screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel })
    expect(evaluate).toHaveClass('tm-border-action-secondary-default')
    expect(within(evaluate).getByTestId('icon')).toHaveAttribute('data-icon-name', 'refresh-cw')
    expect(screen.queryByRole('button', { name: SCORE_SUMMARY_V2_COPY.moreActionsLabel })).not.toBeInTheDocument()
  })

  it('shows the score ring, counts and clamped summary when collapsed', () => {
    render(<ScoreSummaryV2 {...SCORED_PROPS} />)

    const ring = screen.getByTestId('score-summary-v2-score')
    expect(ring).toHaveAccessibleName(
      SCORE_SUMMARY_V2_COPY.scoreRingLabel(92, SCORE_SUMMARY_V2_COPY.matchQuality.success),
    )
    expect(ring).toHaveTextContent('92 %')
    expect(screen.queryByText(SCORE_SUMMARY_V2_COPY.matchQuality.success)).not.toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.matchCount.met(2))).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.matchCount.partial(2))).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.matchCount.unmet(1))).not.toHaveClass(
      'tm-font-semibold',
      'tm-text-emotion-danger-emphasis',
    )
    expect(screen.getByText(sampleScoreSummaryV2Text)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.showDetail })).toHaveClass(
      'tm-text-sm',
    )
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.showDetail })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByRole('heading', { name: SCORE_SUMMARY_V2_COPY.summaryHeading })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: SCORE_SUMMARY_V2_COPY.matchesHeading })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: SCORE_SUMMARY_V2_COPY.questionsHeading })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel })).toHaveClass(
      'tm-border-action-secondary-default',
    )
    expect(screen.getByTestId('score-summary-v2-header')).toHaveClass('tm-items-center')
    expect(screen.getByTestId('score-summary-v2-header')).not.toHaveTextContent(sampleScoreSummaryV2Text)
    expect(screen.getByTestId('score-summary-v2-header')).not.toHaveTextContent(SCORE_SUMMARY_V2_COPY.showDetail)
  })

  it.each([
    [55, SCORE_SUMMARY_V2_COPY.matchQuality.warning],
    [22, SCORE_SUMMARY_V2_COPY.matchQuality.danger],
  ] as const)('keeps score %s quality in the ring name only', (score, quality) => {
    render(<ScoreSummaryV2 {...SCORED_PROPS} score={score} />)

    expect(screen.queryByText(quality)).not.toBeInTheDocument()
    expect(screen.getByTestId('score-summary-v2-score')).toHaveAccessibleName(
      SCORE_SUMMARY_V2_COPY.scoreRingLabel(score, quality),
    )
  })

  it('expands to summary, matches, questions and collapse control', async () => {
    const user = userEvent.setup()
    render(<ScoreSummaryV2 {...SCORED_PROPS} />)

    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.showDetail }))

    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY.summaryHeading })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY.matchesHeading })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY.questionsHeading })).toBeInTheDocument()
    expect(screen.getAllByTestId('score-summary-v2-match')).toHaveLength(5)
    const firstMatch = screen.getAllByTestId('score-summary-v2-match')[0]
    expect(within(firstMatch).getByText(sampleScoreSummaryV2Matches[0].title)).toHaveClass(
      'tm-font-medium',
      'tm-text-primary-default',
    )
    expect(within(firstMatch).getByText(sampleScoreSummaryV2Matches[0].title)).not.toHaveClass(
      'tm-font-semibold',
    )
    expect(screen.getByText(sampleScoreSummaryV2Matches[0].description)).toBeInTheDocument()
    expect(
      within(screen.getAllByTestId('score-summary-v2-match')[2]).getByText(SCORE_SUMMARY_V2_COPY.matchStatus.met),
    ).toHaveClass('tm-font-normal')
    expect(screen.getByText(sampleScoreSummaryV2Questions[0].text)).toBeInTheDocument()
    expect(
      screen.getByText(`${SCORE_SUMMARY_V2_COPY.verifiesPrefix} ${sampleScoreSummaryV2Questions[0].verifies}`),
    ).toBeInTheDocument()
    const hide = screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.hideDetail })
    expect(hide).toHaveAttribute('aria-expanded', 'true')

    await user.click(hide)
    expect(screen.queryByRole('heading', { name: SCORE_SUMMARY_V2_COPY.matchesHeading })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.showDetail })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('opens expanded when defaultExpanded is set', () => {
    render(<ScoreSummaryV2 {...SCORED_PROPS} defaultExpanded />)

    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY.matchesHeading })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.hideDetail })).toBeInTheDocument()
    expect(screen.getByTestId('score-summary-v2-header')).toHaveClass('tm-items-center')
  })

  it('calls onEvaluate and onOpenCriteria', async () => {
    const user = userEvent.setup()
    const onEvaluate = vi.fn()
    const onOpenCriteria = vi.fn()
    render(<ScoreSummaryV2 {...SCORED_PROPS} onEvaluate={onEvaluate} onOpenCriteria={onOpenCriteria} />)

    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel }))
    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.criteriaLabel }))

    expect(onEvaluate).toHaveBeenCalledTimes(1)
    expect(onOpenCriteria).toHaveBeenCalledTimes(1)
  })

  it('lets the language menu switch evaluation language on scored cards', async () => {
    const user = userEvent.setup()
    const onEvaluationLanguageChange = vi.fn()
    render(
      <ScoreSummaryV2
        {...SCORED_PROPS}
        evaluationLanguage="cs"
        onEvaluationLanguageChange={onEvaluationLanguageChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.moreActionsLabel }))
    expect(screen.getByText(SCORE_SUMMARY_V2_COPY.languageHeading)).toBeInTheDocument()
    expect(screen.getByRole('option', { name: SCORE_SUMMARY_V2_COPY.languageCs })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.click(screen.getByRole('option', { name: SCORE_SUMMARY_V2_COPY.languageEn }))
    expect(onEvaluationLanguageChange).toHaveBeenCalledWith('en')
  })

  it.each(NON_SCORED_TYPES)('calls onEvaluate from type=%s', async (type) => {
    const user = userEvent.setup()
    const onEvaluate = vi.fn()
    render(<ScoreSummaryV2 type={type} onEvaluate={onEvaluate} />)

    await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_V2_COPY.evaluateLabel }))
    expect(onEvaluate).toHaveBeenCalledTimes(1)
  })
})
