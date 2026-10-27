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

  it('shows one success running heading and portals with their periods', () => {
    const endDate = daysFromNow(40)
    const advertisement: JobAdvertisement = {
      id: 'running-same',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate }),
      ],
    }

    render(<JobCardSimplify26 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.getAllByTestId('advertisement-header')).toHaveLength(1)
    const heading = screen.getByTestId('job-card-simplify26-running-heading')
    expect(heading).toHaveTextContent(`Běží ${formatCompactDateRange('1. 10. 2026', endDate)}`)
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    expect(screen.queryByTestId('advertisement-header-badge')).not.toBeInTheDocument()

    expect(screen.queryByTestId('job-card-simplify26-columns')).not.toBeInTheDocument()

    const list = screen.getByTestId('advertisement-list')
    expect(list).toHaveAttribute('data-status', 'active')

    const items = within(list).getAllByTestId('job-board-item')
    expect(items[0]).toHaveAttribute('data-status', 'active')
    expect(within(items[0]).getByTestId('job-board-item-date')).toHaveTextContent(
      `do ${endDate}`,
    )
    expect(within(items[0]).getByTestId('job-portal-logo').className).toContain('tm-size-[30px]')
    expect(within(items[0]).getByTestId('job-card-simplify19-channel-status-dot')).toHaveAttribute(
      'data-channel-status',
      'success',
    )
  })

  it('stacks running, ending-soon and ended groups vertically under one header', () => {
    const advertisement: JobAdvertisement = {
      id: 'screen',
      publications: [
        publication({ id: 'jobs-live', channel: 'Jobs.cz', endDate: daysFromNow(40) }),
        publication({ id: 'recommend-live', channel: 'Doporučení', startDate: '15. 9. 2026', endDate: daysFromNow(60) }),
        publication({ id: 'export-live', channel: 'Export' }),
        publication({ id: 'jobs-ended', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
        publication({ id: 'recommend-ended', channel: 'Doporučení', status: 'expired', endDate: '1. 1. 2026' }),
        publication({ id: 'export-ended', channel: 'Export', status: 'expired', startDate: '1. 10. 2025' }),
      ],
    }

    render(<JobCardSimplify26 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.getAllByTestId('advertisement-header')).toHaveLength(1)
    const heading = screen.getByTestId('job-card-simplify26-running-heading')
    expect(heading).toHaveTextContent('Běží v různá období')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    const badges = screen.getAllByTestId('advertisement-header-badge')
    expect(badges.map((badge) => badge.textContent)).toEqual(['3 ukončené'])
    expect(badges[0].className).toContain('tm-text-[11px]')
    expect(badges[0].className).toContain('tm-font-semibold')

    const lists = screen.getAllByTestId('advertisement-list')
    expect(lists.map((list) => list.getAttribute('data-status'))).toEqual(['active', 'inactive'])

    const endedItems = within(lists[1]).getAllByTestId('job-board-item')
    expect(endedItems).toHaveLength(3)
    expect(endedItems[0]).toHaveAttribute('data-status', 'expired')
    expect(within(endedItems[0]).getByTestId('job-card-simplify19-channel-status-dot')).toHaveAttribute(
      'data-channel-status',
      'gray',
    )
    expect(within(endedItems[0]).getByTestId('job-board-item-date')).toHaveTextContent('do 1. 1. 2026')
  })

  it('shows a warning badge and lists ending-soon dates on items', () => {
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

    expect(screen.getByTestId('job-card-simplify26-running-heading')).toHaveTextContent(
      'Běží v různá období',
    )
    const badges = screen.getAllByTestId('advertisement-header-badge')
    expect(badges.map((badge) => badge.textContent)).toEqual(['2 Brzy končí'])
    expect(badges[0]).toHaveAttribute('data-tone', 'warning')

    const [, endingSoonList] = screen.getAllByTestId('advertisement-list')
    expect(
      within(endingSoonList).getAllByTestId('job-board-item-date').map((node) => node.textContent),
    ).toEqual([`do ${soonA}`, `do ${soonB}`])
    expect(
      within(endingSoonList)
        .getAllByTestId('job-card-simplify19-channel-status-dot')
        .map((dot) => dot.getAttribute('data-channel-status')),
    ).toEqual(['warning', 'warning'])
  })

  it('shows Neinzeruje se without portal lists', () => {
    render(
      <JobCardSimplify26
        title="Pozice"
        advertisements={[{ id: 'declined', status: 'notAdvertising', publications: [] }]}
      />,
    )

    const heading = screen.getByTestId('job-card-simplify26-not-advertising-heading')
    expect(screen.getByTestId('advertisement-header')).toContainElement(heading)
    expect(heading).toHaveTextContent('Neinzeruje se')
    expect(heading.className).toContain('tm-text-secondary-default')
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-quiet', 'true')
    expect(screen.queryByTestId('advertisement-list')).not.toBeInTheDocument()
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
