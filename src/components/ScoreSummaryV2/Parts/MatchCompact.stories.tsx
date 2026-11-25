import type { Meta, StoryObj } from '@storybook/react-vite'
import { sampleScoreSummaryV2Matches } from '../fixtures'
import { ScoreSummaryV2MatchCompact } from '../ScoreSummaryV2MatchCompact'
import type { ScoreMatchStatus } from '../types'

const byStatus = (status: ScoreMatchStatus) =>
  sampleScoreSummaryV2Matches.find((match) => match.status === status)!

const meta = {
  id: 'ai-evaluation-scoresummary-v2-parts-match-compact',
  title: 'AI Evaluation/ScoreSummary/V2/Parts/Kritérium kompaktní',
  component: ScoreSummaryV2MatchCompact,
  args: {
    match: byStatus('met'),
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ul className="tm-mb-0 tm-max-w-[28rem] tm-flex tm-list-none tm-flex-col tm-p-0">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof ScoreSummaryV2MatchCompact>

export default meta
type Story = StoryObj<typeof meta>

export const Met: Story = {
  name: 'Splňuje',
  args: {
    match: byStatus('met'),
  },
}

export const Partial: Story = {
  name: 'Částečně splňuje',
  args: {
    match: byStatus('partial'),
  },
}

export const Unmet: Story = {
  name: 'Nesplňuje',
  args: {
    match: byStatus('unmet'),
  },
}

export const All: Story = {
  name: 'Přehled stavů',
  render: () => (
    <>
      <ScoreSummaryV2MatchCompact match={byStatus('met')} />
      <ScoreSummaryV2MatchCompact match={byStatus('partial')} />
      <ScoreSummaryV2MatchCompact match={byStatus('unmet')} />
    </>
  ),
}
