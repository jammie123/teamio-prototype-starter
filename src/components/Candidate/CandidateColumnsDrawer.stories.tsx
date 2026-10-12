import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { CandidateColumnsDrawer } from './CandidateColumnsDrawer'
import { CandidateTable } from './CandidateTable'
import { CANDIDATE_DEFAULT_COLUMNS } from './candidateCopy'
import { sampleCandidates } from './fixtures'
import type { CandidateColumnState } from './types'

const meta = {
  title: 'Candidate/CandidateColumnsDrawer',
  component: CandidateColumnsDrawer,
  args: {
    open: true,
    onOpenChange: fn(),
    columns: CANDIDATE_DEFAULT_COLUMNS,
    onApply: fn(),
  },
} satisfies Meta<typeof CandidateColumnsDrawer>

export default meta
type Story = StoryObj<typeof meta>

/** The name and note columns are checked and disabled, and have no drag handle. */
export const Default: Story = {
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Přizpůsobit sloupce')
    await expect(within(dialog).getByRole('checkbox', { name: 'Uchazeč' })).toBeDisabled()
    await expect(within(dialog).getByRole('checkbox', { name: 'Poznámka' })).toBeDisabled()
    await expect(within(dialog).getByRole('checkbox', { name: 'Zdroj' })).toBeEnabled()
  },
}

export const WithHiddenColumns: Story = {
  args: {
    columns: CANDIDATE_DEFAULT_COLUMNS.map((column) =>
      ['ai', 'tags', 'lastContact'].includes(column.id) ? { ...column, visible: false } : column,
    ),
  },
}

function InteractiveExample() {
  const [open, setOpen] = useState(false)
  const [columns, setColumns] = useState<CandidateColumnState[]>(CANDIDATE_DEFAULT_COLUMNS)

  return (
    <div className="tm-flex tm-flex-col tm-gap-4 tm-max-w-[1100px]">
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Přizpůsobit sloupce
        </Button>
      </div>
      <CandidateTable candidates={sampleCandidates} columns={columns} />
      <CandidateColumnsDrawer
        open={open}
        onOpenChange={setOpen}
        columns={columns}
        onApply={setColumns}
      />
    </div>
  )
}

/** Hide a column with its checkbox, drag a handle (or use arrow keys on it) and save to update the table. */
export const Interactive: Story = {
  render: () => <InteractiveExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Přizpůsobit sloupce' }))
    const dialog = await within(document.body).findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Zdroj' }))
    await userEvent.click(within(dialog).getByRole('button', { name: 'Uložit' }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('columnheader', { name: 'Zdroj' })).not.toBeInTheDocument()
  },
}
