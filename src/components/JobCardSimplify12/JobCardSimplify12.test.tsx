import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify12 } from './JobCardSimplify12'

function daysFromNow(days: number) {
  const date = new Date('2026-10-22T12:00:00')
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const stateA: JobAdvertisement = {
  id: 'ad-a',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 3170 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 920 },
    { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 410 },
  ],
}

const stateB: JobAdvertisement = {
  id: 'ad-b',
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
    { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 410 },
  ],
}

const stateC: JobAdvertisement = {
  id: 'ad-c',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 1200 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(12), viewCount: 640 },
    { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 210 },
  ],
}

function renderSimplify12(props: Partial<Parameters<typeof JobCardSimplify12>[0]> = {}) {
  return render(
    <JobCardSimplify12
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{
        unassessed: 14,
        preselected: 8,
        invited: 5,
        hired: 2,
        total: 32,
      }}
      advertisements={[stateA]}
      {...props}
    />,
  )
}

describe('JobCardSimplify12', () => {
  it('shows state A with running heading, logos, views, and no panel CTA', () => {
    renderSimplify12({ advertisements: [stateA] })

    expect(screen.getByTestId('job-card-simplify12-running-calm')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify12-running-calm-heading')).toHaveTextContent(
      /Běží do 14\. 11\./,
    )
    expect(screen.getByTestId('job-card-simplify12-logo-row')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      '4 500 zhlédnutí',
    )
    expect(screen.queryByTestId('job-card-simplify12-panel-cta')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify12-channel-rows')).not.toBeInTheDocument()
  })

  it('shows state B with partial heading and per-channel restore link', async () => {
    const onExtendPublication = vi.fn()
    renderSimplify12({ advertisements: [stateB], onExtendPublication })

    expect(screen.getByTestId('job-card-simplify12-partial-heading')).toHaveTextContent(
      'Běží na 2 ze 3 kanálů',
    )
    expect(screen.getByTestId('job-card-simplify12-channel-rows')).toBeInTheDocument()
    expect(screen.getByText('bez omezení')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('job-card-simplify12-channel-restore'))
    expect(onExtendPublication).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prace', channel: 'Prace.cz' }),
    )
    expect(screen.queryByTestId('job-card-simplify12-panel-cta')).not.toBeInTheDocument()
  })

  it('shows state C with nearest end heading and secondary small extend button', async () => {
    const onExtendAndRepublish = vi.fn()
    renderSimplify12({ advertisements: [stateC], onExtendAndRepublish })

    expect(screen.getByTestId('job-card-simplify12-mixed-dates-heading')).toHaveTextContent(
      /Nejdřív končí za 5 dní/,
    )
    expect(screen.getByTestId('job-card-simplify12-channel-rows')).toBeInTheDocument()

    const cta = screen.getByTestId('job-card-simplify12-panel-cta')
    expect(cta).toHaveTextContent('Prodloužit inzerci')
    await userEvent.click(cta)
    expect(onExtendAndRepublish).toHaveBeenCalled()
  })
})
