import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JobCardAdvertisement } from './JobCardAdvertisement'
import type { JobAdvertisement } from '../JobCardSynteza/types'

function renderAdvertisement(advertisement: JobAdvertisement) {
  return render(<JobCardAdvertisement advertisement={advertisement} />)
}

describe('JobCardAdvertisement same-date groups', () => {
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
      expect(screen.queryByTestId('job-card-advertisement-running-heading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('job-card-publication-period-badge')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps Běží with the date range when every running portal shares a later date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      renderAdvertisement({
        id: 'ad-running-same',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
          { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        ],
      })

      const heading = screen.getByTestId('job-card-advertisement-running-heading')
      expect(heading.textContent).toBe('Běží 12. 7. – 30. 9. 2026')
      expect(screen.queryByTestId('job-card-publication-period-badge')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('JobCardAdvertisement mixed periods', () => {
  it('uses Běží v různá období and warning badges when ending-soon dates differ', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 26))

    try {
      renderAdvertisement({
        id: 'ad-ending-many',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '28. 8. 2026' },
          { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '31. 8. 2026' },
        ],
      })

      const heading = screen.getByTestId('job-card-advertisement-running-heading')
      expect(heading.textContent).toBe('Běží v různá období')
      expect(heading).toHaveClass('tm-text-secondary-default', 'tm-font-medium')
      expect(screen.queryByTestId('job-card-advertisement-ending-soon-heading')).not.toBeInTheDocument()
      expect(screen.queryByText('Končí brzy')).not.toBeInTheDocument()

      const badges = screen.getAllByTestId('job-card-publication-period-badge')
      expect(badges).toHaveLength(2)
      expect(badges[0]).toHaveTextContent('zbývá 2 dny')
      expect(badges[0]).toHaveClass('tm-bg-emotion-warning-background', 'tm-text-emotion-warning-emphasis')
      expect(badges[1]).toHaveTextContent('zbývá 5 dní')

      const list = screen.getByTestId('job-card-advertisement-active-publications')
      expect(list.tagName).toBe('DIV')
      expect(list).toHaveClass('tm-grid', 'tm-grid-cols-1')
      expect(screen.getAllByTestId('job-card-advertisement-period-column')).toHaveLength(1)
      expect(list.querySelector('ul, li')).toBeNull()
      expect(screen.queryByTestId('job-card-publication-separator')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('puts a warning badge on the ending-soon portal and informative dates on the rest', () => {
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

      expect(screen.getByTestId('job-card-advertisement-running-heading').textContent).toBe(
        'Běží v různá období',
      )
      expect(screen.queryByTestId('job-card-advertisement-ending-soon-heading')).not.toBeInTheDocument()

      const publications = screen.getAllByTestId('job-card-publication')
      expect(within(publications[0]).getByTestId('job-card-publication-channel')).toHaveTextContent(
        'Jobs.cz',
      )
      expect(within(publications[0]).getByTestId('job-card-publication-period-badge')).toHaveTextContent(
        'zbývá 5 dní',
      )
      expect(within(publications[0]).getByTestId('job-card-publication-period-badge')).toHaveClass(
        'tm-bg-emotion-warning-background',
      )
      expect(within(publications[1]).getByTestId('job-card-publication-channel')).toHaveTextContent(
        'Prace.cz',
      )
      expect(within(publications[1]).getByTestId('job-card-publication-period-badge')).toHaveTextContent(
        '30. 9. 2026',
      )
      expect(within(publications[1]).getByTestId('job-card-publication-period-badge')).toHaveClass(
        'tm-bg-emotion-info-background',
        'tm-text-emotion-info-emphasis',
      )
    } finally {
      vi.useRealTimers()
    }
  })

  it('renders mixed-period dates as secondary text when periodPresentation is text', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      render(
        <JobCardAdvertisement
          advertisement={{
            id: 'ad-running-diff',
            publications: [
              { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
              { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '20. 9. 2026' },
            ],
          }}
          periodPresentation="text"
        />,
      )

      const badges = screen.getAllByTestId('job-card-publication-period-badge')
      expect(badges[0]).toHaveTextContent('20. 9. 2026')
      expect(badges[0]).toHaveClass('tm-text-sm', 'tm-text-secondary-default')
      expect(badges[0]).not.toHaveClass('tm-bg-emotion-info-background')
      expect(badges[1]).toHaveTextContent('30. 9. 2026')
      expect(badges[1]).not.toHaveClass('tm-bg-emotion-info-background')
    } finally {
      vi.useRealTimers()
    }
  })

  it('uses warning medium text for mixed-period ending-soon dates when periodPresentation is text', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 26))

    try {
      render(
        <JobCardAdvertisement
          advertisement={{
            id: 'ad-ending-diff',
            publications: [
              { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '31. 8. 2026' },
              { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
            ],
          }}
          periodPresentation="text"
        />,
      )

      const heading = screen.getByTestId('job-card-advertisement-running-heading')
      expect(heading.textContent).toBe('Běží v různá období')
      expect(heading).toHaveClass('tm-text-sm', 'tm-font-medium', 'tm-text-secondary-default')

      const publications = screen.getAllByTestId('job-card-publication')
      const endingSoon = within(publications[0]).getByTestId('job-card-publication-period-badge')
      expect(endingSoon).toHaveTextContent('zbývá 5 dní')
      expect(endingSoon).toHaveClass(
        'tm-text-sm',
        'tm-font-medium',
        'tm-text-emotion-warning-emphasis',
      )
      expect(endingSoon).not.toHaveClass('tm-bg-emotion-warning-background')

      const later = within(publications[1]).getByTestId('job-card-publication-period-badge')
      expect(later).toHaveTextContent('30. 9. 2026')
      expect(later).toHaveClass('tm-text-sm', 'tm-text-secondary-default')
      expect(later).not.toHaveClass('tm-text-emotion-warning-emphasis')
    } finally {
      vi.useRealTimers()
    }
  })

  it('uses informative end-date badges when running portals have different later dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      renderAdvertisement({
        id: 'ad-running-diff',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
          { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '20. 9. 2026' },
        ],
      })

      expect(screen.getByTestId('job-card-advertisement-running-heading').textContent).toBe(
        'Běží v různá období',
      )
      const badges = screen.getAllByTestId('job-card-publication-period-badge')
      expect(badges[0]).toHaveTextContent('20. 9. 2026')
      expect(badges[0]).toHaveClass('tm-bg-emotion-info-background')
      expect(badges[1]).toHaveTextContent('30. 9. 2026')
      expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('balances four mixed-period portals into two columns of two', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 25))

    try {
      renderAdvertisement({
        id: 'ad-running-four',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
          { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
          { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '20. 9. 2026' },
          { id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7. 2026', endDate: '12. 10. 2026' },
        ],
      })

      const list = screen.getByTestId('job-card-advertisement-active-publications')
      expect(list).toHaveClass('tm-grid', 'tm-grid-cols-2')

      const columns = screen.getAllByTestId('job-card-advertisement-period-column')
      expect(columns).toHaveLength(2)
      columns.forEach((column) => {
        expect(column).toHaveClass('tm-grid', 'tm-grid-cols-[minmax(0,10rem)_auto]')
        expect(within(column).getAllByTestId('job-card-publication')).toHaveLength(2)
        expect(within(column).getAllByTestId('job-card-publication-period-badge')).toHaveLength(2)
      })
      expect(within(columns[0]).getAllByTestId('job-card-publication-channel')[0]).toHaveTextContent(
        'Jobs.cz',
      )
      expect(within(columns[0]).getAllByTestId('job-card-publication-period-badge')[0]).toHaveTextContent(
        'zbývá 5 dní',
      )
      expect(within(columns[1]).getAllByTestId('job-card-publication-channel')[0]).toHaveTextContent(
        'Atmoskop',
      )
    } finally {
      vi.useRealTimers()
    }
  })

  it('puts the extra portal in the first column when the count is odd', () => {
    renderAdvertisement({
      id: 'ad-running-three',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '20. 9. 2026' },
        { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '12. 10. 2026' },
      ],
    })

    const columns = screen.getAllByTestId('job-card-advertisement-period-column')
    expect(columns).toHaveLength(2)
    expect(within(columns[0]).getAllByTestId('job-card-publication')).toHaveLength(2)
    expect(within(columns[1]).getAllByTestId('job-card-publication')).toHaveLength(1)
  })

  it('keeps Ukončeno below mixed running portals', () => {
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

      const running = screen.getByTestId('job-card-advertisement-running-heading')
      const ended = screen.getByTestId('job-card-publication-ended-heading')
      expect(running.textContent).toBe('Běží v různá období')
      expect(ended.textContent).toBe('Ukončeno 10. 8.')
      expect(
        running.compareDocumentPosition(ended) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })

  it('uses the balanced badge grid for expired portals with different dates', () => {
    renderAdvertisement({
      id: 'ad-ended-diff',
      publications: [
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '1. 9. 2026',
        },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '1. 9. 2026',
        },
        {
          id: 'career',
          channel: 'Kariérní stránky',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '1. 9. 2026',
        },
        {
          id: 'atmoskop',
          channel: 'Atmoskop',
          status: 'expired',
          startDate: '1. 6. 2026',
          endDate: '12. 8. 2026',
        },
      ],
    })

    expect(screen.getByTestId('job-card-publication-ended-heading').textContent).toBe('Ukončeno')
    expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-publication-separator')).not.toBeInTheDocument()

    const list = screen.getByTestId('job-card-advertisement-ended-publications')
    expect(list.tagName).toBe('DIV')
    expect(list).toHaveClass('tm-grid', 'tm-grid-cols-2')
    expect(list.querySelector('ul, li')).toBeNull()

    const columns = within(list).getAllByTestId('job-card-advertisement-period-column')
    expect(columns).toHaveLength(2)
    expect(within(columns[0]).getAllByTestId('job-card-publication')).toHaveLength(2)
    expect(within(columns[1]).getAllByTestId('job-card-publication')).toHaveLength(2)

    const badges = screen.getAllByTestId('job-card-publication-period-badge')
    expect(badges).toHaveLength(4)
    expect(badges[0]).toHaveTextContent('12. 8. 2026')
    expect(badges[0]).toHaveClass('tm-bg-emotion-info-background')
    expect(badges[3]).toHaveTextContent('1. 9. 2026')
  })

  it('keeps a single ended row without badges when every expired portal shares a date', () => {
    renderAdvertisement({
      id: 'ad-ended-same',
      publications: [
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '1. 9. 2026',
        },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '1. 9. 2026',
        },
      ],
    })

    expect(screen.getByTestId('job-card-publication-ended-heading').textContent).toBe(
      'Ukončeno 1. 9.',
    )
    expect(screen.queryByTestId('job-card-publication-period-badge')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-ended-publications').tagName).toBe('UL')
  })
})

