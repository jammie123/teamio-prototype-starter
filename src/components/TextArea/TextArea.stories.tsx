import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { TextArea } from './TextArea'

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  args: {
    'aria-label': 'Poznámka k uchazeči',
    placeholder: 'Napište poznámku z pohovoru',
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByLabelText('Poznámka k uchazeči')
    await userEvent.type(field, 'Kandidát má relevantní zkušenosti.')
    await expect(field).toHaveValue('Kandidát má relevantní zkušenosti.')
  },
}

export const Success: Story = {
  args: {
    validationState: 'success',
    defaultValue: 'Poznámka je v pořádku.',
  },
}

export const Warning: Story = {
  args: {
    validationState: 'warning',
    defaultValue: 'Doplňte ještě datum pohovoru.',
  },
}

export const Error: Story = {
  args: {
    validationState: 'error',
    defaultValue: 'Příliš krátký text',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Poznámku nelze upravit.',
  },
}
