import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV36, type JobCardV36Props } from './JobCardV36'
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
  publications: ['jobs', 'prace', 'career'].map((id) =>
    portal({ id, channel: id, status: 'expired', startDate: '1. 8. 2026', endDate: '15. 8. 2026' }),
  ),
}

/** Every portal expired on 24. 9. 2026, three days before `now`. */
const recentlyEnded: JobAdvertisement = {
  id: 'ad-recent',
  publications: ['jobs', 'prace', 'career'].map((id) =>
    portal({ id, channel: id, status: 'expired', startDate: '1. 9. 2026', endDate: '24. 9. 2026' }),
  ),
}

const mixedEndedPortal: JobAdvertisement = {
  id: 'ad-mixed',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026' }),
    portal({ id: 'prace', channel: 'Prace.cz', status: 'expired', endDate: '15. 8. 2026' }),
  ],
}

function renderJobCard(props: Partial<JobCardV36Props> = {}) {
  return render(
    <JobCardV36
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

describe('JobCardV36', () => {
  it('renders the job title in normal weight', () => {
    renderJobCard()

    const title = screen.getByTestId('job-card-title')
    expect(title.tagName).toBe('H3')
    expect(title).toHaveTextContent('Řidič/ka sk. C ČB PO–PÁ')
    expect(title.className).toContain('tm-text-base')
    expect(title.className).toContain('tm-font-normal')
    expect(title.className).not.toContain('tm-font-semibold')
  })

  it('puts the menu in the left corner with avatars under the title and pipeline on the right', () => {
    renderJobCard()

    const layoutRow = screen.getByTestId('job-card-layout-row')
    const main = screen.getByTestId('job-card-main')
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const headerRow = screen.getByTestId('job-card-header-row')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const people = screen.getByTestId('job-card-people')
    const title = screen.getByTestId('job-card-title')

    expect(layoutRow).toContainElement(actions)
    expect(layoutRow).toContainElement(main)
    expect(main).toContainElement(headerRow)
    expect(headerRow).not.toContainElement(actions)
    expect(headerRow).toContainElement(headingRow)
    expect(headerRow).toContainElement(pipeline)
    expect(headerRow.className).toContain('md:tm-gap-12')
    expect(headingRow).toContainElement(title)
    expect(headingRow).toContainElement(people)
    expect(headingRow).not.toContainElement(pipeline)
    expect(headingRow.className).toContain('tm-flex-col')
    expect(actions.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title.compareDocumentPosition(pipeline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(pipeline.className).toContain('md:tm-ml-auto')
  })

  it('stacks the rows below desktop: menu, title with assignee, pipeline, advertisement, note', () => {
    renderJobCard()

    const layoutRow = screen.getByTestId('job-card-layout-row')
    const headerRow = screen.getByTestId('job-card-header-row')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const recruitmentNote = screen.getByTestId('job-card-note')
    const advertisement = screen.getByTestId('job-card-advertisement')

    expect(layoutRow.className).toContain('tm-flex-col')
    expect(layoutRow.className).toContain('md:tm-flex-row')
    expect(layoutRow.className).toContain('tm-items-stretch')
    expect(screen.getByTestId('job-card-main').className).toContain('tm-w-full')
    expect(screen.getByTestId('job-card-main').className).toContain('tm-min-w-0')
    expect(headerRow.className).toContain('tm-flex-col')
    expect(headerRow.className).toContain('md:tm-flex-row')
    expect(pipeline.className).toContain('tm-w-full')
    expect(actions.parentElement?.className).toContain('tm-self-end')
    expect(actions.parentElement?.className).toContain('md:tm-self-start')

    const rows = [actions, headingRow, pipeline, advertisement, recruitmentNote]
    rows.slice(1).forEach((row, index) => {
      expect(rows[index].compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  it('renders the pipeline stats via JobPipeline', () => {
    renderJobCard()

    const stats = within(screen.getByTestId('job-card-pipeline')).getByTestId('job-card-stats')
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Ve hře')).toBeInTheDocument()
    expect(within(stats).getByText('Opalcovaný')).toBeInTheDocument()
    expect(within(stats).getByText('Celkem')).toBeInTheDocument()
    expect(within(stats).getByTestId('job-card-new-candidates')).toHaveTextContent(/^5$/)
  })

  describe('isHiringManager', () => {
    const hmCandidates = { toAssess: 4, unassessed: 14, inProgress: 6, opalcovani: 3, total: 52 }

    it('shows only K ohodnocení and Celkem in the pipeline', () => {
      renderJobCard({ isHiringManager: true, candidates: hmCandidates })

      const stats = screen.getByTestId('job-card-stats')
      expect(
        Array.from(stats.children).map((child) => child.getAttribute('data-testid')),
      ).toEqual(['job-card-stat-toAssess', 'job-card-stat-total'])
      expect(within(stats).getByText('K ohodnocení')).toBeInTheDocument()
      expect(within(stats).getByText('4')).toBeInTheDocument()
      expect(within(stats).queryByText('Neposouzený')).not.toBeInTheDocument()
      expect(within(stats).queryByText('Ve hře')).not.toBeInTheDocument()
    })

    it('replaces the advertisement block with a Náhled button under the job', async () => {
      const user = userEvent.setup()
      const onAdvertisementPreviewClick = vi.fn()
      renderJobCard({
        isHiringManager: true,
        candidates: hmCandidates,
        onAdvertisementPreviewClick,
      })

      expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
      expect(screen.queryByTestId('job-card-advertisement')).not.toBeInTheDocument()

      const preview = screen.getByTestId('job-card-hm-preview')
      expect(preview.className).toContain('tm-justify-start')
      expect(
        screen
          .getByTestId('job-card-main')
          .contains(preview),
      ).toBe(true)

      await user.click(within(preview).getByRole('button', { name: 'Náhled inzerátu' }))
      expect(onAdvertisementPreviewClick).toHaveBeenCalledTimes(1)
    })

    it('does not show the note', () => {
      renderJobCard({ isHiringManager: true, candidates: hmCandidates })

      expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
    })

    it('keeps the default layout without the prop', () => {
      renderJobCard({ candidates: hmCandidates })

      expect(screen.queryByTestId('job-card-hm-preview')).not.toBeInTheDocument()
      expect(screen.getByTestId('job-card-advertisements')).toBeInTheDocument()
      expect(screen.getByText('Neposouzený')).toBeInTheDocument()
    })
  })

  it('omits the pipeline without candidates', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-pipeline')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-note')).toBeInTheDocument()
  })

  it('shows the note below the advertisement', () => {
    renderJobCard()

    const headerRow = screen.getByTestId('job-card-header-row')
    const recruitmentNote = screen.getByTestId('job-card-note')
    const advertisement = screen.getByTestId('job-card-advertisement')

    expect(screen.getByTestId('job-card-main')).toContainElement(recruitmentNote)
    expect(recruitmentNote.className).toContain('tm-w-full')
    expect(within(recruitmentNote).getByTestId('note-added-at')).toHaveTextContent(
      `PN · ${note.addedAt}`,
    )
    expect(headerRow.compareDocumentPosition(advertisement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(advertisement.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(recruitmentNote.className).toContain('tm-mb-5')
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-pt-4')
  })

  it('hides the note when its text is empty', () => {
    renderJobCard({ note: { ...note, text: '   ' } })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-pt-4')
  })

  it('keeps the top border on every advertisement when a note exists', () => {
    renderJobCard({ advertisements: [runningSame, { ...endingSoon, id: 'ad-2' }] })

    const advertisements = screen.getAllByTestId('job-card-advertisement')
    expect(advertisements[0].className).toContain('tm-border-t')
    expect(advertisements[0].className).toContain('tm-pt-4')
    expect(advertisements[1].className).toContain('tm-border-t')
    expect(advertisements[1].className).toContain('tm-pt-4')
  })

  it('renders the advertisement inside the bottom band', () => {
    renderJobCard()

    const band = screen.getByTestId('job-card-advertisements')
    expect(screen.getByTestId('job-card-main')).toContainElement(band)
    expect(screen.getByTestId('job-card').className).toContain('tm-pb-0')
    expect(band).toContainElement(screen.getByTestId('job-card-advertisement'))
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      '1. 1. – 1. 2. 2026',
    )
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
  })

  it('shows five portals and a "+ N dalších" counter for the all-portals fixture', () => {
    renderJobCard({ advertisements: [allPortals] })

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(5)
    expect(screen.getByTestId('job-card-publications-more')).toHaveTextContent('+ 4 dalších')
  })

  it('calls onExtendAndRepublish from Prodloužit when the advertisement ends soon', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [endingSoon], onExtendAndRepublish })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Končí za 3 dny 1. 9. – 30. 9. 2026',
    )

    await user.click(screen.getByTestId('job-card-disappearance-prolong'))
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })

  it('keeps an active card on a white background with a solid secondary border and light shadow', () => {
    renderJobCard()

    const card = screen.getByTestId('job-card')
    expect(card.className).toContain('tm-bg-basic')
    expect(card.className).toContain('tm-border-secondary')
    expect(card.className).toContain('tm-shadow-xs')
    expect(card.className).not.toContain('tm-bg-cover-default')
    expect(card.className).not.toContain('tm-border-dashed')
    expect(card.className).not.toContain('!tm-shadow-none')
  })

  it('does not mute a running card that still has some ended portals', () => {
    renderJobCard({ advertisements: [mixedEndedPortal] })

    expect(screen.getByTestId('job-card').className).not.toContain('tm-bg-cover-default')
    expect(screen.getByTestId('job-card').className).not.toContain('tm-border-dashed')
  })

  it('mutes an ended advertisement with cover-default background, solid primary border and no shadow', () => {
    renderJobCard({ advertisements: [ended] })

    const card = screen.getByTestId('job-card')
    expect(card.className).toContain('tm-bg-cover-default')
    expect(card.className).toContain('tm-border-primary')
    expect(card.className).not.toContain('tm-border-dashed')
    expect(card.className).toContain('!tm-shadow-none')
  })

  it('marks every portal as ended and offers Prodloužit next to the stats for an unpublished job', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ status: 'unpublished', onExtendAndRepublish })

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Ukončené vystavování')
    expect(heading).toHaveAttribute('data-tone', 'ended')
    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'endedManually')
    expect(screen.getByTestId('job-card').className).toContain('tm-bg-cover-default')
    expect(screen.getByTestId('job-card').className).not.toContain('tm-border-dashed')
    expect(screen.getByTestId('job-card').className).toContain('!tm-shadow-none')

    const prolong = screen.getByTestId('job-card-disappearance-prolong')
    expect(prolong.parentElement).toBe(screen.getByTestId('job-card-advertisement-action'))

    await user.click(prolong)
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })

  it('does not mute a recently expired advertisement and highlights it like "Brzy končí"', () => {
    renderJobCard({ advertisements: [recentlyEnded] })

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Skončilo před 3 dny')
    expect(heading).toHaveAttribute('data-tone', 'warning')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'endedRecently')
    expect(screen.getByTestId('job-card').className).not.toContain('tm-bg-cover-default')
    expect(screen.getByTestId('job-card-disappearance-prolong')).toBeInTheDocument()
  })

  it('shows an archived job muted with ended advertisements and an Archivní pill', () => {
    renderJobCard({ status: 'archived' })

    const pill = screen.getByTestId('job-card-archived-pill')
    expect(pill).toHaveTextContent('Archivní')
    expect(screen.getByTestId('job-card-title-heading-row')).toContainElement(pill)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Skončilo')
    expect(heading).toHaveAttribute('data-tone', 'ended')
    expect(screen.getByTestId('job-card').className).toContain('tm-bg-cover-default')
    expect(screen.getByTestId('job-card').className).toContain('!tm-shadow-none')
  })

  it('does not highlight an archived job even when its advertisement just expired', () => {
    renderJobCard({ status: 'archived', advertisements: [recentlyEnded] })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveAttribute('data-tone', 'ended')
    expect(screen.getByTestId('job-card').className).toContain('tm-bg-cover-default')
  })

  it('shows the presentation unit after the title', () => {
    renderJobCard({ department: 'České Budějovice' })

    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const title = screen.getByTestId('job-card-title')
    const department = screen.getByTestId('job-card-department')

    expect(department).toHaveTextContent('České Budějovice')
    expect(headingRow).toContainElement(department)
    expect(screen.getByTestId('job-card-department-separator')).toHaveTextContent('·')
    expect(title.compareDocumentPosition(department) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('omits the presentation unit without a department', () => {
    renderJobCard()

    expect(screen.queryByTestId('job-card-department')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-department-separator')).not.toBeInTheDocument()
  })

  it('shows no Archivní pill on a published job', () => {
    renderJobCard()

    expect(screen.queryByTestId('job-card-archived-pill')).not.toBeInTheDocument()
  })

  it('hides advertisements for drafts', () => {
    renderJobCard({ status: 'draft' })

    expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
  })

  it('replaces the pipeline with the DraftWidget on a draft', async () => {
    const user = userEvent.setup()
    const onContinueDraft = vi.fn()
    renderJobCard({ status: 'draft', lastChanged: '3. 11. 2026', onContinueDraft })

    expect(screen.queryByTestId('job-card-pipeline')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-header-row')).toContainElement(
      screen.getByTestId('job-card-draft'),
    )
    expect(screen.getByTestId('job-card-last-changed')).toHaveTextContent(
      'Poslední změna: 3. 11. 2026',
    )

    await user.click(screen.getByRole('button', { name: 'Pokračovat' }))
    expect(onContinueDraft).toHaveBeenCalledOnce()
  })

  it.each([
    ['no advertisement', [] as JobAdvertisement[]],
    ['an advertisement without portals', [{ id: 'ad-empty', publications: [] }]],
  ])('shows "Zatím nevystavený inzerát" with Publikovat on the right for %s', async (_, advertisements) => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({ advertisements, onCreateAdvertisement })

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Zatím nevystavený inzerát')
    expect(heading).toHaveAttribute('data-tone', 'neutral')
    expect(screen.queryByText('Nábor nemá žádný inzerát.')).not.toBeInTheDocument()
    expect(screen.queryByText('Vytvořit inzerát')).not.toBeInTheDocument()

    const top = screen.getByTestId('job-card-advertisement-top')
    const publish = within(top).getByRole('button', { name: 'Publikovat' })
    expect(publish).toHaveAttribute('data-testid', 'job-card-advertisement-publish')
    expect(top.className).toContain('tm-justify-between')
    expect(top.lastElementChild).toBe(publish)

    await user.click(publish)
    expect(onCreateAdvertisement).toHaveBeenCalledOnce()
  })

  it('uses column advertisement actions', () => {
    renderJobCard({ advertisements: [runningSame] })

    expect(screen.getByTestId('job-card-advertisement-action')).toHaveAttribute(
      'data-layout',
      'column',
    )
    const main = screen.getByTestId('job-card-advertisement-action-main')
    expect(main.tagName).toBe('BUTTON')
    expect(main).toHaveAccessibleName('Zobrazit detail inzerce')
    expect(main).toHaveTextContent('Detail')
    expect(screen.getByTestId('job-card-advertisement-preview-action')).toHaveAccessibleName(
      'Náhled inzerátu',
    )
  })

  it('calls onAdvertisementPreviewClick from the icon button', async () => {
    const user = userEvent.setup()
    const onAdvertisementPreviewClick = vi.fn()
    renderJobCard({ onAdvertisementPreviewClick })

    await user.click(screen.getByTestId('job-card-advertisement-preview-action'))
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
  })

  it('calls onAdvertisementDetailClick from the combined stats+Detail button', async () => {
    const user = userEvent.setup()
    const onAdvertisementDetailClick = vi.fn()
    const onViewStatisticsClick = vi.fn()
    renderJobCard({ onAdvertisementDetailClick, onViewStatisticsClick })

    await user.click(screen.getByTestId('job-card-advertisement-aggregate-views'))
    expect(onAdvertisementDetailClick).toHaveBeenCalledOnce()
    expect(onViewStatisticsClick).not.toHaveBeenCalled()
  })

  it('does not collapse advertisements without onAdditionalAdvertisementsClick', () => {
    renderJobCard({ advertisements: [runningSame, { ...endingSoon, id: 'ad-2' }] })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(2)
    expect(screen.queryByTestId('job-card-additional-advertisements')).not.toBeInTheDocument()
  })

  it('collapses to the first advertisement behind a "show more" link', async () => {
    const user = userEvent.setup()
    const onAdditionalAdvertisementsClick = vi.fn()
    renderJobCard({
      advertisements: [runningSame, { ...endingSoon, id: 'ad-2' }, { ...runningSame, id: 'ad-3' }],
      onAdditionalAdvertisementsClick,
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)

    const link = screen.getByTestId('job-card-additional-advertisements')
    expect(link).toHaveTextContent('Zobrazit další inzeráty (2)')

    await user.click(link)
    expect(onAdditionalAdvertisementsClick).toHaveBeenCalledOnce()
  })
})
