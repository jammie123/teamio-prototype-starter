import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import {
  sampleEvaluationCriteria,
  sampleGroupedEvaluationCriteria,
} from '../EvaluationCriteriaModal/fixtures'
import { EvaluationCriteriaModalV2 } from './EvaluationCriteriaModalV2'

const meta = {
  id: 'ai-evaluation-evaluationcriteriamodal-v2',
  title: 'AI Evaluation/EvaluationCriteriaModal/V2',
  component: EvaluationCriteriaModalV2,
  args: {
    defaultCriteria: sampleEvaluationCriteria,
    onSave: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof EvaluationCriteriaModalV2>

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

export const GeneratingCriteriaFromJd: Story = {
  name: 'generating criteria from JD',
  args: {
    defaultOpen: true,
    defaultCriteria: [],
    isGenerating: true,
  },
}

export const ReadOnly: Story = {
  args: {
    defaultOpen: true,
    readOnly: true,
    defaultCriteria: sampleGroupedEvaluationCriteria,
    onEvaluate: fn(),
    onEdit: fn(),
  },
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Kritéria hodnocení kandidátů',
    })
    await expect(within(dialog).getByText('Vysoká priorita')).toBeInTheDocument()
    await expect(within(dialog).getByText('Nižší priorita')).toBeInTheDocument()
    await expect(within(dialog).queryByRole('checkbox')).not.toBeInTheDocument()
  },
}

export const ReadOnlyEditSwitch: Story = {
  args: {
    ...ReadOnly.args,
  },
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Kritéria hodnocení kandidátů',
    })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Editovat kritéria' }))
    await expect(await within(dialog).findByRole('button', { name: 'Uložit' })).toBeInTheDocument()
  },
}

export const InlineEdit: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    await userEvent.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await expect(textarea).toHaveValue(sampleEvaluationCriteria[1].text)
    await expect(body.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
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
    const row = within(dialog).getAllByTestId('evaluation-criterion-row')[1]
    await userEvent.click(within(row).getByRole('button', { name: 'Uložit' }))
    await expect(await within(dialog).findByRole('alert')).toHaveTextContent('nelze uložit')
    await expect(body.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
  },
}
