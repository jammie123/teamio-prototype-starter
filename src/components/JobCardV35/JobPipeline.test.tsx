import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobPipeline } from './JobPipeline'

const candidates = { new: 5, unassessed: 14, inProgress: 6, opalcovani: 3, total: 52 }

describe('JobPipeline', () => {
  it('renders Neposouzený, Ve hře, Opalcovaný and Celkem in order without a background', () => {
    render(<JobPipeline candidates={candidates} />)

    const stats = screen.getByTestId('job-card-stats')
    expect(stats.className).not.toMatch(/tm-bg-/)
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Ve hře')).toBeInTheDocument()
    expect(within(stats).getByText('Opalcovaný')).toBeInTheDocument()
    expect(within(stats).getByText('Celkem')).toBeInTheDocument()

    expect(
      Array.from(stats.children).map((child) => child.getAttribute('data-testid')),
    ).toEqual([
      'job-card-stat-unassessed',
      'job-card-stat-inProgress',
      'job-card-stat-opalcovani',
      'job-card-stat-total',
    ])

    const unassessed = screen.getByTestId('job-card-stat-unassessed')
    const inProgress = screen.getByTestId('job-card-stat-inProgress')
    const opalcovani = screen.getByTestId('job-card-stat-opalcovani')
    const total = screen.getByTestId('job-card-stat-total')

    for (const stat of [unassessed, inProgress, opalcovani, total]) {
      expect(stat.className).toContain('md:tm-w-[126px]')
      expect(stat.className).not.toContain('md:tm-w-pipeline')
    }
    expect(unassessed.className).toContain('md:tm-items-end')
    expect(inProgress.className).toContain('md:tm-items-end')
    expect(total.className).toContain('md:tm-items-end')
    expect(inProgress.className).toContain('md:tm-border-l')
    expect(inProgress.className).toContain('tm-border-t')
    expect(within(unassessed).getByText('14').className).toContain('tm-text-xl')
    expect(within(unassessed).getByText('14').className).not.toContain('tm-text-2xl')
    expect(within(inProgress).getByText('6').className).toContain('tm-text-xl')
    expect(within(opalcovani).getByText('3').className).toContain('tm-text-xl')
    expect(within(unassessed).getByText('14').parentElement?.className).toContain(
      'tm-flex-row-reverse',
    )
    expect(within(unassessed).getByText('14').parentElement?.className).toContain('tm-gap-2')
    expect(within(total).getByText('52').className).toContain('tm-text-xl')
  })

  it('shows the new candidates as a pink Pill on Neposouzený only', () => {
    render(<JobPipeline candidates={candidates} />)

    const pill = within(screen.getByTestId('job-card-stat-unassessed')).getByTestId(
      'job-card-new-candidates',
    )
    expect(pill).toHaveTextContent(/^5$/)
    expect(pill.className).toContain('tm-rounded-full')
    expect(pill.className).toContain('tm-bg-teamio-pink')
    expect(
      within(screen.getByTestId('job-card-stat-total')).queryByTestId('job-card-new-candidates'),
    ).not.toBeInTheDocument()
  })

  it('does not render an opalcovaný badge', () => {
    render(<JobPipeline candidates={candidates} />)

    expect(screen.queryByTestId('job-card-new-opalcovani')).not.toBeInTheDocument()
    expect(screen.queryByText(/opalcovaný$/)).not.toBeInTheDocument()
  })

  it('hides the new pill when its count is zero', () => {
    render(<JobPipeline candidates={{ ...candidates, new: 0 }} />)

    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()
  })

  it('renders K ohodnocení and Celkem for a Hiring Manager', async () => {
    const user = userEvent.setup()
    const onStatClick = vi.fn()
    render(
      <JobPipeline
        isHiringManager
        candidates={{ ...candidates, toAssess: 4 }}
        onStatClick={onStatClick}
      />,
    )

    const stats = screen.getByTestId('job-card-stats')
    expect(
      Array.from(stats.children).map((child) => child.getAttribute('data-testid')),
    ).toEqual(['job-card-stat-toAssess', 'job-card-stat-total'])
    expect(within(stats).getByText('K ohodnocení')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'K ohodnocení: 4' }))
    expect(onStatClick).toHaveBeenCalledWith('toAssess')
  })

  it('renders nothing without counts', () => {
    const { container } = render(<JobPipeline candidates={{ new: 2 }} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('makes stats clickable and reports the clicked stat', async () => {
    const user = userEvent.setup()
    const onStatClick = vi.fn()
    render(<JobPipeline candidates={candidates} onStatClick={onStatClick} />)

    expect(screen.getByRole('button', { name: /Neposouzený: 14/ })).toHaveAccessibleName(
      'Neposouzený: 14, Noví kandidáti: 5',
    )

    await user.click(screen.getByRole('button', { name: /Opalcovaný: 3/ }))
    expect(onStatClick).toHaveBeenCalledWith('opalcovani')

    await user.click(screen.getByRole('button', { name: /Ve hře: 6/ }))
    expect(onStatClick).toHaveBeenCalledWith('inProgress')
  })
})
