import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify28 } from './JobCardSimplify28'

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

describe('JobCardSimplify28', () => {
  it('caps the card at 1300px and the pipeline at 750px', () => {
    render(
      <JobCardSimplify28
        title="Operátor výroby"
        advertisements={[]}
        candidates={{ unassessed: 21, preselected: 5, invited: 2, hired: 3, total: 72 }}
      />,
    )

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-28')
    expect(screen.getByTestId('job-card').className).toContain('tm-max-w-[1300px]')
    expect(screen.getByTestId('job-card-candidates').className).toContain('tm-max-w-[750px]')
    expect(screen.getByTestId('job-card-advertisements').className).toContain('md:tm-w-1/4')
    expect(screen.getByTestId('job-card-recruitment')).toHaveTextContent('Operátor výroby')
    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Zatím nemáte vytvořený žádný inzerát.',
    )
  })

  it('stacks a success badge over portals and hides dates when they share one period', () => {
    const endDate = daysFromNow(40)
    const advertisement: JobAdvertisement = {
      id: 'running-same',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate }),
      ],
    }

    render(<JobCardSimplify28 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.queryByTestId('advertisement-header')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify28-running-heading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()

    const list = screen.getByTestId('advertisement-list')
    expect(list).toHaveAttribute('data-status', 'success')
    expect(list).toHaveAttribute('data-layout', 'column')
    const badge = within(list).getByTestId('advertisement-list-badge')
    expect(badge).toHaveTextContent('Běží')
    expect(badge).toHaveAttribute('data-tone', 'success')
    expect(badge.className).toContain('tm-text-xs')
    expect(badge.className).toContain('tm-font-medium')

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

  it('stacks live and ended lists and puts differing end dates under the channel name', () => {
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

    render(<JobCardSimplify28 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.queryByTestId('advertisement-header')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()

    const lists = screen.getAllByTestId('advertisement-list')
    expect(lists.map((list) => list.getAttribute('data-status'))).toEqual(['success'])
    expect(within(lists[0]).getByTestId('advertisement-list-badge')).toHaveTextContent('Běží')

    const ended = screen.getByTestId('advertise-list-end')
    expect(ended).toHaveAttribute('data-expanded', 'false')
    expect(within(ended).getByText('3 ukončené')).toBeInTheDocument()
    expect(within(ended).queryByTestId('advertisement-list-badge')).not.toBeInTheDocument()
    expect(within(ended).queryByTestId('job-board-item')).not.toBeInTheDocument()
    const toggle = within(ended).getByTestId('advertise-list-end-toggle')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(toggle).getByTestId('icon')).toHaveAttribute('data-icon-name', 'chevron-down')
    expect(within(toggle).getByTestId('icon').className).toContain('-tm-rotate-90')

    const liveItems = within(lists[0]).getAllByTestId('job-board-item')
    expect(liveItems).toHaveLength(3)
    expect(liveItems[0]).toHaveAttribute('data-date-layout', 'beside')
    expect(within(liveItems[0]).getByTestId('job-board-item-date').parentElement?.className).toContain(
      'tm-flex-row',
    )
    expect(liveItems[0].className).not.toContain('tm-w-[10.5rem]')
    expect(within(liveItems[0]).getByTestId('job-board-item-date')).toBeInTheDocument()

    fireEvent.click(toggle)
    expect(ended).toHaveAttribute('data-expanded', 'true')
    const endedItems = within(ended).getAllByTestId('job-board-item')
    expect(endedItems.map((item) => item.getAttribute('data-status'))).toEqual([
      'expired',
      'expired',
      'expired',
    ])
    expect(within(toggle).getByTestId('icon').className).not.toContain('-tm-rotate-90')
  })

  it('shows ending-soon portals in a second success list', () => {
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

    render(<JobCardSimplify28 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.queryByTestId('advertisement-header')).not.toBeInTheDocument()
    const lists = screen.getAllByTestId('advertisement-list')
    expect(
      lists.map((list) => within(list).getByTestId('advertisement-list-badge').textContent),
    ).toEqual(['Běží', '2 Brzy končí'])
    expect(lists[1]).toHaveAttribute('data-status', 'success')
    expect(within(lists[1]).getByTestId('advertisement-list-badge')).toHaveAttribute(
      'data-tone',
      'success',
    )

    const endingSoonItems = within(lists[1]).getAllByTestId('job-board-item')
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

  it('shows an all-ended advertisement as a default list', () => {
    const advertisement: JobAdvertisement = {
      id: 'ended',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
      ],
    }

    render(<JobCardSimplify28 title="Pozice" advertisements={[advertisement]} />)

    expect(screen.queryByTestId('job-card-simplify28-ended-heading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertisement-list')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()
    const ended = screen.getByTestId('advertise-list-end')
    expect(within(ended).getByTestId('advertise-list-end-toggle')).toHaveTextContent('Jobs.cz')
    expect(within(ended).queryByTestId('job-board-item')).not.toBeInTheDocument()
    fireEvent.click(within(ended).getByTestId('advertise-list-end-toggle'))
    expect(within(ended).getByTestId('job-board-item')).toHaveTextContent('Jobs.cz')
  })

  it('shows Neinzeruje se without portal lists or a prolong banner', () => {
    render(
      <JobCardSimplify28
        title="Pozice"
        advertisements={[{ id: 'declined', status: 'notAdvertising', publications: [] }]}
      />,
    )

    const heading = screen.getByTestId('job-card-simplify28-not-advertising-heading')
    expect(screen.getByTestId('advertisement-header')).toContainElement(heading)
    expect(heading).toHaveTextContent('Neinzeruje se')
    expect(heading.className).toContain('tm-text-secondary-default')
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-quiet', 'true')
    expect(screen.queryByTestId('advertisement-list')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()
  })

  it('keeps a draft advertisement on the Simplify 13 panel', () => {
    render(
      <JobCardSimplify28
        title="Pozice"
        advertisements={[{ id: 'draft', status: 'draft', title: 'Rozpracovaný inzerát', publications: [] }]}
      />,
    )

    expect(screen.getByText('Rozpracovaný inzerát')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify28-not-advertising-heading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advertise-prolong-highlight')).not.toBeInTheDocument()
  })
})
