import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
  it('puts status, portals and views on one row', () => {
    renderWidget(runningSame)

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-flex-row')
    expect(advertisement.className).toContain('tm-py-5')
    expect(advertisement.className).not.toContain('tm-flex-col')
    expect(advertisement.className).not.toContain('tm-rounded')

    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const channels = within(advertisement).getByTestId('job-card-advertisement-badges')
    const views = within(advertisement).getByTestId('job-card-advertisement-aggregate-views')

    expect(heading).toHaveTextContent('Běží 1. 1. – 1. 2. 2026')
    expect(heading.parentElement).toBe(advertisement)
    expect(channels.parentElement).toBe(advertisement)
    expect(views.parentElement?.parentElement).toBe(advertisement)
    expect(heading.compareDocumentPosition(channels) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(channels.compareDocumentPosition(views) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(channels).getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(views).toHaveTextContent(/3\s170 zhlédnutí/)
  })

  it('renders portals as chips without status dots while all share one status', () => {
    renderWidget(runningSame)

    const channels = screen.getAllByTestId('job-card-publication-channel')
    expect(channels.map((channel) => channel.textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    expect(screen.queryByTestId('job-card-publication-dot')).not.toBeInTheDocument()
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
    expect(advertisement).not.toHaveTextContent('1. 9. – 30. 10.')
  })

  it('keeps a running advertisement with a finished portal on one row', () => {
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
    expect(advertisement.className).toContain('tm-flex-row')
  })

  it('puts Prodloužit on the same row as an advertisement that ends soon', async () => {
    const user = userEvent.setup()
    const onProlong = vi.fn()
    renderWidget(endingSoon, { onProlong })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const prolong = within(advertisement).getByRole('button', { name: 'Prodloužit' })

    expect(heading).toHaveTextContent('Končí za 3 dny 1. 9. – 30. 9. 2026')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(heading.parentElement).toBe(advertisement)
    expect(prolong.parentElement).toBe(advertisement)
    expect(advertisement).not.toHaveTextContent('zmizí inzerát')

    await user.click(prolong)
    expect(onProlong).toHaveBeenCalledOnce()
  })

  it('shows an ended advertisement with from-to dates and no Prodloužit', () => {
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
    expect(screen.queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    expect(screen.queryByText(/ukončeno 15\. 8\./)).not.toBeInTheDocument()
  })

  it('shows "Zatím nevystavený inzerát" without portals or views', () => {
    renderWidget({ id: 'ad-empty', publications: [] })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Zatím nevystavený inzerát',
    )
    expect(screen.queryByTestId('job-card-advertisement-badges')).not.toBeInTheDocument()
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

    const names = screen.getAllByTestId('job-card-publication-highlight-name')
    expect(names.map((name) => name.textContent)).toEqual(['Jobstip'])
  })

  it('shows the title next to the views when requested', () => {
    renderWidget({ ...runningSame, title: 'Hlavní inzerát' }, { showTitle: true })

    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Hlavní inzerát')
    expect(screen.getByTestId('job-card-advertisement-title-separator')).toBeInTheDocument()
  })
})
