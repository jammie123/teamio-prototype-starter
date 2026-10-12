import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { JobsPipeline, type JobsPipelineProps } from './JobsPipeline'
import { pipelineStatusCounts } from './fixtures'
import { PipelineWithTable } from './jobsPipelineStoryData'

const meta = {
  title: 'Candidate/JobsPipeline/V1',
  component: JobsPipeline,
  args: {
    statusCounts: pipelineStatusCounts,
    value: undefined,
    onChange: fn(),
  },
} satisfies Meta<typeof JobsPipeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithNewBadge: Story = {
  args: { newCounts: { unassessed: 14, opalcovani: 3 } },
}

export const Selected: Story = {
  args: { value: 'preselected' },
}

function InteractivePipeline(args: JobsPipelineProps) {
  const [value, setValue] = useState(args.value)

  return <JobsPipeline {...args} value={value} onChange={setValue} />
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

/** The pipeline shares its container with the table, so both line up and filter the same rows. */
export const AboveCandidateTable: Story = {
  render: () => <PipelineWithTable Pipeline={JobsPipeline} />,
}
