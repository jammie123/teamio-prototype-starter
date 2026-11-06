import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobPipeline } from './JobPipeline'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV16/JobPipeline',
  component: JobPipeline,
  args: {
    candidates: { unassessed: 14, preselected: 6, evaluated: 8 },
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

export const WithNewBadge: Story = {
  name: 'Nový badge',
  args: {
    candidates: { new: 5, unassessed: 14, preselected: 6, evaluated: 8 },
  },
}

export const OnlyNewCandidates: Story = {
  name: 'Jen nový kandidát',
  args: {
    candidates: { new: 1, unassessed: 1, preselected: 0, evaluated: 0 },
  },
}

export const Clickable: Story = {
  name: 'Klikací',
  args: {
    candidates: { new: 5, unassessed: 14, preselected: 6, evaluated: 8 },
    onStatClick: fn(),
  },
}

export const LargeNumbers: Story = {
  name: 'Velká čísla',
  args: {
    candidates: { new: 128, unassessed: 1240, preselected: 356, evaluated: 84 },
  },
}

export const Empty: Story = {
  name: 'Nuly',
  args: {
    candidates: { unassessed: 0, preselected: 0, evaluated: 0 },
  },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-6">
      <JobPipeline {...args} candidates={{ unassessed: 14, preselected: 6, evaluated: 8 }} />
      <JobPipeline
        {...args}
        candidates={{ new: 5, unassessed: 14, preselected: 6, evaluated: 8 }}
      />
      <JobPipeline {...args} candidates={{ unassessed: 0, preselected: 0, evaluated: 0 }} />
    </div>
  ),
}
