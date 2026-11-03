import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SCORE_SUMMARY_COPY, SCORE_SUMMARY_HELP_URL } from './copy'
import { EvaluationItem } from './EvaluationItem'
import {
  sampleScoreSummaryCriteria,
  sampleScoreSummaryQuestions,
  sampleScoreSummaryText,
} from './fixtures'
import { ScoreSummary } from './ScoreSummary'
import { ScoreSummaryBadge } from './ScoreSummaryBadge'
import type { ScoreSummaryType } from './types'

const SCORED_PROPS = {
  type: 'scored' as const,
  score: 92,
  summary: sampleScoreSummaryText,
  criteria: sampleScoreSummaryCriteria,
  questions: sampleScoreSummaryQuestions,
}

const TYPES_WITHOUT_SCORE = [
  'insufficientData',
  'notEvaluated',
  'error',
  'evaluating',
] as const satisfies readonly ScoreSummaryType[]

describe('EvaluationItem', () => {
  it('includes the criterion status in the accessible name, not only color', () => {
    render(<EvaluationItem label="ITSM, governance, asset mgmt" status="met" />)

    const item = screen.getByTestId('evaluation-item')
    expect(item).toHaveAccessibleName(/splněno/)
    expect(item).toHaveTextContent('ITSM, governance, asset mgmt')
    expect(within(item).getByTestId('icon')).toHaveAttribute('data-icon-name', 'check')
  })

  it.each([
    ['partial', 'částečně splněno', 'circle-help'],
    ['unmet', 'nesplněno', 'x'],
  ] as const)('exposes %s status with icon %s', (status, statusLabel, iconName) => {
    render(<EvaluationItem label="Kritérium" status={status} />)

    const item = screen.getByTestId('evaluation-item')
    expect(item).toHaveAccessibleName(new RegExp(statusLabel))
    expect(within(item).getByTestId('icon')).toHaveAttribute('data-icon-name', iconName)
  })
})