describe('JobCardAdvertisement draft', () => {
  const draftAdvertisement: JobAdvertisement = {
    id: 'ad-draft',
    title: 'Řidič/ka sk. C — druhý inzerát',
    status: 'draft',
    publications: [],
  }

  it('renders a follow-up card with copy and Dokončit inzerát', () => {
    const onCompleteAdvertisement = vi.fn()
    render(
      <JobCardAdvertisement
        advertisement={draftAdvertisement}
        onCompleteAdvertisement={onCompleteAdvertisement}
      />,
    )

    const card = screen.getByTestId('job-card-advertisement-draft')
    expect(card).toHaveTextContent('Řidič/ka sk. C — druhý inzerát')
    const badge = screen.getByTestId('job-card-advertisement-draft-badge')
    expect(badge).toHaveTextContent('Rozpracovaný')
    expect(badge).toHaveClass('tm-bg-emotion-info-background', 'tm-text-emotion-info-emphasis')
    expect(card).toHaveTextContent(
      'Inzerát ještě není dokončený. Dokončete ho a pokračujte ve zveřejnění.',
    )
    expect(card).toHaveClass(
      'tm-rounded',
      'tm-border',
      'tm-border-secondary',
      'tm-bg-cover-light',
      'tm-p-4',
    )
    expect(screen.queryByText('Inzerát není nikde vystavený.')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-meta')).not.toBeInTheDocument()

    const complete = screen.getByTestId('job-card-advertisement-complete')
    expect(complete).toHaveTextContent('Dokončit inzerát')
    expect(complete).toHaveClass('!tm-min-h-7', '!tm-px-3', '!tm-py-1')
    fireEvent.click(complete)
    expect(onCompleteAdvertisement).toHaveBeenCalledTimes(1)
    expect(onCompleteAdvertisement).toHaveBeenCalledWith(draftAdvertisement)
  })

  it('falls back to Rozpracovaný inzerát when the draft has no title', () => {
    render(<JobCardAdvertisement advertisement={{ id: 'ad-draft', status: 'draft' }} />)

    expect(screen.getByTestId('job-card-advertisement-draft')).toHaveTextContent(
      'Rozpracovaný inzerát',
    )
    expect(screen.getByTestId('job-card-advertisement-draft-badge')).toHaveTextContent(
      'Rozpracovaný',
    )
  })

  it('hides Dokončit inzerát when the complete handler is missing', () => {
    render(<JobCardAdvertisement advertisement={draftAdvertisement} />)

    expect(screen.getByTestId('job-card-advertisement-draft')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-complete')).not.toBeInTheDocument()
  })

  it('keeps empty publications without draft status as unpublished', () => {
    render(<JobCardAdvertisement advertisement={{ id: 'ad-empty', publications: [] }} />)

    expect(screen.getByText('Inzerát není nikde vystavený.')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-draft')).not.toBeInTheDocument()
  })

  it('ignores publications on a draft advertisement', () => {
    render(
      <JobCardAdvertisement
        advertisement={{
          ...draftAdvertisement,
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 10 },
          ],
        }}
      />,
    )

    expect(screen.getByTestId('job-card-advertisement-draft')).toBeInTheDocument()
    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-meta')).not.toBeInTheDocument()
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
          ],
        }}
        onViewStatisticsClick={onViewStatisticsClick}
      />,
    )

    fireEvent.click(screen.getByTestId('job-card-advertisement-stats-toggle'))
    expect(screen.getByTestId('job-card-advertisement-stats-dropdown')).toHaveTextContent('Jobs.cz')
    fireEvent.click(screen.getByTestId('job-card-advertisement-detailed-stats'))
    expect(onViewStatisticsClick).toHaveBeenCalledTimes(1)
  })

  it('keeps the Zobrazit náhled link next to the view count by default', () => {
    render(
      <JobCardAdvertisement
        advertisement={{
          id: 'ad-1',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
          ],
        }}
        onPreviewAdvertisement={vi.fn()}
      />,
    )

    expect(screen.getByTestId('job-card-advertisement-preview')).toHaveTextContent('Zobrazit náhled')
    expect(screen.getByTestId('job-card-advertisement-preview-separator')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toBeInTheDocument()
  })

  it('hides the preview link and separator when showPreviewLink is false', () => {
    render(
      <JobCardAdvertisement
        advertisement={{
          id: 'ad-1',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
          ],
        }}
        showPreviewLink={false}
        onPreviewAdvertisement={vi.fn()}
      />,
    )

    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-preview')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-preview-separator')).not.toBeInTheDocument()
  })
})
