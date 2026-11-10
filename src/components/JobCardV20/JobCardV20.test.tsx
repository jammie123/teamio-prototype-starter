import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV20, type JobCardV20Props } from './JobCardV20'
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

function renderJobCard(props: Partial<JobCardV20Props> = {}) {
  return render(
    <JobCardV20
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

describe('JobCardV20', () => {
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

  it('puts the menu, title, assignee and pipeline in the left column', () => {
    renderJobCard()

    const layoutRow = screen.getByTestId('job-card-layout-row')
    const main = screen.getByTestId('job-card-main')
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const people = screen.getByTestId('job-card-people')
    const title = screen.getByTestId('job-card-title')
    const advertisements = screen.getByTestId('job-card-advertisements')

    expect(layoutRow).toContainElement(actions)
    expect(layoutRow).toContainElement(main)
    expect(layoutRow).toContainElement(advertisements)
    expect(main).toContainElement(headingRow)
    expect(main).toContainElement(pipeline)
    expect(main).not.toContainElement(advertisements)
    expect(headingRow).toContainElement(title)
    expect(headingRow).toContainElement(people)
    expect(headingRow).not.toContainElement(pipeline)
    expect(headingRow.className).toContain('tm-flex-col')
    expect(pipeline.className).not.toContain('tm-ml-auto')
    expect(title.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(people.compareDocumentPosition(pipeline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
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

    expect(card).toHaveAttribute('data-variant', 'v20')
    expect(card.className).toContain('!tm-p-0')
    expect(layoutRow).toContainElement(column)
    expect(main).not.toContainElement(column)
    expect(column.className).toContain('tm-border-l')
    expect(column.className).toContain('tm-w-80')
    expect(column).toContainElement(advertisement)
    expect(advertisement.className).not.toContain('tm-pl-14')
    expect(advertisement.className).not.toContain('tm-border-t')
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží 1. 1. – 1. 2. 2026',
    )
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(screen.queryByTestId('job-card-advertisement-action')).not.toBeInTheDocument()
  })

  it('separates stacked advertisements with a top border after the first', () => {
    renderJobCard({ advertisements: [runningSame, { ...endingSoon, id: 'ad-2' }] })

    const advertisements = screen.getAllByTestId('job-card-advertisement')
    expect(advertisements[0].className).not.toContain('tm-border-t')
    expect(advertisements[1].className).toContain('tm-border-t')
  })

  it('hides the right column for drafts', () => {
    renderJobCard({ status: 'draft' })

    expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-main')).toBeInTheDocument()
  })

  it('marks every portal as ended for an unpublished job', () => {
    renderJobCard({ status: 'unpublished' })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent('Ukončeno')
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('keeps the ending-soon warning background on the compact widget', () => {
    renderJobCard({ advertisements: [endingSoon] })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Končí za 3 dny 1. 9. – 30. 9. 2026',
    )
    expect(screen.getByTestId('job-card-advertisement').className).toContain(
      'tm-bg-emotion-warning-background/80',
    )
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('offers creating an advertisement when the job has none', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({ advertisements: [], onCreateAdvertisement })

    const column = screen.getByTestId('job-card-advertisements')
    expect(within(column).getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )
    await user.click(screen.getByText('Vytvořit inzerát'))
    expect(onCreateAdvertisement).toHaveBeenCalledOnce()
  })

  it('collapses to the first advertisement behind a "show more" link', async () => {
    const user = userEvent.setup()
    const onAdditionalAdvertisementsClick = vi.fn()
    renderJobCard({
      advertisements: [runningSame, { ...endingSoon, id: 'ad-2' }, { ...runningSame, id: 'ad-3' }],
      showAdditionalAdvertisementsLink: true,
      onAdditionalAdvertisementsClick,
    })

    expect(screen.getAllByTestId('job-card-advertisement')).toHaveLength(1)

    const link = screen.getByTestId('job-card-additional-advertisements')
    expect(link).toHaveTextContent('Zobrazit další inzeráty (2)')
    expect(screen.getByTestId('job-card-advertisements')).toContainElement(link)

    await user.click(link)
    expect(onAdditionalAdvertisementsClick).toHaveBeenCalledOnce()
  })
})
