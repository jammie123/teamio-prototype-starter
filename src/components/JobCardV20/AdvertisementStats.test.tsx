import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementStats } from './AdvertisementStats'
import { formatCount } from './lib/format'

describe('AdvertisementStats', () => {
  it('shows view count and a Detail action on one row', () => {
    render(<AdvertisementStats viewCount={2610} onStatistics={vi.fn()} onDetail={vi.fn()} />)

    const root = screen.getByTestId('job-card-advertisement-stats')
    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')

    expect(root.className).toContain('tm-w-full')
    expect(root.className).toContain('tm-items-center')
    expect(views).toHaveTextContent(/2\s*610/)
    expect(views).toHaveAccessibleName(`${formatCount(2610)} zhlédnutí`)
    expect(within(views).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(detail).toHaveTextContent('Detail')
    expect(detail).toHaveAccessibleName('Zobrazit detail inzerce')
    expect(within(detail).getByTestId('icon')).toHaveAttribute('data-icon-name', 'external-link')
    expect(views.className).toContain('tm-text-action-link-secondary-default')
    expect(views.className).toContain('tm-font-normal')
    expect(detail.className).toContain('tm-text-action-link-secondary-default')
    expect(detail.className).toContain('tm-font-normal')
    expect(screen.getByRole('separator', { hidden: true })).toBeInTheDocument()
    expect(views.compareDocumentPosition(detail) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('hides views and the divider when viewCount is missing', () => {
    render(<AdvertisementStats onDetail={vi.fn()} />)

    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
    expect(screen.queryByRole('separator', { hidden: true })).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toBeInTheDocument()
  })

  it('calls statistics and detail handlers', async () => {
    const user = userEvent.setup()
    const onStatistics = vi.fn()
    const onDetail = vi.fn()
    render(<AdvertisementStats viewCount={2610} onStatistics={onStatistics} onDetail={onDetail} />)

    await user.click(screen.getByTestId('job-card-advertisement-aggregate-views'))
    await user.click(screen.getByTestId('job-card-advertisement-detail-action'))

    expect(onStatistics).toHaveBeenCalledOnce()
    expect(onDetail).toHaveBeenCalledOnce()
  })
})
