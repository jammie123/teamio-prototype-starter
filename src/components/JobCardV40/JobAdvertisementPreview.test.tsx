import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobAdvertisementPreview } from './JobAdvertisementPreview'

describe('JobAdvertisementPreview', () => {
  it('renders an icon-only advertisement capsule', () => {
    render(<JobAdvertisementPreview />)

    const trigger = screen.getByTestId('job-card-header-advertisement-preview')
    expect(trigger).toHaveAccessibleName('Náhled inzerátu')
    expect(trigger).not.toHaveTextContent('Náhled')
    expect(trigger.tagName).toBe('DIV')
    expect(trigger.className).toContain('tm-rounded-full')
    expect(trigger.className).toContain('tm-border-secondary')
    expect(trigger.className).toContain('tm-bg-transparent')
    expect(trigger.className).not.toContain('tm-bg-basic')
    expect(trigger.className).not.toContain('tm-border-action-secondary-default')
    expect(within(trigger).getByTestId('icon')).toHaveAttribute('data-icon-name', 'advertisement-doc')
  })

  it('shows a Náhled inzerátu tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<JobAdvertisementPreview />)

    await user.hover(screen.getByTestId('job-card-header-advertisement-preview'))
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Náhled inzerátu')
    })
  })

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<JobAdvertisementPreview onClick={onClick} />)

    await user.click(screen.getByTestId('job-card-header-advertisement-preview'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
