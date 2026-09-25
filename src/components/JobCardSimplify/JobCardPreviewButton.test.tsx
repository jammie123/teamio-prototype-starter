import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardPreviewButton } from './JobCardPreviewButton'

describe('JobCardPreviewButton', () => {
  it('shows a search icon button with a preview tooltip', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<JobCardPreviewButton onPreviewAdvertisement={vi.fn()} />)

    const button = screen.getByTestId('job-card-preview-toggle')
    expect(button).toHaveAttribute('aria-label', 'Zobrazit náhled inzerátu')
    expect(button.querySelector('[data-icon-name="search"]')).toBeInTheDocument()

    await user.hover(button)
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Zobrazit náhled inzerátu')
  })

  it('uses a custom label for the aria-label and tooltip', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<JobCardPreviewButton label="Zobrazit náhled" onPreviewAdvertisement={vi.fn()} />)

    const button = screen.getByTestId('job-card-preview-toggle')
    expect(button).toHaveAttribute('aria-label', 'Zobrazit náhled')

    await user.hover(button)
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Zobrazit náhled')
  })

  it('calls onPreviewAdvertisement when clicked', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onPreviewAdvertisement = vi.fn()
    render(<JobCardPreviewButton onPreviewAdvertisement={onPreviewAdvertisement} />)

    await user.click(screen.getByTestId('job-card-preview-toggle'))
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })
})
