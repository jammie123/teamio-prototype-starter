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

/** Hidden and reordered columns; the name and note columns stay pinned at the edges. */
export const CustomColumns: Story = {
  args: {
    columns: [
      { id: 'name', visible: true },
      { id: 'status', visible: true },
      { id: 'source', visible: true },
      { id: 'rating', visible: true },
      { id: 'attachments', visible: false },
      { id: 'ai', visible: false },
      { id: 'lastContact', visible: false },
      { id: 'tags', visible: false },
      { id: 'note', visible: true },
    ],
  },
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

function SelectableTable(args: CandidateTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <div className="tm-min-h-[520px]">
      <CandidateTable
        {...args}
        className="tm-max-w-[900px]"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onAction={fn()}
      />
    </div>
  )
}

/** Select column with a checkbox and the actions menu; the header checkbox selects all rows. */
export const WithSelection: Story = {
  render: (args) => <SelectableTable {...args} />,
}
