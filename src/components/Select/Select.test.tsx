import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

describe('Select', () => {
  it('renders a native select with options and medium height', () => {
    render(
      <Select aria-label="Město">
        <option value="praha">Praha</option>
        <option value="brno">Brno</option>
      </Select>,
    )
    const select = screen.getByRole('combobox', { name: 'Město' })
    expect(select.tagName).toBe('SELECT')
    expect(select).toHaveClass('tm-h-10', 'tm-border-secondary')
    expect(screen.getByRole('option', { name: 'Praha' })).toBeInTheDocument()
  })

  it('applies validation styles and aria-invalid only for error', () => {
    const { rerender } = render(
      <Select aria-label="City" validationState="success">
        <option value="a">A</option>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toHaveClass('!tm-border-emotion-success-active')
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid')

    rerender(
      <Select aria-label="City" validationState="error">
        <option value="a">A</option>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('supports controlled/uncontrolled and forwards ref', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const ref = createRef<HTMLSelectElement>()
    const { rerender } = render(
      <Select aria-label="City" defaultValue="brno" ref={ref}>
        <option value="praha">Praha</option>
        <option value="brno">Brno</option>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toHaveValue('brno')
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)

    rerender(
      <Select aria-label="City" value="praha" onChange={onChange}>
        <option value="praha">Praha</option>
        <option value="brno">Brno</option>
      </Select>,
    )
    await user.selectOptions(screen.getByRole('combobox'), 'brno')
    expect(onChange).toHaveBeenCalled()
  })
})
