import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { sampleEvaluationCriteria } from '../EvaluationCriteriaModal/fixtures'
import { EvaluationCriteriaModalV3 } from './EvaluationCriteriaModalV3'

const meta = {
  id: 'ai-evaluation-evaluationcriteriamodal-v3',
  title: 'AI Evaluation/EvaluationCriteriaModal/V3',
  component: EvaluationCriteriaModalV3,
  args: {
    defaultCriteria: sampleEvaluationCriteria,
    onSave: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof EvaluationCriteriaModalV3>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Kritéria hodnocení</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Kritéria hodnocení' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Kritéria hodnocení kandidátů')
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const Empty: Story = {
  args: {
    defaultOpen: true,
    defaultCriteria: [],
  },
}

export const EditCriterion: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    await userEvent.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await expect(dialog).toHaveAccessibleName('Upravit kritérium')
    await expect(textarea).toHaveValue(sampleEvaluationCriteria[1].text)
    await expect(textarea).toHaveFocus()
    await expect(within(dialog).queryByRole('table')).not.toBeInTheDocument()
    await expect(within(dialog).queryByRole('button', { name: 'Zavřít dialog' })).not.toBeInTheDocument()
  },
}

export const EeoViolation: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    await userEvent.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Hledáme muže do týmu')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Uložit' }))
    await expect(await within(dialog).findByRole('alert')).toHaveTextContent('nelze uložit')
    await expect(dialog).toHaveAccessibleName('Upravit kritérium')
    await expect(within(dialog).queryByRole('table')).not.toBeInTheDocument()
  },
}
