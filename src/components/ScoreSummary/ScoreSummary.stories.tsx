import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { EvaluationItem } from './EvaluationItem'
import {
  sampleScoreSummaryCriteria,
  sampleScoreSummaryQuestions,
  sampleScoreSummaryText,
} from './fixtures'
import { ScoreSummary } from './ScoreSummary'

const scoredArgs = {
  type: 'scored' as const,
  score: 92,
  summary: sampleScoreSummaryText,
  criteria: sampleScoreSummaryCriteria,
  questions: sampleScoreSummaryQuestions,
  onEvaluate: fn(),
}

const meta = {
  title: 'Components/ScoreSummary',
  component: ScoreSummary,
  args: scoredArgs,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ScoreSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Scored: Story = {}

export const InsufficientData: Story = {
  render: () => <ScoreSummary type="insufficientData" onEvaluate={fn()} />,
}

export const NotEvaluated: Story = {
  render: () => <ScoreSummary type="notEvaluated" onEvaluate={fn()} />,
}

export const Error: Story = {
  render: () => <ScoreSummary type="error" onEvaluate={fn()} />,
}

export const Evaluating: Story = {
  render: () => <ScoreSummary type="evaluating" onEvaluate={fn()} />,
}

export const BadgeLow: Story = {
  args: {
    ...scoredArgs,
    score: 22,
  },
}

export const BadgeMid: Story = {
  args: {
    ...scoredArgs,
    score: 55,
  },
}

export const BadgeHigh: Story = {
  args: {
    ...scoredArgs,
    score: 92,
  },
}

export const EvaluationItemMet: Story = {
  render: () => <EvaluationItem label="ITSM, governance, asset mgmt" status="met" />,
}

export const EvaluationItemPartial: Story = {
  render: () => <EvaluationItem label="Endpoint management expertise" status="partial" />,
}

export const EvaluationItemUnmet: Story = {
  render: () => <EvaluationItem label="Pokročilá znalost angličtiny" status="unmet" />,
}

export const AllVariants: Story = {
  render: () => (
    <div className="tm-flex tm-max-w-3xl tm-flex-col tm-gap-6">
      <ScoreSummary {...scoredArgs} />
      <ScoreSummary type="insufficientData" onEvaluate={fn()} />
      <ScoreSummary type="notEvaluated" onEvaluate={fn()} />
      <ScoreSummary type="error" onEvaluate={fn()} />
      <ScoreSummary type="evaluating" onEvaluate={fn()} />
    </div>
  ),
}
