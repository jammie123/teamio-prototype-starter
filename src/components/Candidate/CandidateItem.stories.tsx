import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import { fn } from 'storybook/test'
import { Table, TableBody } from '../Table'
import { CandidateItem, type CandidateItemProps } from './CandidateItem'
import { CandidateTableHead } from './CandidateTableHead'
import { sampleCandidates } from './fixtures'
import type { CandidateItemData } from './types'

const [minayeva, cerny, karl, sousek, prijmeni] = sampleCandidates

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    // Rows are shown on their own here, so the sticky dividers and shadows that
    // `CandidateTable` toggles on overflow and while scrolling are forced on to make them visible.
    <div
      data-overflow="true"
      data-shadow-start="true"
      data-shadow-end="true"
      className={`tm-group/candidate-table tm-min-h-[320px] tm-overflow-hidden tm-rounded tm-border tm-border-secondary ${className ?? ''}`}
    >
      <Table aria-label="Uchazeči" className="tm-min-w-[1250px]">
        <CandidateTableHead />
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  )
}

const meta = {
  title: 'Candidate/CandidateItem',
  component: CandidateItem,
  args: {
    candidate: cerny,
    onNameClick: fn(),
    onAttachmentsClick: fn(),
    onStatusChange: fn(),
    onTagAdd: fn(),
    onTagRemove: fn(),
    onNoteAdd: fn(),
    onNoteExpand: fn(),
  },
  render: (args: CandidateItemProps) => (
    <Frame>
      <CandidateItem {...args} />
    </Frame>
  ),
} satisfies Meta<typeof CandidateItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutPhoneAndNote: Story = {
  args: { candidate: minayeva },
}

export const WithTags: Story = {
  args: { candidate: prijmeni },
}

export const LongNote: Story = {
  args: { candidate: karl },
}

export const NotContacted: Story = {
  args: { candidate: sousek },
}

/** Scroll the table horizontally: the name column sticks left and the note column sticks right. */
export const StickyColumns: Story = {
  render: (args) => (
    <Frame className="tm-max-w-[900px] tm-min-h-[420px]">
      {sampleCandidates.map((candidate) => (
        <CandidateItem key={candidate.id} {...args} candidate={candidate} />
      ))}
    </Frame>
  ),
}

function InteractiveRows() {
  const [rows, setRows] = useState<CandidateItemData[]>(sampleCandidates)
  const update = (id: string, patch: (row: CandidateItemData) => CandidateItemData) =>
    setRows((current) => current.map((row) => (row.id === id ? patch(row) : row)))

  return (
    <>
      {rows.map((candidate) => (
        <CandidateItem
          key={candidate.id}
          candidate={candidate}
          onStatusChange={(row, statusId) => update(row.id, (item) => ({ ...item, statusId }))}
          onTagAdd={(row) =>
            update(row.id, (item) => ({
              ...item,
              tags: [
                ...(item.tags ?? []),
                { id: `tag-${(item.tags?.length ?? 0) + 1}`, label: 'nový' },
              ],
            }))
          }
          onTagRemove={(row, tag) =>
            update(row.id, (item) => ({ ...item, tags: item.tags?.filter((t) => t.id !== tag.id) }))
          }
          onNoteAdd={(row) =>
            update(row.id, (item) => ({
              ...item,
              note: { text: 'Nová poznámka', addedAt: 'právě teď' },
            }))
          }
        />
      ))}
    </>
  )
}

export const Interactive: Story = {
  render: () => (
    <Frame className="tm-max-w-[900px] tm-min-h-[480px]">
      <InteractiveRows />
    </Frame>
  ),
}
