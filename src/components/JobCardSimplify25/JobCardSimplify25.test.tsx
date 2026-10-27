import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify25 } from './JobCardSimplify25'

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

describe('JobCardSimplify25', () => {
  it('renders recruitment and advertisement sections', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[runningAd]} />)

    expect(screen.getByTestId('job-card-recruitment')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisements')).toBeInTheDocument()
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-25')
  })

  it('replaces the advertisement heading with a success running badge', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[runningAd]} />)

    const badge = screen.getByTestId('job-card-simplify25-running-badge')
    expect(badge).toHaveTextContent('2 portály běží')
    expect(screen.queryByText('Běží')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify25-running-heading')).not.toBeInTheDocument()
  })

  it('shows combinable running and ended badges on a partial advertisement', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[partialAd]} />)

    const header = screen.getByTestId('job-card-simplify25-advertisement-heading-wrap')
    expect(within(header).getByTestId('job-card-simplify25-running-badge')).toHaveTextContent(
      '1 portál běží',
    )
    expect(within(header).getByTestId('job-card-simplify25-ended-badge')).toHaveTextContent(
      '1 portál ukončen',
    )
    expect(within(header).getByTestId('job-card-simplify25-ended-badge').className).toContain(
      '!tm-text-[10px]',
    )
    expect(screen.queryByText('Běží')).not.toBeInTheDocument()
  })

  it('puts running portals in column 1 and ended portals in column 2', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[partialAd]} />)

    const groups = screen.getByTestId('job-card-publication-groups')
    expect(groups).toHaveClass('tm-grid', 'tm-grid-cols-2')
    expect(within(screen.getByTestId('job-card-advertisement-active-publications')).getByText('Jobs.cz')).toBeInTheDocument()
    expect(within(screen.getByTestId('job-card-advertisement-ended-publications')).getByText('Prace.cz')).toBeInTheDocument()
  })

  it('moves the view-count stats control into the advertisement header', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[runningAd]} />)

    const header = screen.getByTestId('job-card-simplify25-advertisement-heading-wrap')
    expect(within(header).getByTestId('job-card-advertisement-stats-toggle')).toBeInTheDocument()
    expect(within(header).getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      'zhlédnutí',
    )
    expect(screen.queryByTestId('job-card-advertisement-meta')).not.toBeInTheDocument()
  })

  it('does not render the chevron edit button on advertising states', () => {
    render(
      <JobCardSimplify25
        title="Test pozice"
        advertisements={[runningAd]}
        onEditAdvertisement={vi.fn()}
      />,
    )

    expect(screen.queryByTestId('job-card-simplify25-edit-advertisement')).not.toBeInTheDocument()
  })

  it('keeps the chevron on the not-advertising layout', () => {
    render(
      <JobCardSimplify25 title="Test pozice" advertisements={[]} onEditAdvertisement={vi.fn()} />,
    )

    expect(screen.getByTestId('job-card-simplify25-edit-advertisement')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify25-not-advertising-heading')).toBeInTheDocument()
  })

  it('keeps Zatím neprodlužovat on unexpectedly expired advertising', () => {
    render(
      <JobCardSimplify25
        title="Test pozice"
        advertisements={[expiredAdEndedDaysAgo(1)]}
        onDeclineAdvertising={vi.fn()}
      />,
    )

    expect(screen.getByTestId('job-card-simplify25-decline-advertising')).toHaveTextContent(
      'Zatím neprodlužovat',
    )
  })

  it('does not render the Prodloužit link', () => {
    render(
      <JobCardSimplify25
        title="Test pozice"
        advertisements={[partialAd, endingSoonOnePortalAd, expiredAdEndedDaysAgo(1)]}
        onExtendAndRepublish={() => {}}
      />,
    )

    expect(screen.queryByTestId('job-card-simplify25-extend-advertising')).not.toBeInTheDocument()
    expect(screen.queryByText('Prodloužit')).not.toBeInTheDocument()
  })

  it('does not render portal status dots', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[partialAd]} />)

    expect(screen.queryByTestId('job-card-simplify19-channel-status-dot')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify20-channel-status-dot')).not.toBeInTheDocument()
  })

  it('uses 18px portal logos', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[runningAd]} />)

    const logos = screen.getAllByTestId('job-card-publication-channel-logo')
    expect(logos).toHaveLength(2)
    logos.forEach((logo) => expect(logo).toHaveClass('tm-size-[18px]'))
  })

  it('does not show per-portal dates when every running portal shares an end date', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[runningAd]} />)

    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.getByText('Prace.cz')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-publication-period-badge')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-period-column')).not.toBeInTheDocument()
  })

  it('stacks mixed-date portals and shows dates as plain text', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[endingSoonOnePortalAd]} />)

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
    render(<JobCardSimplify25 title="Test pozice" advertisements={[runningAd]} />)

    const names = screen.getAllByTestId('job-card-publication-channel')
    expect(names).toHaveLength(2)
    names.forEach((name) => {
      expect(name).toHaveClass('tm-w-[100px]', 'tm-truncate')
      expect(name).toHaveAttribute('title', name.textContent)
    })
  })

  it('shows only the ended badge when advertising has fully ended', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[expiredAdEndedDaysAgo(1)]} />)

    expect(screen.getByTestId('job-card-simplify25-ended-badge')).toHaveTextContent('1 portál ukončen')
    expect(screen.queryByText('Inzerce skončila')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-groups')).not.toHaveClass('tm-grid-cols-2')
  })

  it('shows running and ending-soon badges side by side', () => {
    render(<JobCardSimplify25 title="Test pozice" advertisements={[endingSoonOnePortalAd]} />)

    const header = screen.getByTestId('job-card-simplify25-advertisement-heading-wrap')
    expect(within(header).getByTestId('job-card-simplify25-running-badge')).toHaveTextContent(
      '1 portál běží',
    )
    expect(within(header).getByTestId('job-card-simplify25-ending-soon-badge')).toHaveTextContent(
      '1 brzy skončí',
    )
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
            viewCount: 100 + index,
            ...(ended ? { status: 'expired' as const, endDate: daysFromNow(-3) } : {}),
            ...(!ended && !career ? { endDate: daysFromNow(40) } : {}),
          }
        }),
      }
    }

    it('all running: every portal is listed in a single column', () => {
      render(<JobCardSimplify25 title="Test pozice" advertisements={[fivePortals([])]} />)

      expect(screen.getByTestId('job-card-simplify25-running-badge')).toHaveTextContent(
        '5 portálů běží',
      )
      expect(screen.getAllByTestId('job-card-publication')).toHaveLength(5)
      expect(screen.getByTestId('job-card-publication-groups')).not.toHaveClass('tm-grid-cols-2')
    })

    it('partially running: ended portals sit in column 2', () => {
      render(
        <JobCardSimplify25
          title="Test pozice"
          advertisements={[fivePortals(['Prace.cz', 'Práce za rohem'])]}
        />,
      )

      expect(screen.getByTestId('job-card-publication-groups')).toHaveClass('tm-grid-cols-2')
      const ended = screen.getByTestId('job-card-advertisement-ended-publications')
      expect(within(ended).getByText('Prace.cz')).toBeInTheDocument()
      expect(within(ended).getByText('Práce za rohem')).toBeInTheDocument()
      expect(ended.className).not.toContain('tm-ml-auto')
    })

    it('all ended: only the ended badge is shown', () => {
      render(<JobCardSimplify25 title="Test pozice" advertisements={[fivePortals(channels)]} />)

      expect(screen.getByTestId('job-card-simplify25-ended-badge')).toBeInTheDocument()
      expect(screen.queryByText('Inzerce skončila')).not.toBeInTheDocument()
      expect(screen.getAllByTestId('job-card-publication-channel-logo')).toHaveLength(5)
    })
  })
})
