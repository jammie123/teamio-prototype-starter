import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementStats } from './AdvertisementStats'
import { formatCount } from './lib/format'

describe('AdvertisementStats', () => {
  it('shows a stacked view count', () => {
    render(<AdvertisementStats viewCount={2610} onStatistics={vi.fn()} />)

    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    const count = screen.getByTestId('job-card-advertisement-view-count')

    expect(views.className).toContain('tm-flex-col')
    expect(views.className).toContain('tm-items-start')
    expect(count).toHaveTextContent(/^2\s*610$/)
    expect(views).toHaveTextContent('zhlédnutí')
    expect(views).not.toHaveTextContent('Zhlédnuto')
    expect(views).toHaveAccessibleName(`${formatCount(2610)} zhlédnutí`)
    expect(within(views).queryByTestId('icon')).not.toBeInTheDocument()
    expect(views.className).toContain('tm-text-action-link-secondary-default')
    expect(views.className).toContain('tm-font-normal')
    expect(screen.queryByTestId('job-card-advertisement-detail-action')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('renders nothing when viewCount is missing', () => {
    const { container } = render(<AdvertisementStats onStatistics={vi.fn()} />)

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
  })

  it('calls the statistics handler', async () => {
    const user = userEvent.setup()
    const onStatistics = vi.fn()
    render(<AdvertisementStats viewCount={2610} onStatistics={onStatistics} />)

    await user.click(screen.getByTestId('job-card-advertisement-aggregate-views'))
    expect(onStatistics).toHaveBeenCalledOnce()
  })
})
