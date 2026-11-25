import type { Meta, StoryObj } from '@storybook/react-vite'
import { sampleScoreSummaryV2Matches } from '../fixtures'
import { ScoreSummaryV2Matches } from '../ScoreSummaryV2Matches'

const meta = {
  id: 'ai-evaluation-scoresummary-v2-parts-matches',
  title: 'AI Evaluation/ScoreSummary/V2/Parts/Splňuje kritéria',
  component: ScoreSummaryV2Matches,
  args: {
    matches: sampleScoreSummaryV2Matches,
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
} satisfies Meta<typeof ScoreSummaryV2Matches>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Sekce',
}
