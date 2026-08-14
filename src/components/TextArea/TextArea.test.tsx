import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { TextArea } from './TextArea'

describe('TextArea', () => {
  it('renders with default rows and medium text size', () => {
    render(<TextArea aria-label="Poznámka" />)
    const area = screen.getByRole('textbox', { name: 'Poznámka' })
    expect(area.tagName).toBe('TEXTAREA')
    expect(area).toHaveAttribute('rows', '3')
    expect(area).toHaveClass('tm-text-base', 'tm-border-secondary')
  })

  it('sets aria-invalid only for error and forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>()
    const { rerender } = render(
      <TextArea aria-label="Area" validationState="warning" ref={ref} />,
    )
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
    expect(screen.getByRole('textbox')).toHaveClass('!tm-border-emotion-warning-active')

    rerender(<TextArea aria-label="Area" validationState="error" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('accepts controlled and uncontrolled values', () => {
    const { rerender } = render(<TextArea aria-label="Area" defaultValue="hello" />)
    expect(screen.getByRole('textbox')).toHaveValue('hello')
    rerender(<TextArea aria-label="Area" value="world" onChange={() => undefined} />)
    expect(screen.getByRole('textbox')).toHaveValue('world')
  })
})
