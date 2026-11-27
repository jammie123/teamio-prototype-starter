import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV40, type JobCardV40Props } from './JobCardV40'
import { allPortals } from './fixtures'
import type { JobAdvertisement, JobPublication } from './types'

const now = new Date(2026, 8, 27)
const note = {
  author: 'Petra Nováková',
  text: 'Čekáme na schválení rozpočtu, start až od října',
  addedAt: '12. 9. 2026',
}

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

const endingSoon: JobAdvertisement = {
  id: 'ad-soon',
  publications: ['jobs', 'prace', 'career'].map((id) =>
    portal({ id, channel: id, startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
  ),
}

const ended: JobAdvertisement = {
  id: 'ad-ended',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '1. 8. 2026',
      endDate: '15. 8. 2026',
    }),
  ],
}

/** A job whose only portal expired the given number of days before `now`. */
function expiredAgo(days: number): JobAdvertisement {
  const end = new Date(now)
  end.setDate(end.getDate() - days)

  return {
    id: `ad-expired-${days}`,
    publications: [
      portal({
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '1. 6. 2026',
        endDate: `${end.getDate()}. ${end.getMonth() + 1}. ${end.getFullYear()}`,
      }),
    ],
  }
}

function renderJobCard(props: Partial<JobCardV40Props> = {}) {
  return render(
    <JobCardV40
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{ new: 5, unassessed: 14, inProgress: 6, opalcovani: 3, total: 52 }}
      advertisements={[runningSame]}
      note={note}
      onEditJob={vi.fn()}
      now={now}
      {...props}
    />,
  )
}

