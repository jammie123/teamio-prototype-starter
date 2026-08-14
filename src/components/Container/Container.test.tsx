import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('applies padding and centering classes by default flags', () => {
    render(
      <Container isCentered data-testid="container">
        Content
      </Container>,
    )
    const el = screen.getByTestId('container')
    expect(el).toHaveClass('tm-mx-auto')
    expect(el.className).toMatch(/tm-px-\[var\(--container-px\)\]/)
    expect(el).toHaveStyle({ '--container-max-width': undefined })
  })

  it('sets max width CSS variable and forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Container ref={ref} maxWidth="72rem" hasPadding={false} data-testid="container">
        Content
      </Container>,
    )
    const el = screen.getByTestId('container')
    expect(el).toHaveStyle({ '--container-max-width': '72rem' })
    expect(el.className).not.toMatch(/tm-px-\[var\(--container-px\)\]/)
    expect(ref.current).toBe(el)
  })
})
