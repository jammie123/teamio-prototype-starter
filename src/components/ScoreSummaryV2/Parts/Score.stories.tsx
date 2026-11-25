import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScoreSummaryV2Score } from '../ScoreSummaryV2Score'

const meta = {
  id: 'ai-evaluation-scoresummary-v2-parts-score',
  title: 'AI Evaluation/ScoreSummary/V2/Parts/Hodnocení',
  component: ScoreSummaryV2Score,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ScoreSummaryV2Score>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  name: 'Nehodnoceno',
  render: () => <ScoreSummaryV2Score pending />,
}

export const High: Story = {
  name: 'Vysoká shoda',
  render: () => <ScoreSummaryV2Score score={92} />,
}

export const Mid: Story = {
  name: 'Střední shoda',
  render: () => <ScoreSummaryV2Score score={55} />,
}

export const Low: Story = {
  name: 'Nízká shoda',
  render: () => <ScoreSummaryV2Score score={22} />,
}

export const All: Story = {
  name: 'Přehled stavů',
  render: () => (
    <div className="tm-flex tm-items-center tm-gap-6">
      <ScoreSummaryV2Score pending />
      <ScoreSummaryV2Score score={92} />
      <ScoreSummaryV2Score score={55} />
      <ScoreSummaryV2Score score={22} />
    </div>
  ),
}
