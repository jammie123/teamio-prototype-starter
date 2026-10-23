import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify14 } from './JobCardSimplify14'

const combinationD: JobAdvertisement = {
  id: 'ad-d',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
      viewCount: 920,
    },
    {
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'disabled',
      startDate: '12. 7. 2026',
      viewCount: 410,
    },
  ],
}

const combinationE: JobAdvertisement = {
  id: 'ad-e',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 920 },
    {
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'disabled',
      startDate: '12. 7. 2026',
      viewCount: 410,
    },
  ],
}

const mixedPeriodAdvertisement: JobAdvertisement = {
  id: 'ad-mixed',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 1200 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '20. 12. 2026', viewCount: 640 },
  ],
}

function renderSimplify14(props: Partial<Parameters<typeof JobCardSimplify14>[0]> = {}) {
  return render(
    <JobCardSimplify14
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{
        unassessed: 14,
        preselected: 8,
        invited: 5,
        hired: 2,
        total: 32,
      }}
      advertisements={[combinationD]}
      {...props}
    />,
  )
}

describe('JobCardSimplify14', () => {
  it('shows per-channel date labels for combination D', () => {
    renderSimplify14()

    expect(screen.getByTestId('job-card-simplify14-partial')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify14-advertisement-heading')).toContainElement(
      screen.getByTestId('job-card-advertisement-aggregate-views'),
    )
    const labels = screen.getAllByTestId('job-card-simplify14-channel-date')
    expect(labels).toHaveLength(3)
    expect(labels.map((label) => label.textContent)).toEqual(
      expect.arrayContaining(['14. 11.', '20. 10.', 'vypnuto']),
    )
  })

  it('hides date labels for combination E when active channels share the same end date', () => {
    renderSimplify14({ advertisements: [combinationE] })

    expect(screen.getByTestId('job-card-simplify14-running')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify14-channel-strip')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify14-channel-date')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify14-subline')).toHaveTextContent(
      '12. 7. – 14. 11. 2026',
    )
    expect(screen.queryByText(/· 1 vypnutý/)).not.toBeInTheDocument()
  })

  it('does not show a same-period subline for partial combination D', () => {
    renderSimplify14()
    expect(screen.queryByTestId('job-card-simplify14-subline')).not.toBeInTheDocument()
  })

  it('shows date labels for mixed periods', () => {
    renderSimplify14({ advertisements: [mixedPeriodAdvertisement] })

    expect(
      screen.getByTestId('job-card-simplify14-mixed-periods-heading'),
    ).toHaveTextContent('Běží v různá období')
    const labels = screen.getAllByTestId('job-card-simplify14-channel-date')
    expect(labels).toHaveLength(2)
    expect(labels.map((label) => label.textContent)).toEqual(
      expect.arrayContaining(['14. 11.', '20. 12.']),
    )
  })

  it('shows combination D panel CTA like Simplify 11', async () => {
    const onExtendPublication = vi.fn()
    renderSimplify14({ onExtendPublication })

    expect(screen.getByTestId('job-card-simplify14-panel-cta')).toHaveTextContent('Obnovit Prace.cz')

    await userEvent.click(screen.getByTestId('job-card-simplify14-panel-cta'))
    expect(onExtendPublication).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prace', channel: 'Prace.cz' }),
    )
  })
})
