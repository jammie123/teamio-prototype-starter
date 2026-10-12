import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { JobsPipelineV2, type JobsPipelineV2Props } from './JobsPipelineV2'
import { pipelineStatusCounts } from './fixtures'
import { PipelineWithTable } from './jobsPipelineStoryData'

const meta = {
  title: 'Candidate/JobsPipeline/V2',
  component: JobsPipelineV2,
  args: {
    statusCounts: pipelineStatusCounts,
    value: undefined,
    onChange: fn(),
  },
} satisfies Meta<typeof JobsPipelineV2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithNewBadge: Story = {
  args: { newCounts: { unassessed: 14, opalcovani: 3 } },
}

export const Selected: Story = {
  args: { value: 'preselected' },
}

export const RejectedSelected: Story = {
  args: { value: 'rejected' },
}

function InteractivePipeline(args: JobsPipelineV2Props) {
  const [value, setValue] = useState(args.value)

  return <JobsPipelineV2 {...args} value={value} onChange={setValue} />
}

export const Interactive: Story = {
  render: (args) => <InteractivePipeline {...args} />,
}

export const Narrow: Story = {
  render: (args) => (
    <div className="tm-max-w-[600px]">
      <InteractivePipeline {...args} />
    </div>
  ),
}

/** The tab navigation sits above the table in the same container and filters the same rows. */
export const AboveCandidateTable: Story = {
  render: () => <PipelineWithTable Pipeline={JobsPipelineV2} />,
}
