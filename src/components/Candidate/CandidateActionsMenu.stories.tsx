import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CandidateActionsMenu } from './CandidateActionsMenu'

const meta = {
  title: 'Candidate/CandidateActionsMenu',
  component: CandidateActionsMenu,
  args: {
    label: 'Akce uchazeče Karl Jakub',
    onAction: fn(),
  },
  render: (args) => (
    <div className="tm-min-h-[480px] tm-p-4">
      <CandidateActionsMenu {...args} />
    </div>
  ),
} satisfies Meta<typeof CandidateActionsMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomMoveTargets: Story = {
  args: {
    moveToOptions: [
      { id: 'preselected', label: 'Předvýběr za HR' },
      { id: 'approved', label: 'Odsouhlasený od LM' },
      { id: 'hired', label: 'Nástup' },
    ],
  },
}

export const WithoutMoveSection: Story = {
  args: { moveToOptions: [] },
}
