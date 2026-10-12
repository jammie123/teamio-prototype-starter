import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Table, TableBody } from '../Table'
import { CandidateItem } from './CandidateItem'
import { CandidateListPanel, type CandidateListPanelProps } from './CandidateListPanel'
import { CandidateTable } from './CandidateTable'
import { CandidateTableHead } from './CandidateTableHead'
import { sampleCandidates } from './fixtures'

const [first, second] = sampleCandidates

describe('CandidateItem selection', () => {
  function renderItem(props: Parameters<typeof CandidateItem>[0]) {
    return render(
      <Table>
        <TableBody>
          <CandidateItem {...props} />
        </TableBody>
      </Table>,
    )
  }

  it('has no select column without selection or actions', () => {
    renderItem({ candidate: first })

    expect(screen.queryByTestId('candidate-cell-select')).not.toBeInTheDocument()
    expect(screen.getByTestId('candidate-cell-name')).toHaveClass('tm-left-0')
  })

  it('adds a sticky select column in front of the name and offsets the name column', () => {
    renderItem({ candidate: first, onSelectChange: vi.fn() })

    const row = screen.getByTestId('candidate-item')
    const cells = within(row).getAllByRole('cell')
    expect(cells[0]).toBe(screen.getByTestId('candidate-cell-select'))
    expect(cells[1]).toBe(screen.getByTestId('candidate-cell-name'))
    expect(cells[0]).toHaveClass('tm-sticky', 'tm-left-0', 'tm-w-[6rem]')
    expect(cells[1]).toHaveClass('tm-sticky', 'tm-left-[6rem]')
    expect(cells[1]).not.toHaveClass('tm-left-0')
  })

  it('reports checkbox changes with the candidate', async () => {
    const user = userEvent.setup()
    const onSelectChange = vi.fn()
    renderItem({ candidate: first, onSelectChange })

    await user.click(screen.getByRole('checkbox', { name: `Vybrat uchazeče ${first.name}` }))

    expect(onSelectChange).toHaveBeenCalledWith(first, true)
  })

  it('reflects isSelected on the checkbox and the row', () => {
    renderItem({ candidate: first, onSelectChange: vi.fn(), isSelected: true })

    expect(screen.getByTestId('candidate-select')).toBeChecked()
    expect(screen.getByTestId('candidate-item')).toHaveAttribute('data-selected', 'true')
  })

  it('places the actions menu to the right of the checkbox and reports actions', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    renderItem({ candidate: first, onSelectChange: vi.fn(), onAction })

    const checkbox = screen.getByTestId('candidate-select')
    const toggle = screen.getByRole('button', { name: `Akce uchazeče ${first.name}` })
    expect(
      checkbox.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    await user.click(toggle)
    await user.click(screen.getByRole('option', { name: 'Zamítnout' }))
    expect(onAction).toHaveBeenCalledWith(first, 'reject', undefined)

    await user.click(toggle)
    await user.click(screen.getByRole('option', { name: 'Nástup' }))
    expect(onAction).toHaveBeenCalledWith(first, 'move', 'hired')
  })

  it('shows only the menu when there is no selection handler', () => {
    renderItem({ candidate: first, onAction: vi.fn() })

    expect(screen.getByTestId('candidate-cell-select')).toBeInTheDocument()
    expect(screen.queryByTestId('candidate-select')).not.toBeInTheDocument()
    expect(screen.getByTestId('candidate-actions-toggle')).toBeInTheDocument()
  })
})

describe('CandidateTableHead selection', () => {
  function renderHead(props: Parameters<typeof CandidateTableHead>[0]) {
    return render(
      <Table>
        <CandidateTableHead {...props} />
      </Table>,
    )
  }

  it('puts the select-all checkbox left of the name column', () => {
    renderHead({ onSelectAllChange: vi.fn(), totalCount: 3 })

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(10)
    expect(headers[0]).toBe(screen.getByTestId('candidate-header-select'))
    expect(headers[0]).toHaveClass('tm-sticky', 'tm-left-0')
    expect(headers[1]).toHaveTextContent('Uchazeč')
    expect(headers[1]).toHaveClass('tm-sticky', 'tm-left-[6rem]')
    expect(within(headers[0]).getByRole('checkbox', { name: 'Vybrat všechny uchazeče' })).toBeInTheDocument()
  })

  it('has no select column by default', () => {
    renderHead({})

    expect(screen.getAllByRole('columnheader')).toHaveLength(9)
    expect(screen.queryByTestId('candidate-header-select')).not.toBeInTheDocument()
  })

  it('shows unchecked, indeterminate and checked states', () => {
    const { rerender } = render(
      <Table>
        <CandidateTableHead onSelectAllChange={vi.fn()} totalCount={3} selectedCount={0} />
      </Table>,
    )
    const checkbox = screen.getByTestId('candidate-select-all') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    expect(checkbox.indeterminate).toBe(false)

    rerender(
      <Table>
        <CandidateTableHead onSelectAllChange={vi.fn()} totalCount={3} selectedCount={1} />
      </Table>,
    )
    expect(checkbox.checked).toBe(false)
    expect(checkbox.indeterminate).toBe(true)

    rerender(
      <Table>
        <CandidateTableHead onSelectAllChange={vi.fn()} totalCount={3} selectedCount={3} />
      </Table>,
    )
    expect(checkbox.checked).toBe(true)
    expect(checkbox.indeterminate).toBe(false)
  })
})

