import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { EvaluationCriteriaModal } from './EvaluationCriteriaModal'
import { sampleEvaluationCriteria } from './fixtures'

const meta = {
  id: 'jobs-evaluationcriteriamodal',
  title: 'Jobs/EvaluationCriteriaModal',
  component: EvaluationCriteriaModal,
  args: {
    defaultCriteria: sampleEvaluationCriteria,
    onSave: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof EvaluationCriteriaModal>

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

export const DetailOpen: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    await userEvent.click(within(dialog).getByText('Znalost angličtiny na komunikativní úrovni.'))
    await expect(await body.findByRole('dialog', { name: 'Detail kritéria' })).toBeInTheDocument()
  },
}

export const EeoViolation: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    await userEvent.click(within(dialog).getByText('Znalost angličtiny na komunikativní úrovni.'))
    const detail = await body.findByRole('dialog', { name: 'Detail kritéria' })
    const textarea = within(detail).getByRole('textbox')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Hledáme muže do týmu')
    await userEvent.click(within(detail).getByRole('button', { name: 'Uložit' }))
    await expect(await within(detail).findByRole('alert')).toHaveTextContent('nelze uložit')
  },
}
