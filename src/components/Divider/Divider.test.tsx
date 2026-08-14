import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders a separator with border classes and accessible role', () => {
    render(<Divider data-testid="divider" />)
    const el = screen.getByTestId('divider')
    expect(el).toHaveAttribute('role', 'separator')
    expect(el).toHaveClass('tm-border-t', 'tm-border-secondary')
  })

  it('forwards ref and className', () => {
    const ref = createRef<HTMLHRElement>()
    render(<Divider ref={ref} className="extra" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('extra')
  })
})