describe('JobCardV40', () => {
  it('renders the job title in medium weight', () => {
    renderJobCard()

    const title = screen.getByTestId('job-card-title')
    expect(title.tagName).toBe('H3')
    expect(title).toHaveTextContent('Řidič/ka sk. C ČB PO–PÁ')
    expect(title.className).toContain('tm-text-lg')
    expect(title.className).toContain('tm-font-medium')
    expect(title.className).not.toContain('tm-font-normal')
    expect(title.className).not.toContain('tm-font-semibold')
  })

  it('renders department after the job title in a secondary-color span', () => {
    renderJobCard({ department: 'České Budějovice' })

    const title = screen.getByTestId('job-card-title')
    const separator = screen.getByTestId('job-card-department-separator')
    const department = screen.getByTestId('job-card-department')

    expect(department.tagName).toBe('SPAN')
    expect(department).toHaveTextContent('České Budějovice')
    expect(department.className).toContain('tm-text-secondary-default')
    expect(separator).toHaveTextContent('·')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('job-card-title-heading-row')).toContainElement(department)
    expect(
      title.compareDocumentPosition(separator) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      separator.compareDocumentPosition(department) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('omits department when it is not provided', () => {
    renderJobCard()

    expect(screen.queryByTestId('job-card-department')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-department-separator')).not.toBeInTheDocument()
  })

  it('uses a vertical dots icon for the actions toggle', () => {
    renderJobCard()

    expect(within(screen.getByTestId('job-card-actions-toggle')).getByTestId('icon')).toHaveAttribute(
      'data-icon-name',
      'more-vertical',
    )
  })

  it('puts the menu, title, assignee and pipeline in the left column', () => {
    renderJobCard()

    const layoutRow = screen.getByTestId('job-card-layout-row')
    const main = screen.getByTestId('job-card-main')
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const people = screen.getByTestId('job-card-people')
    const headerActions = screen.getByTestId('job-card-header-actions')
    const preview = screen.getByTestId('job-card-header-advertisement-preview')
    const title = screen.getByTestId('job-card-title')
    const advertisements = screen.getByTestId('job-card-advertisements')

    expect(layoutRow).toContainElement(actions)
    expect(layoutRow).toContainElement(main)
    expect(layoutRow).toContainElement(advertisements)
    expect(actions.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title.compareDocumentPosition(headerActions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      headerActions.compareDocumentPosition(pipeline) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(layoutRow.className).toContain('tm-flex-col')
    expect(layoutRow.className).toContain('md:tm-flex-row')
    expect(main.className).toContain('tm-gap-4')
    expect(main).toContainElement(headingRow)
    expect(main).toContainElement(pipeline)
    expect(main).not.toContainElement(advertisements)
    expect(headingRow).toContainElement(title)
    expect(headingRow).toContainElement(people)
    expect(headingRow).toContainElement(preview)
    expect(headingRow).not.toContainElement(pipeline)
    expect(headingRow.className).toContain('tm-flex-col')
    expect(headingRow.className).toContain('md:tm-flex-row')
    expect(headingRow.className).toContain('md:tm-items-start')
    expect(headerActions.className).toContain('md:tm-ml-auto')
    expect(headerActions).toContainElement(people)
    expect(headerActions).toContainElement(preview)
    expect(preview.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(pipeline.className).toContain('tm-w-full')
    expect(pipeline.className).not.toContain('tm-ml-auto')
    expect(title.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(people.compareDocumentPosition(pipeline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('opens the advertisement preview from the header Náhled capsule', async () => {
    const user = userEvent.setup()
    const onAdvertisementPreviewClick = vi.fn()
    renderJobCard({ onAdvertisementPreviewClick })

    const preview = screen.getByTestId('job-card-header-advertisement-preview')
    await user.hover(preview)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Náhled inzerátu')
    })
    await user.click(preview)
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
  })

  it('places the actions menu to the right of assignees below md and left of the title from md up', () => {
    renderJobCard()

    const main = screen.getByTestId('job-card-main')
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const people = screen.getByTestId('job-card-people')
    const toolbar = screen.getByTestId('job-card-toolbar')
    const cluster = main.parentElement
    const menuWrap = toolbar.lastElementChild

    expect(headingRow).toContainElement(people)
    expect(headingRow).not.toContainElement(actions)
    expect(toolbar).toContainElement(actions)
    expect(cluster).toContainElement(toolbar)
    expect(cluster).toContainElement(main)
    expect(cluster?.className).toContain('tm-flex-col')
    expect(cluster?.className).toContain('md:tm-flex-row')
    expect(cluster?.className).toContain('tm-gap-3')
    expect(cluster?.className).toContain('tm-px-6')
    expect(cluster?.className).toContain('md:tm-gap-2')
    expect(cluster?.className).toContain('md:tm-px-4')
    expect(toolbar.className).toContain('tm-justify-end')
    expect(toolbar.className).toContain('md:tm-contents')
    expect(main.className).toContain('tm-w-full')
    expect(menuWrap?.className).toContain('tm-size-8')
    expect(menuWrap?.className).toContain('tm-self-start')
    expect(menuWrap?.className).toContain('md:tm--top-1')
    expect(toolbar.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the pipeline stats via JobPipeline', () => {
    renderJobCard()

    const stats = within(screen.getByTestId('job-card-pipeline')).getByTestId('job-card-stats')
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Ve hře')).toBeInTheDocument()
    expect(within(stats).getByText('Celkem')).toBeInTheDocument()
    expect(within(stats).getByTestId('job-card-new-candidates')).toHaveTextContent('5')
  })

  it('omits the pipeline without candidates', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-pipeline')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-note')).toBeInTheDocument()
  })

  it('keeps the note in the left column under the pipeline', () => {
    renderJobCard()

    const main = screen.getByTestId('job-card-main')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const recruitmentNote = screen.getByTestId('job-card-note')
    const advertisements = screen.getByTestId('job-card-advertisements')

    expect(main).toContainElement(recruitmentNote)
    expect(advertisements).not.toContainElement(recruitmentNote)
    expect(recruitmentNote.className).toContain('tm-w-full')
    expect(within(recruitmentNote).getByTestId('note-added-at')).toHaveTextContent(
      `PN · ${note.addedAt}`,
    )
    expect(pipeline.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      recruitmentNote.compareDocumentPosition(advertisements) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('hides the note when its text is empty', () => {
    renderJobCard({ note: { ...note, text: '   ' } })

    expect(screen.getByTestId('job-card-advertisement')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
  })

  it('puts compact advertisements in a bordered right column', () => {
    renderJobCard()

    const card = screen.getByTestId('job-card')
    const layoutRow = screen.getByTestId('job-card-layout-row')
    const main = screen.getByTestId('job-card-main')
    const column = screen.getByTestId('job-card-advertisements')
    const advertisement = screen.getByTestId('job-card-advertisement')

    expect(card).toHaveAttribute('data-variant', 'v40')
    expect(card.className).toContain('!tm-p-0')
    expect(card.className).not.toContain('!tm-bg-basic/50')
    expect(layoutRow).toContainElement(column)
    expect(main).not.toContainElement(column)
    expect(column.className).toContain('tm-w-full')
    expect(column.className).toContain('tm-flex-col')
    expect(column.className).toContain('tm-items-stretch')
    expect(column.className).not.toContain('tm-flex-row')
    expect(column.className).toContain('md:tm-w-[450px]')
    expect(column.className).not.toContain('md:tm-w-[350px]')
    expect(column.className).toContain('tm-border-t')
    expect(column.className).toContain('md:tm-border-t-0')
    expect(column.className).toContain('md:tm-border-l')
    expect(column.className).not.toContain('tm-w-[300px]')
    expect(column.className).toContain('tm-px-6')
    expect(column.className).not.toContain('tm-w-80')
    expect(column.className).not.toContain('tm-bg-emotion-info-background')
    expect(column).toContainElement(advertisement)
    expect(advertisement.className).toContain('tm-w-full')
    expect(advertisement.className).not.toContain('tm-pl-14')
    expect(advertisement.className).not.toContain('tm-border-t')
    expect(screen.queryByTestId('job-card-advertisement-heading-label')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      '1. 1. – 1. 2. 2026',
    )
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
    const publications = within(column).getByTestId('job-card-advertisement-publications')
    expect(publications.className).toContain('tm-hidden')
    expect(publications.className).toContain('md:tm-flex')
    const stats = within(column).getByTestId('job-card-advertisement-stats')
    expect(advertisement).not.toContainElement(stats)
    expect(stats.className).toContain('tm-mt-0')
    expect(stats.className).toContain('tm-w-full')
    expect(stats.className).toContain('tm-pt-4')
    expect(stats.className).toContain('md:tm-mt-auto')
    expect(stats.className).not.toContain('tm-pt-2')
    expect(stats).toHaveTextContent('Přehled')
    expect(
      advertisement.compareDocumentPosition(stats) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(screen.queryByTestId('job-card-advertisement-action')).not.toBeInTheDocument()
  })

  it('separates stacked advertisements with a top border after the first', () => {
    renderJobCard({ advertisements: [runningSame, { ...endingSoon, id: 'ad-2' }] })

    const advertisements = screen.getAllByTestId('job-card-advertisement')
    expect(advertisements[0].className).not.toContain('tm-border-t')
    expect(advertisements[1].className).toContain('tm-border-t')
  })

  it('renders draft last-change meta under the title without a Dokončit link', () => {
    renderJobCard({
      status: 'draft',
      lastChanged: '22. 8. 2026',
    })

    const cluster = screen.getByTestId('job-card-main').parentElement
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const title = screen.getByTestId('job-card-title')
    const lastChanged = screen.getByTestId('job-card-last-changed')
    const people = screen.getByTestId('job-card-people')
    const meta = screen.getByTestId('job-card-draft-meta')

    expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-pipeline')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-complete-draft')).not.toBeInTheDocument()
    expect(cluster?.className).toContain('tm-py-3')
    expect(cluster?.className).not.toContain('tm-py-6')
    expect(headingRow).toContainElement(people)
    expect(headingRow).toContainElement(screen.getByTestId('job-card-header-advertisement-preview'))
    expect(headingRow).toContainElement(meta)
    expect(title.compareDocumentPosition(meta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(lastChanged).toHaveTextContent('Poslední změna')
    expect(lastChanged).toHaveTextContent('22. 8. 2026')
    expect(lastChanged).not.toHaveTextContent('Poslední změna:')
    expect(lastChanged.className).toContain('tm-flex-row')
    expect(lastChanged.className).not.toContain('tm-flex-col')
    expect(lastChanged.className).toContain('tm-text-secondary-default')
    expect(meta.className).not.toContain('md:tm-w-[450px]')
  })

  it('omits draft meta when lastChanged is missing', () => {
    renderJobCard({ status: 'draft' })

    expect(screen.queryByTestId('job-card-last-changed')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-draft-meta')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-complete-draft')).not.toBeInTheDocument()
  })

  it('offers a primary Znovuvystavit button on an ended advertisement', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [ended], onExtendAndRepublish })

    const republish = screen.getByTestId('job-card-advertisement-republish')
    expect(republish).toHaveTextContent('Znovuvystavit')
    expect(republish).toHaveClass('tm-bg-action-primary-default')

    await user.click(republish)
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })

  it('uses a translucent white background when the advertisement is ended', () => {
    renderJobCard({ advertisements: [ended] })

    expect(screen.getByTestId('job-card').className).toContain('!tm-bg-basic/50')
    expect(screen.getByTestId('job-card').className).toContain('!tm-shadow-none')
  })

  it('marks every portal as ended for an unpublished job', () => {
    renderJobCard({ status: 'unpublished' })

    expect(screen.getByTestId('job-card').className).toContain('!tm-bg-basic/50')
    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'endedManually')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Ukončené vystavování',
    )
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Ukončené vystavování 1. 1. – 1. 2. 2026',
    )
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-republish')).toBeInTheDocument()
  })

  it('shows ending-soon status without a warning background', () => {
    renderJobCard({ advertisements: [endingSoon] })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Končí za 3 dny',
    )
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Končí za 3 dny 1. 9. – 30. 9. 2026',
    )
    expect(advertisement).toHaveAttribute('data-kind', 'endingSoon')
    expect(advertisement.className).not.toContain('tm-bg-emotion-warning-background/80')
    expect(advertisement.className).not.toMatch(/tm-bg-/)
    const prolong = screen.getByTestId('job-card-disappearance-prolong')
    expect(prolong).toHaveTextContent('Prodloužit')
    expect(prolong).toHaveClass('tm-bg-action-primary-default', '!tm-min-h-7')
    expect(
      screen.getByTestId('job-card-advertisement-detail-action').compareDocumentPosition(prolong) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('calls onExtendAndRepublish from Prodloužit in the stats footer when the advertisement ends soon', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [endingSoon], onExtendAndRepublish })

    await user.click(screen.getByTestId('job-card-disappearance-prolong'))
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })

  it('offers creating an advertisement when the job has none', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    const onAdvertisementPreviewClick = vi.fn()
    renderJobCard({ advertisements: [], onCreateAdvertisement, onAdvertisementPreviewClick })

    const column = screen.getByTestId('job-card-advertisements')
    const empty = within(column).getByTestId('job-card-no-advertisement')

    expect(column.className).not.toContain('tm-bg-emotion-info-background')
    expect(empty).not.toHaveTextContent('Zatím nevystavený inzerát')
    expect(empty).toHaveTextContent('Zatím neinzerujete')
    expect(empty).toHaveTextContent(
      'Zkontrolujte náhled a publikujte. Kandidáti se ozvou rychle.',
    )
    expect(screen.queryByText('Nábor nemá žádný inzerát.')).not.toBeInTheDocument()
    expect(screen.queryByText('Vytvořit inzerát')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-stats')).not.toBeInTheDocument()
    expect(screen.queryByText('Přehled')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Zobrazit náhled' }))
    await user.click(screen.getByRole('button', { name: 'Publikovat' }))
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
    expect(onCreateAdvertisement).toHaveBeenCalledOnce()
  })

  it('shows the unpublished advertisement promo without stats', () => {
    renderJobCard({
      advertisements: [{ id: 'ad-empty', publications: [] }],
      onCreateAdvertisement: vi.fn(),
    })

    const column = screen.getByTestId('job-card-advertisements')
    expect(column.className).not.toContain('tm-bg-emotion-info-background')
    expect(within(column).getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Zatím neinzerujete',
    )
    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'notPublished')
    expect(screen.queryByTestId('job-card-advertisement-stats')).not.toBeInTheDocument()
    expect(screen.queryByText('Přehled')).not.toBeInTheDocument()
  })

  it('hides the heading label while the advertisement runs, also in different periods', () => {
    const { unmount } = renderJobCard()
    expect(screen.queryByTestId('job-card-advertisement-heading-label')).not.toBeInTheDocument()
    unmount()

    renderJobCard({
      advertisements: [
        {
          id: 'ad-diff',
          publications: [
            portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '30. 10. 2026' }),
            portal({ id: 'prace', channel: 'Prace.cz', endDate: '15. 11. 2026' }),
          ],
        },
      ],
    })
    expect(screen.queryByTestId('job-card-advertisement-heading-label')).not.toBeInTheDocument()
  })

  it('shows the heading label when the advertisement ends soon or has ended', () => {
    renderJobCard({ advertisements: [endingSoon] })

    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent('Končí za 3 dny')
  })

  it('keeps the card active and highlighted when the advertisement expired within 7 days', () => {
    renderJobCard({ advertisements: [expiredAgo(5)] })

    const card = screen.getByTestId('job-card')
    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'endedRecently')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Expirováno před 5 dny',
    )
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveAttribute('data-tone', 'warning')
    expect(card.className).not.toContain('!tm-bg-basic/50')
    expect(screen.getByTestId('job-card-advertisement-republish')).toBeInTheDocument()
  })

  it('mutes the card when the advertisement expired more than 7 days ago', () => {
    renderJobCard({ advertisements: [expiredAgo(8)] })

    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'ended')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent('Expirováno')
    expect(screen.getByTestId('job-card').className).toContain('!tm-bg-basic/50')
  })

  it('shows the Archivní pill and ended advertisements for an archived job', () => {
    renderJobCard({ status: 'archived', onCreateAdvertisement: vi.fn() })

    expect(screen.getByTestId('job-card-archived-pill')).toHaveTextContent('Archivní')
    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'endedManually')
    expect(screen.getByTestId('job-card').className).toContain('!tm-bg-basic/50')
  })

  it('hides the advertisement column for a Hiring Manager and keeps preview in the header', () => {
    renderJobCard({
      isHiringManager: true,
      candidates: { toAssess: 4, total: 52 },
    })

    expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-hm-preview')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-preview-action')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-header-advertisement-preview')).toBeInTheDocument()
    const stats = within(screen.getByTestId('job-card-pipeline')).getByTestId('job-card-stats')
    expect(within(stats).getByText('K ohodnocení')).toBeInTheDocument()
    expect(within(stats).getByText('Celkem')).toBeInTheDocument()
  })

  it('collapses a job with every portal into five portals and "+ 4 dalších" in the 450px column', async () => {
    const user = userEvent.setup()
    renderJobCard({ advertisements: [allPortals] })

    const column = screen.getByTestId('job-card-advertisements')
    expect(column.className).toContain('md:tm-w-[450px]')
    expect(within(column).getAllByTestId('job-card-publication')).toHaveLength(5)

    await user.click(within(column).getByTestId('job-card-publications-more'))
    expect(within(column).getAllByTestId('job-card-publication')).toHaveLength(9)
    expect(within(column).getByTestId('job-card-publications-more')).toHaveTextContent('Zobrazit méně')
  })

  it('renders the avatars of people without a border', () => {
    renderJobCard()

    expect(screen.getByTestId('job-card-owner').className).not.toMatch(/(?:^|\s)(?:tm-)?border/)
  })

  it('forwards statistics and detail clicks from AdvertisementStats', async () => {
    const user = userEvent.setup()
    const onViewStatisticsClick = vi.fn()
    const onAdvertisementDetailClick = vi.fn()
    renderJobCard({ onViewStatisticsClick, onAdvertisementDetailClick })

    await user.click(screen.getByTestId('job-card-advertisement-aggregate-views'))
    await user.click(screen.getByTestId('job-card-advertisement-detail-action'))

    expect(onViewStatisticsClick).toHaveBeenCalledOnce()
    expect(onAdvertisementDetailClick).toHaveBeenCalledOnce()
  })

  it('forwards Inzerát and Zvýraznit from the portal hover card while running', async () => {
    const user = userEvent.setup()
    const onAdvertisementPreviewClick = vi.fn()
    const onHighlightAdvertisement = vi.fn()
    renderJobCard({
      onAdvertisementPreviewClick,
      onHighlightAdvertisement,
    })

    await user.hover(screen.getAllByTestId('job-card-publication-channel')[0])
    const dropdown = await screen.findByTestId('job-card-publication-dropdown')
    const actions = within(dropdown).getByTestId('job-card-publication-actions')

    expect(within(actions).queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    fireEvent.click(within(dropdown).getByTestId('job-card-publication-view-advertisement'))
    fireEvent.click(within(actions).getByRole('button', { name: 'Zvýraznit' }))
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
    expect(onHighlightAdvertisement).toHaveBeenCalledOnce()
  })

  it('hides the bulk-select checkbox until isBulkAction is on', () => {
    renderJobCard()

    expect(screen.queryByTestId('job-card-bulk-select')).not.toBeInTheDocument()
  })

  it('shows a left checkbox while bulk editing and reports selection changes', async () => {
    const user = userEvent.setup()
    const onBulkSelectChange = vi.fn()
    renderJobCard({ isBulkAction: true, isSelected: false, onBulkSelectChange })

    const checkbox = screen.getByRole('checkbox', { name: 'Vybrat nábor Řidič/ka sk. C ČB PO–PÁ' })
    const toolbar = screen.getByTestId('job-card-toolbar')
    const main = screen.getByTestId('job-card-main')
    const menu = screen.getByTestId('job-card-actions-toggle')

    expect(checkbox).toHaveAttribute('data-testid', 'job-card-bulk-select')
    expect(checkbox).not.toBeChecked()
    expect(toolbar).toContainElement(checkbox)
    expect(toolbar).toContainElement(menu)
    expect(toolbar.firstElementChild?.className).toContain('tm-mr-auto')
    expect(toolbar.firstElementChild?.className).toContain('md:tm-mr-0')
    expect(
      checkbox.compareDocumentPosition(menu) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      checkbox.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    await user.click(checkbox)
    expect(onBulkSelectChange).toHaveBeenCalledWith(true)
  })

  it('checks the bulk-select checkbox when the job is selected', () => {
    renderJobCard({ isBulkAction: true, isSelected: true })

    expect(screen.getByTestId('job-card-bulk-select')).toBeChecked()
  })

  it('keeps JobMenu on the toolbar while bulk editing is on', () => {
    renderJobCard({ isBulkAction: true })

    const toolbar = screen.getByTestId('job-card-toolbar')
    const checkbox = screen.getByTestId('job-card-bulk-select')
    const menu = screen.getByTestId('job-card-actions-toggle')

    expect(toolbar).toContainElement(checkbox)
    expect(toolbar).toContainElement(menu)
  })
})
