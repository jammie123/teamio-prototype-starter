import type { Meta, StoryObj } from '@storybook/react-vite'
import { TeamioLogo } from './TeamioLogo'

const meta = {
  title: 'Components/TeamioLogo',
  component: TeamioLogo,
  decorators: [
    (Story) => (
      <div className="tm-inline-flex tm-rounded tm-bg-teamio-violet tm-p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    edition: 'default',
    variant: 'full',
  },
} satisfies Meta<typeof TeamioLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Compact: Story = {
  args: {
    variant: 'compact',
  },
}

export const Editions: Story = {
  render: () => (
    <div className="tm-flex tm-flex-col tm-gap-4">
      <TeamioLogo edition="default" />
      <TeamioLogo edition="neznama-edice" />
    </div>
  ),
}
