import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { formatCompactDateRange } from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify26 } from './JobCardSimplify26'

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

function publication(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 10. 2026', ...partial }
}

describe('JobCardSimplify26', () => {
  it('keeps the Simplify 13 recruitment shell', () => {
    render(<JobCardSimplify26 title="Operátor výroby" advertisements={[]} />)

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-26')
    expect(screen.getByTestId('job-card-recruitment')).toHaveTextContent('Operátor výroby')
    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Zatím nemáte vytvořený žádný inzerát.',
    )
  })

  it('shows a shared running period in the heading and portals in a row without dates', () => {
    const endDate = daysFromNow(40)
    const advertisement: JobAdvertisement = {
      id: 'running-same',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate }),
      ],
    }

    render(<JobCardSimplify26 title="Pozice" advertisements={[advertisement]} />)

    const column = screen.getByTestId('job-card-simplify26-active-column')
    expect(screen.getByTestId('job-card-simplify26-running-heading')).toHaveTextContent(
      `Běží ${formatCompactDateRange('1. 10. 2026', endDate)}`,
    )
    expect(screen.queryByTestId('job-card-simplify26-inactive-column')).not.toBeInTheDocument()

    const list = within(column).getByTestId('advertisement-list')
    expect(list).toHaveAttribute('data-layout', 'column')
    expect(list).toHaveAttribute('data-status', 'active')
    expect(within(list).queryByTestId('job-board-item-date')).not.toBeInTheDocument()
    expect(within(list).getAllByTestId('job-board-item')[0]).toHaveAttribute('data-status', 'active')
  })

  it('splits mixed running periods and a shared ended date into two bordered columns', () => {
    const advertisement: JobAdvertisement = {
      id: 'screen',
      publications: [
        publication({ id: 'jobs-live', channel: 'Jobs.cz', endDate: daysFromNow(40) }),
        publication({
          id: 'recommend-live',
          channel: 'Doporučení',
          startDate: '15. 9. 2026',
          endDate: daysFromNow(60),
        }),
        publication({ id: 'export-live', channel: 'Export' }),
        publication({
          id: 'jobs-ended',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        publication({
          id: 'recommend-ended',
          channel: 'Doporučení',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        publication({
          id: 'export-ended',
          channel: 'Export',
          status: 'expired',
          startDate: '1. 10. 2025',
        }),
      ],
    }

    render(<JobCardSimplify26 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.getByTestId('job-card-simplify26-running-heading')).toHaveTextContent(
      'Běží v různá období',
    )
    expect(screen.getByTestId('job-card-simplify26-ended-heading')).toHaveTextContent(
      'Inzerce skončila 1. 1. 2026',
    )

    const active = screen.getByTestId('job-card-simplify26-active-column')
    const inactive = screen.getByTestId('job-card-simplify26-inactive-column')
    expect(inactive.className).toContain('tm-border-l')
    expect(within(active).getByTestId('advertisement-list')).toHaveAttribute('data-layout', 'column')
    expect(within(inactive).getByTestId('advertisement-list')).toHaveAttribute('data-layout', 'column')
    expect(within(inactive).getByTestId('advertisement-list')).toHaveAttribute('data-status', 'inactive')

    const activeItems = within(active).getAllByTestId('job-board-item')
    const jobsDate = within(activeItems[0]).getByTestId('job-board-item-date')
    expect(jobsDate).toHaveTextContent(formatCompactDateRange('1. 10. 2026', daysFromNow(40)))
    expect(jobsDate.parentElement).toHaveClass('tm-flex-col')
    expect(jobsDate.previousElementSibling).toHaveTextContent('Jobs.cz')
    expect(within(activeItems[2]).queryByTestId('job-board-item-date')).not.toBeInTheDocument()
    expect(within(inactive).queryByTestId('job-board-item-date')).not.toBeInTheDocument()
    expect(within(inactive).getAllByTestId('job-board-item')[0]).toHaveAttribute('data-status', 'expired')
  })

  it('stacks ending soon under running and shows differing end dates on items', () => {
    const soonA = daysFromNow(2)
    const soonB = daysFromNow(5)
    const advertisement: JobAdvertisement = {
      id: 'ending',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(40) }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: soonA }),
        publication({ id: 'atmoskop', channel: 'Atmoskop', endDate: soonB }),
      ],
    }

    render(<JobCardSimplify26 title="Pozice" advertisements={[advertisement]} />)

    const active = screen.getByTestId('job-card-simplify26-active-column')
    const headings = within(active).getAllByRole('paragraph')
    expect(headings.map((heading) => heading.textContent)).toEqual([
      expect.stringMatching(/^Běží /),
      'Brzy končí',
    ])
    expect(within(active).getAllByTestId('job-board-item-date').map((node) => node.textContent)).toEqual([
      soonA,
      soonB,
    ])
  })

  it('shows Neinzeruje se without advertisement columns', () => {
    render(
      <JobCardSimplify26
        title="Pozice"
        advertisements={[{ id: 'declined', status: 'notAdvertising', publications: [] }]}
      />,
    )

    const heading = screen.getByTestId('job-card-simplify26-not-advertising-heading')
    expect(heading).toHaveTextContent('Neinzeruje se')
    expect(heading.className).toContain('tm-text-secondary-default')
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-quiet', 'true')
    expect(screen.queryByTestId('job-card-simplify26-active-column')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify26-inactive-column')).not.toBeInTheDocument()
  })

  it('keeps a draft advertisement on the Simplify 13 panel', () => {
    render(
      <JobCardSimplify26
        title="Pozice"
        advertisements={[{ id: 'draft', status: 'draft', title: 'Rozpracovaný inzerát', publications: [] }]}
      />,
    )

    expect(screen.getByText('Rozpracovaný inzerát')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify26-not-advertising-heading')).not.toBeInTheDocument()
  })
})
