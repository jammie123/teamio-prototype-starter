import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders a medium text input with default border and focus ring', () => {
    render(<Input aria-label="Jméno" />)
    const input = screen.getByRole('textbox', { name: 'Jméno' })
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveClass('tm-h-10', 'tm-border-secondary', 'focus-visible:tm-ring')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('applies validation borders and aria-invalid only for error', () => {
    const { rerender } = render(<Input aria-label="Field" validationState="success" />)
    expect(screen.getByRole('textbox')).toHaveClass('!tm-border-emotion-success-active')
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')

    rerender(<Input aria-label="Field" validationState="warning" />)
    expect(screen.getByRole('textbox')).toHaveClass('!tm-border-emotion-warning-active')
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')

    rerender(<Input aria-label="Field" validationState="error" />)
    expect(screen.getByRole('textbox')).toHaveClass('!tm-border-emotion-danger-active')
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('supports controlled and uncontrolled values and forwards ref', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const ref = createRef<HTMLInputElement>()

    const { unmount } = render(<Input aria-label="Value" defaultValue="a" ref={ref} />)
    expect(screen.getByRole('textbox')).toHaveValue('a')
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    unmount()

    render(<Input aria-label="Value" value="b" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'c')
    expect(onChange).toHaveBeenCalled()
  })

  it('supports small size and disabled styling', () => {
    render(<Input aria-label="Small" size="small" disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('tm-h-8', 'tm-opacity-50')
  })
})
