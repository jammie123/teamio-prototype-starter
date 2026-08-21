import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
    expect(screen.getByText('Petra Nováková')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-total-views')).not.toBeInTheDocument()
  })

  it('renders the published status by default and status actions on demand', () => {
    const { unmount } = renderJobCard()
    const publishedStatus = screen.getByTestId('job-card-status')
    expect(publishedStatus).toHaveTextContent('Zveřejněný')
    expect(publishedStatus).toHaveClass('!tm-font-medium')
    expect(screen.getByTestId('job-card-status-indicator')).toHaveClass(
      'tm-bg-emotion-success-emphasis',
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
    expect(pill).toHaveTextContent(`${formatCount(5)} nových`)
    expect(pill).toHaveAttribute('aria-label', `Noví kandidáti: ${formatCount(5)}`)
    expect(pill).toHaveClass(
      'tm-bg-teamio-pink',
      'tm-text-primary-inverted-default',
      'tm-absolute',
      'tm-left-full',
    )
    expect(pill.parentElement).toHaveClass('tm-relative')
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

    expect(screen.getByTestId('job-card-new-candidates').textContent).toBe(
      `${formatCount(1234)} nových`,
    )
  })

  it('labels the advertisement toggle with the recruitment title', () => {
    renderJobCard({ title: 'Skladník Praha' })

    expect(screen.getByRole('button', { name: 'Skladník Praha' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Inzerce' })).not.toBeInTheDocument()
  })

  it('collapses and expands the advertisement section', async () => {
    const user = userEvent.setup()
    renderJobCard()

    const toggle = screen.getByRole('button', { name: 'Řidič/ka sk. C ČB PO–PÁ' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(toggle).getByText('Řidič/ka sk. C ČB PO–PÁ')).toHaveClass('tm-text-primary-default')
    expect(within(toggle).getByText('Řidič/ka sk. C ČB PO–PÁ')).toHaveClass('tm-font-medium')
    expect(screen.getAllByTestId('job-card-publication')[0]).toBeVisible()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    screen.getAllByTestId('job-card-publication').forEach((publication) => {
      expect(publication).not.toBeVisible()
    })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('draws a light secondary outline on advertisement hover without a fill', () => {
    renderJobCard({ defaultOpenAdvertisementIds: [] })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement).toHaveClass('tm-rounded')
    expect(advertisement).toHaveClass('tm-border')
    expect(advertisement).toHaveClass('tm-border-transparent')
    expect(advertisement).toHaveClass('hover:tm-border-secondary')
    expect(advertisement.className).not.toMatch(/hover:tm-bg-/)

    const section = screen.getByTestId('job-card-advertisements')
    expect(section).not.toHaveClass('tm-border-t')
    expect(section.className).not.toMatch(/tm-border-t/)
  })

  it('uses a small gap between multiple advertisements', () => {
    renderJobCard({
      advertisements: [
        advertisement,
        { id: 'ad-2', publications: [{ id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.' }] },
      ],
    })

    const list = screen.getByTestId('job-card-advertisements').firstElementChild
    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(2)
    expect(list).toHaveClass('tm-flex')
    expect(list).toHaveClass('tm-flex-col')
    expect(list).toHaveClass('tm-gap-1')
    expect(list).not.toHaveClass('tm-gap-3')
  })

  it('summarizes active portal names and the first end date on the collapsed header row', async () => {
    const user = userEvent.setup()
    renderJobCard()

    expect(screen.queryByTestId('job-card-advertisement-summary')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Řidič/ka sk. C ČB PO–PÁ' }))

    const advertisementEl = screen.getByTestId('job-card-advertisement')
    const header = advertisementEl.firstElementChild
    const summary = screen.getByTestId('job-card-advertisement-summary')
    expect(header).toContainElement(screen.getByRole('button', { name: 'Řidič/ka sk. C ČB PO–PÁ' }))
    expect(header).toContainElement(summary)
    expect(summary).toHaveTextContent(/Jobs\.cz, Prace\.cz, Kariérní stránky\s*·\s*první končí 12\. 8\./)
    expect(summary).toHaveClass('tm-text-13')
    expect(summary).toHaveClass('tm-text-secondary-default')
    expect(summary).toHaveClass('tm-gap-x-3')
    expect(summary.className).not.toMatch(/tm-grid-cols-\[/)
  })

  it('omits the Zhlédnutí total from the title row when expanded', () => {
    renderJobCard()

    const header = screen.getByTestId('job-card-advertisement').firstElementChild as HTMLElement
    const list = within(screen.getByTestId('job-card-advertisement-publications')).getByRole(
      'list',
    )
    const publicationRows = screen.getAllByTestId('job-card-publication')
    const publicationViews = within(publicationRows[0]).getByTestId('job-card-publication-views')

    expect(screen.queryByTestId('job-card-advertisement-summary')).not.toBeInTheDocument()
    expect(header).toContainElement(screen.getByRole('button', { name: 'Řidič/ka sk. C ČB PO–PÁ' }))
    expect(within(header).queryByTestId('job-card-advertisement-total-views')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-total-views')).not.toBeInTheDocument()
    expect(header).not.toHaveTextContent('Zhlédnutí:')
    expect(list.firstElementChild).toBe(publicationRows[0])
    expect(publicationViews).toHaveTextContent('842')
    expect(publicationViews).toHaveClass('tm-tabular-nums')
    expect(publicationViews).toHaveClass('tm-text-right')
    expect(publicationViews).toHaveClass('tm-justify-self-end')
    expect(within(publicationViews).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-publications')).not.toHaveClass('tm-pt-1')
  })

  it('appends a declined view count after a middle dot in the collapsed summary', async () => {
    const user = userEvent.setup()
    renderJobCard()

    await user.click(screen.getByRole('button', { name: 'Řidič/ka sk. C ČB PO–PÁ' }))

    const summary = screen.getByTestId('job-card-advertisement-summary')
    const views = within(summary).getByTestId('job-card-advertisement-aggregate-views')
    expect(summary).toHaveTextContent(
      /Jobs\.cz, Prace\.cz, Kariérní stránky\s*·\s*první končí 12\. 8\.\s*·\s*1\s284 zhlédnutí/,
    )
    expect(views).toHaveTextContent(/1\s284 zhlédnutí/)
    expect(within(views).queryByTestId('icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-total-views')).not.toBeInTheDocument()
    expect(screen.queryByText('Zhlédnutí:')).not.toBeInTheDocument()
  })

  it('uses the earliest active publication end date in the collapsed summary', () => {
    renderJobCard({
      defaultOpenAdvertisementIds: [],
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '1. 10. 2026' },
            {
              id: 'career',
              channel: 'Kariérní stránky',
              status: 'expired',
              startDate: '12. 7.',
              endDate: '1. 8. 2026',
            },
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-summary')).toHaveTextContent(
      /Jobs\.cz, Prace\.cz\s*·\s*první končí 15\. 9\./,
    )
    expect(screen.getByTestId('job-card-advertisement-summary')).not.toHaveTextContent(
      'Kariérní stránky',
    )
  })

  it('omits the end-date part when no active publication has an end date', () => {
    renderJobCard({
      defaultOpenAdvertisementIds: [],
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', viewCount: 10 }],
        },
      ],
    })

    const summary = screen.getByTestId('job-card-advertisement-summary')
    expect(summary).toHaveTextContent('Jobs.cz')
    expect(summary.textContent).not.toMatch(/první končí/)
    expect(within(summary).getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      '10 zhlédnutí',
    )
  })

  it('omits aggregated views when no publication has a view count', () => {
    renderJobCard({
      defaultOpenAdvertisementIds: [],
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' }],
        },
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-summary')).toHaveTextContent(
      'první končí 15. 9.',
    )
    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
  })

  it('summarizes expired portal count, last end date and views when every publication is expired', () => {
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
              endDate: '12. 7.',
              viewCount: 842,
            },
            {
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '12. 6.',
              endDate: '15. 8. 2026',
              viewCount: 312,
            },
          ],
        },
      ],
    })

    const toggle = screen.getByRole('button', { name: 'Řidič/ka sk. C ČB PO–PÁ' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    screen.getAllByTestId('job-card-publication').forEach((publication) => {
      expect(publication).not.toBeVisible()
    })

    const summary = screen.getByTestId('job-card-advertisement-summary')
    const views = within(summary).getByTestId('job-card-advertisement-aggregate-views')
    expect(summary).toHaveTextContent(/2 portály ukončeny\s*·\s*15\. 8\.\s*·\s*1\s154 zhlédnutí/)
    expect(summary).not.toHaveTextContent('Jobs.cz')
    expect(summary.textContent).not.toMatch(/první končí/)
    expect(views).toHaveTextContent(/1\s154 zhlédnutí/)
    expect(screen.queryByTestId('job-card-advertisement-total-views')).not.toBeInTheDocument()
  })

  it('lets an all-expired advertisement expand from the collapsed summary', async () => {
    const user = userEvent.setup()
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
              endDate: '12. 7.',
              viewCount: 842,
            },
          ],
        },
      ],
    })

    const toggle = screen.getByRole('button', { name: 'Řidič/ka sk. C ČB PO–PÁ' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByTestId('job-card-advertisement-summary')).toHaveTextContent('1 portál ukončen')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('job-card-publication')).toBeVisible()
    expect(screen.queryByTestId('job-card-advertisement-summary')).not.toBeInTheDocument()
  })

  it('shows every publication when the advertisement is expanded', () => {
    renderJobCard()

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(screen.queryByRole('button', { name: /Zobrazit další/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Zobrazit méně' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-total-views')).not.toBeInTheDocument()
  })

  it('hides the status label on an active publication', () => {
    renderJobCard()

    expect(screen.queryByTestId('job-card-publication-status')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-publication')[0]).not.toHaveTextContent('Aktivní')
  })

  describe('when a publication ends in less than a week', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 7, 19))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('shows remaining days after the date with the warning status style', () => {
      renderJobCard({
        advertisements: [
          {
            id: 'ad-1',
            publications: [
              {
                id: 'jobs',
                channel: 'Jobs.cz',
                startDate: '12. 7.',
                endDate: '22. 8. 2026',
              },
            ],
          },
        ],
      })

      const dates = screen.getByTestId('job-card-publication-dates')
      const status = screen.getByTestId('job-card-publication-status')
      expect(dates).toHaveTextContent('do 22. 8.')
      expect(dates).toHaveClass('tm-tabular-nums', 'tm-text-right')
      expect(dates).toContainElement(status)
      expect(status).toHaveTextContent('Brzy končí · 3 dny')
      expect(status).toHaveClass('tm-text-emotion-warning-emphasis')
      expect(status).toHaveClass('tm-uppercase')
      expect(status).toHaveClass('tm-font-medium')
    })

    it('does not show remaining days when the end is a week or more away', () => {
      renderJobCard({
        advertisements: [
          {
            id: 'ad-1',
            publications: [
              {
                id: 'jobs',
                channel: 'Jobs.cz',
                startDate: '12. 7.',
                endDate: '26. 8. 2026',
              },
            ],
          },
        ],
      })

      expect(screen.queryByTestId('job-card-publication-status')).not.toBeInTheDocument()
    })
  })

  it('marks an ending-soon publication', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              status: 'endingSoon',
              startDate: '12. 7.',
              endDate: '15. 9. 2026',
            },
          ],
        },
      ],
    })

    const status = screen.getByTestId('job-card-publication-status')
    const dates = screen.getByTestId('job-card-publication-dates')
    expect(dates).toHaveTextContent('do 15. 9.')
    expect(dates).toContainElement(status)
    expect(status).toHaveTextContent('Brzy končí')
    expect(status).toHaveClass('tm-text-emotion-warning-emphasis')
    expect(status).toHaveClass('tm-uppercase')
    expect(status).toHaveClass('tm-font-medium')
  })

  it('marks an expired publication with a shared ended-until date', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '12. 7.',
              endDate: '12. 8.',
            },
          ],
        },
      ],
    })

    const publication = screen.getByTestId('job-card-publication')
    const dates = screen.getByTestId('job-card-publication-dates')
    expect(publication).toHaveTextContent('ukončeno do 12. 8.')
    expect(dates).toHaveTextContent('ukončeno do 12. 8.')
    expect(dates).toHaveClass('tm-tabular-nums', 'tm-text-right')
    expect(screen.queryByTestId('job-card-publication-status')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-publication-ended-heading')).not.toBeInTheDocument()
  })

  it('collapses portals that share an end date into one until-date row', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 10 },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '15. 9.', viewCount: 4 },
          ],
        },
      ],
    })

    const rows = screen.getAllByTestId('job-card-publication')
    expect(rows).toHaveLength(1)
    expect(within(rows[0]).getByTestId('job-card-publication-channel')).toHaveTextContent(
      'Jobs.cz, Prace.cz',
    )
    expect(within(rows[0]).getByTestId('job-card-publication-dates')).toHaveTextContent('do 15. 9.')
    expect(within(rows[0]).getByTestId('job-card-publication-views')).toHaveTextContent('14')
  })

  it('lists each expired portal under Ukončeno when end dates differ', () => {
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
            {
              id: 'career',
              channel: 'Kariérní stránky',
              status: 'expired',
              startDate: '1. 6.',
              endDate: '12. 8. 2026',
            },
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveTextContent('Ukončeno')
    const rows = screen.getAllByTestId('job-card-publication')
    expect(rows.map((row) => within(row).getByTestId('job-card-publication-channel').textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    expect(rows.map((row) => within(row).getByTestId('job-card-publication-dates').textContent)).toEqual([
      'do 15. 9.',
      'do 30. 9.',
      'do 12. 8.',
    ])
    expect(within(rows[0]).getByTestId('job-card-publication-dates')).toHaveClass(
      'tm-tabular-nums',
      'tm-text-right',
    )
  })

  it('aligns publication row borders with the advertisement title', () => {
    renderJobCard()

    const rows = screen.getAllByTestId('job-card-publication')
    expect(rows).toHaveLength(3)

    const list = within(screen.getByTestId('job-card-advertisement-publications')).getByRole(
      'list',
    )
    expect(list).toHaveClass('tm-grid')
    expect(list).toHaveClass('tm-w-full')
    expect(list).toHaveClass('tm-gap-x-4')
    expect(list.className).toMatch(
      /tm-grid-cols-\[minmax\(0,1fr\)_auto_auto\]/,
    )

    const gridClass = rows[0].className
    expect(gridClass).toMatch(/\btm-grid\b/)
    expect(gridClass).toMatch(/\btm-text-13\b/)
    expect(gridClass).toMatch(/\btm-grid-cols-subgrid\b/)
    expect(gridClass).toMatch(/\btm-col-span-full\b/)
    expect(gridClass).not.toMatch(/tm-grid-cols-\[/)
    expect(gridClass).not.toMatch(/\btm-flex-wrap\b/)
    expect(rows[0]).not.toHaveClass('tm-border-t')

    rows.forEach((row) => {
      expect(row).toHaveClass('tm-col-span-full')
      expect(row).toHaveClass('tm-grid-cols-subgrid')
    })

    rows.slice(1).forEach((row) => {
      expect(row).toHaveClass('tm-border-t')
      expect(row).toHaveClass('tm-border-secondary')
    })

    const expanded = screen.getByTestId('job-card-advertisement-publications')
    expect(expanded).toHaveClass('tm-pl-8')
    expect(expanded).toHaveClass('tm-w-full')
    expect(expanded.className).toMatch(/-tm-mx-3/)

    expect(within(rows[0]).getByTestId('job-card-publication-channel')).toHaveClass(
      'tm-font-medium',
    )
    expect(within(rows[0]).getByTestId('job-card-publication-channel')).toHaveClass(
      'tm-min-w-0',
    )
    expect(within(rows[0]).getByTestId('job-card-publication-dates')).toHaveTextContent(
      'do 15. 9.',
    )
    expect(within(rows[0]).getByTestId('job-card-publication-dates')).toHaveClass(
      'tm-tabular-nums',
    )
  })

  it('renders publication view counts as a right-aligned eye in a 3-digit-wide div', () => {
    renderJobCard()

    const jobsRow = screen.getAllByTestId('job-card-publication')[0]
    const views = within(jobsRow).getByTestId('job-card-publication-views')
    expect(views.tagName).toBe('DIV')
    expect(views.children).toHaveLength(1)
    expect(within(views).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(views).toHaveTextContent('842')
    expect(views).toHaveClass('tm-text-right')
    expect(views).toHaveClass('tm-tabular-nums')
    expect(views).toHaveClass('tm-justify-self-end')
    expect(views.className).toMatch(/tm-grid-cols-\[auto_minmax\(3ch,max-content\)\]/)
    expect(jobsRow.textContent).not.toMatch(/Zhlédnuto/)
    expect(jobsRow.textContent).not.toMatch(/Počet zhlédnutí/)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
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
    const onManagePublications = vi.fn()
    renderJobCard({
      onEditJob: vi.fn(),
      onDuplicateJob: vi.fn(),
      onInviteColleagues: vi.fn(),
      onTransferJob: vi.fn(),
      onArchiveJob: vi.fn(),
      onEditAdvertisement: vi.fn(),
      onManagePublications,
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      'Editovat inzerátPopis a znění inzerátu',
      'Místa vystaveníUkončení nebo prodloužení inzerce',
      'Editovat nábor',
      'Duplikovat',
      'Zapojit kolegy',
      'Předat nábor',
      'Archivovat',
    ])
    expect(screen.getByTestId('job-card-actions-divider')).toBeInTheDocument()
    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()

    await user.click(options[1])
    expect(onManagePublications).toHaveBeenCalledTimes(1)
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
      onManagePublications: vi.fn(),
      onEditJob: vi.fn(),
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Editovat inzerátPopis a znění inzerátu',
      'Místa vystaveníUkončení nebo prodloužení inzerce',
      'Editovat nábor',
    ])
    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Editovat inzerát Popis a znění inzerátu' }))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('lists Přidat inzerát instead of advertisement actions when the job has none', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({
      advertisements: [],
      onCreateAdvertisement,
      onEditAdvertisement: vi.fn(),
      onManagePublications: vi.fn(),
      onEditJob: vi.fn(),
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Přidat inzerát',
      'Editovat nábor',
    ])
    expect(screen.queryByRole('option', { name: /Editovat inzerát/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Místa vystavení/ })).not.toBeInTheDocument()

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
