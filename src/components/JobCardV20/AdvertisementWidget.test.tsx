import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvertisementWidget } from './AdvertisementWidget'
import type { JobAdvertisement, JobPublication } from './types'

const now = new Date(2026, 8, 27)

function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 1. 2026', viewCount: 100, ...partial }
}

const runningSame: JobAdvertisement = {
  id: 'ad-1',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026', viewCount: 2000 }),
    portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 800 }),
    portal({ id: 'career', channel: 'Kariérní stránky', endDate: '1. 2. 2026', viewCount: 370 }),
  ],
}

const endingSoon: JobAdvertisement = {
  id: 'ad-soon',
  publications: ['jobs', 'prace', 'career'].map((id) =>
    portal({ id, channel: id, startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
  ),
}

function renderWidget(advertisement: JobAdvertisement, props = {}) {
  return render(<AdvertisementWidget advertisement={advertisement} now={now} {...props} />)
}

describe('AdvertisementWidget', () => {
  it('renders status and portals without AdvertisementStats', () => {
    renderWidget(runningSame)

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).not.toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-flex-col')
    expect(advertisement.className).not.toContain('tm-bg-emotion-warning-background/80')
    expect(advertisement.className).not.toMatch(/tm-bg-/)

    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const channels = within(advertisement).getByTestId('job-card-advertisement-publications')

    expect(heading).toHaveTextContent('Běží 1. 1. – 1. 2. 2026')
    expect(heading.compareDocumentPosition(channels) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(channels).getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(screen.queryByTestId('job-card-advertisement-stats')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-action')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-top')).not.toBeInTheDocument()
  })

  it('can show a top border when stacked under another advertisement', () => {
    renderWidget(runningSame, { hideTopBorder: false })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-pt-4')
  })

  it('renders each portal with a status dot and dotted underline', () => {
    renderWidget(runningSame)

    const channels = screen.getAllByTestId('job-card-publication-channel')
    expect(channels.map((channel) => channel.textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    expect(screen.getAllByTestId('job-card-publication-dot')).toHaveLength(3)
    for (const channel of channels) {
      expect(channel.className).toContain('tm-border-dotted')
    }
  })

  it('shows each live portal as do-date when periods differ', () => {
    renderWidget({
      id: 'ad-diff',
      publications: [
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '15. 9. 2026', endDate: '15. 11. 2026' }),
      ],
    })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(within(advertisement).getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží v různých obdobích',
    )
    expect(within(advertisement).getByText('do 30. 10.')).toBeInTheDocument()
    expect(within(advertisement).getByText('do 15. 11.')).toBeInTheDocument()
  })

  it('keeps a running advertisement with a finished portal in a vertical block', () => {
    renderWidget({
      id: 'ad-mixed',
      publications: [
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
        portal({
          id: 'career',
          channel: 'Kariérní stránky',
          startDate: '1. 9. 2026',
          endDate: '30. 10. 2026',
        }),
      ],
    })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(within(advertisement).getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží 30. 10.',
    )
    expect(within(advertisement).getByText('ukončeno 15. 8.')).toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-publication-dot')).toHaveLength(3)
  })

  it('shows ending-soon warning without Prodloužit', () => {
    renderWidget(endingSoon)

    const advertisement = screen.getByTestId('job-card-advertisement')
    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')

    expect(heading).toHaveTextContent('Končí za 3 dny 1. 9. – 30. 9. 2026')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(advertisement).toHaveAttribute('data-kind', 'endingSoon')
    expect(advertisement.className).not.toContain('tm-bg-emotion-warning-background/80')
    expect(advertisement.className).not.toMatch(/tm-bg-/)
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('shows an ended advertisement with from-to dates', () => {
    renderWidget({
      id: 'ad-ended',
      publications: [
        portal({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Ukončeno 1. 8. – 15. 8. 2026',
    )
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('shows "Zatím nevystavený inzerát" without portals or views', () => {
    renderWidget({ id: 'ad-empty', publications: [] })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Zatím nevystavený inzerát',
    )
    expect(screen.queryByTestId('job-card-advertisement-publications')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
  })

  it('renders Jobstip and Topováno highlights after their portal', () => {
    renderWidget({
      id: 'ad-highlights',
      publications: [
        {
          ...portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026' }),
          highlights: [
            { id: 'h1', name: 'Jobstip', startDate: '8. 6.', endDate: '30. 9. 2026' },
            { id: 'h2', name: 'Topováno', startDate: '22. 6.', status: 'expired' },
          ],
        },
      ],
    })

    const highlight = screen.getByTestId('job-card-publication-highlight')
    expect(highlight).toHaveTextContent('+ Jobstip')
    expect(screen.getAllByTestId('job-card-publication-highlight-name')).toHaveLength(1)
  })

  it('shows the title above the status when requested', () => {
    renderWidget({ ...runningSame, title: 'Hlavní inzerát' }, { showTitle: true })

    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Hlavní inzerát')
  })
})
