import type { Meta, StoryObj } from '@storybook/react-vite'
import { sampleScoreSummaryV2Matches } from '../fixtures'
import { ScoreSummaryV2Match } from '../ScoreSummaryV2Match'
import type { ScoreMatchStatus } from '../types'

const byStatus = (status: ScoreMatchStatus) =>
  sampleScoreSummaryV2Matches.find((match) => match.status === status)!

const meta = {
  id: 'ai-evaluation-scoresummary-v2-parts-match',
  title: 'AI Evaluation/ScoreSummary/V2/Parts/Kritérium',
  component: ScoreSummaryV2Match,
  args: {
    match: byStatus('met'),
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ul className="tm-mb-0 tm-max-w-[52rem] tm-flex tm-list-none tm-flex-col tm-p-0">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof ScoreSummaryV2Match>

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
      <ScoreSummaryV2Match match={byStatus('met')} />
      <ScoreSummaryV2Match match={byStatus('partial')} />
      <ScoreSummaryV2Match match={byStatus('unmet')} />
    </>
  ),
}
