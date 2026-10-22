import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify9 } from './JobCardSimplify9'

const runningAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
  ],
}

const endedAdvertisement: JobAdvertisement = {
  id: 'ad-ended',
  title: 'Ukončený inzerát',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '12. 6.',
      endDate: '1. 9. 2026',
      viewCount: 2100,
    },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6.',
      endDate: '1. 9. 2026',
      viewCount: 760,
    },
  ],
}

const mixedAdvertisement: JobAdvertisement = {
  id: 'ad-mixed',
  title: 'Smíšený inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 700 },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6.',
      endDate: '1. 9. 2026',
      viewCount: 760,
    },
  ],
}

function renderSimplify9(props: Partial<Parameters<typeof JobCardSimplify9>[0]> = {}) {
  return render(
    <JobCardSimplify9
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{
        new: 2,
        unassessed: 14,
        preselected: 8,
        newOhodnoceni: 2,
        invited: 5,
        nabidka: 4,
        hired: 2,
        total: 32,
      }}
      advertisements={[runningAdvertisement]}
      {...props}
    />,
  )
}

describe('JobCardSimplify9', () => {
  it('does not show ended row for running-only advertisements', () => {
    renderSimplify9()

    expect(screen.queryByTestId('job-card-advertisement-ended-row')).not.toBeInTheDocument()
  })

  it('wraps ended publications in a bordered row with Prodloužit', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onExtendAndRepublish = vi.fn()
    renderSimplify9({
      advertisements: [endedAdvertisement],
      onExtendAndRepublish,
    })

    const endedRow = screen.getByTestId('job-card-advertisement-ended-row')
    expect(endedRow).toHaveClass('tm-border-secondary')
    expect(within(endedRow).getByTestId('job-card-publication-ended-heading')).toBeInTheDocument()
    expect(within(endedRow).getAllByTestId('job-card-publication-channel-logo')).toHaveLength(2)

    await user.click(screen.getByTestId('job-card-advertisement-ended-extend'))
    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)
  })

  it('shows ended row below running publications when mixed', () => {
    renderSimplify9({
      advertisements: [mixedAdvertisement],
      onExtendAndRepublish: vi.fn(),
    })

    expect(screen.getByTestId('job-card-advertisement-active-publications')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-ended-row')).toBeInTheDocument()
  })
})
