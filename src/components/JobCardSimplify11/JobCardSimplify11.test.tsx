import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify11 } from './JobCardSimplify11'

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

const combinationF: JobAdvertisement = {
  id: 'ad-f',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
      viewCount: 2100,
    },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
      viewCount: 760,
    },
    {
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'disabled',
      startDate: '12. 7. 2026',
      viewCount: 310,
    },
  ],
}

function renderSimplify11(props: Partial<Parameters<typeof JobCardSimplify11>[0]> = {}) {
  return render(
    <JobCardSimplify11
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

describe('JobCardSimplify11', () => {
  it('shows combination D with partial heading and single-portal restore CTA', async () => {
    const onExtendPublication = vi.fn()
    renderSimplify11({ onExtendPublication })

    expect(screen.getByTestId('job-card-simplify11-partial')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify11-partial-heading')).toHaveTextContent(
      'Běží částečně',
    )
    expect(screen.getByTestId('job-card-simplify11-subline')).toHaveTextContent(
      'Prace.cz skončila · 1 vypnutý',
    )
    expect(screen.getByTestId('job-card-simplify11-panel-cta')).toHaveTextContent('Obnovit Prace.cz')

    await userEvent.click(screen.getByTestId('job-card-simplify11-panel-cta'))
    expect(onExtendPublication).toHaveBeenCalledTimes(1)
    expect(onExtendPublication).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prace', channel: 'Prace.cz' }),
    )
  })

  it('shows combination E without panel CTA', () => {
    renderSimplify11({ advertisements: [combinationE] })

    expect(screen.getByTestId('job-card-simplify11-running')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify11-running-heading')).toHaveTextContent('Běží')
    expect(screen.getByTestId('job-card-simplify11-subline')).toHaveTextContent(
      /do 14\. 11\. · 1 vypnutý/,
    )
    expect(screen.queryByTestId('job-card-simplify11-panel-cta')).not.toBeInTheDocument()
  })

  it('restores only expired channels for combination F', async () => {
    const onExtendPublication = vi.fn()
    renderSimplify11({ advertisements: [combinationF], onExtendPublication })

    expect(screen.getByTestId('job-card-simplify11-ended')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify11-panel-cta')).toHaveTextContent('Obnovit inzerci')

    await userEvent.click(screen.getByTestId('job-card-simplify11-panel-cta'))
    expect(onExtendPublication).toHaveBeenCalledTimes(2)
    expect(onExtendPublication).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: 'career' }),
    )
  })

  it('marks disabled channels in the strip', () => {
    renderSimplify11()

    expect(screen.getByTestId('job-card-simplify11-channel-strip')).toBeInTheDocument()
    const disabledChip = screen
      .getAllByTestId('job-card-simplify11-channel-chip')
      .find((chip) => chip.getAttribute('data-channel-state') === 'disabled')
    expect(disabledChip).toBeDefined()
  })

  it('renders 13px status dots on every portal logo', () => {
    renderSimplify11()

    const dots = screen.getAllByTestId('job-card-simplify11-channel-status-dot')
    expect(dots).toHaveLength(3)
    dots.forEach((dot) => {
      expect(dot).toHaveClass('tm-size-[13px]', 'tm-rounded-full')
    })
    expect(
      dots.find((dot) => dot.getAttribute('data-channel-state') === 'expired'),
    ).toHaveClass('tm-bg-emotion-danger-emphasis')
    expect(
      dots.find((dot) => dot.getAttribute('data-channel-state') === 'disabled'),
    ).toHaveClass('tm-bg-secondary')
  })
})
