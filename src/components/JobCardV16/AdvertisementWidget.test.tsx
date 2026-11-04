import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardV14/types'
import { AdvertisementWidget } from './AdvertisementWidget'

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

describe('AdvertisementWidget (V16)', () => {
  it('puts status and portals on the left and advertisement actions on the right', () => {
    renderWidget(runningSame)

    const panel = screen.getByTestId('job-card-advertisement-panel')
    const meta = within(panel).getByTestId('job-card-advertisement-meta')
    const actions = within(panel).getByTestId('job-card-advertisement-action')

    expect(within(meta).getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Běží 1. 1. – 1. 2. 2026',
    )
    expect(within(meta).getByTestId('job-card-advertisement-channel-summary')).toHaveTextContent(
      'Jobs.cz · Prace.cz · Kariérní stránky',
    )
    expect(within(actions).getByText('3 170')).toBeInTheDocument()
    expect(within(actions).getByText('Detail')).toBeInTheDocument()
    expect(within(actions).getByText('Náhled')).toBeInTheDocument()
    expect(within(actions).queryByText('Prodloužit')).not.toBeInTheDocument()
  })

  it('shows Prodloužit in advertisement actions when ending soon', async () => {
    const user = userEvent.setup()
    const onProlong = vi.fn()
    renderWidget(endingSoon, { onProlong })

    const prolong = screen.getByTestId('job-card-disappearance-prolong')
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Končí za 3 dny 1. 9. – 30. 9. 2026',
    )
    expect(prolong.parentElement).toBe(screen.getByTestId('job-card-advertisement-action'))

    await user.click(prolong)
    expect(onProlong).toHaveBeenCalledOnce()
  })

  it('keeps portal rows when periods differ', () => {
    renderWidget({
      id: 'ad-diff',
      publications: [
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '15. 9. 2026', endDate: '15. 11. 2026' }),
      ],
    })

    expect(screen.queryByTestId('job-card-advertisement-channel-summary')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(2)
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

  it('shows the title above the status when requested', () => {
    renderWidget({ ...runningSame, title: 'Hlavní inzerát' }, { showTitle: true })

    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Hlavní inzerát')
  })

  it('shows "Zatím nevystavený inzerát" without portals or views', () => {
    renderWidget({ id: 'ad-empty', publications: [] })

    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Zatím nevystavený inzerát',
    )
    expect(screen.queryByTestId('job-card-advertisement-panel')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
  })
})
