import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CandidateListPanel, type CandidateListPanelProps } from './CandidateListPanel'
import { CandidateTable } from './CandidateTable'
import { sampleCandidates } from './fixtures'

const baseProps: CandidateListPanelProps = {
  statusCounts: { unassessed: 2, rejected: 1, total: 6 },
  statusValue: undefined,
  onStatusChange: vi.fn(),
  searchValue: '',
  onSearchChange: vi.fn(),
}

describe('CandidateListPanel', () => {
  it('renders the pipeline, toolbar and table in one container', () => {
    render(
      <CandidateListPanel {...baseProps}>
        <CandidateTable candidates={sampleCandidates} />
      </CandidateListPanel>,
    )

    const panel = screen.getByTestId('candidate-list-panel')
    expect(panel).toContainElement(screen.getByTestId('jobs-pipeline'))
    expect(panel).toContainElement(screen.getByTestId('candidate-list-panel-toolbar'))
    expect(panel).toContainElement(screen.getByTestId('candidate-table'))
  })

  it('places the toolbar between the pipeline and the table', () => {
    render(
      <CandidateListPanel {...baseProps}>
        <CandidateTable candidates={sampleCandidates} />
      </CandidateListPanel>,
    )

    const order = Array.from(screen.getByTestId('candidate-list-panel').querySelectorAll('[data-testid]'))
      .map((node) => node.getAttribute('data-testid'))
      .filter((id) =>
        ['jobs-pipeline', 'candidate-list-panel-toolbar', 'candidate-table'].includes(id ?? ''),
      )
    expect(order).toEqual(['jobs-pipeline', 'candidate-list-panel-toolbar', 'candidate-table'])
  })

  it('shows the rejected pipeline tab and forwards status changes', async () => {
    const user = userEvent.setup()
    const onStatusChange = vi.fn()
    render(<CandidateListPanel {...baseProps} onStatusChange={onStatusChange} />)

    expect(screen.getByTestId('jobs-pipeline-status-rejected-count')).toHaveTextContent('1')
    await user.click(screen.getByTestId('jobs-pipeline-status-rejected'))

    expect(onStatusChange).toHaveBeenCalledWith('rejected')
  })

  it('renders a labelled search field and reports typed text', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    render(<CandidateListPanel {...baseProps} onSearchChange={onSearchChange} />)

    const search = screen.getByRole('searchbox', { name: 'Hledat uchazeče' })
    expect(search).toHaveAttribute('placeholder', 'Hledat uchazeče…')
    await user.type(search, 'k')

    expect(onSearchChange).toHaveBeenCalledWith('k')
  })

  it('shows the controlled search value', () => {
    render(<CandidateListPanel {...baseProps} searchValue="karl" />)

    expect(screen.getByRole('searchbox')).toHaveValue('karl')
  })

  it('renders the Filtry button and calls onFiltersClick', async () => {
    const user = userEvent.setup()
    const onFiltersClick = vi.fn()
    render(<CandidateListPanel {...baseProps} onFiltersClick={onFiltersClick} />)

    await user.click(screen.getByRole('button', { name: 'Filtry' }))

    expect(onFiltersClick).toHaveBeenCalledTimes(1)
  })

  it('shows the number of active filters in the button', () => {
    render(<CandidateListPanel {...baseProps} activeFiltersCount={2} />)

    expect(screen.getByRole('button', { name: 'Filtry (2)' })).toBeInTheDocument()
  })

  it('resets the border of the table so there is only one frame', () => {
    render(
      <CandidateListPanel {...baseProps}>
        <CandidateTable candidates={sampleCandidates} />
      </CandidateListPanel>,
    )

    expect(screen.getByTestId('candidate-list-panel-content')).toHaveClass(
      '[&>*]:!tm-border-0',
      '[&>*]:!tm-rounded-none',
    )
  })

  it('lets the pipeline span the full panel width on a cover-light background without padding', () => {
    render(<CandidateListPanel {...baseProps} />)

    const wrapper = screen.getByTestId('candidate-list-panel-pipeline')
    expect(wrapper).not.toHaveClass('tm-px-4', 'tm-pt-1')
    expect(wrapper).toHaveClass('tm-bg-cover-light')
    expect(wrapper).toContainElement(screen.getByTestId('jobs-pipeline'))
  })

  it('omits the content area without children', () => {
    render(<CandidateListPanel {...baseProps} />)

    expect(screen.queryByTestId('candidate-list-panel-content')).not.toBeInTheDocument()
  })

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>()
    render(<CandidateListPanel {...baseProps} ref={ref} className="custom" />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('tm-w-full', 'custom')
  })
})
