import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify10 } from './JobCardSimplify10'

const endingSoonAdvertisement: JobAdvertisement = {
  id: 'ad-ending',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026', viewCount: 1840 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026', viewCount: 920 },
  ],
}

const expiredAdvertisement: JobAdvertisement = {
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
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
      viewCount: 760,
    },
  ],
}

const notAdvertisingAdvertisement: JobAdvertisement = {
  id: 'ad-declined',
  status: 'notAdvertising',
  advertisingDeclinedAt: '20. 10. 2026',
  publications: expiredAdvertisement.publications,
}

function renderSimplify10(props: Partial<Parameters<typeof JobCardSimplify10>[0]> = {}) {
  return render(
    <JobCardSimplify10
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{
        unassessed: 14,
        preselected: 8,
        invited: 5,
        hired: 2,
        total: 32,
      }}
      advertisements={[endingSoonAdvertisement]}
      {...props}
    />,
  )
}

describe('JobCardSimplify10', () => {
  it('shows ending soon panel with warning heading and extend CTA', async () => {
    const onExtendAndRepublish = vi.fn()
    renderSimplify10({ onExtendAndRepublish })

    const panel = screen.getByTestId('job-card-simplify10-ending-soon')
    expect(panel).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-ending-soon-heading')).toHaveClass(
      'tm-text-emotion-warning-emphasis',
    )
    expect(screen.getByTestId('job-card-advertisement-ending-soon-heading')).toHaveTextContent(
      /Končí za .* · 27\. 10\. 2026/,
    )

    await userEvent.click(screen.getByTestId('job-card-simplify10-extend-advertising'))
    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)
  })

  it('shows expired panel with danger heading and decline link', async () => {
    const onExtendAndRepublish = vi.fn()
    const onDeclineAdvertising = vi.fn()
    renderSimplify10({
      advertisements: [expiredAdvertisement],
      onExtendAndRepublish,
      onDeclineAdvertising,
    })

    expect(screen.getByTestId('job-card-simplify10-expired')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveClass(
      'tm-text-emotion-danger-emphasis',
    )
    expect(screen.getByTestId('job-card-publication-ended-heading')).toHaveTextContent(
      'Inzerce skončila 20. 10. 2026',
    )
    expect(screen.getByText('Nábor běží, ale pozice už není vidět. Noví kandidáti nepřijdou.')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('job-card-simplify10-restore-advertising'))
    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByTestId('job-card-simplify10-decline-advertising'))
    expect(onDeclineAdvertising).toHaveBeenCalledTimes(1)
  })

  it('applies quiet card styling for notAdvertising', async () => {
    const onRepublishAdvertisement = vi.fn()
    renderSimplify10({
      advertisements: [notAdvertisingAdvertisement],
      onRepublishAdvertisement,
    })

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-quiet', 'true')
    expect(screen.getByTestId('job-card')).toHaveClass('tm-bg-cover-light')
    expect(screen.getByTestId('job-card-simplify10-not-advertising-heading')).toHaveTextContent(
      'Neinzeruje se',
    )
    expect(screen.getByText(/Inzerce ukončena 20\. 10\. 2026 · 2 860 zhlédnutí/)).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('job-card-simplify10-republish'))
    expect(onRepublishAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('falls back to simplify9 ended row for mixed publications', () => {
    renderSimplify10({
      advertisements: [
        {
          id: 'ad-mixed',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 700 },
            {
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '12. 6.',
              endDate: '1. 9. 2026',
              viewCount: 760,
            },
          ],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-simplify10-expired')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-ended-row')).toBeInTheDocument()
  })
})
