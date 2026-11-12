import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementStats } from './AdvertisementStats'
import { formatCount } from './lib/format'

describe('AdvertisementStats', () => {
  it('shows view count and a Přehled action on one row', () => {
    render(<AdvertisementStats viewCount={2610} onStatistics={vi.fn()} onDetail={vi.fn()} />)

    const root = screen.getByTestId('job-card-advertisement-stats')
    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')

    expect(root.className).toContain('tm-w-auto')
    expect(root.className).toContain('md:tm-w-full')
    expect(root.className).toContain('tm-items-center')
    expect(root.className).toContain('tm-mt-0')
    expect(root.className).toContain('tm-pt-0')
    expect(root.className).toContain('md:tm-mt-auto')
    expect(root.className).toContain('md:tm-pt-4')
    expect(views).toHaveTextContent(/2\s*610/)
    expect(views).toHaveAccessibleName(`${formatCount(2610)} zhlédnutí`)
    expect(within(views).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(detail).toHaveTextContent('Přehled')
    expect(detail).toHaveAccessibleName('Přehled')
    expect(within(detail).getByTestId('icon')).toHaveAttribute('data-icon-name', 'chevron-right')
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

  it('shows a small Prodloužit button right of Přehled only when requested', async () => {
    const user = userEvent.setup()
    const onProlong = vi.fn()
    const { rerender } = render(<AdvertisementStats viewCount={2610} onDetail={vi.fn()} />)
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()

    rerender(
      <AdvertisementStats
        viewCount={2610}
        onDetail={vi.fn()}
        action="prolong"
        onAction={onProlong}
      />,
    )
    const prolong = screen.getByTestId('job-card-disappearance-prolong')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')

    expect(prolong).toHaveTextContent('Prodloužit')
    expect(prolong).toHaveClass('!tm-min-h-7', '!tm-px-3')
    expect(prolong).toHaveClass('tm-ml-auto')
    expect(screen.getByTestId('job-card-advertisement-detail-action')).not.toHaveClass('tm-ml-auto')
    expect(detail.compareDocumentPosition(prolong) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.click(prolong)
    expect(onProlong).toHaveBeenCalledOnce()
  })

  it('shows a primary Znovuvystavit button on the right for an ended advertisement', async () => {
    const user = userEvent.setup()
    const onRepublish = vi.fn()
    render(
      <AdvertisementStats
        viewCount={2610}
        onDetail={vi.fn()}
        action="republish"
        onAction={onRepublish}
      />,
    )

    const republish = screen.getByTestId('job-card-advertisement-republish')
    expect(republish).toHaveTextContent('Znovuvystavit')
    expect(republish).toHaveClass('tm-bg-action-primary-default', 'tm-ml-auto')
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()

    await user.click(republish)
    expect(onRepublish).toHaveBeenCalledOnce()
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
