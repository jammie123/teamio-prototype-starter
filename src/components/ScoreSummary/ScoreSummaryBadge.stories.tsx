import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScoreSummaryBadge } from './ScoreSummaryBadge'

const meta = {
  title: 'Components/ScoreSummary/Badge',
  component: ScoreSummaryBadge,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ScoreSummaryBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  name: 'Loading',
  args: {
    type: 'evaluating',
  },
}

export const ScoredLow: Story = {
  args: {
    type: 'scored',
    score: 22,
  },
}

export const ScoredMid: Story = {
  args: {
    type: 'scored',
    score: 55,
  },
}

export const ScoredHigh: Story = {
  args: {
    type: 'scored',
    score: 92,
  },
}

export const InsufficientData: Story = {
  args: {
    type: 'insufficientData',
  },
}

export const Error: Story = {
  args: {
    type: 'error',
  },
}

export const All: Story = {
  render: () => (
    <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-2">
      <ScoreSummaryBadge type="scored" score={22} />
      <ScoreSummaryBadge type="scored" score={55} />
      <ScoreSummaryBadge type="scored" score={92} />
      <ScoreSummaryBadge type="insufficientData" />
      <ScoreSummaryBadge type="error" />
      <ScoreSummaryBadge type="evaluating" />
    </div>
  ),
}
