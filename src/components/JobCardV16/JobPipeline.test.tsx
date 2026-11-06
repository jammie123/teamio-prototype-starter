import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobPipeline } from './JobPipeline'

const candidates = { new: 5, unassessed: 14, preselected: 6, evaluated: 8 }

describe('JobPipeline', () => {
  it('renders Neposouzený, Předvybraný and Ohodnocený without a background', () => {
    render(<JobPipeline candidates={candidates} />)

    const stats = screen.getByTestId('job-card-stats')
    expect(stats.className).not.toMatch(/tm-bg-/)
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Předvybraný')).toBeInTheDocument()
    expect(within(stats).getByText('Ohodnocený')).toBeInTheDocument()
    expect(within(stats).queryByText('Ve hře')).not.toBeInTheDocument()
    expect(within(stats).queryByText('Celkem')).not.toBeInTheDocument()

    const unassessed = screen.getByTestId('job-card-stat-unassessed')
    const preselected = screen.getByTestId('job-card-stat-preselected')
    const evaluated = screen.getByTestId('job-card-stat-evaluated')

    expect(unassessed.className).toContain('tm-w-[150px]')
    expect(unassessed.className).toContain('tm-items-end')
    expect(preselected.className).toContain('tm-items-end')
    expect(preselected.className).toContain('tm-w-[150px]')
    expect(evaluated.className).toContain('tm-items-end')
    expect(evaluated.className).toContain('tm-w-[150px]')
    expect(preselected.className).toContain('tm-border-l')
    expect(within(unassessed).getByText('14').className).toContain('tm-text-2xl')
    expect(within(unassessed).getByText('14').parentElement?.className).toContain(
      'tm-flex-row-reverse',
    )
    expect(within(evaluated).getByText('8').className).toContain('tm-text-xl')
  })

  it('shows the new badge only on Neposouzený', () => {
    render(<JobPipeline candidates={candidates} />)

    expect(
      within(screen.getByTestId('job-card-stat-unassessed')).getByTestId('job-card-new-candidates'),
    ).toHaveTextContent('5 nový')
    expect(
      within(screen.getByTestId('job-card-stat-preselected')).queryByTestId(
        'job-card-new-candidates',
      ),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-new-opalcovani')).not.toBeInTheDocument()
  })

  it('hides the new badge when the count is zero', () => {
    render(<JobPipeline candidates={{ ...candidates, new: 0 }} />)

    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()
  })

  it('renders nothing without counts', () => {
    const { container } = render(<JobPipeline candidates={{ new: 2 }} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('makes stats clickable and reports the clicked stat', async () => {
    const user = userEvent.setup()
    const onStatClick = vi.fn()
    render(<JobPipeline candidates={candidates} onStatClick={onStatClick} />)

    const button = screen.getByRole('button', { name: /Předvybraný: 6/ })
    expect(button).toHaveAccessibleName('Předvybraný: 6')

    await user.click(button)
    expect(onStatClick).toHaveBeenCalledWith('preselected')
  })
})
