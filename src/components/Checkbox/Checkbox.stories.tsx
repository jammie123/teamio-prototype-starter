import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Souhlasím se zpracováním osobních údajů',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Souhlasím se zpracováním osobních údajů',
    })
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    children: 'Zasílat novinky o pozicích',
  },
}

export const Error: Story = {
  args: {
    validationState: 'error',
    children: 'Vyžadovaný souhlas',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Nedostupné',
  },
}
