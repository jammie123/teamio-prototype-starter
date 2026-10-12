import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BulkAction } from './BulkAction'

const meta = {
  title: 'Candidate/BulkAction',
  component: BulkAction,
  args: {
    count: 3,
    onMoveTo: fn(),
    onReject: fn(),
    onInvite: fn(),
    onSendMessage: fn(),
  },
  render: (args) => (
    <div className="tm-min-h-[200px] tm-max-w-[1100px] tm-rounded tm-border tm-border-secondary">
      <BulkAction {...args} />
    </div>
  ),
} satisfies Meta<typeof BulkAction>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleCandidate: Story = {
  args: { count: 1 },
}

export const ManyCandidates: Story = {
  args: { count: 27 },
}

/** The "Zrušit výběr" button on the right is shown only when `onClear` is set. */
export const WithClear: Story = {
  args: { onClear: fn() },
}
