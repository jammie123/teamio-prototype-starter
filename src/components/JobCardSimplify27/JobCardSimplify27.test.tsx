import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { formatCompactDateRange } from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify27 } from './JobCardSimplify27'

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

describe('JobCardSimplify27', () => {
  it('keeps the Simplify 13 recruitment shell', () => {
    render(<JobCardSimplify27 title="Operátor výroby" advertisements={[]} />)

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-27')
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

    render(<JobCardSimplify27 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.getAllByTestId('advertisement-header')).toHaveLength(1)
    const heading = screen.getByTestId('job-card-simplify27-running-heading')
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
      <JobCardSimplify27
        title="Pozice"
        advertisements={[advertisement]}
        onExtendAndRepublish={onExtendAndRepublish}
      />,
    )

    expect(screen.getAllByTestId('advertisement-header')).toHaveLength(1)
    const heading = screen.getByTestId('job-card-simplify27-running-heading')
    expect(heading).toHaveTextContent('Běží v různá období')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    const badges = screen.getAllByTestId('advertisement-header-badge')
    expect(badges.map((badge) => badge.textContent)).toEqual(['3 ukončené'])

    const lists = screen.getAllByTestId('advertisement-list')
    expect(lists.map((list) => list.getAttribute('data-status'))).toEqual(['active'])
    const liveItems = within(lists[0]).getAllByTestId('job-board-item')
    expect(liveItems).toHaveLength(3)
    expect(liveItems.every((item) => item.getAttribute('data-status') !== 'expired')).toBe(true)

    expect(liveItems[0]).toHaveAttribute('data-date-layout', 'beside')
    expect(liveItems[0].className).toContain('tm-w-[10.5rem]')
    expect(within(liveItems[0]).getByTestId('job-board-item-date')).toBeInTheDocument()

    const banner = screen.getByTestId('advertise-prolong-highlight')
    expect(banner).toHaveTextContent('Inzerce ukončena na 3 portálech')
    expect(banner).toHaveTextContent('Ukončeno 1. 1.')
    fireEvent.click(within(banner).getByRole('button', { name: 'Prodloužit' }))
    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)
  })

  it('shows a warning badge and lists ending-soon dates beside names', () => {
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

    render(<JobCardSimplify27 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.getByTestId('job-card-simplify27-running-heading')).toHaveTextContent(
      'Běží v různá období',
    )
    const badges = screen.getAllByTestId('advertisement-header-badge')
    expect(badges.map((badge) => badge.textContent)).toEqual(['2 Brzy končí'])
    expect(badges[0]).toHaveAttribute('data-tone', 'warning')

    const [, endingSoonList] = screen.getAllByTestId('advertisement-list')
    const endingSoonItems = within(endingSoonList).getAllByTestId('job-board-item')
    expect(endingSoonItems.map((item) => item.getAttribute('data-date-layout'))).toEqual([
      'beside',
      'beside',
    ])
    expect(
      endingSoonItems.map((item) => within(item).getByTestId('job-board-item-date').textContent),
    ).toEqual([`do ${soonA}`, `do ${soonB}`])
    expect(
      endingSoonItems.map((item) =>
        within(item).getByTestId('job-card-simplify19-channel-status-dot').getAttribute('data-channel-status'),
      ),
    ).toEqual(['warning', 'warning'])
  })

  it('shows an all-ended advertisement as a header, badge and banner', () => {
    const advertisement: JobAdvertisement = {
      id: 'ended',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
      ],
    }

    render(
      <JobCardSimplify27
        title="Pozice"
        advertisements={[advertisement]}
        onExtendAndRepublish={vi.fn()}
      />,
    )

    expect(screen.getByTestId('job-card-simplify27-ended-heading')).toHaveTextContent('Ukončeno')
    expect(screen.getByTestId('advertisement-header-badge')).toHaveTextContent('1 ukončený')
    expect(screen.queryByTestId('advertisement-list')).not.toBeInTheDocument()
    const banner = screen.getByTestId('advertise-prolong-highlight')
    expect(banner).toHaveTextContent('Jobs.cz')
    expect(banner).toHaveTextContent('Ukončeno 1. 1.')
  })

  it('shows Neinzeruje se without portal lists or a prolong banner', () => {
    render(
      <JobCardSimplify27
        title="Pozice"
        advertisements={[{ id: 'declined', status: 'notAdvertising', publications: [] }]}
      />,
    )

    const heading = screen.getByTestId('job-card-simplify27-not-advertising-heading')
    expect(screen.getByTestId('advertisement-header')).toContainElement(heading)
    expect(heading).toHaveTextContent('Neinzeruje se')
    expect(heading.className).toContain('tm-text-secondary-default')
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-quiet', 'true')
    expect(screen.queryByTestId('advertisement-list')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()
  })

  it('keeps a draft advertisement on the Simplify 13 panel', () => {
    render(
      <JobCardSimplify27
        title="Pozice"
        advertisements={[{ id: 'draft', status: 'draft', title: 'Rozpracovaný inzerát', publications: [] }]}
      />,
    )

    expect(screen.getByText('Rozpracovaný inzerát')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify27-not-advertising-heading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()
  })
})
