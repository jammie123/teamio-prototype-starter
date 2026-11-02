import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCard/formatCount'
import { JobCardV2 } from './JobCardV2'
import type { JobAdvertisement, JobPublication } from './types'

const now = new Date(2026, 8, 27)

function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 1. 2026', viewCount: 100, ...partial }
}

const runningSame: JobAdvertisement = {
  id: 'ad-1',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026', viewCount: 2000 }),
    portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 800 }),
    portal({ id: 'career', channel: 'Kariérní stránky', endDate: '1. 2. 2026', viewCount: 370 }),
  ],
}

function renderJobCard(props: Partial<Parameters<typeof JobCardV2>[0]> = {}) {
  return render(
    <JobCardV2
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ unassessed: 14, inProgress: 6, total: 52 }}
      advertisements={[runningSame]}
      now={now}
      {...props}
    />,
  )
}

describe('JobCardV2', () => {
  it('renders the JobCard shell with title and owner and no publication status', () => {
    renderJobCard()

    expect(screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })).toBeInTheDocument()
    expect(screen.getByTestId('job-card-owner')).toHaveTextContent('Petra Nováková')
    expect(screen.queryByTestId('job-card-status')).not.toBeInTheDocument()
  })

  it('keeps the three pipeline columns and labels Neposouzený, Ve hře, Celkem', () => {
    renderJobCard({ onCandidatesClick: vi.fn() })

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveTextContent('14Neposouzený')
    expect(stats).toHaveTextContent('6Ve hře')
    expect(stats).toHaveTextContent('52Celkem')
    expect(stats).not.toHaveTextContent('Neposouzení')
    expect(screen.getByTestId('job-card-stat-unassessed')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-stat-inProgress')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-stat-total')).toBeInTheDocument()
  })

  it('shows pink nový and opalcovaný badges on the first two columns', () => {
    renderJobCard({
      candidates: { new: 5, newOpalcovani: 3, unassessed: 14, inProgress: 6, total: 52 },
    })

    const novy = screen.getByTestId('job-card-new-candidates')
    expect(novy).toHaveTextContent('5 nový')
    expect(novy).toHaveAttribute('aria-label', `Noví kandidáti: ${formatCount(5)}`)
    expect(novy).toHaveClass('!tm-bg-teamio-pink', '!tm-text-primary-inverted-default')

    const opalcovaniBadge = screen.getByTestId('job-card-new-opalcovani')
    expect(opalcovaniBadge).toHaveTextContent('3 opalcovaný')
    expect(opalcovaniBadge).toHaveAttribute('aria-label', `Nově opalcovaní: ${formatCount(3)}`)
    expect(opalcovaniBadge).toHaveClass('!tm-bg-teamio-pink')

    expect(screen.getByTestId('job-card-stat-unassessed')).toContainElement(novy)
    expect(screen.getByTestId('job-card-stat-inProgress')).toContainElement(opalcovaniBadge)
  })

  it('hides pipeline badges when the counts are omitted or zero', () => {
    renderJobCard({
      candidates: { new: 0, newOpalcovani: 0, unassessed: 14, inProgress: 6, total: 52 },
    })

    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-new-opalcovani')).not.toBeInTheDocument()
  })

  it('shows a single green from–to heading and green dots for a shared running period', () => {
    renderJobCard()

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Běží od 1. 1. do 1. 2. 2026')
    expect(heading).toHaveClass('tm-text-emotion-success-emphasis')
    expect(screen.queryByTestId('job-card-publication-ended-heading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      /3\s170 zhlédnutí/,
    )

    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals).toHaveLength(3)
    portals.forEach((portalItem) => {
      expect(within(portalItem).getByTestId('job-card-publication-dot')).toHaveClass(
        'tm-bg-emotion-success-emphasis',
      )
      expect(within(portalItem).getByTestId('job-card-publication-channel')).toHaveClass(
        'tm-text-primary-default',
      )
    })
    expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
  })

  it('shows per-portal dates under Běží v různých obdobích', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-diff',
          publications: [
            portal({
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 9. 2026',
              endDate: '30. 9. 2026',
            }),
            portal({
              id: 'prace',
              channel: 'Prace.cz',
              startDate: '15. 9. 2026',
              endDate: '15. 10. 2026',
            }),
            portal({
              id: 'career',
              channel: 'Kariérní stránky',
              startDate: '',
              endDate: '1. 11. 2026',
            }),
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží v různých obdobích',
    )
    expect(screen.getAllByTestId('job-card-publication-dates').map((node) => node.textContent)).toEqual([
      '1. 9. – 30. 9.',
      '15. 9. – 15. 10.',
      'do 1. 11.',
    ])
  })

  it('keeps a green mixed heading and greys only the ended portal', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-mixed',
          publications: [
            portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 11. 2026' }),
            portal({
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '1. 8. 2026',
              endDate: '15. 8. 2026',
            }),
            portal({
              id: 'career',
              channel: 'Kariérní stránky',
              startDate: '1. 9. 2026',
              endDate: '30. 11. 2026',
            }),
          ],
        },
      ],
    })

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Běží do 30. 11. · 1 portál ukončen')
    expect(heading).toHaveClass('tm-text-emotion-success-emphasis')

    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals).toHaveLength(3)
    expect(within(portals[2]).getByTestId('job-card-publication-channel')).toHaveClass(
      'tm-text-secondary-default',
    )
    expect(within(portals[2]).getByTestId('job-card-publication-dot')).toHaveClass('tm-bg-gray-300')
    expect(within(portals[2]).getByTestId('job-card-publication-dates')).toHaveTextContent(
      'ukončeno 15. 8.',
    )
    expect(within(portals[0]).queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    expect(within(portals[1]).queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-ended-publications')).not.toBeInTheDocument()
  })

  it('greys the heading and every portal when advertising has ended', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-ended',
          publications: [
            portal({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
            portal({ id: 'prace', channel: 'Prace.cz', status: 'expired', endDate: '1. 1. 2026' }),
            portal({
              id: 'career',
              channel: 'Kariérní stránky',
              status: 'expired',
              endDate: '1. 1. 2026',
            }),
          ],
        },
      ],
    })

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Ukončeno 1. 1. 2026')
    expect(heading).toHaveClass('tm-text-secondary-default')
    expect(heading).not.toHaveClass('tm-text-emotion-warning-emphasis')

    screen.getAllByTestId('job-card-publication').forEach((portalItem) => {
      expect(within(portalItem).getByTestId('job-card-publication-dot')).toHaveClass('tm-bg-gray-300')
      expect(within(portalItem).getByTestId('job-card-publication-channel')).toHaveClass(
        'tm-text-secondary-default',
      )
    })
  })

  it('uses amber heading and dots only when every remaining dated portal is ending soon', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-soon',
          publications: [
            portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
            portal({ id: 'prace', channel: 'Prace.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
            portal({
              id: 'career',
              channel: 'Kariérní stránky',
              startDate: '1. 9. 2026',
              endDate: '30. 9. 2026',
            }),
          ],
        },
      ],
    })

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Končí za 3 dny · 30. 9.')
    expect(heading).toHaveClass('tm-text-emotion-warning-emphasis')

    screen.getAllByTestId('job-card-publication').forEach((portalItem) => {
      expect(within(portalItem).getByTestId('job-card-publication-dot')).toHaveClass(
        'tm-bg-emotion-warning-emphasis',
      )
      expect(within(portalItem).getByTestId('job-card-publication-channel')).toHaveClass(
        'tm-text-primary-default',
      )
    })
  })

  it('keeps running highlights after their parent portal', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-highlights',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 1. 2026',
              endDate: '1. 2. 2026',
              viewCount: 1840,
              highlights: [
                {
                  id: 'jobs-jobstip',
                  name: 'Jobstip',
                  startDate: '8. 6.',
                  endDate: '30. 9. 2026',
                  viewCount: 699,
                },
              ],
            },
            portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 920 }),
          ],
        },
      ],
    })

    const list = screen.getByTestId('job-card-advertisement-publication-list')
    const highlight = within(list).getByTestId('job-card-publication-highlight')
    expect(highlight).toHaveTextContent('Jobstip')
    expect(list.children[0]).toContainElement(screen.getByText('Jobs.cz'))
    expect(list.children[1]).toBe(highlight)
    expect(list.children[2]).toContainElement(screen.getByText('Prace.cz'))
  })

  it('opens the existing portal hover card', async () => {
    const user = userEvent.setup()
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 6. 2026',
              endDate: '1. 2. 2027',
              viewCount: 1840,
              reactionCount: 34,
            },
          ],
        },
      ],
    })

    await user.hover(screen.getByTestId('job-card-publication-channel'))
    const dropdown = await screen.findByTestId('job-card-publication-dropdown')
    expect(dropdown).toHaveTextContent('Jobs.cz')
    expect(dropdown).toHaveTextContent(/1\s840/)
    expect(dropdown).toHaveTextContent('Konverze')
  })

  it('treats unpublished advertisements as fully ended', () => {
    renderJobCard({ status: 'unpublished' })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent('Ukončeno')
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveClass(
      'tm-text-secondary-default',
    )
  })

  it('shows only the first advertisement and a remaining-count link when extra ads are collapsed', async () => {
    const user = userEvent.setup()
    const onAdditionalAdvertisementsClick = vi.fn()

    renderJobCard({
      advertisements: [
        runningSame,
        { id: 'ad-2', title: 'Inzerát pro brigádníky', publications: [portal({ id: 'jobs-2', channel: 'Jobs.cz' })] },
      ],
      showAdditionalAdvertisementsLink: true,
      onAdditionalAdvertisementsClick,
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)
    const link = screen.getByTestId('job-card-additional-advertisements')
    expect(link).toHaveTextContent('Zobrazit další inzeráty (1)')
    await user.click(link)
    expect(onAdditionalAdvertisementsClick).toHaveBeenCalledTimes(1)
  })

  it('renders the empty advertisement state', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({ advertisements: [], onCreateAdvertisement })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )
    await user.click(screen.getByRole('button', { name: 'Vytvořit inzerát' }))
    expect(onCreateAdvertisement).toHaveBeenCalledTimes(1)
  })
})
