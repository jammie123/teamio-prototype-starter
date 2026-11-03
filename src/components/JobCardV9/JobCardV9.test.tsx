import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV9 } from './JobCardV9'
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

function renderJobCard(props: Partial<Parameters<typeof JobCardV9>[0]> = {}) {
  return render(
    <JobCardV9
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

describe('JobCardV9', () => {
  it('renders the job title in normal weight', () => {
    renderJobCard()

    const title = screen.getByTestId('job-card-title')
    expect(title.tagName).toBe('H3')
    expect(title).toHaveTextContent('Řidič/ka sk. C ČB PO–PÁ')
    expect(title.className).toContain('tm-text-lg')
    expect(title.className).toContain('tm-font-normal')
    expect(title.className).not.toContain('tm-font-semibold')
  })

  it('renders job portals in normal weight', () => {
    renderJobCard()

    const channels = screen.getAllByTestId('job-card-publication-channel')
    expect(channels.map((channel) => channel.textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    for (const channel of channels) {
      expect(channel.className).toContain('tm-font-normal')
      expect(channel.className).not.toContain('tm-font-medium')
    }
  })

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

  it('puts the advertisement status, portals and views on one row', () => {
    renderJobCard()

    const band = screen.getByTestId('job-card-advertisements')
    expect(band.className).toContain('-tm-mx-4')
    expect(band.className).toContain('-tm-mb-4')

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).toContain('tm-px-4')
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-flex-row')
    expect(advertisement.className).not.toContain('tm-flex-col')
    expect(advertisement.className).not.toContain('tm-rounded')

    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const channels = within(advertisement).getByTestId('job-card-advertisement-publication-list')
    const views = within(advertisement).getByTestId('job-card-advertisement-aggregate-views')

    expect(heading).toHaveTextContent('Běží od 1. 1. do 1. 2. 2026')
    expect(heading.className).toContain('tm-min-w-[160px]')
    expect(heading.parentElement).toBe(advertisement)
    expect(channels.parentElement).toBe(advertisement)
    expect(views.parentElement?.parentElement).toBe(advertisement)
    expect(heading.compareDocumentPosition(channels) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(channels.compareDocumentPosition(views) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(channels).getByText('Jobs.cz')).toBeInTheDocument()
    expect(within(channels).getByText('Prace.cz')).toBeInTheDocument()
    expect(within(channels).getByText('Kariérní stránky')).toBeInTheDocument()
    expect(views).toHaveTextContent(/3\s170 zhlédnutí/)
  })

  it('shows the note to the right of the candidate pipeline', () => {
    renderJobCard()

    const row = screen.getByTestId('job-card-pipeline-row')
    const stats = screen.getByTestId('job-card-stats')
    const recruitmentNote = screen.getByTestId('job-card-note')
    const advertisement = screen.getByTestId('job-card-advertisement')

    expect(row.className).toContain('tm-flex-row')
    expect(row).toContainElement(stats)
    expect(row).toContainElement(recruitmentNote)
    expect(recruitmentNote.className).toContain('tm-ml-auto')
    expect(recruitmentNote.className).toContain('tm-bg-emotion-warning-background')
    expect(within(recruitmentNote).getByTestId('icon')).toHaveAttribute('data-icon-name', 'message-square')
    expect(within(recruitmentNote).getByTestId('note-text')).toHaveTextContent(note.text)
    expect(within(recruitmentNote).getByTestId('note-added-at')).toHaveTextContent(
      `PN · ${note.addedAt}`,
    )
    expect(stats).not.toContainElement(recruitmentNote)
    expect(advertisement).not.toContainElement(recruitmentNote)
    expect(stats.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(row.compareDocumentPosition(advertisement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
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

  it('shows each live portal as do-date when periods differ', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-diff',
          publications: [
            portal({
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 9. 2026',
              endDate: '30. 10. 2026',
            }),
            portal({
              id: 'prace',
              channel: 'Prace.cz',
              startDate: '15. 9. 2026',
              endDate: '15. 11. 2026',
            }),
          ],
        },
      ],
    })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(within(advertisement).getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží v různých obdobích',
    )
    expect(within(advertisement).getByText('do 30. 10.')).toBeInTheDocument()
    expect(within(advertisement).getByText('do 15. 11.')).toBeInTheDocument()
    expect(advertisement).not.toHaveTextContent('1. 9. – 30. 10.')
  })

  it('keeps a running advertisement with a finished portal on one row', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-mixed',
          publications: [
            portal({
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '1. 9. 2026',
              endDate: '30. 10. 2026',
              viewCount: 1840,
            }),
            portal({
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '1. 8. 2026',
              endDate: '15. 8. 2026',
              viewCount: 920,
            }),
            portal({
              id: 'career',
              channel: 'Kariérní stránky',
              startDate: '1. 9. 2026',
              endDate: '30. 10. 2026',
              viewCount: 410,
            }),
          ],
        },
      ],
    })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Běží do 30. 10.')
    expect(heading).not.toHaveTextContent('portál')
    expect(within(advertisement).getByText('ukončeno 15. 8.')).toBeInTheDocument()
    expect(advertisement.className).toContain('tm-flex-row')
  })

  it('puts Prodloužit on the same row as an advertisement that ends soon', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [endingSoon], onExtendAndRepublish })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const prolong = within(advertisement).getByRole('button', { name: 'Prodloužit' })

    expect(heading).toHaveTextContent('Končí za 3 dny · 30. 9.')
    expect(heading.parentElement).toBe(advertisement)
    expect(prolong.parentElement).toBe(advertisement)
    expect(screen.queryByTestId('job-card-disappearance-notice')).not.toBeInTheDocument()
    expect(advertisement).not.toHaveTextContent('zmizí inzerát')

    await user.click(prolong)
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })
})
