import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify22 } from './JobCardSimplify22'

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

const partialWithCareerAd: JobAdvertisement = {
  id: 'ad-partial-career',
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
    { id: 'career', channel: 'Kariérní web', startDate: '5. 7. 2026', viewCount: 410 },
  ],
}

describe('JobCardSimplify22', () => {
  it('renders recruitment and advertisement sections', () => {
    render(<JobCardSimplify22 title="Test pozice" advertisements={[runningAd]} />)

    expect(screen.getByTestId('job-card-recruitment')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisements')).toBeInTheDocument()
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-22')
  })

  it('renders advertisement headings without status icons', () => {
    const { container } = render(
      <JobCardSimplify22 title="Test pozice" advertisements={[runningAd]} />,
    )

    const heading = screen.getByTestId('job-card-simplify22-running-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(heading.querySelector('svg')).toBeNull()
    expect(container.querySelector('[data-testid="job-card-simplify22-advertisement-heading-wrap"] svg')).toBeNull()
  })

  it('renders no heading icon for ended and not-advertising states', () => {
    const { unmount } = render(
      <JobCardSimplify22 title="Test pozice" advertisements={[expiredAdEndedDaysAgo(1)]} />,
    )
    expect(screen.getByTestId('job-card-simplify22-expired-heading').querySelector('svg')).toBeNull()
    unmount()

    render(<JobCardSimplify22 title="Test pozice" advertisements={[]} />)
    expect(
      screen.getByTestId('job-card-simplify22-not-advertising-heading').querySelector('svg'),
    ).toBeNull()
  })

  it('shows compact ended-portal badge beside partial running heading', () => {
    render(
      <JobCardSimplify22 title="Test pozice" advertisements={[partialAd]} onExtendAndRepublish={() => {}} />,
    )

    const heading = screen.getByTestId('job-card-simplify22-partial-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(within(heading).getByText('Běží').className).toContain('tm-text-emotion-success-emphasis')

    const badge = within(heading).getByTestId('job-card-simplify22-ended-portal-badge')
    expect(badge).toHaveTextContent('1 portál ukončen')
    expect(badge.className).toContain('!tm-text-[10px]')
    expect(badge.className).toContain('!tm-px-1.5')
    expect(
      within(heading).queryByTestId('job-card-simplify22-advertisement-heading-secondary'),
    ).not.toBeInTheDocument()
  })

  it('does not render portal status dots', () => {
    render(
      <JobCardSimplify22
        title="Test pozice"
        advertisements={[partialAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    expect(screen.queryByTestId('job-card-simplify19-channel-status-dot')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify20-channel-status-dot')).not.toBeInTheDocument()
  })

  it('grays out the logo of ended portals with opacity .8', () => {
    render(
      <JobCardSimplify22
        title="Test pozice"
        advertisements={[partialAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    const logos = screen.getAllByTestId('job-card-publication-channel-logo')
    const endedLogo = logos.find((logo) =>
      logo.closest('[data-testid="job-card-publication"]')?.textContent?.includes('Prace.cz'),
    )
    const runningLogo = logos.find((logo) =>
      logo.closest('[data-testid="job-card-publication"]')?.textContent?.includes('Jobs.cz'),
    )

    expect(endedLogo?.className).toContain('tm-opacity-80')
    expect(endedLogo?.className).toContain('tm-grayscale')
    expect(runningLogo?.className).not.toContain('tm-opacity-80')
    expect(runningLogo?.className).not.toContain('tm-grayscale')
  })

  it('uses the warning token for the name of a portal that is ending soon', () => {
    render(
      <JobCardSimplify22
        title="Test pozice"
        advertisements={[endingSoonOnePortalAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    const names = screen.getAllByTestId('job-card-publication-channel')
    const jobs = names.find((name) => name.textContent === 'Jobs.cz')
    const prace = names.find((name) => name.textContent === 'Prace.cz')

    expect(jobs?.className).toContain('tm-text-emotion-warning-emphasis')
    expect(prace?.className).not.toContain('tm-text-emotion-warning-emphasis')
  })

  it('keeps ended heading red up to 5 days after ending', () => {
    render(
      <JobCardSimplify22
        title="Test pozice"
        advertisements={[expiredAdEndedDaysAgo(5)]}
        onEditAdvertisement={vi.fn()}
      />,
    )

    const heading = screen.getByTestId('job-card-simplify22-expired-heading')
    expect(heading).toHaveTextContent('Inzerce skončila')
    expect(within(heading).getByText('Inzerce skončila').className).toContain(
      'tm-text-emotion-danger-emphasis',
    )
  })

  it('turns ended heading gray more than 5 days after ending', () => {
    render(
      <JobCardSimplify22
        title="Test pozice"
        advertisements={[expiredAdEndedDaysAgo(6)]}
        onEditAdvertisement={vi.fn()}
      />,
    )

    const title = within(screen.getByTestId('job-card-simplify22-expired-heading')).getByText(
      'Inzerce skončila',
    )
    expect(title.className).toContain('tm-text-secondary-default')
    expect(title.className).not.toContain('tm-text-emotion-danger-emphasis')
  })

  it('shows the publish date under the career web', () => {
    render(<JobCardSimplify22 title="Test pozice" advertisements={[partialWithCareerAd]} />)

    const career = screen
      .getAllByTestId('job-card-publication')
      .find((item) => item.textContent?.includes('Kariérní web'))!

    expect(within(career).getByTestId('job-card-publication-period-badge')).toHaveTextContent(
      'od 5. 7. 2026',
    )
  })

  it('shows the career web publish date even when all paid portals share an end date', () => {
    render(
      <JobCardSimplify22
        title="Test pozice"
        advertisements={[
          {
            id: 'ad-same',
            publications: [
              ...runningAd.publications!,
              { id: 'career', channel: 'Kariérní web', startDate: '1. 10. 2026' },
            ],
          },
        ]}
      />,
    )

    const career = screen
      .getAllByTestId('job-card-publication')
      .find((item) => item.textContent?.includes('Kariérní web'))!

    expect(within(career).getByTestId('job-card-publication-period-badge')).toHaveTextContent(
      'od 1. 10. 2026',
    )
  })

  it('separates ended portals from the running row and aligns them to the right', () => {
    render(<JobCardSimplify22 title="Test pozice" advertisements={[partialWithCareerAd]} />)

    const running = screen.getByTestId('job-card-simplify22-partial-publications-running')
    const ended = screen.getByTestId('job-card-simplify22-partial-publications-ended')

    expect(within(running).getByText('Jobs.cz')).toBeInTheDocument()
    expect(within(running).getByText('Kariérní web')).toBeInTheDocument()
    expect(within(running).queryByText('Prace.cz')).not.toBeInTheDocument()
    expect(within(ended).getByText('Prace.cz')).toBeInTheDocument()
    expect(ended.className).toContain('tm-ml-auto')
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

    it('all running: one row with every portal, no ended block', () => {
      render(<JobCardSimplify22 title="Test pozice" advertisements={[fivePortals([])]} />)

      expect(screen.getByTestId('job-card-simplify22-running-heading')).toHaveTextContent('Běží')
      expect(screen.getAllByTestId('job-card-publication')).toHaveLength(5)
      expect(
        screen.queryByTestId('job-card-simplify22-partial-publications-ended'),
      ).not.toBeInTheDocument()
    })

    it('partially running: ended portals separated on the right', () => {
      render(
        <JobCardSimplify22
          title="Test pozice"
          advertisements={[fivePortals(['Prace.cz', 'Práce za rohem'])]}
          onExtendAndRepublish={() => {}}
        />,
      )

      const running = screen.getByTestId('job-card-simplify22-partial-publications-running')
      const ended = screen.getByTestId('job-card-simplify22-partial-publications-ended')

      expect(within(running).getAllByTestId('job-card-publication')).toHaveLength(3)
      expect(within(ended).getAllByTestId('job-card-publication')).toHaveLength(2)
      expect(within(ended).getByText('Prace.cz')).toBeInTheDocument()
      expect(within(ended).getByText('Práce za rohem')).toBeInTheDocument()
    })

    it('all ended: every portal is muted and the heading is red', () => {
      render(
        <JobCardSimplify22
          title="Test pozice"
          advertisements={[fivePortals(channels)]}
          onExtendAndRepublish={() => {}}
        />,
      )

      const heading = screen.getByTestId('job-card-simplify22-expired-heading')
      expect(within(heading).getByText('Inzerce skončila').className).toContain(
        'tm-text-emotion-danger-emphasis',
      )

      const logos = screen.getAllByTestId('job-card-publication-channel-logo')
      expect(logos).toHaveLength(5)
      logos.forEach((logo) => expect(logo.className).toContain('tm-opacity-80'))
    })
  })

  it('calls onEditAdvertisement from advertisement header', async () => {
    const user = userEvent.setup()
    const onEditAdvertisement = vi.fn()

    render(
      <JobCardSimplify22
        title="Test pozice"
        advertisements={[runningAd]}
        onEditAdvertisement={onEditAdvertisement}
      />,
    )

    await user.click(screen.getByTestId('job-card-simplify22-edit-advertisement'))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })
})
