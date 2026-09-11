import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JobCardAdvertisement } from './JobCardAdvertisement'
import type { JobAdvertisement } from './types'

function renderAdvertisement(advertisement: JobAdvertisement) {
  return render(<JobCardAdvertisement advertisement={advertisement} />)
}

describe('JobCardAdvertisement ending-soon groups', () => {
  it('warns on the shared heading when every running portal ends within a week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      renderAdvertisement({
        id: 'ad-ending-same',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 8. 2026' },
          { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 8. 2026' },
        ],
      })

      const heading = screen.getByTestId('job-card-advertisement-ending-soon-heading')
      expect(heading.textContent).toBe('Končí za 6 dní · 30. 8. 2026')
      expect(heading).toHaveClass(
        'tm-text-emotion-warning-emphasis',
        'tm-font-semibold',
        'tm-text-sm',
      )
      expect(heading).not.toHaveClass('tm-text-emotion-success-emphasis')
      expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('lifts an ending-soon portal into its own heading above Běží when other dates still run', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 26))

    try {
      renderAdvertisement({
        id: 'ad-ending-diff',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '31. 8. 2026' },
          { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        ],
      })

      const endingSoon = screen.getByTestId('job-card-advertisement-ending-soon-heading')
      expect(endingSoon.textContent).toBe('Končí za 5 dní · 31. 8. 2026')
      expect(endingSoon).toHaveClass('tm-font-semibold', 'tm-text-emotion-warning-emphasis')
      expect(
        within(screen.getByTestId('job-card-advertisement-ending-soon-publications')).getByTestId(
          'job-card-publication-channel',
        ),
      ).toHaveTextContent('Jobs.cz')
      expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()

      const running = screen.getByTestId('job-card-advertisement-running-heading')
      expect(running.textContent).toBe('Běží 12. 7. – 30. 9. 2026')
      expect(running).toHaveClass('tm-text-emotion-success-emphasis', 'tm-font-medium')
      expect(running).not.toHaveClass('tm-text-emotion-warning-emphasis')
      expect(
        within(screen.getByTestId('job-card-advertisement-active-publications')).getByTestId(
          'job-card-publication-channel',
        ),
      ).toHaveTextContent('Prace.cz')
      expect(
        endingSoon.compareDocumentPosition(running) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })

  it('uses Končí brzy and date rows when ending-soon portals have different dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 26))

    try {
      renderAdvertisement({
        id: 'ad-ending-many',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '28. 8. 2026' },
          { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '31. 8. 2026' },
          { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        ],
      })

      const endingSoon = screen.getByTestId('job-card-advertisement-ending-soon-heading')
      expect(endingSoon.textContent).toBe('Končí brzy')
      expect(endingSoon).toHaveClass('tm-font-medium', 'tm-text-emotion-warning-emphasis')

      const groups = within(
        screen.getByTestId('job-card-advertisement-ending-soon-publications'),
      ).getAllByTestId('job-card-publication-date-group')
      expect(groups).toHaveLength(2)
      expect(within(groups[0]).getByTestId('job-card-publication-dates').textContent).toBe(
        'Končí za 2 dny · 28. 8. 2026',
      )
      expect(within(groups[0]).getByTestId('job-card-publication-channel').textContent).toBe(
        'Jobs.cz',
      )
      expect(within(groups[1]).getByTestId('job-card-publication-dates').textContent).toBe(
        'Končí za 5 dní · 31. 8. 2026',
      )
      expect(within(groups[1]).getByTestId('job-card-publication-channel').textContent).toBe(
        'Prace.cz',
      )
      groups.forEach((group) => {
        const date = within(group).getByTestId('job-card-publication-dates')
        expect(date).toHaveClass('tm-font-normal', 'tm-text-secondary-default')
        expect(date).not.toHaveClass('tm-font-semibold', 'tm-text-emotion-warning-emphasis')
      })

      expect(screen.getByTestId('job-card-advertisement-running-heading').textContent).toBe(
        'Běží 12. 7. – 30. 9. 2026',
      )
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows Končí, Běží and Ukončeno as three category headings in that order', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 26))

    try {
      renderAdvertisement({
        id: 'ad-ending-mixed',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '20. 8. 2026', endDate: '31. 8. 2026' },
          { id: 'prace', channel: 'Prace.cz', startDate: '20. 8. 2026', endDate: '31. 10. 2026' },
          {
            id: 'career',
            channel: 'Kariérní stránky',
            status: 'expired',
            startDate: '2. 6. 2026',
            endDate: '10. 8. 2026',
          },
        ],
      })

      const endingSoon = screen.getByTestId('job-card-advertisement-ending-soon-heading')
      const running = screen.getByTestId('job-card-advertisement-running-heading')
      const ended = screen.getByTestId('job-card-publication-ended-heading')

      expect(endingSoon.textContent).toBe('Končí za 5 dní · 31. 8. 2026')
      expect(running.textContent).toBe('Běží 20. 8. – 31. 10. 2026')
      expect(ended.textContent).toBe('Ukončeno 10. 8.')
      expect(
        endingSoon.compareDocumentPosition(running) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
      expect(running.compareDocumentPosition(ended) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })
})

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
