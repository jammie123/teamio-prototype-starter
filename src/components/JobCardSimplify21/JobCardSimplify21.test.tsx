import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify21 } from './JobCardSimplify21'

const runningAd: JobAdvertisement = {
  id: 'ad-running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
    { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026', viewCount: 920 },
  ],
}

const partialAd: JobAdvertisement = {
  id: 'ad-partial',
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
  ],
}

const expiredAd: JobAdvertisement = {
  id: 'ad-expired',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
      viewCount: 2100,
    },
  ],
}

describe('JobCardSimplify21', () => {
  it('renders recruitment and advertisement sections', () => {
    render(
      <JobCardSimplify21 title="Test pozice" advertisements={[runningAd]} />,
    )

    expect(screen.getByTestId('job-card-recruitment')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisements')).toBeInTheDocument()
    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-21')
  })

  it('keeps icon title heading for running ads without ended-portal badge', () => {
    render(
      <JobCardSimplify21 title="Test pozice" advertisements={[runningAd]} />,
    )

    const heading = screen.getByTestId('job-card-simplify21-running-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(within(heading).queryByTestId('job-card-simplify21-ended-portal-badge')).not.toBeInTheDocument()
  })

  it('shows ended-portal badge beside partial running heading', () => {
    render(
      <JobCardSimplify21 title="Test pozice" advertisements={[partialAd]} onExtendAndRepublish={() => {}} />,
    )

    const heading = screen.getByTestId('job-card-simplify21-partial-heading')
    expect(heading).toHaveTextContent('Běží')
    expect(within(heading).getByTestId('job-card-simplify21-ended-portal-badge')).toHaveTextContent(
      '1 portál ukončen',
    )
    expect(
      within(heading).queryByTestId('job-card-simplify21-advertisement-heading-secondary'),
    ).not.toBeInTheDocument()
  })

  it('shows classic expired heading without badge', () => {
    render(
      <JobCardSimplify21 title="Test pozice" advertisements={[expiredAd]} onEditAdvertisement={vi.fn()} />,
    )

    const heading = screen.getByTestId('job-card-simplify21-expired-heading')
    expect(heading).toHaveTextContent('Inzerce skončila')
    expect(within(heading).queryByTestId('job-card-simplify21-ended-portal-badge')).not.toBeInTheDocument()
  })

  it('places channel status dot on portal logo (Simplify 21)', () => {
    render(
      <JobCardSimplify21 title="Test pozice" advertisements={[runningAd]} />,
    )

    const dots = screen.getAllByTestId('job-card-simplify19-channel-status-dot')
    expect(dots.length).toBeGreaterThan(0)
    dots.forEach((dot) => expect(dot).toHaveAttribute('data-channel-status-placement', 'bottom'))
  })

  it('calls onEditAdvertisement from advertisement header', async () => {
    const user = userEvent.setup()
    const onEditAdvertisement = vi.fn()

    render(
      <JobCardSimplify21
        title="Test pozice"
        advertisements={[runningAd]}
        onEditAdvertisement={onEditAdvertisement}
      />,
    )

    await user.click(screen.getByTestId('job-card-simplify21-edit-advertisement'))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })
})
