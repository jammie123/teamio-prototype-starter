import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'
import { fn } from 'storybook/test'
import { CandidateTable } from './CandidateTable'
import { sampleCandidates } from './fixtures'
import { JobsPipeline, type JobsPipelineProps } from './JobsPipeline'

const statusCounts = {
  unassessed: 128,
  preselected: 24,
  opalcovani: 16,
  invited: 9,
  hired: 5,
  total: 182,
}

const meta = {
  title: 'Candidate/JobsPipeline',
  component: JobsPipeline,
  args: {
    statusCounts,
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

/** Pipeline status of each sample candidate; the table's own statuses are a separate concept. */
const storyStatuses: Record<string, string> = {
  minayeva: 'hired',
  cerny: 'hired',
  karl: 'invited',
  sousek: 'unassessed',
  prijmeni: 'preselected',
}

/** Candidates a hiring manager has rated; shown under "Opalcovaný" in the story. */
const storyOpalcovani = new Set(['karl', 'prijmeni'])

function matchesStatus(id: string, status: string | undefined) {
  if (!status) return true
  return status === 'opalcovani' ? storyOpalcovani.has(id) : storyStatuses[id] === status
}

function PipelineWithTable() {
  const [value, setValue] = useState<string | undefined>()

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      opalcovani: storyOpalcovani.size,
      total: sampleCandidates.length,
    }
    for (const candidate of sampleCandidates) {
      const status = storyStatuses[candidate.id]
      result[status] = (result[status] ?? 0) + 1
    }
    return result
  }, [])

  const visible = sampleCandidates.filter((candidate) => matchesStatus(candidate.id, value))

  return (
    <div className="tm-flex tm-flex-col tm-gap-3 tm-max-w-[1100px]">
      <JobsPipeline
        statusCounts={counts}
        newCounts={{ unassessed: 1 }}
        value={value}
        onChange={setValue}
      />
      <CandidateTable candidates={visible} emptyMessage="Filtru neodpovídá žádný uchazeč" />
    </div>
  )
}

/** The pipeline shares its container with the table, so both line up and filter the same rows. */
export const AboveCandidateTable: Story = {
  render: () => <PipelineWithTable />,
}
