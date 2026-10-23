import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify18 } from './JobCardSimplify18'

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

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const mixedEndingSoonAd: JobAdvertisement = {
  id: 'ad-ending-mixed',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 1200 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(12), viewCount: 640 },
  ],
}

const endedAd: JobAdvertisement = {
  id: 'ad-ended',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
    },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
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
      viewCount: 2100,
    },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 1070 },
  ],
}

describe('JobCardSimplify18', () => {
  it('renders with simplify-18 variant', () => {
    render(
      <JobCardSimplify18 title="Test pozice" advertisements={[runningAd]} onCreateAdvertisement={() => {}} />,
    )

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-18')
  })

  it('shows running title and date range secondary with chevron edit action', async () => {
    const user = userEvent.setup()
    const onEditAdvertisement = vi.fn()

    render(
      <JobCardSimplify18
        title="Test pozice"
        advertisements={[runningAd]}
        onEditAdvertisement={onEditAdvertisement}
      />,
    )

    expect(screen.getByTestId('job-card-simplify18-advertisement-heading-wrap')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify18-running-heading')).toHaveTextContent('Běží')
    expect(screen.getByTestId('job-card-simplify18-advertisement-heading-secondary')).toHaveTextContent(
      '1. 10. – 14. 11.',
    )
    expect(screen.getByTestId('job-card-advertisement-meta')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('job-card-simplify18-running-heading')).queryByTestId(
        'job-card-advertisement-aggregate-views',
      ),
    ).not.toBeInTheDocument()

    await user.click(screen.getByTestId('job-card-simplify18-edit-advertisement'))
    expect(onEditAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('shows Brzy končí when at least one channel ends soon on different dates', () => {
    render(
      <JobCardSimplify18
        title="Test pozice"
        advertisements={[mixedEndingSoonAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    expect(screen.getByTestId('job-card-simplify18-ending-soon-heading')).toHaveTextContent(
      'Brzy končí',
    )
    expect(screen.getByTestId('job-card-simplify18-advertisement-heading-secondary')).toHaveTextContent(
      /1 portál končí za/,
    )
    expect(screen.getByTestId('job-card-simplify18-extend-advertising')).toHaveTextContent('Prodloužit')
    expect(
      within(screen.getByTestId('job-card-advertisement-meta')).getByTestId(
        'job-card-simplify18-extend-advertising',
      ),
    ).toBeInTheDocument()
  })

  it('shows partial heading with expired portal secondary and extend action', () => {
    render(
      <JobCardSimplify18
        title="Test pozice"
        advertisements={[partialAd]}
        onExtendAndRepublish={() => {}}
      />,
    )

    expect(screen.getByTestId('job-card-simplify18-partial-heading')).toHaveTextContent('Běží')
    expect(screen.getByTestId('job-card-simplify18-advertisement-heading-secondary')).toHaveTextContent(
      '1 portál ukončen',
    )
    expect(screen.getByTestId('job-card-simplify18-extend-advertising')).toBeInTheDocument()
  })

  it('shows ended heading actions for extend and decline', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    const onDeclineAdvertising = vi.fn()

    render(
      <JobCardSimplify18
        title="Test pozice"
        advertisements={[endedAd]}
        onExtendAndRepublish={onExtendAndRepublish}
        onDeclineAdvertising={onDeclineAdvertising}
      />,
    )

    expect(screen.getByTestId('job-card-simplify18-expired-heading')).toHaveTextContent(
      'Inzerce skončila',
    )
    expect(screen.getByTestId('job-card-simplify18-advertisement-heading-secondary')).toHaveTextContent(
      '20. 10. 2026',
    )

    await user.click(screen.getByTestId('job-card-simplify18-extend-advertising'))
    await user.click(screen.getByTestId('job-card-simplify18-decline-advertising'))

    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)
    expect(onDeclineAdvertising).toHaveBeenCalledTimes(1)
  })

  it('shows declined not-advertising title and perex separately', () => {
    render(<JobCardSimplify18 title="Test pozice" advertisements={[notAdvertisingAd]} />)

    expect(screen.getByTestId('job-card-simplify18-not-advertising-heading')).toHaveTextContent(
      'Neinzeruje se',
    )
    expect(screen.getByTestId('job-card-simplify18-not-advertising-perex')).toHaveTextContent(
      /ukončeno od 20\. 10\./,
    )
    expect(screen.queryByText('Inzerce ukončena')).not.toBeInTheDocument()
  })

  it('shows never-created copy when the card has no advertisements', () => {
    render(
      <JobCardSimplify18 title="Test pozice" advertisements={[]} onCreateAdvertisement={() => {}} />,
    )

    expect(screen.getByTestId('job-card-simplify18-no-advertisement-heading')).toHaveTextContent(
      'Neinzeruje se',
    )
    expect(screen.getByTestId('job-card-simplify18-never-created-copy')).toHaveTextContent(
      'Zveřejněte ji na portálech a kariérních stránkách a získejte první kandidáty.',
    )
    expect(screen.queryByTestId('job-card-simplify18-no-advertisement-perex')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-simplify18-start-advertising')).toHaveTextContent(
      'Začít inzerovat',
    )
  })
})
