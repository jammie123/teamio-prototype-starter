import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    'aria-label': 'Město',
    children: (
      <>
        <option value="">Vyberte město</option>
        <option value="praha">Praha</option>
        <option value="brno">Brno</option>
        <option value="ostrava">Ostrava</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByLabelText('Město')
    await userEvent.selectOptions(select, 'brno')
    await expect(select).toHaveValue('brno')
  },
}

export const Success: Story = {
  args: { validationState: 'success', defaultValue: 'praha' },
}

export const Warning: Story = {
  args: { validationState: 'warning', defaultValue: 'ostrava' },
}

export const Error: Story = {
  args: { validationState: 'error' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'praha' },
}
