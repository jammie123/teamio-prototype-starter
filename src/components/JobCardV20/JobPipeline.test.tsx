import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobPipeline } from './JobPipeline'

const candidates = { new: 5, newOpalcovani: 3, unassessed: 14, inProgress: 6, total: 52 }

describe('JobPipeline', () => {
  it('renders Neposouzený, Ve hře and Celkem without a background', () => {
    render(<JobPipeline candidates={candidates} />)

    const stats = screen.getByTestId('job-card-stats')
    expect(stats.className).not.toMatch(/tm-bg-/)
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Ve hře')).toBeInTheDocument()
    expect(within(stats).getByText('Celkem')).toBeInTheDocument()

    const unassessed = screen.getByTestId('job-card-stat-unassessed')
    const inProgress = screen.getByTestId('job-card-stat-inProgress')
    const total = screen.getByTestId('job-card-stat-total')

    expect(unassessed.className).toContain('tm-w-[150px]')
    expect(unassessed.className).not.toContain('tm-w-[120px]')
    expect(unassessed.className).toContain('tm-items-start')
    expect(inProgress.className).toContain('tm-w-[150px]')
    expect(inProgress.className).not.toContain('tm-w-[120px]')
    expect(inProgress.className).toContain('tm-items-start')
    expect(total.className).toContain('tm-items-start')
    expect(total.className).toContain('tm-w-[120px]')
    expect(total.className).not.toContain('tm-w-[150px]')
    expect(inProgress.className).toContain('tm-border-l')
    expect(within(unassessed).getByText('14').className).toContain('tm-text-2xl')
    expect(within(unassessed).getByText('14').parentElement?.className).toContain('tm-flex-row')
    expect(within(unassessed).getByText('14').parentElement?.className).toContain('tm-items-center')
    expect(within(unassessed).getByText('14').parentElement?.className).not.toContain(
      'tm-flex-row-reverse',
    )
    expect(within(unassessed).getByText('14').parentElement?.className).toContain('tm-gap-2')
    expect(within(total).getByText('52').className).toContain('tm-text-xl')
  })

  it('shows the new and opalcovaný badges on their own stat', () => {
    render(<JobPipeline candidates={candidates} />)

    expect(
      within(screen.getByTestId('job-card-stat-unassessed')).getByTestId('job-card-new-candidates'),
    ).toHaveTextContent('5 nový')
    expect(
      within(screen.getByTestId('job-card-stat-inProgress')).getByTestId('job-card-new-opalcovani'),
    ).toHaveTextContent('3 opalcovaný')
    expect(
      within(screen.getByTestId('job-card-stat-total')).queryByTestId('job-card-new-candidates'),
    ).not.toBeInTheDocument()
  })

  it('hides badges when their counts are zero', () => {
    render(<JobPipeline candidates={{ ...candidates, new: 0, newOpalcovani: 0 }} />)

    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-new-opalcovani')).not.toBeInTheDocument()
  })

  it('renders nothing without counts', () => {
    const { container } = render(<JobPipeline candidates={{ new: 2 }} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('makes stats clickable and reports the clicked stat', async () => {
    const user = userEvent.setup()
    const onStatClick = vi.fn()
    render(<JobPipeline candidates={candidates} onStatClick={onStatClick} />)

    const button = screen.getByRole('button', { name: /Ve hře: 6/ })
    expect(button).toHaveAccessibleName('Ve hře: 6, Nově opalcovaní: 3')

    await user.click(button)
    expect(onStatClick).toHaveBeenCalledWith('inProgress')
  })
})
