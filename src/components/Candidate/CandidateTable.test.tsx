import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CandidateTable } from './CandidateTable'
import { sampleCandidates } from './fixtures'

describe('CandidateTable', () => {
  it('renders the header and one row per candidate', () => {
    render(<CandidateTable candidates={sampleCandidates} />)

    expect(screen.getByRole('table', { name: 'Uchazeči' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(9)
    expect(screen.getAllByTestId('candidate-item')).toHaveLength(sampleCandidates.length)
    expect(screen.getByText('Karl Jakub')).toBeInTheDocument()
  })

  it('keeps the header sticky columns aligned with the rows', () => {
    render(<CandidateTable candidates={sampleCandidates.slice(0, 1)} />)

    const headers = screen.getAllByRole('columnheader')
    expect(headers[0]).toHaveClass('tm-sticky', 'tm-left-0')
    expect(headers[8]).toHaveClass('tm-sticky', 'tm-right-0')
    expect(screen.getByTestId('candidate-cell-name')).toHaveClass('tm-sticky', 'tm-left-0')
    expect(screen.getByTestId('candidate-cell-note')).toHaveClass('tm-sticky', 'tm-right-0')
  })

  it('renders an empty state spanning all columns', () => {
    render(<CandidateTable candidates={[]} />)

    expect(screen.queryByTestId('candidate-item')).not.toBeInTheDocument()
    const empty = screen.getByTestId('candidate-table-empty')
    expect(within(empty).getByRole('cell')).toHaveAttribute('colspan', '9')
    expect(empty).toHaveTextContent('Žádní uchazeči')
  })

  it('renders a custom empty message and aria-label', () => {
    render(<CandidateTable candidates={[]} emptyMessage="Nic tu není" aria-label="Seznam" />)

    expect(screen.getByRole('table', { name: 'Seznam' })).toBeInTheDocument()
    expect(screen.getByTestId('candidate-table-empty')).toHaveTextContent('Nic tu není')
  })

  describe('scroll edges', () => {
    function mockScrollMetrics(container: HTMLElement, metrics: { scrollWidth: number; clientWidth: number }) {
      Object.defineProperty(container, 'scrollWidth', { configurable: true, value: metrics.scrollWidth })
      Object.defineProperty(container, 'clientWidth', { configurable: true, value: metrics.clientWidth })
    }

    function renderTable() {
      render(<CandidateTable candidates={sampleCandidates} />)
      return {
        wrapper: screen.getByTestId('candidate-table'),
        container: screen.getByRole('table').parentElement as HTMLElement,
      }
    }

    afterEach(() => {
      vi.useRealTimers()
    })

    it('hides dividers and shadows when the table fits', () => {
      const { wrapper, container } = renderTable()

      fireEvent.scroll(container)
      expect(wrapper).toHaveAttribute('data-overflow', 'false')
      expect(wrapper).toHaveAttribute('data-shadow-start', 'false')
      expect(wrapper).toHaveAttribute('data-shadow-end', 'false')
    })

    it('shows dividers whenever the table overflows, even without scrolling', () => {
      const { wrapper, container } = renderTable()
      mockScrollMetrics(container, { scrollWidth: 1250, clientWidth: 900 })

      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      fireEvent.scroll(container)

      expect(wrapper).toHaveAttribute('data-overflow', 'true')
    })

    it('adds the shadow per edge only while scrolling', () => {
      vi.useFakeTimers()
      const { wrapper, container } = renderTable()
      mockScrollMetrics(container, { scrollWidth: 1250, clientWidth: 900 })

      fireEvent.scroll(container)
      expect(wrapper).toHaveAttribute('data-overflow', 'true')
      expect(wrapper).toHaveAttribute('data-shadow-start', 'false')
      expect(wrapper).toHaveAttribute('data-shadow-end', 'true')

      container.scrollLeft = 120
      fireEvent.scroll(container)
      expect(wrapper).toHaveAttribute('data-shadow-start', 'true')
      expect(wrapper).toHaveAttribute('data-shadow-end', 'true')

      container.scrollLeft = 350
      fireEvent.scroll(container)
      expect(wrapper).toHaveAttribute('data-shadow-start', 'true')
      expect(wrapper).toHaveAttribute('data-shadow-end', 'false')

      act(() => {
        vi.advanceTimersByTime(300)
      })
      expect(wrapper).toHaveAttribute('data-overflow', 'true')
      expect(wrapper).toHaveAttribute('data-shadow-start', 'false')
      expect(wrapper).toHaveAttribute('data-shadow-end', 'false')
    })

    it('reveals the dividers and shadows through the table group', () => {
      render(<CandidateTable candidates={sampleCandidates.slice(0, 1)} />)

      expect(screen.getByTestId('candidate-table')).toHaveClass('tm-group/candidate-table')
      expect(screen.getByTestId('candidate-cell-name')).toHaveClass(
        'tm-border-r-transparent',
        'group-data-[overflow=true]/candidate-table:tm-border-r-secondary',
        'group-data-[shadow-start=true]/candidate-table:tm-shadow-[4px_0_8px_-4px_rgba(0,13,60,0.16)]',
      )
      expect(screen.getByTestId('candidate-cell-note')).toHaveClass(
        'tm-border-l-transparent',
        'group-data-[overflow=true]/candidate-table:tm-border-l-secondary',
        'group-data-[shadow-end=true]/candidate-table:tm-shadow-[-4px_0_8px_-4px_rgba(0,13,60,0.16)]',
      )
    })
  })

  it('passes row callbacks with the candidate', async () => {
    const user = userEvent.setup()
    const onNameClick = vi.fn()
    const onStatusChange = vi.fn()
    const [first] = sampleCandidates
    render(
      <CandidateTable
        candidates={[first]}
        onNameClick={onNameClick}
        onStatusChange={onStatusChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: first.name }))
    expect(onNameClick).toHaveBeenCalledWith(first)

    await user.click(screen.getByTestId('candidate-status-toggle'))
    await user.click(screen.getByRole('option', { name: 'Zamítnut' }))
    expect(onStatusChange).toHaveBeenCalledWith(first, 'rejected')
  })
})
