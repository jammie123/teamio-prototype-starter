import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Typography } from './Typography'

describe('Typography', () => {
  it('renders semantic element from as and visual variant class', () => {
    render(
      <Typography as="h2" variant="h1">
        Heading
      </Typography>,
    )
    const el = screen.getByRole('heading', { level: 2, name: 'Heading' })
    expect(el.tagName).toBe('H2')
    expect(el).toHaveClass('h1')
  })

  it('defaults to paragraph body and forwards ref/className', () => {
    const ref = createRef<HTMLParagraphElement>()
    render(
      <Typography ref={ref} className="extra">
        Body
      </Typography>,
    )
    const el = screen.getByText('Body')
    expect(el.tagName).toBe('P')
    expect(el).toHaveClass('extra')
    expect(ref.current).toBe(el)
  })
})
