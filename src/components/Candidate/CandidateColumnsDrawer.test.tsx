import { createEvent, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CandidateColumnsDrawer } from './CandidateColumnsDrawer'
import { CANDIDATE_DEFAULT_COLUMNS } from './candidateCopy'
import type { CandidateColumnState } from './types'

function Harness({
  initial = CANDIDATE_DEFAULT_COLUMNS,
  onApply,
}: {
  initial?: CandidateColumnState[]
  onApply: (columns: CandidateColumnState[]) => void
}) {
  const [open, setOpen] = useState(true)
  const [columns, setColumns] = useState(initial)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        open
      </button>
      <CandidateColumnsDrawer
        open={open}
        onOpenChange={setOpen}
        columns={columns}
        onApply={(next) => {
          setColumns(next)
          onApply(next)
        }}
      />
    </>
  )
}

const order = () =>
  within(screen.getByTestId('candidate-columns-list'))
    .getAllByRole('listitem')
    .map((item) => item.getAttribute('data-testid')?.replace('candidate-column-', ''))

function drag(source: string, target: string, clientY: number) {
  const dataTransfer = { setData: vi.fn(), effectAllowed: '', dropEffect: '' }
  const from = screen.getByTestId(`candidate-column-${source}`)
  const to = screen.getByTestId(`candidate-column-${target}`)
  fireEvent.dragStart(from, { dataTransfer })
  // jsdom has no DragEvent, so `clientY` from the init dictionary is dropped; set it explicitly.
  const over = createEvent.dragOver(to, { dataTransfer })
  const drop = createEvent.drop(to, { dataTransfer })
  for (const event of [over, drop]) Object.defineProperty(event, 'clientY', { value: clientY })
  fireEvent(to, over)
  fireEvent(to, drop)
  fireEvent.dragEnd(from, { dataTransfer })
  return over
}