describe('CandidateTable selection', () => {
  function ControlledTable({ onChange }: { onChange?: (ids: string[]) => void }) {
    const [selected, setSelected] = useState<string[]>([])
    return (
      <CandidateTable
        candidates={sampleCandidates}
        selectedIds={selected}
        onSelectionChange={(ids) => {
          setSelected(ids)
          onChange?.(ids)
        }}
      />
    )
  }

  it('does not render the select column without onSelectionChange', () => {
    render(<CandidateTable candidates={sampleCandidates} />)

    expect(screen.queryByTestId('candidate-header-select')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId('candidate-cell-select')).toHaveLength(0)
  })

  it('renders a checkbox per row and the select-all checkbox', () => {
    render(<ControlledTable />)

    expect(screen.getAllByTestId('candidate-select')).toHaveLength(sampleCandidates.length)
    expect(screen.getByTestId('candidate-select-all')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(10)
  })

  it('selects and deselects single rows', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledTable onChange={onChange} />)

    await user.click(screen.getByRole('checkbox', { name: `Vybrat uchazeče ${first.name}` }))
    await user.click(screen.getByRole('checkbox', { name: `Vybrat uchazeče ${second.name}` }))
    expect(onChange).toHaveBeenLastCalledWith([first.id, second.id])
    expect((screen.getByTestId('candidate-select-all') as HTMLInputElement).indeterminate).toBe(true)

    await user.click(screen.getByRole('checkbox', { name: `Vybrat uchazeče ${first.name}` }))
    expect(onChange).toHaveBeenLastCalledWith([second.id])
  })

  it('selects all rows with the header checkbox and clears them again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledTable onChange={onChange} />)

    await user.click(screen.getByTestId('candidate-select-all'))
    expect(onChange).toHaveBeenLastCalledWith(sampleCandidates.map((candidate) => candidate.id))
    expect(screen.getByTestId('candidate-select-all')).toBeChecked()
    for (const checkbox of screen.getAllByTestId('candidate-select')) {
      expect(checkbox).toBeChecked()
    }

    await user.click(screen.getByTestId('candidate-select-all'))
    expect(onChange).toHaveBeenLastCalledWith([])
    expect(screen.getByTestId('candidate-select-all')).not.toBeChecked()
  })

  it('widens the empty state colspan by the select column', () => {
    render(<CandidateTable candidates={[]} onSelectionChange={vi.fn()} />)

    expect(within(screen.getByTestId('candidate-table-empty')).getByRole('cell')).toHaveAttribute(
      'colspan',
      '10',
    )
  })

  it('passes onAction and shows the menu for every row', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<CandidateTable candidates={[first]} onAction={onAction} />)

    await user.click(screen.getByTestId('candidate-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Upravit údaje' }))

    expect(onAction).toHaveBeenCalledWith(first, 'edit', undefined)
    expect(screen.getAllByRole('columnheader')).toHaveLength(10)
  })
})

describe('CandidateListPanel bulk actions', () => {
  const baseProps: CandidateListPanelProps = {
    statusCounts: { unassessed: 2, total: 6 },
    statusValue: undefined,
    onStatusChange: vi.fn(),
    searchValue: '',
    onSearchChange: vi.fn(),
  }

  it('keeps the toolbar while nothing is selected', () => {
    render(<CandidateListPanel {...baseProps} selectedCount={0} />)

    expect(screen.getByTestId('candidate-list-panel-toolbar')).toBeInTheDocument()
    expect(screen.queryByTestId('bulk-action')).not.toBeInTheDocument()
  })

  it('shows BulkAction above the toolbar, between the pipeline and the table', () => {
    render(
      <CandidateListPanel {...baseProps} selectedCount={2}>
        <CandidateTable candidates={sampleCandidates} />
      </CandidateListPanel>,
    )

    expect(screen.getByTestId('bulk-action-count')).toHaveTextContent('Vybráno: 2 uchazeči')
    expect(screen.getByRole('searchbox', { name: 'Hledat uchazeče' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filtry' })).toBeInTheDocument()
    const order = Array.from(screen.getByTestId('candidate-list-panel').querySelectorAll('[data-testid]'))
      .map((node) => node.getAttribute('data-testid'))
      .filter((id) =>
        ['jobs-pipeline', 'bulk-action', 'candidate-list-panel-toolbar', 'candidate-table'].includes(
          id ?? '',
        ),
      )
    expect(order).toEqual([
      'jobs-pipeline',
      'bulk-action',
      'candidate-list-panel-toolbar',
      'candidate-table',
    ])
  })

  it('forwards the bulk handlers', async () => {
    const user = userEvent.setup()
    const onReject = vi.fn()
    const onMoveTo = vi.fn()
    render(<CandidateListPanel {...baseProps} selectedCount={1} bulkActions={{ onReject, onMoveTo }} />)

    await user.click(screen.getByRole('button', { name: 'Zamítnout' }))
    expect(onReject).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTestId('bulk-action-move'))
    await user.click(screen.getByRole('option', { name: 'Nástup' }))
    expect(onMoveTo).toHaveBeenCalledWith('hired', expect.objectContaining({ id: 'hired' }))
  })
})
