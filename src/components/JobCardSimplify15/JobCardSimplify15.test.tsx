import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify15 } from './JobCardSimplify15'

const runningAd: JobAdvertisement = {
  id: 'ad-running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 920 },
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

const notAdvertisingAd: JobAdvertisement = {
  id: 'ad-na',
  status: 'notAdvertising',
  advertisingDeclinedAt: '20. 10. 2026',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
      viewCount: 100,
    },
  ],
}

describe('JobCardSimplify15', () => {
  it('renders with simplify-15 variant', () => {
    render(
      <JobCardSimplify15 title="Test pozice" advertisements={[runningAd]} onCreateAdvertisement={() => {}} />,
    )

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-15')
  })

  it('wraps running status heading for simplify15 presentation', () => {
    render(<JobCardSimplify15 title="Test pozice" advertisements={[runningAd]} />)

    expect(
      screen.getByTestId('job-card-advertisement-running-heading-wrap'),
    ).toBeInTheDocument()
  })

  it('wraps partial status heading with simplify15 test ids', () => {
    render(<JobCardSimplify15 title="Test pozice" advertisements={[partialAd]} />)

    expect(screen.getByTestId('job-card-simplify15-partial-heading-wrap')).toBeInTheDocument()
  })

  it('wraps not-advertising status heading', () => {
    render(<JobCardSimplify15 title="Test pozice" advertisements={[notAdvertisingAd]} />)

    expect(screen.getByTestId('job-card-simplify10-not-advertising-heading-wrap')).toBeInTheDocument()
    expect(screen.getByText('Neinzeruje se')).toBeInTheDocument()
  })
})
