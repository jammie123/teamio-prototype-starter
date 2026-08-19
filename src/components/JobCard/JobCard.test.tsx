import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCard } from './JobCard'
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
      totalViewCount={1284}
      candidates={{ unreviewed: 14, inProgress: 6, total: 52 }}
      advertisements={[advertisement]}
      {...props}
    />,
  )
}

describe('JobCard', () => {
  it('renders title, owner and total views', () => {
    renderJobCard()

    expect(screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })).toBeInTheDocument()
    expect(screen.getByText('Petra Nováková')).toBeInTheDocument()

    const totalViews = screen.getByTestId('job-card-total-views')
    expect(within(totalViews).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(totalViews).toHaveTextContent(/1\s284/)
    expect(totalViews).toHaveAccessibleName(/Počet zhlédnutí:\s*1\s284/)
    expect(totalViews.textContent).not.toMatch(/Zhlédnuto/)
  })

  it('renders the open status by default and the closed status on demand', () => {
    const { unmount } = renderJobCard()
    const openStatus = screen.getByTestId('job-card-status')
    expect(openStatus).toHaveTextContent('Otevřený')
    expect(openStatus).toHaveClass('!tm-font-medium')
    expect(screen.getByTestId('job-card-status-indicator')).toHaveClass(
      'tm-bg-emotion-success-emphasis',
    )

    unmount()
    renderJobCard({ status: 'closed' })
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Uzavřený')
    expect(screen.queryByTestId('job-card-status-indicator')).not.toBeInTheDocument()
  })

  it('renders candidate counts with labels', () => {
    renderJobCard()

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveTextContent('14Neposouzení')
    expect(stats).toHaveTextContent('6Ve hře')
    expect(stats).toHaveTextContent('52Celkem')
  })

  it('makes the candidate stats clickable only when a handler is passed', async () => {
    const user = userEvent.setup()
    const onCandidatesClick = vi.fn()
    const { unmount } = renderJobCard()

    expect(screen.queryByTestId('job-card-stat-unreviewed')).not.toBeInTheDocument()

    unmount()
    renderJobCard({ onCandidatesClick })

    await user.click(screen.getByTestId('job-card-stat-unreviewed'))
    expect(onCandidatesClick).toHaveBeenCalledWith('unreviewed')

    await user.click(screen.getByTestId('job-card-stat-total'))
    expect(onCandidatesClick).toHaveBeenLastCalledWith('total')
  })

  it('omits the stats block when no candidates are passed', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-stats')).not.toBeInTheDocument()
  })

  it('collapses and expands the advertisement section', async () => {
    const user = userEvent.setup()
    renderJobCard()

    const toggle = screen.getByRole('button', { name: 'Inzerce' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(toggle).getByText('Inzerce')).toHaveClass('tm-text-primary-default')
    expect(within(toggle).getByText('Inzerce')).toHaveClass('tm-font-medium')
    expect(screen.getAllByTestId('job-card-publication')[0]).toBeVisible()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    screen.getAllByTestId('job-card-publication').forEach((publication) => {
      expect(publication).not.toBeVisible()
    })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('wraps the advertisement in a bordered box without a section divider above it', () => {
    renderJobCard({ defaultOpenAdvertisementIds: [] })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement).toHaveClass('tm-rounded')
    expect(advertisement).toHaveClass('tm-border')
    expect(advertisement).toHaveClass('tm-border-solid')
    expect(advertisement).toHaveClass('tm-border-secondary')

    const section = screen.getByTestId('job-card-advertisements')
    expect(section).not.toHaveClass('tm-border-t')
    expect(section.className).not.toMatch(/tm-border-t/)
  })

  it('summarizes active portal names and the first end date on the collapsed header row', async () => {
    const user = userEvent.setup()
    renderJobCard()

    expect(screen.queryByTestId('job-card-advertisement-summary')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Inzerce' }))

    const advertisement = screen.getByTestId('job-card-advertisement')
    const header = advertisement.firstElementChild
    const summary = screen.getByTestId('job-card-advertisement-summary')
    expect(header).toContainElement(screen.getByRole('button', { name: 'Inzerce' }))
    expect(header).toContainElement(summary)
    expect(summary).toHaveTextContent(/Jobs\.cz, Prace\.cz, Kariérní stránky\s*·\s*první končí 12\. 8\./)
    expect(summary).toHaveClass('tm-text-13')
    expect(summary).toHaveClass('tm-text-secondary-default')
    expect(summary).toHaveClass('tm-gap-x-3')
    expect(summary.className).not.toMatch(/tm-grid-cols-\[/)
  })

  it('shows the aggregated view count after the other collapsed summary parts', async () => {
    const user = userEvent.setup()
    renderJobCard()

    await user.click(screen.getByRole('button', { name: 'Inzerce' }))

    const summary = screen.getByTestId('job-card-advertisement-summary')
    const views = within(summary).getByTestId('job-card-advertisement-aggregate-views')
    expect(summary).toHaveTextContent(/Jobs\.cz, Prace\.cz, Kariérní stránky\s*·\s*první končí 12\. 8\.\s*·/)
    expect(within(views).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(views).toHaveTextContent(/1\s284/)
    expect(views).toHaveAccessibleName(/Počet zhlédnutí:\s*1\s284/)
    expect(summary.textContent?.indexOf('první končí 12. 8.') ?? -1).toBeLessThan(
      summary.textContent?.indexOf(views.textContent ?? '') ?? -1,
    )
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

  it('omits portal names and the first-end date when every publication is expired', () => {
    renderJobCard({
      defaultOpenAdvertisementIds: [],
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

    const summary = screen.getByTestId('job-card-advertisement-summary')
    expect(summary).not.toHaveTextContent('Jobs.cz')
    expect(summary.textContent).not.toMatch(/první končí/)
    expect(within(summary).getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      '842',
    )
  })

  it('shows the total view count in the views column when the advertisement is expanded', () => {
    renderJobCard()

    const totals = screen.getByTestId('job-card-advertisement-total-views')
    expect(totals).toHaveClass('tm-grid')
    expect(totals.className).toMatch(/tm-grid-cols-\[/)
    expect(totals.className).toBe(screen.getAllByTestId('job-card-publication')[0].className)
    expect(within(totals).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(totals).toHaveTextContent(/1\s284/)
    expect(screen.queryByTestId('job-card-advertisement-summary')).not.toBeInTheDocument()
  })

  it('shows every publication when the advertisement is expanded', () => {
    renderJobCard()

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(screen.queryByRole('button', { name: /Zobrazit další/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Zobrazit méně' })).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-total-views')).toHaveTextContent(/1\s284/)
  })

  it('marks an expired publication with its end date', () => {
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
    expect(publication).toHaveTextContent('Ukončeno')
    expect(publication).toHaveTextContent('12. 7. – 12. 8.')
    expect(screen.getByTestId('job-card-publication-status')).toHaveClass(
      'tm-text-emotion-danger-emphasis',
    )
    expect(screen.getByTestId('job-card-publication-status')).toHaveClass('tm-uppercase')
    expect(screen.getByTestId('job-card-publication-status')).toHaveClass('tm-font-medium')
  })

  it('aligns publication rows with the chevron and separates them with a line', () => {
    renderJobCard()

    const rows = screen.getAllByTestId('job-card-publication')
    expect(rows).toHaveLength(3)

    const gridClass = rows[0].className
    expect(gridClass).toMatch(/\btm-grid\b/)
    expect(gridClass).toMatch(/\btm-text-13\b/)
    expect(gridClass).toMatch(/tm-grid-cols-\[minmax\(8rem,1fr\)/)
    expect(gridClass).toMatch(/\btm-w-full\b/)
    expect(gridClass).not.toMatch(/\btm-flex-wrap\b/)
    expect(rows[0]).not.toHaveClass('tm-border-t')

    rows.slice(1).forEach((row) => {
      expect(row).toHaveClass('tm-border-t')
      expect(row).toHaveClass('tm-border-secondary')
    })

    const expanded = screen.getByTestId('job-card-advertisement-publications')
    expect(expanded.className).not.toMatch(/\btm-pl-10\b/)
    expect(expanded).toHaveClass('tm-w-full')
    expect(expanded.className).toMatch(/-tm-mx-3/)

    expect(within(rows[0]).getByTestId('job-card-publication-channel')).toHaveClass(
      'tm-font-medium',
    )
  })

  it('renders publication view counts as an eye icon without the Zhlédnuto label', () => {
    renderJobCard()

    const jobsRow = screen.getAllByTestId('job-card-publication')[0]
    const views = within(jobsRow).getByTestId('job-card-publication-views')
    expect(within(views).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(views).toHaveTextContent('842')
    expect(views).toHaveAccessibleName(/Počet zhlédnutí:\s*842/)
    expect(jobsRow.textContent).not.toMatch(/Zhlédnuto/)
  })

  it('explains the view count with a tooltip on the eye icon', async () => {
    const user = userEvent.setup()
    renderJobCard()

    const views = within(screen.getAllByTestId('job-card-publication')[0]).getByTestId(
      'job-card-publication-views',
    )

    await user.hover(views)
    expect(await screen.findByRole('tooltip')).toHaveTextContent(/^Počet zhlédnutí$/)
  })

  it('colors an active publication status with the success emphasis token', () => {
    renderJobCard()

    const [status] = screen.getAllByTestId('job-card-publication-status')
    expect(status).toHaveTextContent('Aktivní')
    expect(status).toHaveClass('tm-text-emotion-success-emphasis')
    expect(status).toHaveClass('tm-uppercase')
    expect(status).toHaveClass('tm-font-medium')
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

  it('calls onEdit and the action from the dropdown menu', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    renderJobCard({
      onEdit,
      actions: [{ id: 'delete', label: 'Smazat nábor', color: 'danger', onClick: onDelete }],
    })

    const editButton = screen.getByRole('button', { name: 'Editovat' })
    expect(editButton).toHaveClass('!tm-font-medium')
    await user.click(editButton)
    expect(onEdit).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTestId('job-card-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Smazat nábor' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCard ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })
})
