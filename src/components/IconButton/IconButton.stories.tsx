import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IconButton } from './IconButton'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: {
    icon: 'eye',
    'aria-label': 'Náhled',
    tooltip: 'Náhled',
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-p-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {}

export const Edit: Story = {
  args: { icon: 'edit', 'aria-label': 'Editovat nábor', tooltip: 'Editovat nábor' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const WithoutTooltip: Story = {
  args: { tooltip: undefined },
}
