import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify13 } from './JobCardSimplify13'

function daysFromNow(days: number) {
  const date = new Date('2026-10-22T12:00:00')
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const runningSameEndDate: JobAdvertisement = {
  id: 'ad-running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '15. 9. 2026', viewCount: 312 },
  ],
}

const endedSameDate: JobAdvertisement = {
  id: 'ad-ended',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 2100 },
    { id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 760 },
  ],
}

const mixedSameDates: JobAdvertisement = {
  id: 'ad-mixed',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1200 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 640 },
    { id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 280 },
    { id: 'atmoskop', channel: 'Atmoskop', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 90 },
  ],
}

const endingSoonSameDate: JobAdvertisement = {
  id: 'ad-ending',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 1200 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 640 },
  ],
}

const endingSoonDifferentDates: JobAdvertisement = {
  id: 'ad-ending-diff',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(6), viewCount: 800 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 440 },
  ],
}

function renderSimplify13(props: Partial<Parameters<typeof JobCardSimplify13>[0]> = {}) {
  return render(
    <JobCardSimplify13
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{
        unassessed: 14,
        preselected: 8,
        invited: 5,
        hired: 2,
        total: 32,
      }}
      advertisements={[runningSameEndDate]}
      {...props}
    />,
  )
}

describe('JobCardSimplify13', () => {
  it('shows Běží do … in the status heading when active portals share an end date', () => {
    renderSimplify13({ advertisements: [runningSameEndDate] })

    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent(
      /Běží do 15\. 9\./,
    )
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.getByText('Prace.cz')).toBeInTheDocument()
  })

  it('shows portal names for fully ended advertisements', () => {
    renderSimplify13({ advertisements: [endedSameDate] })

    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveTextContent(
      /Ukončeno 1\. 9\./,
    )
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.getByText('Prace.cz')).toBeInTheDocument()
  })

  it('shows one partial grid when both running and expired portals exist', () => {
    renderSimplify13({ advertisements: [mixedSameDates] })

    expect(screen.getByTestId('job-card-simplify13-partial-heading')).toHaveTextContent(
      'Běží částečně',
    )
    expect(screen.getByTestId('job-card-simplify13-partial-publications')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-publication-ended-heading')).not.toBeInTheDocument()
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.getByText('Atmoskop')).toBeInTheDocument()
  })

  it('uses Končí za … when all active portals end within a week on the same date', () => {
    renderSimplify13({ advertisements: [endingSoonSameDate] })

    expect(screen.getByTestId('job-card-advertisement-ending-soon-heading')).toHaveTextContent(
      /Končí za 5 dní/,
    )
  })

  it('uses Končí za … for mixed active periods when any portal ends soon', () => {
    renderSimplify13({ advertisements: [endingSoonDifferentDates] })

    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent(
      /Končí za 6 dní/,
    )
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toBeInTheDocument()
  })

  it('cycles advertisements with the switcher', async () => {
    const secondAdvertisement: JobAdvertisement = {
      id: 'ad-2',
      publications: [
        { id: 'career', channel: 'Kariérní stránky', startDate: '1. 8.', endDate: '1. 11. 2026' },
      ],
    }

    renderSimplify13({
      advertisements: [runningSameEndDate, secondAdvertisement],
    })

    await userEvent.click(screen.getByTestId('job-card-advertisement-switcher-next'))
    expect(screen.getByText('Kariérní stránky')).toBeInTheDocument()
  })

  it('shows notAdvertising meta and republish action', async () => {
    const onRepublishAdvertisement = vi.fn()
    const notAdvertisingAdvertisement: JobAdvertisement = {
      id: 'ad-not-advertising',
      status: 'notAdvertising',
      advertisingDeclinedAt: '20. 10. 2026',
      publications: [
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '20. 10. 2026',
          viewCount: 2100,
        },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          endDate: '20. 10. 2026',
          viewCount: 1070,
        },
      ],
    }

    renderSimplify13({
      advertisements: [notAdvertisingAdvertisement],
      onRepublishAdvertisement,
    })

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-quiet', 'true')
    expect(screen.getByTestId('job-card-simplify10-not-advertising-heading')).toHaveTextContent(
      'Neinzeruje se',
    )
    const meta = screen.getByTestId('job-card-not-advertising-meta')
    expect(meta).toHaveTextContent('Inzerce ukončena 20. 10. 2026 · 3 170 zhlédnutí')
    expect(meta).toHaveClass('tm-text-sm')
    await userEvent.click(screen.getByTestId('job-card-simplify10-republish'))
    expect(onRepublishAdvertisement).toHaveBeenCalled()
  })

  it('forwards candidate stat clicks from S8 stats', async () => {
    const onCandidatesClick = vi.fn()
    renderSimplify13({ onCandidatesClick })

    await userEvent.click(screen.getByTestId('job-card-stat-invited'))
    expect(onCandidatesClick).toHaveBeenCalledWith('invited')
  })
})
