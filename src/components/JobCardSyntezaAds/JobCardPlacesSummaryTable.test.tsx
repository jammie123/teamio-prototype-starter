import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  JobCardPlacesSummaryTable,
  shouldShowPlacesProlong,
} from './JobCardPlacesSummaryTable'
import type { JobPublication } from '../JobCardSynteza/types'

const publications: JobPublication[] = [
  {
    id: 'jobs',
    channel: 'Jobs.cz',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    viewCount: 1840,
    reactionCount: 56,
  },
  {
    id: 'prace',
    channel: 'Prace.cz',
    startDate: '12. 7. 2026',
    endDate: '1. 9. 2026',
    status: 'expired',
    viewCount: 920,
  },
]

describe('JobCardPlacesSummaryTable', () => {
  it('renders place, period, views and reactions columns', () => {
    render(<JobCardPlacesSummaryTable publications={publications} />)

    const summary = screen.getByTestId('job-card-places-summary')
    expect(summary).toHaveClass('tm-w-max')
    expect(screen.getByTestId('job-card-places-summary-table')).toHaveClass('tm-text-13')
    expect(screen.getByRole('columnheader', { name: 'Název místa' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Vystavení' })).toHaveClass('tm-whitespace-nowrap')
    expect(screen.getByRole('columnheader', { name: 'Shlédnutí' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Reakcí' })).toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-places-summary-row')).toHaveLength(2)
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-places-summary-extend')).not.toBeInTheDocument()
  })

  it('shows Prodloužit and calls onExtend when requested', async () => {
    const user = userEvent.setup()
    const onExtend = vi.fn()

    render(
      <JobCardPlacesSummaryTable publications={publications} showProlong onExtend={onExtend} />,
    )

    await user.click(screen.getByTestId('job-card-places-summary-extend'))
    expect(onExtend).toHaveBeenCalledTimes(1)
  })

  it('flags prolong when a publication is expired or ending soon', () => {
    expect(shouldShowPlacesProlong(publications)).toBe(true)
    expect(
      shouldShowPlacesProlong([
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          startDate: '12. 7. 2026',
          endDate: '30. 12. 2026',
        },
      ]),
    ).toBe(false)
  })
})
