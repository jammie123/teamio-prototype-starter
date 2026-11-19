import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV33, type JobCardV33Props } from './JobCardV33'
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

function renderJobCard(props: Partial<JobCardV33Props> = {}) {
  return render(
    <JobCardV33
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{ new: 5, unassessed: 14, inProgress: 6, newOpalcovani: 3, total: 52 }}
      advertisements={[runningSame]}
      note={note}
      onEditJob={vi.fn()}
      now={now}
      {...props}
    />,
  )
}

describe('JobCardV33', () => {
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

  it('puts advertisements beside the pipeline in job-card-main, under the title row', () => {
    renderJobCard()

    const layoutRow = screen.getByTestId('job-card-layout-row')
    const main = screen.getByTestId('job-card-main')
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const people = screen.getByTestId('job-card-people')
    const title = screen.getByTestId('job-card-title')
    const advertisements = screen.getByTestId('job-card-advertisements')

    expect(layoutRow).toContainElement(headingRow)
    expect(layoutRow).toContainElement(main)
    expect(layoutRow.className).toContain('tm-flex-col')
    expect(layoutRow.className).not.toContain('md:tm-flex-row')
    expect(main.className).toContain('tm-flex-row')
    expect(main.className).toContain('tm-flex-wrap')
    expect(main).toContainElement(advertisements)
    expect(main).toContainElement(pipeline)
    expect(main).not.toContainElement(headingRow)
    expect(headingRow).toContainElement(title)
    expect(headingRow).toContainElement(people)
    expect(headingRow).toContainElement(actions)
    expect(headingRow).not.toContainElement(pipeline)
    expect(headingRow).not.toContainElement(advertisements)
    expect(headingRow.className).toContain('tm-flex-row')
    expect(headingRow.className).toContain('tm-items-start')
    expect(headingRow.className).not.toContain('tm-flex-col')
    expect(people.parentElement?.parentElement?.className).toContain('tm-ml-auto')
    expect(pipeline.className).not.toContain('tm-ml-auto')
    expect(title.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title.compareDocumentPosition(advertisements) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      advertisements.compareDocumentPosition(pipeline) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('places assignees, detail, preview, edit and the menu in the title heading row', () => {
    renderJobCard({ onAdvertisementPreviewClick: vi.fn() })

    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const advertisements = screen.getByTestId('job-card-advertisements')
    const people = screen.getByTestId('job-card-people')
    const hiringManagers = screen.getByTestId('job-card-hiring-managers')
    const cluster = screen.getByTestId('job-card-header-actions')
    const preview = screen.getByTestId('job-card-preview-action')
    const edit = screen.getByTestId('job-card-edit-action')
    const menu = screen.getByTestId('job-card-actions-toggle')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')

    expect(people).toContainElement(hiringManagers)
    expect(headingRow).toContainElement(cluster)
    expect(advertisements).not.toContainElement(cluster)
    expect(cluster).toContainElement(detail)
    expect(cluster).toContainElement(preview)
    expect(cluster).toContainElement(edit)
    expect(cluster).toContainElement(menu)
    expect(people.compareDocumentPosition(cluster) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(detail.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(preview.compareDocumentPosition(edit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(edit.compareDocumentPosition(menu) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(detail).toHaveTextContent('Detail inzerce')
    expect(preview).toHaveAccessibleName('Náhled inzerátu')
    expect(edit).toHaveAccessibleName('Editovat nábor')
    expect(within(preview).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(within(edit).getByTestId('icon')).toHaveAttribute('data-icon-name', 'edit')
  })

  it('calls the preview and edit handlers from the icon buttons', async () => {
    const user = userEvent.setup()
    const onPreview = vi.fn()
    const onEdit = vi.fn()
    renderJobCard({ onAdvertisementPreviewClick: onPreview, onEditJob: onEdit })

    await user.click(screen.getByTestId('job-card-preview-action'))
    await user.click(screen.getByTestId('job-card-edit-action'))

    expect(onPreview).toHaveBeenCalledOnce()
    expect(onEdit).toHaveBeenCalledOnce()
  })

  it('shows the Náhled tooltip on hover over the eye button', async () => {
    const user = userEvent.setup()
    renderJobCard({ onAdvertisementPreviewClick: vi.fn() })

    await user.hover(screen.getByTestId('job-card-preview-action'))

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Náhled')
  })

  it('shows only edit and the menu, without the preview, on a draft', () => {
    renderJobCard({ status: 'draft', onAdvertisementPreviewClick: vi.fn() })

    expect(screen.queryByTestId('job-card-preview-action')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-edit-action')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-actions-toggle')).toBeInTheDocument()
  })

  it('does not keep advertisements in a side column', () => {
    renderJobCard()

    const advertisements = screen.getByTestId('job-card-advertisements')
    expect(advertisements.className).not.toContain('md:tm-border-l')
    expect(advertisements.className).not.toContain('md:tm-w-[350px]')
    expect(advertisements.className).not.toContain('tm-border-t')
  })

  it('renders the pipeline stats via JobPipeline', () => {
    renderJobCard()

    const stats = within(screen.getByTestId('job-card-pipeline')).getByTestId('job-card-stats')
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Ve hře')).toBeInTheDocument()
    expect(within(stats).getByText('Celkem')).toBeInTheDocument()
    expect(within(stats).getByTestId('job-card-new-candidates')).toHaveTextContent('5 nový')
  })

  it('omits the pipeline without candidates', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-pipeline')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-note')).toBeInTheDocument()
  })

  it('keeps the note under job-card-main after the pipeline', () => {
    renderJobCard()

    const main = screen.getByTestId('job-card-main')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const recruitmentNote = screen.getByTestId('job-card-note')
    const advertisements = screen.getByTestId('job-card-advertisements')

    expect(main).not.toContainElement(recruitmentNote)
    expect(advertisements).not.toContainElement(recruitmentNote)
    expect(recruitmentNote.className).toContain('tm-w-full')
    expect(within(recruitmentNote).getByTestId('note-added-at')).toHaveTextContent(
      `PN · ${note.addedAt}`,
    )
    expect(pipeline.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      advertisements.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('hides the note when its text is empty', () => {
    renderJobCard({ note: { ...note, text: '   ' } })

    expect(screen.getByTestId('job-card-advertisement')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
  })

  it('puts advertisements in a divider row under the title', () => {
    renderJobCard()

    const card = screen.getByTestId('job-card')
    const main = screen.getByTestId('job-card-main')
    const row = screen.getByTestId('job-card-advertisements')
    const heading = screen.getByTestId('job-card-advertisement-heading')
    const advertisement = screen.getByTestId('job-card-advertisement')
    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    const publications = screen.getByTestId('job-card-advertisement-publications')
    const separators = within(row).getAllByRole('separator', { hidden: true })

    expect(card).toHaveAttribute('data-variant', 'v33')
    expect(card.className).toContain('!tm-p-0')
    expect(card.className).not.toContain('!tm-bg-basic/50')
    expect(main).toContainElement(row)
    expect(row.className).toContain('tm-w-full')
    expect(row.className).toContain('tm-flex-row')
    expect(row.className).toContain('tm-flex-wrap')
    expect(row.className).toContain('tm-items-center')
    expect(row.className).not.toContain('md:tm-flex-col')
    expect(row.className).not.toContain('md:tm-w-[350px]')
    expect(row.className).not.toContain('tm-border-t')
    expect(row.className).not.toContain('md:tm-border-l')
    expect(row.className).not.toContain('tm-px-6')
    expect(row.className).not.toContain('tm-bg-emotion-info-background')
    expect(row).toContainElement(heading)
    expect(row).toContainElement(advertisement)
    expect(heading.className).toContain('tm-flex-col')
    expect(heading.className).not.toContain('tm-flex-row')
    expect(heading.className).not.toContain('tm-rounded-full')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent('Běží')
    expect(screen.getByTestId('job-card-advertisement-heading-label').className).toContain(
      'tm-font-medium',
    )
    expect(screen.getByTestId('job-card-advertisement-heading-label').className).not.toContain(
      'tm-font-semibold',
    )
    expect(heading).toHaveTextContent('Běží')
    expect(heading).toHaveTextContent('1. 1. – 1. 2. 2026')
    expect(
      screen.getByTestId('job-card-advertisement-heading-label').compareDocumentPosition(
        screen.getByTestId('job-card-advertisement-heading-date'),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(advertisement).not.toContainElement(heading)
    expect(publications.className).toContain('tm-w-[240px]')
    expect(publications.className).toContain('tm-shrink-0')
    expect(publications.className).not.toContain('tm-w-full')
    expect(screen.getByTestId('job-card-advertisement-view-count')).toHaveTextContent(/^3\s*170$/)
    expect(views).toHaveTextContent('zhlédnutí')
    expect(views).not.toHaveTextContent('Zhlédnuto')
    expect(row).not.toContainElement(screen.getByTestId('job-card-advertisement-detail-action'))
    expect(separators).toHaveLength(2)
    expect(heading.compareDocumentPosition(advertisement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(advertisement.compareDocumentPosition(views) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByTestId('job-card-advertisement-action')).not.toBeInTheDocument()
  })

  it('separates stacked advertisements with a top border after the first', () => {
    renderJobCard({ advertisements: [runningSame, { ...endingSoon, id: 'ad-2' }] })

    const advertisements = screen.getAllByTestId('job-card-advertisement')
    expect(advertisements[0].className).not.toContain('tm-border-t')
    expect(advertisements[1].className).toContain('tm-border-t')
  })

  it('renders a compact draft row with last change and a primary Dokončit button', async () => {
    const user = userEvent.setup()
    const onCompleteDraft = vi.fn()
    renderJobCard({
      status: 'draft',
      lastChanged: '22. 8. 2026',
      onCompleteDraft,
    })

    const cluster = screen.getByTestId('job-card-main').parentElement
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const lastChanged = screen.getByTestId('job-card-last-changed')
    const complete = screen.getByTestId('job-card-complete-draft')
    const people = screen.getByTestId('job-card-people')
    const meta = screen.getByTestId('job-card-draft-meta')

    expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-pipeline')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
    expect(cluster?.className).toContain('tm-py-3')
    expect(cluster?.className).toContain('tm-items-center')
    expect(cluster?.className).not.toContain('tm-py-6')
    expect(headingRow.className).toContain('tm-items-center')
    expect(headingRow.className).not.toContain('tm-pr-')
    expect(headingRow).toContainElement(people)
    expect(headingRow).toContainElement(screen.getByTestId('job-card-header-actions'))
    expect(headingRow).not.toContainElement(meta)
    expect(lastChanged).toHaveTextContent('Poslední změna')
    expect(lastChanged).toHaveTextContent('22. 8. 2026')
    expect(lastChanged).not.toHaveTextContent('Poslední změna:')
    expect(lastChanged.className).toContain('tm-flex-col')
    expect(lastChanged.className).toContain('tm-text-secondary-default')
    expect(complete).toHaveTextContent('Dokončit')
    expect(complete).not.toHaveTextContent('Dokončit nábor')
    expect(complete).toHaveClass('tm-bg-action-primary-default')
    expect(meta.className).toContain('tm-w-full')
    expect(meta.className).toContain('md:tm-w-[350px]')
    expect(meta.className).toContain('tm-ml-4')
    expect(meta.className).toContain('tm-justify-between')
    expect(meta.className).toContain('tm-border-t')
    expect(meta.className).toContain('md:tm-border-l')
    expect(meta.className).toContain('md:tm-border-t-0')
    expect(people.compareDocumentPosition(meta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(lastChanged.compareDocumentPosition(complete) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.click(complete)
    expect(onCompleteDraft).toHaveBeenCalledOnce()
  })

  it('keeps Dokončit on a draft when lastChanged is missing', () => {
    renderJobCard({ status: 'draft' })

    expect(screen.queryByTestId('job-card-last-changed')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-complete-draft')).toHaveTextContent('Dokončit')
  })

  it('offers a primary Znovuvystavit button on an ended advertisement', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [ended], onExtendAndRepublish })

    const republish = screen.getByTestId('job-card-advertisement-republish')
    const cluster = screen.getByTestId('job-card-header-actions')
    expect(cluster).toContainElement(republish)
    expect(screen.getByTestId('job-card-advertisements')).not.toContainElement(republish)
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
    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'ended')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent('Ukončeno')
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent('Ukončeno')
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      '1. 1. – 1. 2. 2026',
    )
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('shows ending-soon status without a warning background', () => {
    renderJobCard({ advertisements: [endingSoon] })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Končí za 3 dny',
    )
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent('Končí za 3 dny')
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      '1. 9. – 30. 9. 2026',
    )
    expect(advertisement).toHaveAttribute('data-kind', 'endingSoon')
    expect(advertisement.className).not.toContain('tm-bg-emotion-warning-background/80')
    expect(advertisement.className).not.toMatch(/tm-bg-/)
    const prolong = screen.getByTestId('job-card-disappearance-prolong')
    const cluster = screen.getByTestId('job-card-header-actions')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')
    expect(cluster).toContainElement(prolong)
    expect(cluster).toContainElement(detail)
    expect(screen.getByTestId('job-card-advertisements')).not.toContainElement(prolong)
    expect(prolong).toHaveTextContent('Prodloužit')
    expect(prolong).toHaveClass('tm-bg-action-primary-default', '!tm-min-h-7')
    expect(detail.compareDocumentPosition(prolong) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
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
    expect(screen.queryByText('Detail inzerce')).not.toBeInTheDocument()
    expect(screen.queryByText('Přehled')).not.toBeInTheDocument()
    expect(column).not.toContainElement(screen.getByTestId('job-card-header-actions'))

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
    expect(screen.queryByText('Detail inzerce')).not.toBeInTheDocument()
    expect(screen.queryByText('Přehled')).not.toBeInTheDocument()
  })

  it('always shows the advertisement heading label', () => {
    renderJobCard()

    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent('Běží')
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
})
