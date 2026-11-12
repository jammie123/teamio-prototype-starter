import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PreviewPosition } from './PreviewPosition'

describe('PreviewPosition', () => {
  it('renders an icon-only button with the position preview icon', () => {
    render(<PreviewPosition onClick={vi.fn()} />)

    const button = screen.getByRole('button', { name: 'Zobrazit náhled' })
    expect(button).toHaveAttribute('data-testid', 'job-card-preview-position')
    expect(button).toHaveTextContent(/^\u200B$/)
    expect(button.querySelector('[data-icon-name="position-preview"]')).toBeInTheDocument()
  })

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<PreviewPosition onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Zobrazit náhled' }))

    expect(onClick).toHaveBeenCalledOnce()
  })
})
