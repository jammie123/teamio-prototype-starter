import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCard } from './JobCard'
import { formatCount } from './formatCount'
import type { JobAdvertisement } from './types'

const advertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '12. 8. 2026', viewCount: 130 },
  ],
}

function renderJobCard(props: Partial<Parameters<typeof JobCard>[0]> = {}) {
  return render(
    <JobCard
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ unassessed: 14, inProgress: 6, total: 52 }}
      advertisements={[advertisement]}
      {...props}
    />,
  )
}

describe('JobCard', () => {
  it('renders title and owner without a header view count', () => {
    renderJobCard()

    expect(screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })).toBeInTheDocument()
    expect(screen.getByTestId('job-card-owner')).toHaveTextContent('Petra Nováková')
    expect(screen.queryByTestId('job-card-hiring-managers')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-total-views')).not.toBeInTheDocument()
  })

  it('renders hiring managers next to the owner when provided', () => {
    renderJobCard({
      hiringManagers: ['Lukáš Procházka', 'Hana Veselá'],
    })

    expect(screen.getByTestId('job-card-hiring-managers')).toHaveTextContent(
      'Lukáš Procházka, Hana Veselá',
    )
  })

  it('hides hiring managers when the list is empty', () => {
    renderJobCard({ hiringManagers: [] })

    expect(screen.queryByTestId('job-card-hiring-managers')).not.toBeInTheDocument()
  })

  it('renders the published status by default and status actions on demand', async () => {
    const user = userEvent.setup()
    const { unmount } = renderJobCard()
    const publishedStatus = screen.getByTestId('job-card-status')
    expect(publishedStatus).toHaveTextContent('Zveřejněný')
    expect(publishedStatus).toHaveClass('!tm-font-medium')
    expect(screen.getByTestId('job-card-status-indicator')).toHaveClass(
      'tm-bg-emotion-success-emphasis',
    )

    await user.click(publishedStatus)
    expect(screen.getByRole('option', { name: /Zveřejněný/ })).toHaveTextContent(
      'Inzerát je viditelný na jobportálech a dalších místech vystavení.',
    )
    expect(screen.getByRole('option', { name: /Nezveřejněný/ })).toHaveTextContent(
      'Inzerát je dostupný pouze skrze interní odkaz na inzerát. Na všech ostatních místech je skrytý.',
    )

    unmount()
    const unpublished = renderJobCard({ status: 'unpublished' })
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Nezveřejněný')
    expect(screen.getByTestId('job-card-status-indicator')).toHaveClass(
      'tm-bg-emotion-warning-emphasis',
    )

    unpublished.unmount()
    renderJobCard({ status: 'archived' })
    expect(screen.getByRole('button', { name: 'Obnovit z archivu' })).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-status')).not.toBeInTheDocument()
  })

  it('renders candidate counts with labels stacked under the numbers', () => {
    renderJobCard({ onCandidatesClick: vi.fn() })

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveTextContent('14Neposouzení')
    expect(stats).toHaveTextContent('6Ve hře')
    expect(stats).toHaveTextContent('52Celkem')

    const unassessed = screen.getByTestId('job-card-stat-unassessed')
    expect(unassessed).toHaveClass('tm-flex-col', 'tm-items-center', 'tm-text-center')
    expect(unassessed).not.toHaveClass('tm-items-baseline')
    expect(unassessed.children[0]).toHaveTextContent('14')
    expect(unassessed.children[1]).toHaveTextContent('Neposouzení')
    expect(unassessed.children[0]).toHaveClass('tm-group-hover:tm-text-action-link-active')
    expect(unassessed.children[1]).toHaveClass('tm-group-hover:tm-text-action-link-active')
  })

  it('makes the candidate stats clickable only when a handler is passed', async () => {
    const user = userEvent.setup()
    const onCandidatesClick = vi.fn()
    const { unmount } = renderJobCard()

    expect(screen.queryByTestId('job-card-stat-unassessed')).not.toBeInTheDocument()

    unmount()
    renderJobCard({ onCandidatesClick })

    await user.click(screen.getByTestId('job-card-stat-unassessed'))
    expect(onCandidatesClick).toHaveBeenCalledWith('unassessed')

    await user.click(screen.getByTestId('job-card-stat-total'))
    expect(onCandidatesClick).toHaveBeenLastCalledWith('total')
  })

  it('omits the stats block when no candidates are passed', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-stats')).not.toBeInTheDocument()
  })

  it('hides the new-candidates pill when new is omitted or zero', () => {
    const { unmount } = renderJobCard()
    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()

    unmount()
    renderJobCard({ candidates: { new: 0, unassessed: 14, inProgress: 6, total: 52 } })
    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()
  })

  it('shows a pink pill with the formatted new-candidate count in the unassessed column', () => {
    renderJobCard({ candidates: { new: 5, unassessed: 14, inProgress: 6, total: 52 } })

    const pill = screen.getByTestId('job-card-new-candidates')
    expect(pill).toHaveTextContent(formatCount(5))
    expect(pill).not.toHaveTextContent('nových')
    expect(pill).toHaveAttribute('aria-label', `Noví kandidáti: ${formatCount(5)}`)
    expect(pill).toHaveClass(
      'tm-bg-teamio-pink',
      'tm-text-primary-inverted-default',
      'tm-h-6',
      'tm-min-w-6',
      'tm-px-2',
      'tm-text-sm',
      'tm-font-semibold',
    )
    expect(pill).not.toHaveClass('tm-absolute')
    expect(pill.parentElement).toHaveClass('tm-inline-flex', 'tm-items-center')
    expect(screen.queryByTestId('job-card-stat-new')).not.toBeInTheDocument()

    const stats = screen.getByTestId('job-card-stats')
    const unassessedColumn = stats.firstElementChild
    expect(unassessedColumn).toHaveClass('tm-flex-col')
    expect(unassessedColumn).toContainElement(pill)
    expect(unassessedColumn).toHaveTextContent('14')
    expect(unassessedColumn).toHaveTextContent('Neposouzení')
    expect(stats).toHaveTextContent('6Ve hře')
    expect(stats).toHaveTextContent('52Celkem')

    const title = screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })
    expect(title).not.toContainElement(pill)
  })

  it('formats large new-candidate counts with cs-CZ grouping', () => {
    renderJobCard({ candidates: { new: 1234, unassessed: 14, inProgress: 6, total: 52 } })

    expect(screen.getByTestId('job-card-new-candidates').textContent).toBe(formatCount(1234))
  })

  it('renders the advertisement as an always-expanded card with a secondary title beside views', () => {
    renderJobCard()

    const card = screen.getByTestId('job-card-advertisement')
    expect(card).toHaveClass('tm-rounded', 'tm-border', 'tm-border-secondary', 'tm-px-3', 'tm-py-3')
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)

    const title = screen.getByTestId('job-card-advertisement-title')
    const heading = screen.getByTestId('job-card-advertisement-running-heading')
    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    expect(title).toHaveTextContent('Aktuální inzerát')
    expect(title).toHaveClass('tm-font-normal')
    expect(title.parentElement).toHaveClass('tm-text-secondary-default')
    expect(heading).toHaveTextContent('Běží')
    expect(title.parentElement).not.toBe(heading.parentElement)
    expect(title.parentElement).toContainElement(views)
    expect(screen.getByTestId('job-card-advertisement-title-separator')).toHaveTextContent('·')
  })

  it('hides the advertisement title when showAdvertisementTitle is false', () => {
    renderJobCard({ showAdvertisementTitle: false })

    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    expect(screen.queryByText('Aktuální inzerát')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent('Běží')
  })

  it('does not render an advertisement title when the advertisement has none', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026' }],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-title-separator')).not.toBeInTheDocument()
  })

  it('keeps the advertisement title secondary on the right when every portal has ended', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              status: 'expired',
              startDate: '12. 6.',
              endDate: '1. 9. 2026',
            },
          ],
        },
      ],
    })

    const title = screen.getByTestId('job-card-advertisement-title')
    const ended = screen.getByTestId('job-card-publication-ended-heading')
    expect(title.parentElement).not.toBe(ended.parentElement)
    expect(title.parentElement).toHaveClass('tm-text-secondary-default')
    expect(ended).toHaveTextContent('Ukončeno')
    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
  })

  it('shows aggregated views in the advertisement header without per-portal counts', () => {
    renderJobCard()

    const card = screen.getByTestId('job-card-advertisement')
    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    expect(views).toHaveTextContent(/1\s284 zhlédnutí/)
    expect(screen.queryByTestId('job-card-publication-views')).not.toBeInTheDocument()
    expect(within(views).queryByTestId('icon')).not.toBeInTheDocument()
    expect(card).toContainElement(views)
    expect(views.parentElement).toHaveClass('tm-text-13', 'tm-text-secondary-default')
    expect(views).not.toHaveClass('tm-absolute')
    expect(screen.getByTestId('job-card-advertisement-title-separator')).toHaveTextContent('·')
  })

  it('omits aggregated views when no publication has a view count', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' }],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
  })

  it('uses a 10px-adjacent gap between multiple advertisement cards', () => {
    renderJobCard({
      advertisements: [
        advertisement,
        { id: 'ad-2', title: 'Inzerát pro brigádníky', publications: [{ id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.' }] },
      ],
    })

    const list = screen.getByTestId('job-card-advertisements').firstElementChild
    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(2)
    expect(list).toHaveClass('tm-flex', 'tm-flex-col', 'tm-gap-3')
    expect(screen.queryByTestId('job-card-additional-advertisements')).not.toBeInTheDocument()
  })

  it('shows only the first advertisement and a remaining-count link when the extra-ads link is enabled', async () => {
    const user = userEvent.setup()
    const onAdditionalAdvertisementsClick = vi.fn()
    const secondAdvertisement: JobAdvertisement = {
      id: 'ad-2',
      title: 'Inzerát pro brigádníky',
      publications: [{ id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.' }],
    }
    const thirdAdvertisement: JobAdvertisement = {
      id: 'ad-3',
      title: 'Inzerát pro studenty',
      publications: [{ id: 'jobs-3', channel: 'Jobs.cz', startDate: '2. 8.' }],
    }

    renderJobCard({
      advertisements: [advertisement, secondAdvertisement, thirdAdvertisement],
      showAdditionalAdvertisementsLink: true,
      onAdditionalAdvertisementsClick,
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)
    const link = screen.getByTestId('job-card-additional-advertisements')
    expect(link).toHaveTextContent('Zobrazit další inzeráty (2)')

    await user.click(link)
    expect(onAdditionalAdvertisementsClick).toHaveBeenCalledTimes(1)
  })

  it('does not show the extra-ads link when the flag is on but the job has a single advertisement', () => {
    renderJobCard({
      showAdditionalAdvertisementsLink: true,
      onAdditionalAdvertisementsClick: vi.fn(),
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)
    expect(screen.queryByTestId('job-card-additional-advertisements')).not.toBeInTheDocument()
  })

  it('keeps unpublished advertisements ended when collapsing extra ads behind the link', () => {
    renderJobCard({
      status: 'unpublished',
      showAdditionalAdvertisementsLink: true,
      advertisements: [
        advertisement,
        { id: 'ad-2', title: 'Inzerát pro brigádníky', publications: [{ id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.' }] },
      ],
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)
    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-ended-heading')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-additional-advertisements')).toHaveTextContent(
      'Zobrazit další inzeráty (1)',
    )
  })

  it('puts Běží and the until-date on the heading when every running portal shares an end date', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          title: 'Inzerát #1',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 2000 },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9.', viewCount: 1000 },
            { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 170 },
          ],
        },
      ],
    })

    const heading = screen.getByTestId('job-card-advertisement-running-heading')
    expect(heading.textContent).toBe('Běží do 30. 9.')
    expect(heading).toHaveClass('tm-text-emotion-success-emphasis', 'tm-text-sm', 'tm-font-medium')

    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals.map((portal) => within(portal).getByTestId('job-card-publication-channel').textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    portals.forEach((portal) => {
      expect(portal).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-primary-default')
    })
    expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toHaveClass(
      'tm-flex-row',
    )
  })

  it('keeps Běží without a date and lists until-dates on portals when they differ', () => {
    renderJobCard()

    const heading = screen.getByTestId('job-card-advertisement-running-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(heading).not.toHaveTextContent('do')
    expect(heading).toHaveClass('tm-text-emotion-success-emphasis')

    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals.map((portal) => within(portal).getByTestId('job-card-publication-dates').textContent)).toEqual([
      'do 15. 9.',
      'do 30. 9.',
      'do 12. 8.',
    ])
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toHaveClass(
      'tm-flex-row',
    )
  })

  it('renders a success status dot on each running portal', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026' }],
        },
      ],
    })

    const dot = within(screen.getByTestId('job-card-publication')).getByTestId('job-card-publication-dot')
    expect(dot).toHaveClass('tm-bg-emotion-success-emphasis', 'tm-rounded-full')
  })

  it('splits running and ended portals and lifts a shared ended date onto Ukončeno', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          title: 'Inzerát #3',
          publications: [
            { id: 'nearby', channel: 'Práce za rohem', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 400 },
            { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 250 },
            {
              id: 'atmoskop',
              channel: 'Atmoskop',
              status: 'expired',
              startDate: '12. 7.',
              endDate: '1. 9. 2026',
              viewCount: 100,
            },
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-running-heading').textContent).toBe(
      'Běží do 15. 9.',
    )
    expect(screen.getByTestId('job-card-advertisement-title').parentElement).toContainElement(
      screen.getByTestId('job-card-advertisement-aggregate-views'),
    )
    const ended = screen.getByTestId('job-card-publication-ended-heading')
    expect(ended.textContent).toBe('Ukončeno 1. 9.')
    expect(ended.parentElement).not.toContainElement(screen.getByTestId('job-card-advertisement-title'))
    expect(ended).toHaveClass('tm-text-emotion-warning-emphasis', 'tm-text-sm', 'tm-font-medium')
    expect(ended.parentElement?.parentElement).toHaveClass('tm-border-t', 'tm-border-secondary')

    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals).toHaveLength(3)
    expect(within(portals[2]).getByTestId('job-card-publication-channel')).toHaveTextContent('Atmoskop')
    expect(portals[2]).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-primary-default')
    expect(within(portals[2]).getByTestId('job-card-publication-channel')).not.toHaveClass(
      'tm-text-secondary-default',
    )
    expect(within(portals[2]).getByTestId('job-card-publication-dot')).toHaveClass('tm-bg-gray-300')
    expect(within(portals[2]).queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
  })

  it('lists each ended portal with its date when ended dates differ', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              status: 'expired',
              startDate: '12. 6.',
              endDate: '15. 9. 2026',
            },
            {
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '12. 6.',
              endDate: '30. 9. 2026',
            },
          ],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveTextContent('Ukončeno')
    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveClass(
      'tm-text-sm',
      'tm-font-medium',
      'tm-text-emotion-warning-emphasis',
    )
    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals.map((portal) => within(portal).getByTestId('job-card-publication-dates').textContent)).toEqual([
      'do 15. 9.',
      'do 30. 9.',
    ])
    portals.forEach((portal) => {
      expect(portal).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-primary-default')
    })
  })

  it('treats every publication as ended when the job is unpublished', () => {
    renderJobCard({ status: 'unpublished' })

    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveTextContent('Ukončeno')
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
  })

  it('renders running highlights as pink chips after their parent portal', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 6.',
              endDate: '30. 9. 2026',
              viewCount: 1840,
              reactionCount: 34,
              highlights: [
                {
                  id: 'jobs-jobstip',
                  name: 'Jobstip',
                  startDate: '8. 6.',
                  endDate: '30. 9. 2026',
                  viewCount: 699,
                  reactionCount: 13,
                },
                {
                  id: 'jobs-top',
                  name: 'Topováno',
                  startDate: '22. 6.',
                  endDate: '30. 9. 2026',
                  viewCount: 331,
                  reactionCount: 6,
                },
              ],
            },
            { id: 'prace', channel: 'Prace.cz', startDate: '1. 6.', endDate: '30. 9. 2026', viewCount: 920 },
          ],
        },
      ],
    })

    const active = screen.getByTestId('job-card-advertisement-active-publications')
    expect(within(active).getAllByTestId('job-card-publication-channel').map((el) => el.textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
    ])
    const highlights = within(active).getAllByTestId('job-card-publication-highlight')
    expect(highlights.map((chip) => chip.textContent)).toEqual(['Jobstip', 'Topováno'])
    expect(active.children[0]).toContainElement(screen.getByText('Jobs.cz'))
    expect(active.children[1]).toBe(highlights[0])
    expect(active.children[2]).toBe(highlights[1])
    expect(active.children[3]).toContainElement(screen.getByText('Prace.cz'))
    highlights.forEach((chip) => {
      expect(within(chip).getByTestId('job-card-publication-highlight-dot')).toHaveClass('tm-bg-teamio-pink')
      expect(within(chip).getByTestId('job-card-publication-highlight-name')).toHaveClass(
        'tm-text-teamio-pink',
        'tm-font-medium',
      )
      expect(within(chip).queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent('Běží do 30. 9.')
  })

  it('hides expired highlights and highlights on ended or unpublished portals', () => {
    const { unmount } = renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 6.',
              endDate: '30. 9. 2026',
              highlights: [
                { id: 'running', name: 'Jobstip', startDate: '8. 6.', endDate: '30. 9. 2026' },
                {
                  id: 'ended',
                  name: 'Topováno',
                  status: 'expired',
                  startDate: '22. 6.',
                  endDate: '6. 7. 2026',
                },
              ],
            },
            {
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '1. 6.',
              endDate: '1. 8. 2026',
              highlights: [{ id: 'supermax', name: 'Supermax', startDate: '8. 6.', endDate: '30. 9. 2026' }],
            },
          ],
        },
      ],
    })

    expect(screen.getAllByTestId('job-card-publication-highlight')).toHaveLength(1)
    expect(screen.getByTestId('job-card-publication-highlight')).toHaveTextContent('Jobstip')
    expect(screen.queryByText('Topováno')).not.toBeInTheDocument()
    expect(screen.queryByText('Supermax')).not.toBeInTheDocument()

    unmount()
    renderJobCard({
      status: 'unpublished',
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 6.',
              endDate: '30. 9. 2026',
              highlights: [{ id: 'running', name: 'Jobstip', startDate: '8. 6.', endDate: '30. 9. 2026' }],
            },
          ],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-publication-highlight')).not.toBeInTheDocument()
    expect(screen.queryByText('Jobstip')).not.toBeInTheDocument()
  })

  it('opens a portal hover card with logo, period and stats', async () => {
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
              endDate: '30. 9. 2026',
              viewCount: 1840,
              reactionCount: 34,
            },
          ],
        },
      ],
    })

    await user.hover(screen.getByTestId('job-card-publication-channel'))
    const dropdown = await screen.findByTestId('job-card-publication-dropdown')
    expect(dropdown.firstElementChild).toHaveClass('tm-w-[200px]')
    expect(dropdown).toHaveTextContent('Jobs.cz')
    expect(within(dropdown).getByTestId('job-portal-logo')).toHaveAttribute('data-logo-type', 'jobs-cz')
    expect(dropdown).toHaveTextContent('1. 6. – 30. 9. 2026')
    expect(dropdown).toHaveTextContent('Zhlédnutí')
    expect(dropdown).toHaveTextContent(/1\s840/)
    expect(dropdown).toHaveTextContent('Reakce')
    expect(dropdown).toHaveTextContent('34')
    expect(dropdown).toHaveTextContent('Konverze')
    expect(dropdown).toHaveTextContent(/1,8\s%/)
    expect(screen.queryByTestId('job-card-publication-highlight-dropdown')).not.toBeInTheDocument()
  })

  it('opens a highlight hover card with the parent portal and highlight stats', async () => {
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
              endDate: '30. 9. 2026',
              viewCount: 1840,
              reactionCount: 34,
              highlights: [
                {
                  id: 'jobs-jobstip',
                  name: 'Jobstip',
                  startDate: '8. 6. 2026',
                  endDate: '30. 9. 2026',
                  viewCount: 699,
                  reactionCount: 13,
                },
              ],
            },
          ],
        },
      ],
    })

    await user.hover(screen.getByTestId('job-card-publication-highlight-name'))
    const dropdown = await screen.findByTestId('job-card-publication-highlight-dropdown')
    expect(dropdown).toHaveTextContent('Jobs.cz')
    expect(within(dropdown).getByTestId('job-portal-logo')).toHaveAttribute('data-logo-type', 'jobs-cz')
    expect(dropdown).toHaveTextContent('1. 6. – 30. 9. 2026')
    expect(dropdown).toHaveTextContent(/1\s840/)
    expect(dropdown).toHaveTextContent('Jobstip')
    expect(dropdown).toHaveTextContent('8. 6. – 30. 9. 2026')
    expect(dropdown).toHaveTextContent(/699/)
    expect(dropdown).toHaveTextContent('13')
    expect(screen.queryByTestId('job-card-publication-dropdown')).not.toBeInTheDocument()
  })

  it('shows an empty publication message when the advertisement has no portals', () => {
    renderJobCard({
      advertisements: [{ id: 'ad-1', title: 'Aktuální inzerát', publications: [] }],
    })

    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Aktuální inzerát')
    expect(screen.queryByTestId('job-card-advertisement-title-separator')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-publications')).toHaveTextContent(
      'Inzerát není nikde vystavený.',
    )
  })

  it('renders an empty state when the job has no advertisement', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({ advertisements: [], onCreateAdvertisement })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )

    await user.click(screen.getByRole('button', { name: 'Vytvořit inzerát' }))
    expect(onCreateAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('does not render an edit button and still calls the action from the dropdown menu', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderJobCard({
      actions: [{ id: 'delete', label: 'Smazat nábor', color: 'danger', onClick: onDelete }],
    })

    expect(screen.queryByRole('button', { name: 'Editovat' })).not.toBeInTheDocument()

    await user.click(screen.getByTestId('job-card-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Smazat nábor' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('lists advertisement actions above the job actions, split by a divider', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    const onEndPublication = vi.fn()
    const onHighlightAdvertisement = vi.fn()
    const onTopAdvertisement = vi.fn()
    renderJobCard({
      onEditJob: vi.fn(),
      onDuplicateJob: vi.fn(),
      onInviteColleagues: vi.fn(),
      onTransferJob: vi.fn(),
      onArchiveJob: vi.fn(),
      onEditAdvertisement: vi.fn(),
      onExtendAndRepublish,
      onEndPublication,
      onHighlightAdvertisement,
      onTopAdvertisement,
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      'Editovat inzerát',
      'Prodloužit a znovu vystavit',
      'Ukončit vystavení',
      'Zvýraznit',
      'Topovat',
      'Editovat nábor',
      'Duplikovat',
      'Zapojit kolegy',
      'Předat nábor',
      'Archivovat',
    ])
    expect(screen.getByTestId('job-card-actions-divider')).toBeInTheDocument()
    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()

    await user.click(options[1])
    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)
    expect(onEndPublication).not.toHaveBeenCalled()

    await user.click(screen.getByTestId('job-card-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Ukončit vystavení' }))
    expect(onEndPublication).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTestId('job-card-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Zvýraznit' }))
    expect(onHighlightAdvertisement).toHaveBeenCalledTimes(1)
    expect(onTopAdvertisement).not.toHaveBeenCalled()

    await user.click(screen.getByTestId('job-card-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Topovat' }))
    expect(onTopAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('keeps advertisement actions flat when the job has several advertisements', async () => {
    const user = userEvent.setup()
    const onEditAdvertisement = vi.fn()
    const secondAdvertisement: JobAdvertisement = {
      id: 'ad-2',
      title: 'Inzerát pro brigádníky',
      publications: [
        { id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.', endDate: '15. 9. 2026' },
      ],
    }

    renderJobCard({
      advertisements: [advertisement, secondAdvertisement],
      onEditAdvertisement,
      onExtendAndRepublish: vi.fn(),
      onEndPublication: vi.fn(),
      onEditJob: vi.fn(),
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Editovat inzerát',
      'Prodloužit a znovu vystavit',
      'Ukončit vystavení',
      'Editovat nábor',
    ])
    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Editovat inzerát' }))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('lists Přidat inzerát instead of advertisement actions when the job has none', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({
      advertisements: [],
      onCreateAdvertisement,
      onEditAdvertisement: vi.fn(),
      onExtendAndRepublish: vi.fn(),
      onEndPublication: vi.fn(),
      onHighlightAdvertisement: vi.fn(),
      onTopAdvertisement: vi.fn(),
      onEditJob: vi.fn(),
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Přidat inzerát',
      'Editovat nábor',
    ])
    expect(screen.queryByRole('option', { name: /Editovat inzerát/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Prodloužit a znovu vystavit/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Ukončit vystavení/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Zvýraznit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Topovat' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Přidat inzerát' }))
    expect(onCreateAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('omits the action menu when no handler is passed', () => {
    renderJobCard()

    expect(screen.queryByTestId('job-card-actions-toggle')).not.toBeInTheDocument()
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCard ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })
})
