import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify17 } from './JobCardSimplify17'

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
    { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 410 },
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
      viewCount: 2100,
    },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 1070 },
  ],
}

describe('JobCardSimplify17', () => {
  it('renders with simplify-17 variant', () => {
    render(
      <JobCardSimplify17 title="Test pozice" advertisements={[runningAd]} onCreateAdvertisement={() => {}} />,
    )

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-17')
  })

  it('shows running heading with date range and chevron edit action', async () => {
    const user = userEvent.setup()
    const onEditAdvertisement = vi.fn()

    render(
      <JobCardSimplify17
        title="Test pozice"
        advertisements={[runningAd]}
        onEditAdvertisement={onEditAdvertisement}
      />,
    )

    expect(screen.getByTestId('job-card-simplify17-advertisement-heading-wrap')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify17-running-heading')).toHaveTextContent(
      'Běží · 1. 10. – 14. 11.',
    )
    expect(screen.queryByText('Běží částečně')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('job-card-simplify17-edit-advertisement'))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('shows partial heading in secondary tone', () => {
    render(<JobCardSimplify17 title="Test pozice" advertisements={[partialAd]} />)

    expect(screen.getByTestId('job-card-simplify17-partial-heading')).toHaveTextContent(
      'Běží · 2 ze 3 kanálů',
    )
  })

  it('shows declined not-advertising title and perex separately', () => {
    render(<JobCardSimplify17 title="Test pozice" advertisements={[notAdvertisingAd]} />)

    expect(screen.getByTestId('job-card-simplify17-not-advertising-heading')).toHaveTextContent(
      'Neinzeruje se',
    )
    expect(screen.getByTestId('job-card-simplify17-not-advertising-perex')).toHaveTextContent(
      /ukončeno od 20\. 10\./,
    )
    expect(screen.queryByText('Inzerce ukončena')).not.toBeInTheDocument()
  })

  it('shows never-created copy when the card has no advertisements', () => {
    render(
      <JobCardSimplify17 title="Test pozice" advertisements={[]} onCreateAdvertisement={() => {}} />,
    )

    expect(screen.getByTestId('job-card-simplify17-no-advertisement-heading')).toHaveTextContent(
      'Neinzeruje se',
    )
    expect(screen.getByTestId('job-card-simplify17-never-created-copy')).toHaveTextContent(
      'Zveřejněte ji na portálech a kariérních stránkách a získejte první kandidáty.',
    )
    expect(screen.queryByTestId('job-card-simplify17-no-advertisement-perex')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify17-start-advertising')).toHaveTextContent(
      'Začít inzerovat',
    )
  })
})
