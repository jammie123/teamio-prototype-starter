import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JobCardAdvertisement } from './JobCardAdvertisement'

describe('JobCardAdvertisement stats dropdown', () => {
  it('lists per-jobboard stats and a secondary detailed-statistics action', () => {
    const onViewStatisticsClick = vi.fn()
    render(
      <JobCardAdvertisement
        advertisement={{
          id: 'ad-1',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '12. 7.',
              endDate: '15. 9. 2026',
              viewCount: 842,
              reactionCount: 21,
            },
            {
              id: 'prace',
              channel: 'Prace.cz',
              startDate: '12. 7.',
              endDate: '30. 9. 2026',
              viewCount: 312,
              reactionCount: 9,
            },
            {
              id: 'career',
              channel: 'Kariérní stránky',
              startDate: '12. 7.',
              endDate: '12. 8. 2026',
              viewCount: 130,
            },
          ],
        }}
        onViewStatisticsClick={onViewStatisticsClick}
      />,
    )

    fireEvent.click(screen.getByTestId('job-card-advertisement-stats-toggle'))
    const dropdown = screen.getByTestId('job-card-advertisement-stats-dropdown')
    expect(dropdown).toHaveTextContent('Jobs.cz')
    expect(dropdown).toHaveTextContent(/842 zhlédnutí/)
    expect(dropdown).toHaveTextContent(/21 reakcí/)
    expect(dropdown).toHaveTextContent('Prace.cz')
    expect(dropdown).toHaveTextContent('Kariérní stránky')
    expect(screen.getAllByTestId('job-card-advertisement-stats-row')).toHaveLength(3)

    fireEvent.click(screen.getByTestId('job-card-advertisement-detailed-stats'))
    expect(onViewStatisticsClick).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('job-card-advertisement-detailed-stats')).toHaveTextContent(
      'Přejít na podrobné statistiky',
    )
  })
})
