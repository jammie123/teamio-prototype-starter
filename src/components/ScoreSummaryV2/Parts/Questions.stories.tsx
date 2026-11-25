import type { Meta, StoryObj } from '@storybook/react-vite'
import { sampleScoreSummaryV2Questions } from '../fixtures'
import { ScoreSummaryV2Questions } from '../ScoreSummaryV2Questions'

const meta = {
  id: 'ai-evaluation-scoresummary-v2-parts-questions',
  title: 'AI Evaluation/ScoreSummary/V2/Parts/Otázky',
  component: ScoreSummaryV2Questions,
  args: {
    questions: sampleScoreSummaryV2Questions,
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
} satisfies Meta<typeof ScoreSummaryV2Questions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Sekce',
}
