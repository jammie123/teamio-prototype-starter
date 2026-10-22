import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify8 } from './JobCardSimplify8'

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

const secondAdvertisement: JobAdvertisement = {
  id: 'ad-2',
  title: 'Druhý inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 8.', endDate: '30. 10. 2026', viewCount: 120 },
  ],
}

function renderSimplify8(props: Partial<Parameters<typeof JobCardSimplify8>[0]> = {}) {
  return render(
    <JobCardSimplify8
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

describe('JobCardSimplify8', () => {
  it('shows pipeline without Opalcovaný and Nabídka, with pink text badges', () => {
    renderSimplify8({ onCandidatesClick: vi.fn() })

    expect(screen.queryByTestId('job-card-stat-opalcovani')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-stat-nabidka')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-new-candidates')).toHaveTextContent('2 nový')
    expect(screen.getByTestId('job-card-new-ohodnoceni')).toHaveTextContent('2 ohodnocený')
    expect(within(screen.getByTestId('job-card-stat-unassessed')).getByText('14')).toHaveClass(
      'tm-text-2xl',
    )
  })

  it('lists multiple advertisements instead of a switcher', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderSimplify8({
      advertisements: [runningAdvertisement, secondAdvertisement],
    })

    expect(screen.queryByTestId('job-card-advertisement-switcher')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-batch')).toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-advertisement-batch-item')).toHaveLength(2)

    await user.click(screen.getAllByTestId('job-card-advertisement-batch-item')[0])
    expect(screen.getByTestId('job-card-advertisement-batch-back')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement')).toBeInTheDocument()
  })

  it('does not wrap mixed running periods in a gray cover panel', () => {
    renderSimplify8()

    expect(screen.getByText(/Běží v různá období/i)).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-mixed-running-cover')).not.toBeInTheDocument()
  })

  it('shows gray miniature portal logos for ended advertisements', () => {
    renderSimplify8({ advertisements: [endedAdvertisement] })

    const endedList = screen.getByTestId('job-card-advertisement-ended-publications')
    expect(endedList).toHaveClass('tm-grayscale')
    expect(within(endedList).getAllByTestId('job-card-publication-channel-logo')).toHaveLength(2)
    expect(screen.queryByTestId('job-card-publication-chip')).not.toBeInTheDocument()
  })
})
