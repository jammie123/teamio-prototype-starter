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
  return render(
    <AdvertisementWidget
      advertisement={advertisement}
      now={now}
      onAdvertisementPreviewClick={vi.fn()}
      onAdvertisementDetailClick={vi.fn()}
      {...props}
    />,
  )
}

describe('AdvertisementWidget', () => {
  it('puts status and portals on the left and advertisement actions on the right', () => {
    renderWidget(runningSame)

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-flex-col')
    expect(advertisement.className).toContain('tm-pt-3')
    expect(advertisement.className).toContain('tm-pb-5')
    expect(advertisement.className).not.toContain('tm-rounded')

    const topRow = within(advertisement).getByTestId('job-card-advertisement-top')
    const heading = within(topRow).getByTestId('job-card-advertisement-heading')
    const channels = within(topRow).getByTestId('job-card-advertisement-publications')
    const actions = within(topRow).getByTestId('job-card-advertisement-action')

    expect(heading).toHaveTextContent('Běží 1. 1. – 1. 2. 2026')
    expect(topRow.parentElement).toBe(advertisement)
    expect(heading.parentElement?.parentElement).toBe(topRow)
    expect(channels.parentElement).toBe(heading.parentElement)
    expect(actions.parentElement).toBe(topRow)
    expect(topRow.className).toContain('tm-justify-between')
    expect(heading.compareDocumentPosition(channels) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(channels).getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(within(actions).getByText('3 170')).toBeInTheDocument()
    expect(within(actions).getByText('Detail')).toBeInTheDocument()
    expect(within(actions).getByText('Náhled')).toBeInTheDocument()
  })

  it('can drop the top border', () => {
    renderWidget(runningSame, { hideTopBorder: true })

    expect(screen.getByTestId('job-card-advertisement').className).not.toContain('tm-border-t')
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
    expect(screen.getAllByTestId('job-card-publication')[0].className).not.toContain('tm-rounded-full')
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
    expect(advertisement.className).toContain('tm-flex-col')
  })

  it('shows Prodloužit in advertisement actions when an advertisement ends soon', async () => {
    const user = userEvent.setup()
    const onProlong = vi.fn()
    renderWidget(endingSoon, { onProlong })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const topRow = within(advertisement).getByTestId('job-card-advertisement-top')
    const heading = within(topRow).getByTestId('job-card-advertisement-heading')
    const prolong = within(advertisement).getByTestId('job-card-disappearance-prolong')

    expect(heading).toHaveTextContent('Končí za 3 dny 1. 9. – 30. 9. 2026')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(heading.parentElement?.parentElement).toBe(topRow)
    expect(prolong.parentElement).toBe(screen.getByTestId('job-card-advertisement-action'))
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
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
    expect(screen.queryByText(/ukončeno 15\. 8\./)).not.toBeInTheDocument()
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

  it('calls statistics, detail and preview handlers from advertisement actions', async () => {
    const user = userEvent.setup()
    const onViewStatisticsClick = vi.fn()
    const onAdvertisementDetailClick = vi.fn()
    const onAdvertisementPreviewClick = vi.fn()
    renderWidget(runningSame, {
      onViewStatisticsClick,
      onAdvertisementDetailClick,
      onAdvertisementPreviewClick,
    })

    await user.click(screen.getByTestId('job-card-advertisement-aggregate-views'))
    await user.click(screen.getByTestId('job-card-advertisement-detail-action'))
    await user.click(screen.getByTestId('job-card-advertisement-preview-action'))

    expect(onViewStatisticsClick).toHaveBeenCalledOnce()
    expect(onAdvertisementDetailClick).toHaveBeenCalledOnce()
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
  })

  it('can render inline stats + Detail actions', () => {
    renderWidget(runningSame, { actionLayout: 'inline' })

    expect(screen.getByTestId('job-card-advertisement-action')).toHaveAttribute(
      'data-layout',
      'inline',
    )
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-preview-action')).not.toBeInTheDocument()
  })

  it('can render column stats above Detail o inzerci', () => {
    renderWidget(runningSame, { actionLayout: 'column' })

    expect(screen.getByTestId('job-card-advertisement-action')).toHaveAttribute(
      'data-layout',
      'column',
    )
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toHaveTextContent(
      'Detail o inzerci',
    )
  })

  it('can force Prodloužit on in the column layout', () => {
    renderWidget(runningSame, { actionLayout: 'column', showProlong: true })

    expect(screen.getByTestId('job-card-disappearance-prolong')).toHaveTextContent('Prodloužit')
  })

  it('can hide Prodloužit even when the advertisement ends soon', () => {
    renderWidget(endingSoon, { actionLayout: 'column', showProlong: false })

    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('shows the title above the status when requested', () => {
    renderWidget({ ...runningSame, title: 'Hlavní inzerát' }, { showTitle: true })

    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Hlavní inzerát')
  })
})
