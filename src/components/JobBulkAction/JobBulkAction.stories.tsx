import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { JobCardV40 } from '../JobCardV40'
import { runningSame, recruitmentNote } from '../JobCardV40/fixtures'
import { JobPageHeader } from '../JobPageHeader'
import { Tabs } from '../Tabs'
import { JobBulkAction, type JobBulkActionProps } from './JobBulkAction'

const demoJobs = [
  {
    id: 'job-1',
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
  },
  {
    id: 'job-2',
    title: 'Skladník/ce Praha',
    owner: 'Martina Nováková',
    hiringManagers: ['Jana Svobodová'],
  },
  {
    id: 'job-3',
    title: 'Operátor výroby Brno',
    owner: 'Jan Fuxa',
    hiringManagers: ['Tomáš Král'],
  },
] as const

const meta = {
  title: 'Jobs/JobBulkAction',
  component: JobBulkAction,
  args: {
    selectedCount: 0,
    totalCount: 3,
    onSelectAllChange: fn(),
    onArchive: fn(),
    onTransfer: fn(),
    onTurnOff: fn(),
  },
} satisfies Meta<typeof JobBulkAction>

export default meta
type Story = StoryObj<typeof meta>

function IsolatedBar(args: JobBulkActionProps) {
  return (
    <div className="tm-max-w-[1100px] tm-bg-cover-light tm-p-6">
      <JobBulkAction {...args} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <IsolatedBar {...args} />,
}

export const WithSelection: Story = {
  args: { selectedCount: 2 },
  render: (args) => <IsolatedBar {...args} />,
}

function InteractiveListing() {
  const [bulkActive, setBulkActive] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const jobIds = demoJobs.map((job) => job.id)
  const selectedCount = selectedIds.length

  function exitBulkMode() {
    setBulkActive(false)
    setSelectedIds([])
  }

  return (
    <Tabs defaultValue="aktivni">
      <div className="tm-bg-cover-light">
        <JobPageHeader
          bulkActionsActive={bulkActive}
          onBulkActionsToggle={() => {
            if (bulkActive) {
              exitBulkMode()
              return
            }
            setBulkActive(true)
          }}
        />
        <div className="tm-mx-auto tm-flex tm-w-full tm-max-w-[64rem] tm-flex-col tm-gap-4 tm-p-6">
          {bulkActive ? (
            <JobBulkAction
              selectedCount={selectedCount}
              totalCount={jobIds.length}
              onSelectAllChange={(checked) => {
                setSelectedIds(checked ? [...jobIds] : [])
              }}
              onArchive={exitBulkMode}
              onTransfer={exitBulkMode}
              onTurnOff={exitBulkMode}
            />
          ) : null}
          {demoJobs.map((job) => (
            <JobCardV40
              key={job.id}
              title={job.title}
              owner={job.owner}
              hiringManagers={[...job.hiringManagers]}
              candidates={{ new: 5, unassessed: 14, inProgress: 6, opalcovani: 3, total: 52 }}
              advertisements={[runningSame]}
              note={recruitmentNote}
              isBulkAction={bulkActive}
              isSelected={selectedIds.includes(job.id)}
              onBulkSelectChange={(selected) => {
                setSelectedIds((current) =>
                  selected ? [...current, job.id] : current.filter((id) => id !== job.id),
                )
              }}
            />
          ))}
        </div>
      </div>
    </Tabs>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveListing />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Hromadné akce' }))
    await expect(canvas.getByTestId('job-bulk-action')).toBeInTheDocument()
    await expect(
      within(canvas.getByTestId('job-bulk-action')).getByRole('button', {
        name: 'Vypnout hromadné úpravy',
      }),
    ).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Archivovat' })).toBeDisabled()

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Vybrat nábor Řidič/ka sk. C ČB PO–PÁ' }))
    await expect(canvas.getByRole('button', { name: 'Archivovat' })).toBeEnabled()

    await userEvent.click(canvas.getByRole('button', { name: 'Archivovat' }))
    await expect(canvas.queryByTestId('job-bulk-action')).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Hromadné akce' })).toBeInTheDocument()
    await expect(canvas.queryByTestId('job-card-bulk-select')).not.toBeInTheDocument()
  },
}
