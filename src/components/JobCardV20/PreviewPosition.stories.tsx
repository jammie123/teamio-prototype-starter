import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PreviewPosition } from './PreviewPosition'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV20/PreviewPosition',
  component: PreviewPosition,
  args: {
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PreviewPosition>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
