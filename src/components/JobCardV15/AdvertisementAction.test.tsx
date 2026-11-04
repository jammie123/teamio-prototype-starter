import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementAction } from '../JobCardV14/AdvertisementAction'
import { formatCount } from '../JobCardV14/lib/format'

describe('AdvertisementAction', () => {
  it('shows statistics, Detail and Náhled when the advertisement is running', () => {
    render(<AdvertisementAction viewCount={2610} onStatistics={vi.fn()} onDetail={vi.fn()} onPreview={vi.fn()} />)

    const root = screen.getByTestId('job-card-advertisement-action')
    const items = [...root.children]
      .map((item) => item.getAttribute('data-testid'))
      .filter((id): id is string => Boolean(id))

    const statistics = screen.getByTestId('job-card-advertisement-aggregate-views')
    expect(statistics).toHaveAccessibleName(`${formatCount(2610)} zhlédnutí`)
    expect(within(statistics).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toHaveTextContent('Detail')
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toHaveAccessibleName(
      'Detail inzerce',
    )
    expect(screen.getByTestId('job-card-advertisement-preview-action')).toHaveTextContent('Náhled')
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
    expect(screen.getAllByRole('separator', { hidden: true })).toHaveLength(2)
    expect(items).toEqual([
      'job-card-advertisement-aggregate-views',
      'job-card-advertisement-detail-action',
      'job-card-advertisement-preview-action',
    ])
  })

  it('adds Prodloužit before Náhled when the advertisement is ending soon', () => {
    render(
      <AdvertisementAction
        viewCount={2610}
        showProlong
        onDetail={vi.fn()}
        onProlong={vi.fn()}
        onPreview={vi.fn()}
      />,
    )

    const root = screen.getByTestId('job-card-advertisement-action')
    const items = [...root.children]
      .map((item) => item.getAttribute('data-testid'))
      .filter((id): id is string => Boolean(id))

    expect(screen.getByTestId('job-card-disappearance-prolong')).toHaveTextContent('Prodloužit')
    expect(screen.getAllByRole('separator', { hidden: true })).toHaveLength(3)
    expect(items).toEqual([
      'job-card-advertisement-aggregate-views',
      'job-card-advertisement-detail-action',
      'job-card-disappearance-prolong',
      'job-card-advertisement-preview-action',
    ])
  })

  it('hides statistics when viewCount is missing', () => {
    render(<AdvertisementAction onDetail={vi.fn()} onPreview={vi.fn()} />)

    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-preview-action')).toBeInTheDocument()
  })

  it('calls handlers when actions are clicked', async () => {
    const user = userEvent.setup()
    const onStatistics = vi.fn()
    const onDetail = vi.fn()
    const onProlong = vi.fn()
    const onPreview = vi.fn()

    render(
      <AdvertisementAction
        viewCount={100}
        showProlong
        onStatistics={onStatistics}
        onDetail={onDetail}
        onProlong={onProlong}
        onPreview={onPreview}
      />,
    )

    await user.click(screen.getByTestId('job-card-advertisement-aggregate-views'))
    await user.click(screen.getByTestId('job-card-advertisement-detail-action'))
    await user.click(screen.getByTestId('job-card-disappearance-prolong'))
    await user.click(screen.getByTestId('job-card-advertisement-preview-action'))

    expect(onStatistics).toHaveBeenCalledOnce()
    expect(onDetail).toHaveBeenCalledOnce()
    expect(onProlong).toHaveBeenCalledOnce()
    expect(onPreview).toHaveBeenCalledOnce()
  })
})
