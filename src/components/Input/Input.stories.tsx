import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    'aria-label': 'Jméno uchazeče',
    placeholder: 'Zadejte jméno',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Jméno uchazeče')
    await userEvent.type(input, 'Anna Nováková')
    await expect(input).toHaveValue('Anna Nováková')
  },
}

export const Small: Story = {
  args: { size: 'small', 'aria-label': 'Krátký vstup' },
}

export const Success: Story = {
  args: {
    validationState: 'success',
    defaultValue: 'OK',
    'aria-label': 'Úspěšný vstup',
  },
}

export const Warning: Story = {
  args: {
    validationState: 'warning',
    defaultValue: 'Pozor',
    'aria-label': 'Varovný vstup',
  },
}

export const Error: Story = {
  args: {
    validationState: 'error',
    defaultValue: 'Chyba',
    'aria-label': 'Chybný vstup',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Nelze upravit',
    'aria-label': 'Zakázaný vstup',
  },
}

export const Required: Story = {
  args: {
    isRequired: true,
    'aria-label': 'Povinný vstup',
  },
}
