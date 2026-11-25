import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Card } from '../../Card'
import { sampleScoreSummaryV2Matches } from '../fixtures'
import { countMatchStatuses } from '../matchCounts'
import { ScoreSummaryV2Header } from '../ScoreSummaryV2Header'

const scoredCounts = countMatchStatuses(sampleScoreSummaryV2Matches)

const actions = {
  onEvaluate: fn(),
  onOpenCriteria: fn(),
  onEvaluationLanguageChange: fn(),
}

const scoredArgs = {
  type: 'scored' as const,
  score: 92,
  counts: scoredCounts,
  ...actions,
}

const meta = {
  id: 'ai-evaluation-scoresummary-v2-parts-header',
  title: 'AI Evaluation/ScoreSummary/V2/Parts/Header',
  component: ScoreSummaryV2Header,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <Card className="tm-max-w-[52rem] !tm-px-8 !tm-py-6">
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof ScoreSummaryV2Header>

export default meta
type Story = StoryObj<typeof meta>

export const Scored: Story = {
  name: 'Ohodnoceno',
  args: scoredArgs,
}

export const NotEvaluated: Story = {
  name: 'Zatím nehodnoceno',
  render: () => <ScoreSummaryV2Header type="notEvaluated" {...actions} />,
}

export const Evaluating: Story = {
  name: 'Probíhá hodnocení',
  render: () => <ScoreSummaryV2Header type="notEvaluated" isEvaluating {...actions} />,
}

export const Translating: Story = {
  name: 'Překlad',
  render: () => (
    <ScoreSummaryV2Header
      {...scoredArgs}
      isTranslate
      translateLanguage="ENG"
    />
  ),
}

export const InsufficientData: Story = {
  name: 'Nedostatek dat',
  render: () => <ScoreSummaryV2Header type="insufficientData" {...actions} />,
}

export const Error: Story = {
  name: 'Chyba',
  render: () => <ScoreSummaryV2Header type="error" {...actions} />,
}
