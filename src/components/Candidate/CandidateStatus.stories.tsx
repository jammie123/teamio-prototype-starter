import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { CandidateStatus } from './CandidateStatus'

const meta = {
  title: 'Candidate/Candidate primitives/CandidateStatus',
  component: CandidateStatus,
  args: {
    value: 'unassessed',
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-mb-[220px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CandidateStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hired: Story = {
  args: { value: 'hired' },
}

export const Rejected: Story = {
  args: { value: 'rejected' },
}

function ControlledStatus({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial)
  return <CandidateStatus value={value} onChange={(id) => setValue(id)} />
}

export const Controlled: Story = {
  render: (args) => <ControlledStatus initial={args.value} />,
}
