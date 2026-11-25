import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { sampleEvaluationCriteria } from '../EvaluationCriteriaModal/fixtures'
import { EvaluationCriteriaModalV2 } from '../EvaluationCriteriaModalV2'
import {
  sampleScoreSummaryV2Matches,
  sampleScoreSummaryV2MatchesEn,
  sampleScoreSummaryV2Questions,
  sampleScoreSummaryV2QuestionsEn,
  sampleScoreSummaryV2Text,
  sampleScoreSummaryV2TextEn,
} from './fixtures'
import { ScoreSummaryV2 } from './ScoreSummaryV2'
import type { ScoreEvaluationLanguage } from './types'

const scoredArgs = {
  type: 'scored' as const,
  score: 92,
  summary: sampleScoreSummaryV2Text,
  matches: sampleScoreSummaryV2Matches,
  questions: sampleScoreSummaryV2Questions,
  onEvaluate: fn(),
  onOpenCriteria: fn(),
  onEvaluationLanguageChange: fn(),
}

const meta = {
  id: 'ai-evaluation-scoresummary-v2',
  title: 'AI Evaluation/ScoreSummary/V2',
  component: ScoreSummaryV2,
  args: scoredArgs,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ScoreSummaryV2>

export default meta
type Story = StoryObj<typeof meta>

export const ScoredHigh: Story = {}

export const ScoredMid: Story = {
  args: {
    score: 55,
  },
}

export const ScoredLow: Story = {
  args: {
    score: 22,
  },
}

export const ScoredExpanded: Story = {
  args: {
    defaultExpanded: true,
  },
}

export const NotEvaluated: Story = {
  render: () => <ScoreSummaryV2 type="notEvaluated" onEvaluate={fn()} onOpenCriteria={fn()} />,
}

export const Evaluating: Story = {
  render: () => (
    <ScoreSummaryV2 type="notEvaluated" isEvaluating onEvaluate={fn()} onOpenCriteria={fn()} />
  ),
}

export const Translating: Story = {
  args: {
    isTranslate: true,
    translateLanguage: 'ENG',
  },
}

export const TranslationOffer: Story = {
  render: function Render(args) {
    const [isTranslate, setIsTranslate] = useState(false)
    const [criteriaOpen, setCriteriaOpen] = useState(false)

    return (
      <>
        <ScoreSummaryV2
          {...args}
          uiLanguage="en"
          showTranslationOffer
          isTranslate={isTranslate}
          translateLanguage="ENG"
          onTranslate={() => {
            args.onTranslate?.()
            setIsTranslate(true)
          }}
          onOpenCriteria={() => {
            args.onOpenCriteria?.()
            setCriteriaOpen(true)
          }}
        />
        <EvaluationCriteriaModalV2
          open={criteriaOpen}
          onOpenChange={setCriteriaOpen}
          readOnly
          defaultCriteria={sampleEvaluationCriteria}
        />
      </>
    )
  },
  args: {
    uiLanguage: 'en',
    showTranslationOffer: true,
    onTranslate: fn(),
  },
}

export const InsufficientData: Story = {
  render: () => <ScoreSummaryV2 type="insufficientData" onEvaluate={fn()} onOpenCriteria={fn()} />,
}

export const Error: Story = {
  render: () => <ScoreSummaryV2 type="error" onEvaluate={fn()} onOpenCriteria={fn()} />,
}

export const LanguageSwitch: Story = {
  render: function Render() {
    const [language, setLanguage] = useState<ScoreEvaluationLanguage>('cs')
    const content =
      language === 'en'
        ? {
            summary: sampleScoreSummaryV2TextEn,
            matches: sampleScoreSummaryV2MatchesEn,
            questions: sampleScoreSummaryV2QuestionsEn,
          }
        : {
            summary: sampleScoreSummaryV2Text,
            matches: sampleScoreSummaryV2Matches,
            questions: sampleScoreSummaryV2Questions,
          }

    return (
      <ScoreSummaryV2
        type="scored"
        score={92}
        {...content}
        defaultExpanded
        evaluationLanguage={language}
        onEvaluationLanguageChange={setLanguage}
        onEvaluate={fn()}
        onOpenCriteria={fn()}
      />
    )
  },
}

export const WithCriteriaModal: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <ScoreSummaryV2 {...scoredArgs} onOpenCriteria={() => setOpen(true)} />
        <EvaluationCriteriaModalV2
          open={open}
          onOpenChange={setOpen}
          readOnly
          defaultCriteria={sampleEvaluationCriteria}
        />
      </>
    )
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="tm-flex tm-flex-col tm-gap-6">
      <ScoreSummaryV2 {...scoredArgs} />
      <ScoreSummaryV2 {...scoredArgs} score={55} />
      <ScoreSummaryV2 {...scoredArgs} score={22} />
      <ScoreSummaryV2 {...scoredArgs} defaultExpanded />
      <ScoreSummaryV2 type="notEvaluated" onEvaluate={fn()} onOpenCriteria={fn()} />
      <ScoreSummaryV2 type="notEvaluated" isEvaluating onEvaluate={fn()} onOpenCriteria={fn()} />
      <ScoreSummaryV2 {...scoredArgs} isTranslate translateLanguage="ENG" />
      <ScoreSummaryV2 {...scoredArgs} uiLanguage="en" showTranslationOffer onTranslate={fn()} />
      <ScoreSummaryV2 type="insufficientData" onEvaluate={fn()} onOpenCriteria={fn()} />
      <ScoreSummaryV2 type="error" onEvaluate={fn()} onOpenCriteria={fn()} />
    </div>
  ),
}
