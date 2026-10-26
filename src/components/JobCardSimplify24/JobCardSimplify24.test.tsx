import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify24 } from './JobCardSimplify24'

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const runningAd: JobAdvertisement = {
  id: 'ad-running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: daysFromNow(40), viewCount: 1840 },
    { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: daysFromNow(40), viewCount: 920 },
  ],
}

const partialAd: JobAdvertisement = {
  id: 'ad-partial',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(40), viewCount: 1840 },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: daysFromNow(-2),
      viewCount: 920,
    },
  ],
}

function expiredAdEndedDaysAgo(days: number): JobAdvertisement {
  return {
    id: `ad-expired-${days}`,
    publications: [
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: daysFromNow(-days),
        viewCount: 2100,
      },
    ],
  }
}

const endingSoonOnePortalAd: JobAdvertisement = {
  id: 'ad-ending-soon',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(3), viewCount: 1200 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(40), viewCount: 640 },
  ],
}

describe('JobCardSimplify24', () => {
  it('renders recruitment and advertisement sections', () => {
    render(<JobCardSimplify24 title="Test pozice" advertisements={[runningAd]} />)

    expect(screen.getByTestId('job-card-recruitment')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisements')).toBeInTheDocument()
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-24')
  })

  it('renders advertisement headings without status icons', () => {
    const { container } = render(
      <JobCardSimplify24 title="Test pozice" advertisements={[runningAd]} />,
    )

    const heading = screen.getByTestId('job-card-simplify24-running-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(heading.querySelector('svg')).toBeNull()
    expect(container.querySelector('[data-testid="job-card-simplify24-advertisement-heading-wrap"] svg')).toBeNull()
  })

  it('renders no heading icon for ended and not-advertising states', () => {
    const { unmount } = render(
      <JobCardSimplify24 title="Test pozice" advertisements={[expiredAdEndedDaysAgo(1)]} />,
    )
    expect(screen.getByTestId('job-card-simplify24-expired-heading').querySelector('svg')).toBeNull()
    unmount()

    render(<JobCardSimplify24 title="Test pozice" advertisements={[]} />)
    expect(
      screen.getByTestId('job-card-simplify24-not-advertising-heading').querySelector('svg'),
    ).toBeNull()
  })

  it('shows compact ended-portal badge beside partial running heading', () => {
    render(
      <JobCardSimplify24 title="Test pozice" advertisements={[partialAd]} onExtendAndRepublish={() => {}} />,
    )

    const heading = screen.getByTestId('job-card-simplify24-partial-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(within(heading).getByText('Běží').className).toContain('tm-text-emotion-success-emphasis')

    const badge = within(heading).getByTestId('job-card-simplify24-ended-portal-badge')
    expect(badge).toHaveTextContent('1 portál ukončen')
    expect(badge.className).toContain('!tm-text-[10px]')
    expect(badge.className).toContain('!tm-px-1.5')
    expect(
      within(heading).queryByTestId('job-card-simplify24-advertisement-heading-secondary'),
    ).not.toBeInTheDocument()
  })

  it('does not render portal status dots', () => {
    render(
      <JobCardSimplify24
        title="Test pozice"
        advertisements={[partialAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    expect(screen.queryByTestId('job-card-simplify19-channel-status-dot')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify20-channel-status-dot')).not.toBeInTheDocument()
  })

  it('uses 18px portal logos', () => {
    render(<JobCardSimplify24 title="Test pozice" advertisements={[runningAd]} />)

    const logos = screen.getAllByTestId('job-card-publication-channel-logo')
    expect(logos).toHaveLength(2)
    logos.forEach((logo) => expect(logo).toHaveClass('tm-size-[18px]'))
  })

  it('does not show per-portal dates when every running portal shares an end date', () => {
    render(<JobCardSimplify24 title="Test pozice" advertisements={[runningAd]} />)

    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.getByText('Prace.cz')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-publication-period-badge')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-period-column')).not.toBeInTheDocument()
  })

  it('stacks mixed-date portals and shows dates as plain text', () => {
    render(
      <JobCardSimplify24
        title="Test pozice"
        advertisements={[endingSoonOnePortalAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    expect(screen.queryByTestId('job-card-advertisement-period-column')).not.toBeInTheDocument()

    const list = screen.getByTestId('job-card-advertisement-active-publications')
    expect(list).toHaveClass('tm-flex-col')
    expect(list.className).not.toMatch(/tm-grid/)

    const publications = within(list).getAllByTestId('job-card-publication')
    expect(publications).toHaveLength(2)
    publications.forEach((publication) => {
      const date = within(publication).getByTestId('job-card-publication-period-badge')
      expect(date).toHaveClass('tm-text-sm')
      expect(date).not.toHaveClass('tm-bg-emotion-warning-background')
      expect(date).not.toHaveClass('tm-bg-emotion-info-background')
      expect(within(publication).getByTestId('job-card-publication-channel')).toBeInTheDocument()
    })
  })

  it('clamps portal names to 100px and truncates overflow', () => {
    render(<JobCardSimplify24 title="Test pozice" advertisements={[runningAd]} />)

    const names = screen.getAllByTestId('job-card-publication-channel')
    expect(names).toHaveLength(2)
    names.forEach((name) => {
      expect(name).toHaveClass('tm-w-[100px]', 'tm-truncate')
      expect(name).toHaveAttribute('title', name.textContent)
    })
  })

  it('does not split ended portals onto a far-right running/ended row', () => {
    render(
      <JobCardSimplify24
        title="Test pozice"
        advertisements={[partialAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    expect(screen.queryByTestId('job-card-simplify24-partial-publications-running')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify24-partial-publications-ended')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-ended-publications')).toBeInTheDocument()
  })

  it('keeps ended heading red up to 5 days after ending', () => {
    render(
      <JobCardSimplify24
        title="Test pozice"
        advertisements={[expiredAdEndedDaysAgo(5)]}
        onEditAdvertisement={vi.fn()}
      />,
    )

    const heading = screen.getByTestId('job-card-simplify24-expired-heading')
    expect(heading).toHaveTextContent('Inzerce skončila')
    expect(within(heading).getByText('Inzerce skončila').className).toContain(
      'tm-text-emotion-danger-emphasis',
    )
  })

  it('turns ended heading gray more than 5 days after ending', () => {
    render(
      <JobCardSimplify24
        title="Test pozice"
        advertisements={[expiredAdEndedDaysAgo(6)]}
        onEditAdvertisement={vi.fn()}
      />,
    )

    const title = within(screen.getByTestId('job-card-simplify24-expired-heading')).getByText(
      'Inzerce skončila',
    )
    expect(title.className).toContain('tm-text-secondary-default')
    expect(title.className).not.toContain('tm-text-emotion-danger-emphasis')
  })

  describe('five portals', () => {
    const channels = ['Prace.cz', 'Jobs.cz', 'Kariérní stránky', 'Atmoskop', 'Práce za rohem']

    function fivePortals(endedChannels: string[]): JobAdvertisement {
      return {
        id: `five-${endedChannels.length}`,
        publications: channels.map((channel, index) => {
          const ended = endedChannels.includes(channel)
          const career = channel === 'Kariérní stránky'

          return {
            id: `p-${index}`,
            channel,
            startDate: '12. 6. 2026',
            ...(ended ? { status: 'expired' as const, endDate: daysFromNow(-3) } : {}),
            ...(!ended && !career ? { endDate: daysFromNow(40) } : {}),
          }
        }),
      }
    }

    it('all running: every portal is listed and there is no 22-style ended split', () => {
      render(<JobCardSimplify24 title="Test pozice" advertisements={[fivePortals([])]} />)

      expect(screen.getByTestId('job-card-simplify24-running-heading')).toHaveTextContent('Běží')
      expect(screen.getAllByTestId('job-card-publication')).toHaveLength(5)
      expect(
        screen.queryByTestId('job-card-simplify24-partial-publications-ended'),
      ).not.toBeInTheDocument()
    })

    it('partially running: ended portals use the default ended group, not a right-aligned row', () => {
      render(
        <JobCardSimplify24
          title="Test pozice"
          advertisements={[fivePortals(['Prace.cz', 'Práce za rohem'])]}
          onExtendAndRepublish={() => {}}
        />,
      )

      const ended = screen.getByTestId('job-card-advertisement-ended-publications')
      expect(within(ended).getByText('Prace.cz')).toBeInTheDocument()
      expect(within(ended).getByText('Práce za rohem')).toBeInTheDocument()
      expect(ended.className).not.toContain('tm-ml-auto')
      expect(
        screen.queryByTestId('job-card-simplify24-partial-publications-ended'),
      ).not.toBeInTheDocument()
    })

    it('all ended: heading stays red', () => {
      render(
        <JobCardSimplify24
          title="Test pozice"
          advertisements={[fivePortals(channels)]}
          onExtendAndRepublish={() => {}}
        />,
      )

      const heading = screen.getByTestId('job-card-simplify24-expired-heading')
      expect(within(heading).getByText('Inzerce skončila').className).toContain(
        'tm-text-emotion-danger-emphasis',
      )
      expect(screen.getAllByTestId('job-card-publication-channel-logo')).toHaveLength(5)
    })
  })

  it('calls onEditAdvertisement from advertisement header', async () => {
    const user = userEvent.setup()
    const onEditAdvertisement = vi.fn()

    render(
      <JobCardSimplify24
        title="Test pozice"
        advertisements={[runningAd]}
        onEditAdvertisement={onEditAdvertisement}
      />,
    )

    await user.click(screen.getByTestId('job-card-simplify24-edit-advertisement'))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })
})
