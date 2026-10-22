import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify7 } from './JobCardSimplify7'

const runningAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
  ],
}

const secondAdvertisement: JobAdvertisement = {
  id: 'ad-2',
  title: 'Druhý inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 8.', endDate: '30. 10. 2026', viewCount: 120 },
  ],
}

function renderSimplify7(props: Partial<Parameters<typeof JobCardSimplify7>[0]> = {}) {
  return render(
    <JobCardSimplify7
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{
        new: 5,
        unassessed: 14,
        preselected: 8,
        opalcovani: 3,
        newOpalcovani: 2,
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

describe('JobCardSimplify7', () => {
  it('uses a simpler pipeline without Nabídka and emphasizes the first cell', () => {
    renderSimplify7({ onCandidatesClick: vi.fn() })

    expect(screen.queryByTestId('job-card-stat-nabidka')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-stat-unassessed')).toHaveTextContent(/Neposouzení/)
    expect(within(screen.getByTestId('job-card-stat-unassessed')).getByText('14')).toHaveClass(
      'tm-text-2xl',
    )
    expect(within(screen.getByTestId('job-card-stat-preselected')).getByText('8')).toHaveClass(
      'tm-text-xl',
    )
  })

  it('lists multiple advertisements instead of a switcher', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderSimplify7({
      advertisements: [runningAdvertisement, secondAdvertisement],
    })

    expect(screen.queryByTestId('job-card-advertisement-switcher')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-batch')).toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-advertisement-batch-item')).toHaveLength(2)

    await user.click(screen.getAllByTestId('job-card-advertisement-batch-item')[0])
    expect(screen.getByTestId('job-card-advertisement-batch-back')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement')).toBeInTheDocument()
  })

  it('uses regular-weight date badges with roomier chips when end dates differ', () => {
    renderSimplify7()

    const badge = within(screen.getAllByTestId('job-card-publication-chip')[0]).getByTestId(
      'job-card-publication-period-badge',
    )
    expect(badge).toHaveClass('tm-font-normal')
    expect(badge).not.toHaveClass('tm-font-medium')
    expect(screen.getAllByTestId('job-card-publication-chip')[0]).toHaveClass('tm-px-3', 'tm-py-1')
    expect(screen.queryByTestId('job-card-advertisement-mixed-running-cover')).not.toBeInTheDocument()
  })
})