describe('ScoreSummary', () => {
  it.each(['scored', ...TYPES_WITHOUT_SCORE] as const)('renders the title for type=%s', (type) => {
    if (type === 'scored') {
      render(<ScoreSummary {...SCORED_PROPS} />)
    } else {
      render(<ScoreSummary type={type} />)
    }

    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_COPY.title })).toHaveClass('h4')
  })

  it('shows badge, summary, criteria and questions for scored, without an alert', () => {
    render(<ScoreSummary {...SCORED_PROPS} />)

    expect(screen.getByTestId('score-summary-header')).toHaveClass('tm-gap-4')
    expect(screen.getByTestId('score-summary-badge')).toHaveTextContent('92 %')
    expect(screen.getByTestId('score-summary-summary')).toHaveClass('tm-p-4')
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_COPY.summaryHeading })).toHaveClass('h4')
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_COPY.criteriaHeading })).toHaveClass('h4')
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_COPY.questionsHeading })).toHaveClass('h4')
    expect(screen.getByText(SCORE_SUMMARY_COPY.summaryHeading)).toBeInTheDocument()
    expect(screen.getByText(sampleScoreSummaryText)).toBeInTheDocument()
    expect(screen.getAllByTestId('evaluation-item')).toHaveLength(5)
    expect(screen.getByText(SCORE_SUMMARY_COPY.questionsHeading)).toBeInTheDocument()
    expect(screen.getByText(sampleScoreSummaryQuestions[0])).toBeInTheDocument()
    expect(screen.getByText(sampleScoreSummaryQuestions[1])).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('hides the badge when the candidate is not evaluated yet', () => {
    render(<ScoreSummary type="notEvaluated" />)

    expect(screen.queryByTestId('score-summary-badge')).not.toBeInTheDocument()
  })

  it('shows a cover-light question badge when data is insufficient', () => {
    render(<ScoreSummary type="insufficientData" />)

    const badge = screen.getByTestId('score-summary-badge')
    expect(badge).toHaveAttribute('data-badge-type', 'insufficientData')
    expect(badge).toHaveClass('tm-bg-cover-light')
    expect(badge).toHaveAccessibleName(SCORE_SUMMARY_COPY.insufficientDataBadge)
    const icons = within(badge).getAllByTestId('icon')
    expect(icons).toHaveLength(2)
    expect(icons[0]).toHaveAttribute('data-icon-name', 'sparkles')
    expect(icons[1]).toHaveAttribute('data-icon-name', 'circle-help')
  })

  it('shows a danger badge when evaluation fails', () => {
    render(<ScoreSummary type="error" />)

    const badge = screen.getByTestId('score-summary-badge')
    expect(badge).toHaveAttribute('data-badge-type', 'error')
    expect(badge).toHaveClass('tm-bg-emotion-danger-background', 'tm-text-emotion-danger-emphasis')
    expect(badge).toHaveAccessibleName(SCORE_SUMMARY_COPY.errorBadge)
    expect(within(badge).getByTestId('icon')).toHaveAttribute('data-icon-name', 'sparkles')
  })

  it('does not show a header badge while evaluating', () => {
    render(<ScoreSummary type="evaluating" onEvaluate={vi.fn()} />)

    expect(screen.queryByTestId('score-summary-badge')).not.toBeInTheDocument()
  })

  it('renders a warning alert and help link for insufficient data', () => {
    render(<ScoreSummary type="insufficientData" />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(SCORE_SUMMARY_COPY.insufficientData)
    const help = screen.getByRole('link', { name: SCORE_SUMMARY_COPY.insufficientDataHelpLink })
    expect(help).toHaveAttribute('href', SCORE_SUMMARY_HELP_URL)
  })

  it('renders informational copy and a help link when not evaluated', () => {
    render(<ScoreSummary type="notEvaluated" />)

    expect(screen.getByText(SCORE_SUMMARY_COPY.notEvaluated)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: SCORE_SUMMARY_COPY.helpLink })).toHaveAttribute(
      'href',
      SCORE_SUMMARY_HELP_URL,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders a danger alert for error without a help link', () => {
    render(<ScoreSummary type="error" />)

    expect(screen.getByRole('alert')).toHaveTextContent(SCORE_SUMMARY_COPY.error)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(within(screen.getByRole('button', { name: SCORE_SUMMARY_COPY.evaluateLabel })).getByTestId('icon'))
      .toHaveAttribute('data-icon-name', 'refresh-cw')
  })

  it('shows a loading status and a busy evaluate button while evaluating', () => {
    render(<ScoreSummary type="evaluating" onEvaluate={vi.fn()} />)

    expect(screen.getByRole('status', { name: SCORE_SUMMARY_COPY.evaluatingStatus })).toBeInTheDocument()
    expect(screen.getByText(SCORE_SUMMARY_COPY.evaluating)).toBeInTheDocument()
    const button = screen.getByRole('button', { name: SCORE_SUMMARY_COPY.evaluateLabel })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(within(button).getByTestId('button-spinner')).toBeInTheDocument()
    expect(within(button).queryByTestId('icon')).not.toBeInTheDocument()
  })

  it('uses a tertiary evaluate button after a score exists', () => {
    render(<ScoreSummary {...SCORED_PROPS} />)

    expect(screen.getByRole('button', { name: SCORE_SUMMARY_COPY.evaluateLabel })).toHaveClass(
      'tm-border-transparent',
      'tm-min-h-8',
    )
  })

  it.each(['insufficientData', 'notEvaluated', 'error', 'evaluating'] as const)(
    'uses a secondary evaluate button when type=%s has no score yet',
    (type) => {
      render(<ScoreSummary type={type} />)

      expect(screen.getByRole('button', { name: SCORE_SUMMARY_COPY.evaluateLabel })).toHaveClass(
        'tm-border-action-secondary-default',
      )
    },
  )

  it.each(['scored', 'insufficientData', 'notEvaluated', 'error'] as const)(
    'calls onEvaluate from type=%s',
    async (type) => {
      const user = userEvent.setup()
      const onEvaluate = vi.fn()

      if (type === 'scored') {
        render(<ScoreSummary {...SCORED_PROPS} onEvaluate={onEvaluate} />)
      } else {
        render(<ScoreSummary type={type} onEvaluate={onEvaluate} />)
      }

      await user.click(screen.getByRole('button', { name: SCORE_SUMMARY_COPY.evaluateLabel }))
      expect(onEvaluate).toHaveBeenCalledTimes(1)
    },
  )
})

describe('ScoreSummaryBadge', () => {
  it('shows a cover-light sparkle asset with pulse animation for evaluating', () => {
    render(<ScoreSummaryBadge type="evaluating" />)

    const badge = screen.getByTestId('score-summary-badge')
    expect(badge).toHaveAttribute('data-badge-type', 'evaluating')
    expect(badge).toHaveClass('tm-bg-cover-light')
    expect(badge).toHaveAccessibleName(SCORE_SUMMARY_COPY.evaluatingStatus)
    const sparkle = within(badge).getByTestId('score-summary-badge-sparkle')
    expect(sparkle).toHaveClass('tm-animate-sparkle-pulse')
    expect(sparkle).toHaveAttribute('width', '16')
  })
})
