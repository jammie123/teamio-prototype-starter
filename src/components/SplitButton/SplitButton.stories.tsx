import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Option } from '../OptionList'
import { SplitButton } from './SplitButton'

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton,
  args: {
    label: 'Přidat nábor',
    onClick: fn(),
    children: <Option onClick={fn()}>Přidat brigádu</Option>,
  },
  decorators: [
    (Story) => (
      <div className="tm-mb-[180px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}

export const MenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Další možnosti' }))
    await expect(canvas.getByRole('option', { name: 'Přidat brigádu' })).toBeInTheDocument()
  },
}
