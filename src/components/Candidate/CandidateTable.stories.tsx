import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { CandidateTable, type CandidateTableProps } from './CandidateTable'
import { sampleCandidates } from './fixtures'
import type { CandidateItemData } from './types'

const meta = {
  title: 'Candidate/CandidateTable',
  component: CandidateTable,
  args: {
    candidates: sampleCandidates,
    onNameClick: fn(),
    onAttachmentsClick: fn(),
    onStatusChange: fn(),
    onTagAdd: fn(),
    onTagRemove: fn(),
    onNoteAdd: fn(),
    onNoteExpand: fn(),
  },
} satisfies Meta<typeof CandidateTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Scroll the table horizontally: the name column sticks left and the note column sticks right. */
export const StickyColumns: Story = {
  render: (args) => <CandidateTable {...args} className="tm-max-w-[900px]" />,
}

export const Empty: Story = {
  args: { candidates: [] },
}

export const CustomEmptyMessage: Story = {
  args: { candidates: [], emptyMessage: 'Filtru neodpovídá žádný uchazeč' },
}

function InteractiveTable(args: CandidateTableProps) {
  const [rows, setRows] = useState<CandidateItemData[]>(args.candidates)
  const update = (id: string, patch: (row: CandidateItemData) => CandidateItemData) =>
    setRows((current) => current.map((row) => (row.id === id ? patch(row) : row)))

  return (
    <CandidateTable
      {...args}
      candidates={rows}
      className="tm-max-w-[900px]"
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
  )
}

export const Interactive: Story = {
  render: (args) => <InteractiveTable {...args} />,
}
