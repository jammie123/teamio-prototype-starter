import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { formatCompactDateRange } from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify29 } from './JobCardSimplify29'

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

describe('JobCardSimplify29', () => {
  it('keeps the Simplify 13 recruitment shell', () => {
    render(<JobCardSimplify29 title="Operátor výroby" advertisements={[]} />)

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-29')
    expect(screen.getByTestId('job-card-recruitment')).toHaveTextContent('Operátor výroby')
    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Zatím nemáte vytvořený žádný inzerát.',
    )
  })

  it('hides item dates and uses a 24px logo when live portals share one period', () => {
    const endDate = daysFromNow(40)
    const advertisement: JobAdvertisement = {
      id: 'running-same',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate }),
      ],
    }

    render(<JobCardSimplify29 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.getAllByTestId('advertisement-header')).toHaveLength(1)
    const heading = screen.getByTestId('job-card-simplify29-running-heading')
    expect(heading).toHaveTextContent(`Běží ${formatCompactDateRange('1. 10. 2026', endDate)}`)
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    expect(screen.queryByTestId('advertisement-header-badge')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()

    const list = screen.getByTestId('advertisement-list')
    expect(list).toHaveAttribute('data-status', 'active')

    const items = within(list).getAllByTestId('job-board-item')
    expect(items[0]).toHaveAttribute('data-status', 'active')
    expect(items[0]).toHaveAttribute('data-date-layout', 'hidden')
    expect(within(items[0]).queryByTestId('job-board-item-date')).not.toBeInTheDocument()
    expect(items[0].className).not.toContain('tm-w-[10.5rem]')
    expect(within(items[0]).getByTestId('job-portal-logo').className).toContain('tm-size-[24px]')
    expect(within(items[0]).getByText('Jobs.cz').className).not.toContain('tm-truncate')
    expect(within(items[0]).getByTestId('job-card-simplify19-channel-status-dot')).toHaveAttribute(
      'data-channel-status',
      'success',
    )
  })

  it('lists only live portals and shows a prolong banner for ended ones', () => {
    const onExtendAndRepublish = vi.fn()
    const jobsEnd = daysFromNow(40)
    const recommendEnd = daysFromNow(60)
    const advertisement: JobAdvertisement = {
      id: 'screen',
      publications: [
        publication({ id: 'jobs-live', channel: 'Jobs.cz', endDate: jobsEnd }),
        publication({
          id: 'recommend-live',
          channel: 'Doporučení',
          startDate: '15. 9. 2026',
          endDate: recommendEnd,
        }),
        publication({ id: 'export-live', channel: 'Export' }),
        publication({ id: 'jobs-ended', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
        publication({
          id: 'recommend-ended',
          channel: 'Doporučení',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        publication({ id: 'export-ended', channel: 'Export', status: 'expired', startDate: '1. 10. 2025' }),
      ],
    }

    render(
      <JobCardSimplify29
        title="Pozice"
        advertisements={[advertisement]}
        onExtendAndRepublish={onExtendAndRepublish}
      />,
    )

    expect(screen.getAllByTestId('advertisement-header')).toHaveLength(1)
    const heading = screen.getByTestId('job-card-simplify29-running-heading')
    expect(heading).toHaveTextContent('Běží v různá období')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    const badges = screen.getAllByTestId('advertisement-header-badge')
    expect(badges.map((badge) => badge.textContent)).toEqual(['3 ukončené'])

    const lists = screen.getAllByTestId('advertisement-list')
    expect(lists).toHaveLength(3)
    expect(lists.map((list) => list.getAttribute('data-status'))).toEqual(['active', 'active', 'active'])
    expect(lists.map((list) => within(list).queryByTestId('advertisement-list-period')?.textContent)).toEqual([
      formatCompactDateRange('1. 10. 2026', jobsEnd),
      formatCompactDateRange('15. 9. 2026', recommendEnd),
      undefined,
    ])
    expect(lists[0].firstElementChild).toHaveAttribute('data-testid', 'advertisement-list-period')
    expect(lists[1].firstElementChild).toHaveAttribute('data-testid', 'advertisement-list-period')
    expect(lists[2].firstElementChild).not.toHaveAttribute('data-testid', 'advertisement-list-period')

    const liveItems = lists.flatMap((list) => within(list).getAllByTestId('job-board-item'))
    expect(liveItems.map((item) => within(item).getByText(/Jobs|Doporučení|Export/).textContent)).toEqual([
      'Jobs.cz',
      'Doporučení',
      'Export',
    ])
    expect(liveItems.every((item) => item.getAttribute('data-status') !== 'expired')).toBe(true)
    expect(liveItems.every((item) => item.getAttribute('data-date-layout') === 'hidden')).toBe(true)
    expect(screen.queryByTestId('job-board-item-date')).not.toBeInTheDocument()

    const banner = screen.getByTestId('advertise-prolong-highlight')
    expect(banner).toHaveTextContent('Inzerce ukončena na 3 portálech')
    expect(banner).toHaveTextContent('Ukončeno 1. 1.')
    fireEvent.click(within(banner).getByRole('button', { name: 'Prodloužit' }))
    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)
  })

  it('shows a warning badge and puts each mixed period on its own row', () => {
    const soonA = daysFromNow(2)
    const soonB = daysFromNow(5)
    const later = daysFromNow(40)
    const advertisement: JobAdvertisement = {
      id: 'ending',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: later }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: soonA }),
        publication({ id: 'atmoskop', channel: 'Atmoskop', endDate: soonB }),
      ],
    }

    render(<JobCardSimplify29 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.getByTestId('job-card-simplify29-running-heading')).toHaveTextContent(
      'Běží v různá období',
    )
    const badges = screen.getAllByTestId('advertisement-header-badge')
    expect(badges.map((badge) => badge.textContent)).toEqual(['2 Brzy končí'])
    expect(badges[0]).toHaveAttribute('data-tone', 'warning')

    const lists = screen.getAllByTestId('advertisement-list')
    expect(lists).toHaveLength(3)
    expect(lists.map((list) => within(list).getByTestId('advertisement-list-period').textContent)).toEqual([
      formatCompactDateRange('1. 10. 2026', soonA),
      formatCompactDateRange('1. 10. 2026', soonB),
      formatCompactDateRange('1. 10. 2026', later),
    ])
    expect(lists.every((list) => list.firstElementChild?.getAttribute('data-testid') === 'advertisement-list-period')).toBe(
      true,
    )
    expect(
      lists.map((list) => within(list).getByTestId('job-board-item').getAttribute('data-date-layout')),
    ).toEqual(['hidden', 'hidden', 'hidden'])
    expect(screen.queryByTestId('job-board-item-date')).not.toBeInTheDocument()
    expect(
      lists.map((list) =>
        within(list)
          .getByTestId('job-card-simplify19-channel-status-dot')
          .getAttribute('data-channel-status'),
      ),
    ).toEqual(['warning', 'warning', 'success'])
  })

  it('shows an all-ended advertisement as a header, badge and banner', () => {
    const advertisement: JobAdvertisement = {
      id: 'ended',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
      ],
    }

    render(
      <JobCardSimplify29
        title="Pozice"
        advertisements={[advertisement]}
        onExtendAndRepublish={vi.fn()}
      />,
    )

    expect(screen.getByTestId('job-card-simplify29-ended-heading')).toHaveTextContent('Ukončeno')
    expect(screen.getByTestId('advertisement-header-badge')).toHaveTextContent('1 ukončený')
    expect(screen.queryByTestId('advertisement-list')).not.toBeInTheDocument()
    const banner = screen.getByTestId('advertise-prolong-highlight')
    expect(banner).toHaveTextContent('Jobs.cz')
    expect(banner).toHaveTextContent('Ukončeno 1. 1.')
  })

  it('shows Neinzeruje se without portal lists or a prolong banner', () => {
    render(
      <JobCardSimplify29
        title="Pozice"
        advertisements={[{ id: 'declined', status: 'notAdvertising', publications: [] }]}
      />,
    )

    const heading = screen.getByTestId('job-card-simplify29-not-advertising-heading')
    expect(screen.getByTestId('advertisement-header')).toContainElement(heading)
    expect(heading).toHaveTextContent('Neinzeruje se')
    expect(heading.className).toContain('tm-text-secondary-default')
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-quiet', 'true')
    expect(screen.queryByTestId('advertisement-list')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()
  })

  it('keeps a draft advertisement on the Simplify 13 panel', () => {
    render(
      <JobCardSimplify29
        title="Pozice"
        advertisements={[{ id: 'draft', status: 'draft', title: 'Rozpracovaný inzerát', publications: [] }]}
      />,
    )

    expect(screen.getByText('Rozpracovaný inzerát')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify29-not-advertising-heading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()
  })
})
