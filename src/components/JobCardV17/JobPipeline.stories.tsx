import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobPipeline } from './JobPipeline'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV17/JobPipeline',
  component: JobPipeline,
  args: {
    candidates: { unassessed: 14, inProgress: 6, total: 52 },
  },
  decorators: [
    (Story) => (
      <div className="tm-inline-block tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobPipeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Počty',
}

export const WithNewBadges: Story = {
  name: 'Nový a opalcovaný badge',
  args: {
    candidates: { new: 5, newOpalcovani: 3, unassessed: 14, inProgress: 6, total: 52 },
  },
}

export const OnlyNewCandidates: Story = {
  name: 'Jen nový kandidát',
  args: {
    candidates: { new: 1, unassessed: 1, inProgress: 0, total: 1 },
  },
}

export const Clickable: Story = {
  name: 'Klikací',
  args: {
    candidates: { new: 5, newOpalcovani: 3, unassessed: 14, inProgress: 6, total: 52 },
    onStatClick: fn(),
  },
}

export const LargeNumbers: Story = {
  name: 'Velká čísla',
  args: {
    candidates: { new: 128, newOpalcovani: 12, unassessed: 1240, inProgress: 356, total: 12840 },
  },
}

export const Empty: Story = {
  name: 'Nuly',
  args: {
    candidates: { unassessed: 0, inProgress: 0, total: 0 },
  },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-6">
      <JobPipeline {...args} candidates={{ unassessed: 14, inProgress: 6, total: 52 }} />
      <JobPipeline
        {...args}
        candidates={{ new: 5, newOpalcovani: 3, unassessed: 14, inProgress: 6, total: 52 }}
      />
      <JobPipeline {...args} candidates={{ unassessed: 0, inProgress: 0, total: 0 }} />
    </div>
  ),
}
