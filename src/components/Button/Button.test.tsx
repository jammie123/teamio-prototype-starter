import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders a native button with primary medium defaults and focus ring classes', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('tm-bg-action-primary-default')
    expect(button).toHaveClass('tm-min-h-8')
    expect(button).toHaveClass('focus-visible:tm-ring')
  })

  it('applies secondary/tertiary/danger variants and size classes', () => {
    const { rerender } = render(
      <Button variant="secondary" size="small">
        Secondary
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass(
      'tm-bg-basic',
      'tm-min-h-6',
    )

    rerender(
      <Button variant="tertiary" size="large">
        Tertiary
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Tertiary' })).toHaveClass(
      'tm-bg-transparent',
      'tm-min-h-10',
    )

    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByRole('button', { name: 'Danger' })).toHaveClass(
      'tm-bg-action-danger-default',
    )
  })

  it('supports loading, disabled, and click behavior', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { rerender } = render(
      <Button onClick={onClick} isLoading>
        Saving
      </Button>,
    )
    const loadingButton = screen.getByRole('button', { name: /Saving/i })
    expect(loadingButton).toBeDisabled()
    expect(loadingButton).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument()
    await user.click(loadingButton)
    expect(onClick).not.toHaveBeenCalled()

    rerender(
      <Button onClick={onClick} isDisabled>
        Disabled
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled()

    rerender(<Button onClick={onClick}>Ready</Button>)
    await user.click(screen.getByRole('button', { name: 'Ready' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} className="extra">
        Ref
      </Button>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current).toHaveClass('extra')
  })
})
