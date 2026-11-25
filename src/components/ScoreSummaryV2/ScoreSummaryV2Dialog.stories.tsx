import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ScoreSummaryBadge } from '../ScoreSummary/ScoreSummaryBadge'
import { sampleScoreSummaryV2Matches } from './fixtures'
import { ScoreSummaryV2Dialog } from './ScoreSummaryV2Dialog'

const meta = {
  id: 'ai-evaluation-scoresummary-v2-dialog',
  title: 'AI Evaluation/ScoreSummary/V2/Popover',
  component: ScoreSummaryV2Dialog,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ScoreSummaryV2Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Badge otevírá popover',
  render: () => (
    <ScoreSummaryV2Dialog
      score={92}
      matches={sampleScoreSummaryV2Matches}
      trigger={<ScoreSummaryBadge type="scored" score={92} />}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    const dialog = await canvas.findByRole('dialog', { name: 'Shoda uchazeče s pozicí' })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'false')
    await expect(within(dialog).queryByTestId('score-summary-badge')).toBeNull()
  },
}

export const OpenHigh: Story = {
  name: 'Ohodnoceno — vysoká shoda',
  render: () => (
    <ScoreSummaryV2Dialog defaultOpen score={92} matches={sampleScoreSummaryV2Matches} />
  ),
}

export const OpenMid: Story = {
  name: 'Ohodnoceno — střední shoda',
  render: () => (
    <ScoreSummaryV2Dialog defaultOpen score={55} matches={sampleScoreSummaryV2Matches} />
  ),
}

export const OpenLow: Story = {
  name: 'Ohodnoceno — nízká shoda',
  render: () => (
    <ScoreSummaryV2Dialog defaultOpen score={22} matches={sampleScoreSummaryV2Matches} />
  ),
}

export const InsufficientData: Story = {
  name: 'Nedostatek dat — tooltip',
  render: () => <ScoreSummaryV2Dialog type="insufficientData" defaultOpen />,
}

export const Error: Story = {
  name: 'Chyba — tooltip',
  render: () => <ScoreSummaryV2Dialog type="error" defaultOpen />,
}

export const Evaluating: Story = {
  name: 'Probíhá hodnocení — tooltip',
  render: () => <ScoreSummaryV2Dialog type="evaluating" defaultOpen />,
}
