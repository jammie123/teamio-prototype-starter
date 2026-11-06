import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardV14/types'
import { JobCardV16, type JobCardV16Props } from './JobCardV16'

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

function renderJobCard(props: Partial<JobCardV16Props> = {}) {
  return render(
    <JobCardV16
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{ new: 5, unassessed: 14, preselected: 6, evaluated: 8 }}
      advertisements={[runningSame]}
      note={note}
      onEditJob={vi.fn()}
      now={now}
      {...props}
    />,
  )
}

describe('JobCardV16', () => {
  it('renders the job title in normal weight', () => {
    renderJobCard()

    const title = screen.getByTestId('job-card-title')
    expect(title.tagName).toBe('H3')
    expect(title).toHaveTextContent('Řidič/ka sk. C ČB PO–PÁ')
    expect(title.className).toContain('tm-text-lg')
    expect(title.className).toContain('tm-font-normal')
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'v16')
  })

  it('puts the menu in the left corner with avatars under the title and pipeline on the right', () => {
    renderJobCard()

    const layoutRow = screen.getByTestId('job-card-layout-row')
    const main = screen.getByTestId('job-card-main')
    const headingRow = screen.getByTestId('job-card-title-heading-row')
    const titleRow = screen.getByTestId('job-card-title-row')
    const actions = screen.getByTestId('job-card-actions-toggle')
    const pipeline = screen.getByTestId('job-card-pipeline')
    const people = screen.getByTestId('job-card-people')
    const title = screen.getByTestId('job-card-title')

    expect(layoutRow).toContainElement(actions)
    expect(layoutRow).toContainElement(main)
    expect(main).toContainElement(titleRow)
    expect(titleRow).not.toContainElement(actions)
    expect(titleRow).toContainElement(headingRow)
    expect(titleRow).toContainElement(pipeline)
    expect(headingRow).toContainElement(title)
    expect(headingRow).toContainElement(people)
    expect(headingRow).not.toContainElement(pipeline)
    expect(actions.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title.compareDocumentPosition(pipeline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders Neposouzený, Předvybraný and Ohodnocený in the candidate pipeline', () => {
    renderJobCard()

    const stats = within(screen.getByTestId('job-card-pipeline')).getByTestId('job-card-stats')
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Předvybraný')).toBeInTheDocument()
    expect(within(stats).getByText('Ohodnocený')).toBeInTheDocument()
    expect(within(stats).queryByText('Ve hře')).not.toBeInTheDocument()
    expect(within(stats).queryByText('Celkem')).not.toBeInTheDocument()
    expect(within(stats).getByTestId('job-card-new-candidates')).toHaveTextContent('5 nový')
  })

  it('omits the pipeline without candidates', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-pipeline')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-note')).toBeInTheDocument()
  })

  it('renders advertisement actions on the right of the advertisement panel', () => {
    renderJobCard()

    const panel = screen.getByTestId('job-card-advertisement-panel')
    const actions = within(panel).getByTestId('job-card-advertisement-action')

    expect(within(panel).getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží 1. 1. – 1. 2. 2026',
    )
    expect(within(actions).getByText('3 170')).toBeInTheDocument()
    expect(within(actions).getByText('Detail')).toBeInTheDocument()
    expect(within(actions).getByText('Náhled')).toBeInTheDocument()
    expect(within(actions).queryByText('Prodloužit')).not.toBeInTheDocument()
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

  it('shows the note below the header row and above the advertisement', () => {
    renderJobCard()

    const headerRow = screen.getByTestId('job-card-header-row')
    const recruitmentNote = screen.getByTestId('job-card-note')
    const advertisement = screen.getByTestId('job-card-advertisement')

    expect(screen.getByTestId('job-card-main')).toContainElement(recruitmentNote)
    expect(headerRow.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(recruitmentNote.compareDocumentPosition(advertisement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('marks every portal as ended for an unpublished job', () => {
    renderJobCard({ status: 'unpublished' })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent('Ukončeno')
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('hides advertisements for drafts and archived jobs', () => {
    renderJobCard({ status: 'draft' })

    expect(screen.queryByTestId('job-card-advertisements')).not.toBeInTheDocument()
  })

  it('offers creating an advertisement when the job has none', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({ advertisements: [], onCreateAdvertisement })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
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

    await user.click(link)
    expect(onAdditionalAdvertisementsClick).toHaveBeenCalledOnce()
  })
})
