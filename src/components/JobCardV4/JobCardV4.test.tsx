import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV4 } from './JobCardV4'
import type { JobAdvertisement, JobPublication } from './types'

const now = new Date(2026, 8, 27)
const note = 'Čekáme na schválení rozpočtu, start až od října'

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

function renderJobCard(props: Partial<Parameters<typeof JobCardV4>[0]> = {}) {
  return render(
    <JobCardV4
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{ unassessed: 14, inProgress: 6, total: 52 }}
      advertisements={[runningSame]}
      note={note}
      onEditJob={vi.fn()}
      now={now}
      {...props}
    />,
  )
}

describe('JobCardV4', () => {
  it('keeps the status heading and job portals on one advertisement row', () => {
    renderJobCard()

    const summary = screen.getByTestId('job-card-advertisement-summary')
    const heading = within(summary).getByTestId('job-card-advertisement-heading')
    const channels = within(summary).getByTestId('job-card-advertisement-publication-list')

    expect(heading).toHaveTextContent('Běží od 1. 1. do 1. 2. 2026')
    expect(within(channels).getByText('Jobs.cz')).toBeInTheDocument()
    expect(within(channels).getByText('Prace.cz')).toBeInTheDocument()
    expect(within(channels).getByText('Kariérní stránky')).toBeInTheDocument()
    expect(within(summary).getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      /3\s170 zhlédnutí/,
    )
  })

  it('shows the recruitment note under the advertisement', () => {
    renderJobCard()

    const advertisement = screen.getByTestId('job-card-advertisement')
    const recruitmentNote = screen.getByTestId('job-card-recruitment-note')

    expect(recruitmentNote).toHaveTextContent(note)
    expect(within(recruitmentNote).getByTestId('icon')).toHaveAttribute('data-icon-name', 'message-square')
    expect(
      advertisement.compareDocumentPosition(recruitmentNote) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(advertisement).not.toContainElement(recruitmentNote)
  })

  it('hides the recruitment note when it is empty', () => {
    renderJobCard({ note: '   ' })

    expect(screen.queryByTestId('job-card-recruitment-note')).not.toBeInTheDocument()
  })

  it('keeps the warning heading and adds the disappearance notice after the summary row', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [endingSoon], onExtendAndRepublish })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const summary = within(advertisement).getByTestId('job-card-advertisement-summary')
    const heading = within(summary).getByTestId('job-card-advertisement-heading')
    const notice = within(advertisement).getByTestId('job-card-disappearance-notice')

    expect(heading).toHaveTextContent('Končí za 3 dny · 30. 9.')
    expect(summary.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(notice).toHaveTextContent('Po 30. 9. zmizí inzerát ze všech tří kanálů.')

    await user.click(within(notice).getByRole('button', { name: 'Prodloužit' }))
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })
})
