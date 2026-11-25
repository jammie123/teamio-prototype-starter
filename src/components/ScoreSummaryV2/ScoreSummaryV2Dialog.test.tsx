import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SCORE_SUMMARY_COPY } from '../ScoreSummary/copy'
import { SCORE_SUMMARY_V2_COPY } from './copy'
import { sampleScoreSummaryV2Matches } from './fixtures'
import { ScoreSummaryV2Dialog } from './ScoreSummaryV2Dialog'
import { ScoreSummaryV2MatchCompact } from './ScoreSummaryV2MatchCompact'

const metMatch = sampleScoreSummaryV2Matches.find((match) => match.status === 'met')!

describe('ScoreSummaryV2MatchCompact', () => {
  it('renders only the status icon and title', () => {
    render(
      <ul>
        <ScoreSummaryV2MatchCompact match={metMatch} />
      </ul>,
    )

    const item = screen.getByTestId('score-summary-v2-match-compact')
    expect(item).toHaveAttribute('data-status', 'met')
    expect(item).toHaveAccessibleName(`${metMatch.title} (${SCORE_SUMMARY_V2_COPY.matchStatus.met})`)
    expect(within(item).getByTestId('icon')).toHaveAttribute('data-icon-name', 'check')
    expect(item).toHaveTextContent(metMatch.title)
    expect(item).not.toHaveTextContent(metMatch.description)
    expect(item).not.toHaveTextContent(SCORE_SUMMARY_V2_COPY.matchStatus.met)
  })

  it.each([
    ['partial', 'minus'],
    ['unmet', 'x'],
  ] as const)('uses the %s icon', (status, iconName) => {
    const match = sampleScoreSummaryV2Matches.find((item) => item.status === status)!
    render(
      <ul>
        <ScoreSummaryV2MatchCompact match={match} />
      </ul>,
    )

    expect(within(screen.getByTestId('score-summary-v2-match-compact')).getByTestId('icon')).toHaveAttribute(
      'data-icon-name',
      iconName,
    )
  })
})

describe('ScoreSummaryV2Dialog', () => {
  it('opens a compact popover with title and compact criteria, badge stays on the trigger', async () => {
    const user = userEvent.setup()
    render(<ScoreSummaryV2Dialog score={92} matches={sampleScoreSummaryV2Matches} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const triggerBadge = screen.getByTestId('score-summary-badge')
    expect(triggerBadge).toHaveTextContent('92 %')
    expect(triggerBadge).toHaveAccessibleName(SCORE_SUMMARY_COPY.scoreBadgeLabel(92))
    await user.click(screen.getByRole('button'))

    const dialog = await screen.findByRole('dialog', { name: SCORE_SUMMARY_V2_COPY.title })
    expect(dialog).toHaveAttribute('aria-modal', 'false')
    expect(screen.getByRole('heading', { name: SCORE_SUMMARY_V2_COPY.title })).toHaveClass('tm-text-sm')
    expect(within(dialog).queryByTestId('score-summary-badge')).not.toBeInTheDocument()
    expect(within(dialog).getAllByTestId('score-summary-v2-match-compact')).toHaveLength(
      sampleScoreSummaryV2Matches.length,
    )
    expect(within(dialog).queryByText(sampleScoreSummaryV2Matches[0].description)).not.toBeInTheDocument()
  })

  it.each([
    ['insufficientData', SCORE_SUMMARY_V2_COPY.badgeTooltip.insufficientData],
    ['error', SCORE_SUMMARY_V2_COPY.badgeTooltip.error],
    ['evaluating', SCORE_SUMMARY_V2_COPY.badgeTooltip.evaluating],
  ] as const)('shows only a tooltip for type=%s', async (type, tooltipText) => {
    const user = userEvent.setup()
    render(<ScoreSummaryV2Dialog type={type} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.hover(screen.getByRole('button'))

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent(tooltipText)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: SCORE_SUMMARY_V2_COPY.title })).not.toBeInTheDocument()
  })
})
