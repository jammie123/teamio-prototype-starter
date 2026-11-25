import type { Meta, StoryObj } from '@storybook/react-vite'
import { sampleScoreSummaryV2Text } from '../fixtures'
import { ScoreSummaryV2Overview } from '../ScoreSummaryV2Overview'

const meta = {
  id: 'ai-evaluation-scoresummary-v2-parts-overview',
  title: 'AI Evaluation/ScoreSummary/V2/Parts/Shrnutí uchazeče',
  component: ScoreSummaryV2Overview,
  args: {
    type: 'scored',
    summary: sampleScoreSummaryV2Text,
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="tm-max-w-[52rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreSummaryV2Overview>

export default meta
type Story = StoryObj<typeof meta>

export const Summary: Story = {
  name: 'Shrnutí',
}

export const InsufficientData: Story = {
  name: 'Nedostatek dat',
  args: {
    type: 'insufficientData',
    summary: undefined,
  },
}

export const Error: Story = {
  name: 'Chyba',
  args: {
    type: 'error',
    summary: undefined,
  },
}