describe('CandidateColumnsDrawer', () => {
  it('lists all columns with checkboxes', () => {
    render(<Harness onApply={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: 'Přizpůsobit sloupce' })
    expect(within(dialog).getAllByRole('checkbox')).toHaveLength(9)
    expect(order()).toEqual(CANDIDATE_DEFAULT_COLUMNS.map((column) => column.id))
  })

  it('shows the name and note columns as checked and disabled without a drag handle', () => {
    render(<Harness onApply={vi.fn()} />)

    for (const label of ['Uchazeč', 'Poznámka']) {
      const checkbox = screen.getByRole('checkbox', { name: label })
      expect(checkbox).toBeChecked()
      expect(checkbox).toBeDisabled()
    }
    expect(screen.queryByTestId('candidate-column-handle-name')).not.toBeInTheDocument()
    expect(screen.queryByTestId('candidate-column-handle-note')).not.toBeInTheDocument()
    expect(screen.getByTestId('candidate-column-name')).not.toHaveAttribute('draggable', 'true')
    expect(screen.getByRole('checkbox', { name: 'Zdroj' })).toBeEnabled()
  })

  it('applies hidden columns on save and closes the drawer', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<Harness onApply={onApply} />)

    await user.click(screen.getByRole('checkbox', { name: 'Zdroj' }))
    await user.click(screen.getByRole('button', { name: 'Uložit' }))

    expect(onApply).toHaveBeenCalledTimes(1)
    const applied: CandidateColumnState[] = onApply.mock.calls[0][0]
    expect(applied.find((column) => column.id === 'source')?.visible).toBe(false)
    expect(applied.filter((column) => !column.visible)).toHaveLength(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('discards the draft on cancel and starts from the current columns when reopened', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<Harness onApply={onApply} />)

    await user.click(screen.getByRole('checkbox', { name: 'Zdroj' }))
    await user.click(screen.getByRole('button', { name: 'Zrušit' }))
    expect(onApply).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('checkbox', { name: 'Zdroj' })).toBeChecked()
  })

  it('moves a column with the arrow keys and keeps focus on its handle', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<Harness onApply={onApply} />)

    const handle = screen.getByRole('button', { name: 'Přesunout sloupec Stav' })
    handle.focus()
    await user.keyboard('{ArrowUp}')

    expect(order().slice(1, 5)).toEqual(['rating', 'attachments', 'status', 'ai'])
    expect(screen.getByRole('button', { name: 'Přesunout sloupec Stav' })).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Sloupec Stav je na pozici 4 z 9')

    await user.click(screen.getByRole('button', { name: 'Uložit' }))
    expect(onApply.mock.calls[0][0].map((column: CandidateColumnState) => column.id).slice(1, 5)).toEqual([
      'rating',
      'attachments',
      'status',
      'ai',
    ])
  })

  it('moves a column with the up and down arrows shown on the left of the row', async () => {
    const user = userEvent.setup()
    render(<Harness onApply={vi.fn()} />)

    const down = screen.getByRole('button', { name: 'Posunout sloupec Stav dolů' })
    await user.click(down)
    expect(order().slice(3, 6)).toEqual(['ai', 'lastContact', 'status'])
    expect(screen.getByRole('button', { name: 'Posunout sloupec Stav dolů' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Posunout sloupec Stav nahoru' }))
    expect(order().slice(3, 6)).toEqual(['ai', 'status', 'lastContact'])
    expect(screen.getByRole('status')).toHaveTextContent('Sloupec Stav je na pozici 5 z 9')
  })

  it('disables the up arrow of the first and the down arrow of the last movable column', () => {
    render(<Harness onApply={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Posunout sloupec Hodnocení nahoru' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Posunout sloupec Hodnocení dolů' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Posunout sloupec Štítky dolů' })).toBeDisabled()
    expect(screen.queryByTestId('candidate-column-up-name')).not.toBeInTheDocument()
    expect(screen.queryByTestId('candidate-column-down-note')).not.toBeInTheDocument()
  })

  it('highlights a row on hover and reveals its arrows only while the row is hovered', () => {
    render(<Harness onApply={vi.fn()} />)

    const row = screen.getByTestId('candidate-column-status')
    expect(row).toHaveClass('tm-group/row', 'hover:tm-bg-cover-light')
    expect(screen.getByTestId('candidate-column-up-status')).toHaveClass(
      'tm-opacity-0',
      'group-hover/row:tm-opacity-100',
      'group-focus-within/row:tm-opacity-100',
    )
    expect(screen.getByTestId('candidate-column-handle-status')).not.toHaveClass('tm-opacity-0')
    expect(screen.getByTestId('candidate-column-name')).toHaveClass('hover:tm-bg-cover-light')
  })

  it('does not move the first movable column above the name column', async () => {
    const user = userEvent.setup()
    render(<Harness onApply={vi.fn()} />)

    screen.getByRole('button', { name: 'Přesunout sloupec Hodnocení' }).focus()
    await user.keyboard('{ArrowUp}')

    expect(order()[0]).toBe('name')
    expect(order()[1]).toBe('rating')
  })

  it('reorders columns by dragging, using the half of the target the pointer is in', () => {
    render(<Harness onApply={vi.fn()} />)

    // jsdom has no layout: every row's rect is at 0 with zero height, so -1 is "above" and 100 "below".
    const over = drag('tags', 'rating', -1)
    expect(over.defaultPrevented).toBe(true)
    expect(order().slice(1, 4)).toEqual(['tags', 'rating', 'attachments'])

    drag('tags', 'source', 100)
    expect(order().slice(5, 9)).toEqual(['lastContact', 'source', 'tags', 'note'])
  })

  it('does not accept drops onto the locked columns', () => {
    render(<Harness onApply={vi.fn()} />)

    const over = drag('tags', 'name', 0)

    expect(over.defaultPrevented).toBe(false)
    expect(order()).toEqual(CANDIDATE_DEFAULT_COLUMNS.map((column) => column.id))
  })

  it('restores the default order and visibility', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<Harness onApply={onApply} />)

    await user.click(screen.getByRole('checkbox', { name: 'Zdroj' }))
    screen.getByRole('button', { name: 'Přesunout sloupec Štítky' }).focus()
    await user.keyboard('{ArrowUp}')
    await user.click(screen.getByRole('button', { name: 'Obnovit výchozí' }))

    expect(order()).toEqual(CANDIDATE_DEFAULT_COLUMNS.map((column) => column.id))
    expect(screen.getByRole('checkbox', { name: 'Zdroj' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Uložit' }))
    expect(onApply).toHaveBeenCalledWith(CANDIDATE_DEFAULT_COLUMNS)
  })

  it('keeps the title and footer outside the scrolling body', () => {
    render(<Harness onApply={vi.fn()} />)

    const dialog = screen.getByRole('dialog')
    const body = screen.getByTestId('candidate-columns-list').parentElement as HTMLElement
    expect(body).toHaveClass('tm-overflow-y-auto')
    expect(body).not.toContainElement(screen.getByText('Přizpůsobit sloupce', { selector: 'h2' }))
    expect(body).not.toContainElement(screen.getByTestId('candidate-columns-save'))
    expect(dialog).toHaveClass('tm-flex-col')
  })
})
