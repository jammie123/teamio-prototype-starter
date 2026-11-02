import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardV3 } from './JobCardV3'
import type { JobAdvertisement, JobPublication } from './types'

const now = new Date(2026, 8, 27)

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

function renderJobCard(props: Partial<Parameters<typeof JobCardV3>[0]> = {}) {
  return render(
    <JobCardV3
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{ unassessed: 14, inProgress: 6, total: 52 }}
      advertisements={[runningSame]}
      onEditJob={vi.fn()}
      now={now}
      {...props}
    />,
  )
}

describe('JobCardV3', () => {
  it('puts people initials beside the menu', () => {
    renderJobCard()

    const people = screen.getByTestId('job-card-people')
    const menu = screen.getByTestId('job-card-actions-toggle')

    expect(people.compareDocumentPosition(menu) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(people).getByTestId('job-card-owner')).toHaveTextContent('PN')
    expect(within(people).getByTestId('job-card-hiring-manager-0')).toHaveTextContent('LP')
    expect(people).toHaveAccessibleName('Petra Nováková (Náborář), Lukáš Procházka (Hiring manager)')
    expect(screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })).toBeInTheDocument()
  })

  it('keeps the warning heading and adds the disappearance notice after it', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderJobCard({ advertisements: [endingSoon], onExtendAndRepublish })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const notice = within(advertisement).getByTestId('job-card-disappearance-notice')
    const channels = within(advertisement).getByTestId('job-card-advertisement-publication-list')

    expect(heading).toHaveTextContent('Končí za 3 dny · 30. 9.')
    expect(heading.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(notice.compareDocumentPosition(channels) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(notice).toHaveTextContent('Po 30. 9. zmizí inzerát ze všech tří kanálů.')
    expect(within(notice).getByTestId('icon')).toHaveAttribute('data-icon-name', 'clock')

    await user.click(within(notice).getByRole('button', { name: 'Prodloužit' }))
    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })

  it('hides the disappearance notice while the advertisement is still running', () => {
    renderJobCard()

    expect(screen.queryByTestId('job-card-disappearance-notice')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží od 1. 1. do 1. 2. 2026',
    )
  })
})
