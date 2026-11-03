import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV6 } from './JobCardV6'
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
}

function renderJobCard(props: Partial<Parameters<typeof JobCardV6>[0]> = {}) {
  return render(
    <JobCardV6
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

describe('JobCardV6', () => {
  it('renders Neposouzený, Ve hře and Celkem without a pipeline background', () => {
    renderJobCard()

    const stats = screen.getByTestId('job-card-stats')
    expect(stats.className).not.toMatch(/tm-bg-/)
    expect(within(stats).getByText('Neposouzený')).toBeInTheDocument()
    expect(within(stats).getByText('Ve hře')).toBeInTheDocument()
    expect(within(stats).getByText('Celkem')).toBeInTheDocument()

    const unassessed = screen.getByTestId('job-card-stat-unassessed')
    const inProgress = screen.getByTestId('job-card-stat-inProgress')
    const total = screen.getByTestId('job-card-stat-total')

    expect(unassessed.className).toContain('tm-items-start')
    expect(inProgress.className).toContain('tm-border-l')
    expect(within(unassessed).getByText('14').className).toContain('tm-font-normal')
    expect(within(unassessed).getByText('14').className).toContain('tm-text-2xl')
    expect(within(total).getByText('52').className).toContain('tm-text-xl')
    expect(within(unassessed).getByTestId('job-card-new-candidates')).toHaveTextContent('5 nový')
    expect(within(inProgress).getByTestId('job-card-new-opalcovani')).toHaveTextContent(
      '3 opalcovaný',
    )
  })

  it('stretches the advertisement to the card edges and stacks the heading above the portals', () => {
    renderJobCard()

    const band = screen.getByTestId('job-card-advertisements')
    expect(band.className).toContain('-tm-mx-4')
    expect(band.className).toContain('-tm-mb-4')

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).toContain('tm-px-4')
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).not.toContain('tm-rounded')

    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const channels = within(advertisement).getByTestId('job-card-advertisement-publication-list')

    expect(heading).toHaveTextContent('Běží od 1. 1. do 1. 2. 2026')
    expect(heading.parentElement).not.toContainElement(channels)
    expect(heading.compareDocumentPosition(channels) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(advertisement.className).toContain('tm-flex-col')
    expect(within(channels).getByText('Jobs.cz')).toBeInTheDocument()
    expect(within(channels).getByText('Prace.cz')).toBeInTheDocument()
    expect(within(channels).getByText('Kariérní stránky')).toBeInTheDocument()
    expect(within(advertisement).getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      /3\s170 zhlédnutí/,
    )
  })

  it('shows the note as a bar under the candidate pipeline', () => {
    renderJobCard()

    const stats = screen.getByTestId('job-card-stats')
    const recruitmentNote = screen.getByTestId('job-card-note')
    const advertisement = screen.getByTestId('job-card-advertisement')

    expect(recruitmentNote.className).toContain('tm-bg-emotion-warning-background')
    expect(within(recruitmentNote).getByTestId('icon')).toHaveAttribute('data-icon-name', 'message-square')
    expect(within(recruitmentNote).getByTestId('note-text')).toHaveTextContent(note.text)
    expect(within(recruitmentNote).getByTestId('note-added-at')).toHaveTextContent(
      `PN · ${note.addedAt}`,
    )
    expect(stats).not.toContainElement(recruitmentNote)
    expect(advertisement).not.toContainElement(recruitmentNote)
    expect(stats.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      recruitmentNote.compareDocumentPosition(advertisement) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('keeps the note when there is no candidate pipeline', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-stats')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-note')).toBeInTheDocument()
  })

  it('hides the note when its text is empty', () => {
    renderJobCard({ note: { ...note, text: '   ' } })

    expect(screen.getByTestId('job-card-advertisement')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-note')).not.toBeInTheDocument()
  })

  it('keeps the warning heading and adds the disappearance notice after the summary', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [endingSoon], onExtendAndRepublish })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const notice = within(advertisement).getByTestId('job-card-disappearance-notice')

    expect(heading).toHaveTextContent('Končí za 3 dny · 30. 9.')
    expect(heading.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(notice).toHaveTextContent('Po 30. 9. zmizí inzerát ze všech tří kanálů.')

    await user.click(within(notice).getByRole('button', { name: 'Prodloužit' }))
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })
})
