import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardNew } from './JobCardNew'
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

function renderJobCardNew(props: Partial<Parameters<typeof JobCardNew>[0]> = {}) {
  return render(
    <JobCardNew
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ unassessed: 14, inProgress: 6, total: 52 }}
      advertisements={[advertisement]}
      {...props}
    />,
  )
}

describe('JobCardNew', () => {
  it('renders title and owner without a header view count', () => {
    renderJobCardNew()

    const title = screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('!tm-text-base', '!tm-font-medium')
    expect(screen.getByTestId('job-card-owner')).toHaveTextContent('PN')
    expect(screen.getByTestId('job-card-people')).toHaveAttribute(
      'aria-label',
      'Petra Nováková (Náborář)',
    )
    expect(screen.queryByTestId('job-card-hiring-managers')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-total-views')).not.toBeInTheDocument()
  })

  it('places avatars, the status button and the tertiary actions menu on the title row', () => {
    renderJobCardNew({ onEditJob: vi.fn() })

    const titleRow = screen.getByTestId('job-card-title-row')
    const recruitment = screen.getByTestId('job-card-recruitment')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const people = screen.getByTestId('job-card-people')
    const status = screen.getByTestId('job-card-status')
    const title = screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })

    expect(titleRow).toHaveClass('tm-items-center')
    expect(titleRow).toContainElement(title)
    expect(titleRow).toContainElement(people)
    expect(titleRow).toContainElement(status)
    expect(titleRow).toContainElement(actions)
    expect(recruitment).toContainElement(titleRow)
    expect(
      people.compareDocumentPosition(status) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      status.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(actions).toHaveClass('tm-bg-transparent', 'tm-border-transparent')
    expect(status).toHaveTextContent('Zveřejněný')
    expect(status).toHaveClass('tm-bg-emotion-success-background', 'tm-text-emotion-success-emphasis')
    expect(status).toHaveClass('tm-gap-2', 'tm-font-medium')
    expect(screen.getByTestId('job-card-status-dot')).toHaveClass('tm-rounded-full', 'tm-bg-current')
    expect(status.querySelector('[data-icon-name="chevron-down"] svg')).toHaveAttribute(
      'stroke-width',
      '2.75',
    )
  })

  it('renders hiring managers next to the owner when provided', () => {
    renderJobCardNew({
      hiringManagers: ['Lukáš Procházka', 'Hana Veselá'],
    })

    expect(screen.getByTestId('job-card-owner')).toHaveTextContent('PN')
    expect(screen.getByTestId('job-card-hiring-manager-0')).toHaveTextContent('LP')
    expect(screen.getByTestId('job-card-hiring-manager-1')).toHaveTextContent('HV')
    expect(screen.getByTestId('job-card-hiring-managers')).not.toHaveTextContent('Lukáš Procházka')
  })

  it('shows names and roles in a hover dropdown on the people avatars', async () => {
    const user = userEvent.setup()
    renderJobCardNew({
      hiringManagers: ['Lukáš Procházka'],
    })

    await user.hover(screen.getByTestId('job-card-people'))
    const dropdown = await screen.findByTestId('job-card-people-dropdown')
    expect(dropdown).toHaveTextContent('Petra Nováková')
    expect(dropdown).toHaveTextContent('Náborář')
    expect(dropdown).toHaveTextContent('Lukáš Procházka')
    expect(dropdown).toHaveTextContent('Hiring manager')
  })

  it('hides hiring managers when the list is empty', () => {
    renderJobCardNew({ hiringManagers: [] })

    expect(screen.queryByTestId('job-card-hiring-managers')).not.toBeInTheDocument()
  })

  it('shows a colored status button for every recruitment state', () => {
    const { unmount } = renderJobCardNew()
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Zveřejněný')
    expect(screen.getByTestId('job-card-status')).toHaveClass('tm-bg-emotion-success-background')

    unmount()
    renderJobCardNew({ status: 'unpublished' })
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Nezveřejněný')
    expect(screen.getByTestId('job-card-status')).toHaveClass('tm-bg-emotion-warning-background', 'tm-text-emotion-warning-emphasis')
  })

  it('lets the recruiter change the job status from the status button menu', async () => {
    const user = userEvent.setup()
    const onStatusChange = vi.fn()
    renderJobCardNew({ onStatusChange })

    await user.click(screen.getByTestId('job-card-status'))
    const menu = await screen.findByTestId('job-card-status-menu')
    expect(menu).toHaveClass('tm-w-[22rem]')
    expect(menu).toHaveTextContent('Aktivní')
    expect(menu).toHaveTextContent('Nábor je otevřený pro práci s kandidáty.')
    expect(menu).not.toHaveTextContent('s neběžící inzercí')
    expect(screen.getByTestId('job-card-status-insertion-hint')).toHaveTextContent(
      'Aktivní nábor může mít zviditelnění',
    )
    expect(screen.getByRole('option', { name: /Aktivní/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('option', { name: /Aktivní/ })).not.toHaveClass('!tm-pl-6')
    expect(screen.getByRole('option', { name: /Archivní/ })).not.toHaveClass('!tm-pl-6')
    expect(screen.queryByRole('option', { name: /Zveřejněný/ })).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-status-visibility')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Zveřejněný/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Nezveřejněný/ })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: /Interní/ })).not.toBeChecked()
    expect(menu).toHaveTextContent('Zveřejněný')
    expect(menu).toHaveTextContent('Viditelný skrze job portály a další místa.')
    expect(menu).toHaveTextContent('Nezveřejněný')
    expect(menu).toHaveTextContent('Není vidět skrze job portály, je dostupný skrze interní link.')
    expect(menu).toHaveTextContent('Interní')
    expect(menu).toHaveTextContent('Viditelný pouze skrze referál.')
    expect(menu).toHaveTextContent('Archivní')
    expect(menu).toHaveTextContent('Nábor už je uzavřený a už s ním nechcete pracovat.')
    expect(screen.queryByText('Ukončený')).not.toBeInTheDocument()
    expect(screen.queryByText('Obsazený')).not.toBeInTheDocument()
    expect(screen.queryByText('Draft')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-status-option-dot-active')).toHaveClass(
      'tm-bg-emotion-info-emphasis',
    )
    expect(screen.getByTestId('job-card-status-option-dot-published')).toHaveClass(
      'tm-rounded-full',
      'tm-bg-emotion-success-emphasis',
    )
    expect(screen.getByTestId('job-card-status-option-dot-unpublished')).toHaveClass(
      'tm-bg-emotion-warning-emphasis',
    )
    expect(screen.getByTestId('job-card-status-option-dot-internal')).toHaveClass(
      'tm-bg-emotion-promotion-emphasis',
    )
    expect(screen.getByTestId('job-card-status-option-dot-archived')).toHaveClass(
      'tm-bg-emotion-danger-emphasis',
    )

    await user.click(screen.getByRole('radio', { name: /Interní/ }))
    expect(onStatusChange).toHaveBeenCalledWith('internal')
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Interní')
    expect(screen.getByTestId('job-card-status')).toHaveClass(
      'tm-bg-emotion-promotion-background',
      'tm-text-emotion-promotion-emphasis',
    )
  })

  it('reveals visibility radios only after the recruiter clicks Aktivní', async () => {
    const user = userEvent.setup()
    const onStatusChange = vi.fn()
    renderJobCardNew({ status: 'archived', onStatusChange })

    await user.click(screen.getByTestId('job-card-status'))
    const menu = await screen.findByTestId('job-card-status-menu')
    expect(screen.queryByTestId('job-card-status-visibility')).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /Zveřejněný/ })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Aktivní/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    await user.click(screen.getByRole('option', { name: /Aktivní/ }))
    expect(onStatusChange).toHaveBeenCalledWith('active')
    expect(await screen.findByTestId('job-card-status-visibility')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Zveřejněný/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Aktivní/ })).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toBeInTheDocument()
  })

  it('uses blue, green, orange, grey and red for the five recruitment statuses', () => {
    const { unmount } = renderJobCardNew({ status: 'active' })
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Aktivní')
    expect(screen.getByTestId('job-card-status')).toHaveClass(
      'tm-bg-emotion-info-background',
      'tm-text-emotion-info-emphasis',
    )

    unmount()
    const published = renderJobCardNew({ status: 'published' })
    expect(screen.getByTestId('job-card-status')).toHaveClass('tm-bg-emotion-success-background')

    published.unmount()
    const unpublished = renderJobCardNew({ status: 'unpublished' })
    expect(screen.getByTestId('job-card-status')).toHaveClass('tm-bg-emotion-warning-background')

    unpublished.unmount()
    const internal = renderJobCardNew({ status: 'internal' })
    expect(screen.getByTestId('job-card-status')).toHaveClass(
      'tm-bg-emotion-promotion-background',
      'tm-text-emotion-promotion-emphasis',
    )

    internal.unmount()
    renderJobCardNew({ status: 'archived' })
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Archivní')
    expect(screen.getByTestId('job-card-status')).toHaveClass(
      'tm-bg-emotion-danger-background',
      'tm-text-emotion-danger-emphasis',
    )
  })

  it('renders candidate counts with labels stacked under the numbers', () => {
    renderJobCardNew({ onCandidatesClick: vi.fn() })

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveClass('tm-gap-0')
    expect(stats).toHaveTextContent('0Nový')
    expect(stats).toHaveTextContent('14Neposouzení')
    expect(stats).toHaveTextContent('6Ve hře')
    expect(stats).toHaveTextContent('52Celkem')

    const newStat = screen.getByTestId('job-card-stat-new')
    expect(newStat.children[0]).toHaveTextContent('0')
    expect(newStat.children[1]).toHaveTextContent('Nový')
    expect(newStat.children[0]).toHaveClass('tm-text-primary-default')
    expect(newStat.children[0]).not.toHaveClass('tm-text-teamio-pink')

    const unassessed = screen.getByTestId('job-card-stat-unassessed')
    expect(unassessed).toHaveClass(
      'tm-flex-col',
      'tm-items-start',
      'tm-text-left',
      'tm-shrink-0',
      'tm-px-6',
    )
    expect(unassessed).not.toHaveClass('tm-items-baseline')
    expect(unassessed.children[0]).toHaveTextContent('14')
    expect(unassessed.children[1]).toHaveTextContent('Neposouzení')
    expect(unassessed.children[1]).toHaveClass('tm-whitespace-nowrap')
    expect(unassessed.children[0]).toHaveClass('tm-group-hover:tm-text-action-link-active')
    expect(unassessed.children[1]).toHaveClass('tm-group-hover:tm-text-action-link-active')
  })

  it('makes the candidate stats clickable only when a handler is passed', async () => {
    const user = userEvent.setup()
    const onCandidatesClick = vi.fn()
    const { unmount } = renderJobCardNew()

    expect(screen.queryByTestId('job-card-stat-unassessed')).not.toBeInTheDocument()

    unmount()
    renderJobCardNew({ onCandidatesClick })

    await user.click(screen.getByTestId('job-card-stat-new'))
    expect(onCandidatesClick).toHaveBeenCalledWith('new')

    await user.click(screen.getByTestId('job-card-stat-unassessed'))
    expect(onCandidatesClick).toHaveBeenCalledWith('unassessed')

    await user.click(screen.getByTestId('job-card-stat-total'))
    expect(onCandidatesClick).toHaveBeenLastCalledWith('total')
  })

  it('omits the stats block when no candidates are passed', () => {
    renderJobCardNew({ candidates: undefined })

    expect(screen.queryByTestId('job-card-stats')).not.toBeInTheDocument()
  })

  it('shows Nový as its own category and highlights the count in pink when there are new candidates', () => {
    renderJobCardNew({
      candidates: { new: 5, unassessed: 14, inProgress: 6, total: 52 },
      onCandidatesClick: vi.fn(),
    })

    const newStat = screen.getByTestId('job-card-stat-new')
    expect(newStat.children[0]).toHaveTextContent('5')
    expect(newStat.children[1]).toHaveTextContent('Nový')
    expect(newStat.children[0]).toHaveClass('tm-text-teamio-pink')
    expect(newStat.children[1]).toHaveClass('tm-text-secondary-default')
    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()
    expect(screen.queryByText(/nových/)).not.toBeInTheDocument()
  })

  it('uses two columns with a wider recruitment stack and the advertisement on the right', () => {
    renderJobCardNew()

    const layout = screen.getByTestId('job-card-layout')
    const recruitment = screen.getByTestId('job-card-recruitment')
    const candidates = screen.getByTestId('job-card-candidates')
    const advertisements = screen.getByTestId('job-card-advertisements')

    expect(layout).toHaveClass('tm-flex', 'md:tm-flex-row', 'md:tm-items-start')
    expect(recruitment).toContainElement(screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' }))
    expect(recruitment).toContainElement(screen.getByTestId('job-card-title-row'))
    expect(recruitment).toContainElement(candidates)
    expect(recruitment).toHaveClass('md:tm-flex-1')
    expect(candidates).toHaveClass(
      'tm-inline-flex',
      'tm-overflow-hidden',
      'tm-rounded',
      'tm-border',
      'tm-border-solid',
      'tm-border-secondary',
      'tm-bg-cover-light',
      'tm-px-3',
      'tm-py-2',
    )
    expect(candidates).not.toHaveClass('tm-border-t', 'tm-pt-2')
    expect(advertisements).toHaveClass(
      'md:tm-w-2/5',
      'md:tm-flex-none',
      'md:tm-border-l',
      'md:tm-border-secondary',
    )
    expect(layout).toContainElement(advertisements)
    expect(recruitment).not.toContainElement(advertisements)
  })

  it('keeps the advertisement column for every recruitment status', () => {
    renderJobCardNew({ status: 'active', onEditJob: vi.fn() })

    const titleRow = screen.getByTestId('job-card-title-row')
    expect(screen.getByTestId('job-card-advertisements')).toBeInTheDocument()
    expect(titleRow).toContainElement(screen.getByTestId('job-card-actions-toggle'))
    expect(titleRow).toContainElement(screen.getByTestId('job-card-people'))
    expect(titleRow).toContainElement(screen.getByTestId('job-card-status'))
  })

  it('renders a single advertisement without a title or switcher', () => {
    renderJobCardNew()

    const card = screen.getByTestId('job-card-advertisement')
    expect(card).not.toHaveClass('tm-rounded', 'tm-border', 'tm-border-secondary')
    expect(card).toHaveClass('tm-gap-4')
    expect(screen.getByTestId('job-card-advertisement-running-heading').parentElement).toHaveClass(
      'tm-gap-0.5',
    )
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(screen.queryByTestId('job-card-advertisement-switcher')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    expect(screen.queryByText('Aktuální inzerát')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent('Běží')
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toBeInTheDocument()
  })

  it('does not render an advertisement title when the advertisement has none', () => {
    renderJobCardNew({
      advertisements: [
        {
          id: 'ad-1',
          publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026' }],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-switcher')).not.toBeInTheDocument()
  })

  it('hides the advertisement title when every portal has ended', () => {
    renderJobCardNew({
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

    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    const ended = screen.getByTestId('job-card-publication-ended-heading')
    expect(ended).toHaveTextContent('Ukončeno')
    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
  })

  it('shows aggregated views under the job portals with a more-statistics link', async () => {
    const user = userEvent.setup()
    const onViewStatisticsClick = vi.fn()
    renderJobCardNew({ onViewStatisticsClick })

    const card = screen.getByTestId('job-card-advertisement')
    const publications = screen.getByTestId('job-card-advertisement-publications')
    const meta = screen.getByTestId('job-card-advertisement-meta')
    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    const moreStats = screen.getByTestId('job-card-advertisement-more-stats')

    expect(views).toHaveTextContent(/1\s284 zhlédnutí/)
    expect(meta).toHaveClass('tm-flex', 'tm-items-center', 'tm-text-13', 'tm-text-secondary-default')
    expect(meta).not.toHaveClass('tm-flex-col')
    expect(screen.getByTestId('job-card-advertisement-meta-separator')).toHaveTextContent('·')
    expect(screen.queryByTestId('job-card-publication-views')).not.toBeInTheDocument()
    expect(within(views).queryByTestId('icon')).not.toBeInTheDocument()
    expect(card).toContainElement(views)
    expect(card).toContainElement(moreStats)
    expect(
      publications.compareDocumentPosition(views) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(views.compareDocumentPosition(moreStats) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(moreStats).toHaveTextContent('Zobrazit více statistik')
    expect(moreStats).toHaveClass('tm-text-13', 'tm-text-secondary-default')
    expect(within(moreStats).getByTestId('icon')).toHaveAttribute('data-icon-name', 'bar-chart')

    await user.click(moreStats)
    expect(onViewStatisticsClick).toHaveBeenCalledTimes(1)
  })

  it('omits aggregated views when no publication has a view count', () => {
    renderJobCardNew({
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' }],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-meta-separator')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-more-stats')).toBeInTheDocument()
  })

  it('shows a wrap-around switcher and only the selected advertisement when the job has several ads', async () => {
    const user = userEvent.setup()
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

    renderJobCardNew({
      advertisements: [advertisement, secondAdvertisement, thirdAdvertisement],
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Aktuální inzerát')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/3')
    expect(screen.getAllByTestId('job-card-publication-channel').map((portal) => portal.textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])

    await user.click(screen.getByTestId('job-card-advertisement-switcher-next'))
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Inzerát pro brigádníky')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('2/3')
    expect(screen.getByTestId('job-card-publication-channel')).toHaveTextContent('Jobs.cz')
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(1)

    await user.click(screen.getByTestId('job-card-advertisement-switcher-next'))
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Inzerát pro studenty')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('3/3')

    await user.click(screen.getByTestId('job-card-advertisement-switcher-next'))
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Aktuální inzerát')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/3')

    await user.click(screen.getByTestId('job-card-advertisement-switcher-prev'))
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Inzerát pro studenty')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('3/3')
  })

  it('shows a tooltip on the switcher arrows to reveal the next or previous advertisement', async () => {
    const user = userEvent.setup()
    renderJobCardNew({
      advertisements: [
        advertisement,
        { id: 'ad-2', title: 'Inzerát pro brigádníky', publications: [{ id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.' }] },
      ],
    })

    const next = screen.getByRole('button', { name: 'Zobrazit další inzerát' })
    const prev = screen.getByRole('button', { name: 'Zobrazit předchozí inzerát' })
    expect(next).toBeInTheDocument()
    expect(prev).toBeInTheDocument()

    await user.hover(next)
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Zobrazit další inzerát')
  })

  it('falls back to a numbered advertisement title when a switched ad has none', () => {
    renderJobCardNew({
      advertisements: [
        { id: 'ad-1', publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 8.' }] },
        { id: 'ad-2', title: 'Inzerát pro brigádníky', publications: [{ id: 'jobs-2', channel: 'Prace.cz', startDate: '2. 8.' }] },
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Inzerát 1')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')
  })

  it('keeps unpublished advertisements ended while still switching between them', async () => {
    const user = userEvent.setup()
    renderJobCardNew({
      status: 'unpublished',
      advertisements: [
        advertisement,
        { id: 'ad-2', title: 'Inzerát pro brigádníky', publications: [{ id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.' }] },
      ],
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)
    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-ended-heading')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Aktuální inzerát')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')

    await user.click(screen.getByTestId('job-card-advertisement-switcher-next'))
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Inzerát pro brigádníky')
    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-ended-heading')).toBeInTheDocument()
  })

  it('puts Běží and the until-date on the heading when every running portal shares an end date', () => {
    renderJobCardNew({
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
    expect(heading.textContent).toBe('Běží 12. 7. – 30. 9. 2026')
    expect(heading).toHaveClass('tm-text-emotion-success-emphasis', 'tm-text-sm', 'tm-font-medium')
    expect(heading).not.toHaveClass('tm-text-emotion-warning-emphasis')
    expect(heading).not.toHaveClass('tm-font-semibold')

    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals.map((portal) => within(portal).getByTestId('job-card-publication-channel').textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    portals.forEach((portal) => {
      expect(portal).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-primary-default')
      expect(within(portal).getByTestId('job-card-publication-channel')).toHaveClass('tm-font-medium')
    })
    expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toHaveClass(
      'tm-flex-row',
    )
  })

  it('keeps Běží without a date and lists until-dates on date rows when they differ', () => {
    renderJobCardNew()

    const heading = screen.getByTestId('job-card-advertisement-running-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(heading).not.toHaveTextContent('do')
    expect(heading).toHaveClass('tm-text-emotion-success-emphasis')

    const groups = screen.getAllByTestId('job-card-publication-date-group')
    expect(groups.map((group) => within(group).getByTestId('job-card-publication-dates').textContent)).toEqual([
      '12. 7. – 15. 9. 2026',
      '12. 7. – 30. 9. 2026',
      '12. 7. – 12. 8. 2026',
    ])
    expect(groups.map((group) => within(group).getByTestId('job-card-publication-channel').textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toHaveClass(
      'tm-grid',
      'tm-grid-cols-[auto_auto]',
    )
    expect(screen.queryByTestId('job-card-publication-separator')).not.toBeInTheDocument()
  })

  it('groups portals that share a date onto one row with the date first', () => {
    renderJobCardNew({
      advertisements: [
        {
          id: 'ad-grouped',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
            { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
            { id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7. 2026', endDate: '12. 8. 2026' },
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent('Běží')
    const groups = screen.getAllByTestId('job-card-publication-date-group')
    expect(groups).toHaveLength(2)
    expect(within(groups[0]).getByTestId('job-card-publication-dates').textContent).toBe(
      '12. 7. – 30. 9. 2026',
    )
    expect(
      within(groups[0]).getAllByTestId('job-card-publication-channel').map((channel) => channel.textContent),
    ).toEqual(['Jobs.cz', 'Prace.cz', 'Kariérní stránky'])
    expect(within(groups[1]).getByTestId('job-card-publication-dates').textContent).toBe(
      '12. 7. – 12. 8. 2026',
    )
    expect(within(groups[1]).getByTestId('job-card-publication-channel').textContent).toBe('Atmoskop')
    expect(within(groups[0]).getAllByTestId('job-card-publication-separator')).toHaveLength(2)

    const firstDate = within(groups[0]).getByTestId('job-card-publication-dates')
    const firstPortal = within(groups[0]).getAllByTestId('job-card-publication')[0]
    expect(
      firstDate.compareDocumentPosition(firstPortal) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('warns on the shared heading when every running portal ends within a week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      renderJobCardNew({
        advertisements: [
          {
            id: 'ad-ending-same',
            publications: [
              { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 8. 2026' },
              { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 8. 2026' },
            ],
          },
        ],
      })

      const heading = screen.getByTestId('job-card-advertisement-running-heading')
      expect(heading.textContent).toBe('Končí za 6 dní · 30. 8. 2026')
      expect(heading).toHaveClass(
        'tm-text-emotion-warning-emphasis',
        'tm-font-semibold',
        'tm-text-sm',
      )
      expect(heading).not.toHaveClass('tm-text-emotion-success-emphasis')
      expect(heading).not.toHaveClass('tm-font-medium')
      expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('warns only on the portal whose insertion ends within a week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      renderJobCardNew({
        advertisements: [
          {
            id: 'ad-ending-diff',
            publications: [
              { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 8. 2026' },
              { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
            ],
          },
        ],
      })

      const heading = screen.getByTestId('job-card-advertisement-running-heading')
      expect(heading).toHaveTextContent('Běží')
      expect(heading).not.toHaveTextContent('Končí')
      expect(heading).toHaveClass('tm-text-emotion-success-emphasis', 'tm-font-medium')
      expect(heading).not.toHaveClass('tm-text-emotion-warning-emphasis')
      expect(heading).not.toHaveClass('tm-font-semibold')

      const groups = screen.getAllByTestId('job-card-publication-date-group')
      const jobsDate = within(groups[0]).getByTestId('job-card-publication-dates')
      const praceDate = within(groups[1]).getByTestId('job-card-publication-dates')
      expect(within(groups[0]).getByTestId('job-card-publication-channel')).toHaveTextContent('Jobs.cz')
      expect(jobsDate).toHaveTextContent('Končí za 6 dní · 30. 8. 2026')
      expect(jobsDate).toHaveClass('tm-font-semibold', 'tm-text-emotion-warning-emphasis')
      expect(within(groups[1]).getByTestId('job-card-publication-channel')).toHaveTextContent('Prace.cz')
      expect(praceDate).toHaveTextContent('12. 7. – 30. 9. 2026')
      expect(praceDate).not.toHaveClass('tm-font-semibold')
      expect(praceDate).not.toHaveClass('tm-text-emotion-warning-emphasis')
    } finally {
      vi.useRealTimers()
    }
  })

  it('underlines each portal name with a dotted border', () => {
    renderJobCardNew()

    screen.getAllByTestId('job-card-publication-channel').forEach((channel) => {
      expect(channel).toHaveClass('tm-border-b', 'tm-border-dotted', 'tm-font-medium')
    })
  })

  it('opens a running-portal dropdown on hover with logo, period, stats and preview', async () => {
    const user = userEvent.setup()
    const onPreviewPublication = vi.fn()
    renderJobCardNew({
      onPreviewPublication,
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '12. 7. 2026',
              endDate: '30. 9. 2026',
              viewCount: 1840,
              reactionCount: 42,
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
    expect(dropdown).toHaveTextContent('12. 7. – 30. 9. 2026')
    expect(dropdown).toHaveTextContent('Zhlédnutí')
    expect(dropdown).toHaveTextContent(/1\s840/)
    expect(dropdown).toHaveTextContent('Reakce')
    expect(dropdown).toHaveTextContent('42')
    expect(dropdown).toHaveTextContent('Konverze')
    expect(dropdown).toHaveTextContent(/2,3\s%/)
    expect(dropdown).not.toHaveTextContent('Předvybraní')
    expect(dropdown).not.toHaveTextContent('Hired')
    expect(dropdown).not.toHaveTextContent('Úspěch')
    expect(within(dropdown).queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    fireEvent.click(within(dropdown).getByRole('button', { name: 'Zobrazit náhled' }))
    expect(onPreviewPublication).toHaveBeenCalledTimes(1)
  })

  it('strikes through ended portals and shows Prodloužit in the hover dropdown', async () => {
    const user = userEvent.setup()
    const onExtendPublication = vi.fn()
    renderJobCardNew({
      onExtendPublication,
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              status: 'expired',
              startDate: '12. 6. 2026',
              endDate: '1. 9. 2026',
              viewCount: 2100,
              reactionCount: 30,
            },
          ],
        },
      ],
    })

    const channel = screen.getByTestId('job-card-publication-channel')
    expect(channel).toHaveClass('tm-line-through', 'tm-group-hover:tm-no-underline')

    await user.hover(channel)
    const dropdown = await screen.findByTestId('job-card-publication-dropdown')
    expect(dropdown).toHaveTextContent('Jobs.cz')
    expect(dropdown).toHaveTextContent('12. 6. – 1. 9. 2026')
    expect(within(dropdown).queryByRole('button', { name: 'Zobrazit náhled' })).not.toBeInTheDocument()

    fireEvent.click(within(dropdown).getByRole('button', { name: 'Prodloužit' }))
    expect(onExtendPublication).toHaveBeenCalledTimes(1)
  })

  it('separates multiple portals with a middle dot and omits status dots', () => {
    renderJobCardNew({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026' },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026' },
          ],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-publication-dot')).not.toBeInTheDocument()
    const separators = screen.getAllByTestId('job-card-publication-separator')
    expect(separators).toHaveLength(1)
    expect(separators[0]).toHaveTextContent('·')
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toHaveClass(
      'tm-flex-row',
    )
  })

  it('splits running and ended portals and lifts a shared ended date onto Ukončeno', () => {
    renderJobCardNew({
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
      'Běží 12. 7. – 15. 9. 2026',
    )
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    const ended = screen.getByTestId('job-card-publication-ended-heading')
    expect(ended.textContent).toBe('Ukončeno 1. 9.')
    expect(ended).toHaveClass('tm-text-secondary-default', 'tm-text-sm', 'tm-font-normal')
    expect(ended).not.toHaveClass('tm-text-emotion-warning-emphasis')
    expect(ended.parentElement).toHaveClass('tm-gap-0.5', 'tm-pt-2')
    expect(ended.parentElement).not.toHaveClass('tm-border-t')

    const portals = screen.getAllByTestId('job-card-publication')
    expect(portals).toHaveLength(3)
    expect(within(portals[2]).getByTestId('job-card-publication-channel')).toHaveTextContent('Atmoskop')
    expect(portals[2]).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-secondary-default')
    expect(within(portals[2]).getByTestId('job-card-publication-channel')).toHaveClass(
      'tm-font-normal',
      'tm-text-secondary-default',
    )
    expect(within(portals[2]).getByTestId('job-card-publication-channel')).not.toHaveClass(
      'tm-font-medium',
    )
    expect(within(portals[2]).queryByTestId('job-card-publication-dot')).not.toBeInTheDocument()
    expect(within(portals[2]).queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
  })

  it('lists each ended portal with its date when ended dates differ', () => {
    renderJobCardNew({
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
      'tm-font-normal',
      'tm-text-secondary-default',
    )
    const groups = screen.getAllByTestId('job-card-publication-date-group')
    expect(groups.map((group) => within(group).getByTestId('job-card-publication-dates').textContent)).toEqual([
      '12. 6. – 15. 9. 2026',
      '12. 6. – 30. 9. 2026',
    ])
    expect(screen.getByTestId('job-card-advertisement-ended-publications')).toHaveClass(
      'tm-grid',
      'tm-grid-cols-[auto_auto]',
    )
    expect(screen.queryByTestId('job-card-publication-separator')).not.toBeInTheDocument()
    screen.getAllByTestId('job-card-publication').forEach((portal) => {
      expect(portal).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-secondary-default')
      expect(within(portal).getByTestId('job-card-publication-channel')).toHaveClass(
        'tm-font-normal',
        'tm-text-secondary-default',
      )
      expect(within(portal).getByTestId('job-card-publication-channel')).not.toHaveClass(
        'tm-font-medium',
      )
    })
  })

  it('aligns running and ended portal dates in one shared column when both groups have different dates', () => {
    renderJobCardNew({
      advertisements: [
        {
          id: 'ad-mixed-diff',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
            { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '20. 9. 2026' },
            {
              id: 'atmoskop',
              channel: 'Atmoskop',
              status: 'expired',
              startDate: '12. 7. 2026',
              endDate: '1. 9. 2026',
            },
            {
              id: 'nearby',
              channel: 'Práce za rohem',
              status: 'expired',
              startDate: '12. 7. 2026',
              endDate: '12. 8. 2026',
            },
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-publication-groups')).toHaveClass(
      'tm-grid',
      'tm-grid-cols-[auto_auto]',
    )
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toHaveClass('tm-contents')
    expect(screen.getByTestId('job-card-advertisement-ended-publications')).toHaveClass('tm-contents')
    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveClass('tm-col-span-2')
    const groups = screen.getAllByTestId('job-card-publication-date-group')
    expect(groups).toHaveLength(4)
    expect(
      within(groups[0]).getAllByTestId('job-card-publication-channel').map((channel) => channel.textContent),
    ).toEqual(['Jobs.cz', 'Prace.cz'])
    expect(within(groups[1]).getByTestId('job-card-publication-channel')).toHaveTextContent(
      'Kariérní stránky',
    )
    expect(screen.getAllByTestId('job-card-publication-dates')).toHaveLength(4)
  })

  it('treats every publication as ended when the job is unpublished', () => {
    renderJobCardNew({ status: 'unpublished' })

    expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveTextContent('Ukončeno')
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
  })

  it('shows an empty publication message when the advertisement has no portals', () => {
    renderJobCardNew({
      advertisements: [{ id: 'ad-1', title: 'Aktuální inzerát', publications: [] }],
    })

    expect(screen.queryByTestId('job-card-advertisement-title')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-publications')).toHaveTextContent(
      'Inzerát není nikde vystavený.',
    )
  })

  it('renders an empty state when the job has no advertisement', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCardNew({ advertisements: [], onCreateAdvertisement })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )

    await user.click(screen.getByRole('button', { name: 'Vytvořit inzerát' }))
    expect(onCreateAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('does not render an edit button and still calls the action from the dropdown menu', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderJobCardNew({
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
    renderJobCardNew({
      onEditJob: vi.fn(),
      onDuplicateJob: vi.fn(),
      onInviteColleagues: vi.fn(),
      onTransferJob: vi.fn(),
      onArchiveJob: vi.fn(),
      onEditAdvertisement: vi.fn(),
      onExtendAndRepublish,
      onEndPublication,
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      'Editovat inzerátPopis a znění inzerátu',
      'Prodloužit a znovu vystavit',
      'Ukončit vystavení',
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

    renderJobCardNew({
      advertisements: [advertisement, secondAdvertisement],
      onEditAdvertisement,
      onExtendAndRepublish: vi.fn(),
      onEndPublication: vi.fn(),
      onEditJob: vi.fn(),
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Editovat inzerátPopis a znění inzerátu',
      'Prodloužit a znovu vystavit',
      'Ukončit vystavení',
      'Editovat nábor',
    ])
    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Editovat inzerát Popis a znění inzerátu' }))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('lists Přidat inzerát instead of advertisement actions when the job has none', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCardNew({
      advertisements: [],
      onCreateAdvertisement,
      onEditAdvertisement: vi.fn(),
      onExtendAndRepublish: vi.fn(),
      onEndPublication: vi.fn(),
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

    await user.click(screen.getByRole('option', { name: 'Přidat inzerát' }))
    expect(onCreateAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('omits the action menu when no handler is passed', () => {
    renderJobCardNew()

    expect(screen.queryByTestId('job-card-actions-toggle')).not.toBeInTheDocument()
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardNew ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })
})
