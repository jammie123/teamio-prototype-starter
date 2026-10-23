import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify16 } from './JobCardSimplify16'

const twoChannelAd: JobAdvertisement = {
  id: 'ad-two',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '20. 1. 2027', viewCount: 4301 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 100 },
  ],
}

const partialAd: JobAdvertisement = {
  id: 'ad-partial',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '12. 7. 2026',
      endDate: '27. 10. 2026',
      viewCount: 1200,
      highlights: [
        {
          id: 'top',
          name: 'Top',
          startDate: '1. 10. 2026',
          endDate: '24. 10. 2026',
        },
      ],
    },
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

const singleChannelAd: JobAdvertisement = {
  id: 'ad-one',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '20. 1. 2027', viewCount: 500 },
  ],
}

describe('JobCardSimplify16', () => {
  it('renders with simplify-16 variant', () => {
    render(<JobCardSimplify16 title="Test pozice" advertisements={[twoChannelAd]} />)

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-16')
  })

  it('renders google-style channel grid', () => {
    render(<JobCardSimplify16 title="Test pozice" advertisements={[twoChannelAd]} />)

    expect(screen.getByTestId('job-card-simplify16-channel-grid')).toBeInTheDocument()
    expect(screen.getByText('Inzerce')).toBeInTheDocument()
  })

  it('calls onEditAdvertisement from chevron', () => {
    const onEditAdvertisement = vi.fn()

    render(
      <JobCardSimplify16
        title="Test pozice"
        advertisements={[twoChannelAd]}
        onEditAdvertisement={onEditAdvertisement}
      />,
    )

    fireEvent.click(screen.getByTestId('job-card-simplify16-edit-advertisement'))

    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('hides chevron when onEditAdvertisement is missing', () => {
    render(<JobCardSimplify16 title="Test pozice" advertisements={[twoChannelAd]} />)

    expect(screen.queryByTestId('job-card-simplify16-edit-advertisement')).not.toBeInTheDocument()
  })

  it('shows panel CTA for partial state', () => {
    render(
      <JobCardSimplify16
        title="Test pozice"
        advertisements={[partialAd]}
        onExtendPublication={() => {}}
      />,
    )

    expect(screen.getByTestId('job-card-simplify16-panel-cta')).toBeInTheDocument()
  })

  it('shows promo badge and subline', () => {
    render(<JobCardSimplify16 title="Test pozice" advertisements={[partialAd]} />)

    expect(screen.getByTestId('job-card-simplify16-promo-subline')).toHaveTextContent(
      'Zvýrazněno do 24. 10.',
    )
    expect(screen.getByTestId('job-card-simplify16-channel-promo-badge')).toBeInTheDocument()
  })

  it('uses single column grid for one channel', () => {
    render(<JobCardSimplify16 title="Test pozice" advertisements={[singleChannelAd]} />)

    const grid = screen.getByTestId('job-card-simplify16-channel-grid').firstElementChild
    expect(grid).toHaveClass('tm-grid-cols-1')
  })
})
