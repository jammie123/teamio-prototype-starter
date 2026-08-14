import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders a section by default with surface styles', () => {
    render(<Card>Card body</Card>)
    const el = screen.getByText('Card body')
    expect(el.tagName).toBe('SECTION')
    expect(el).toHaveClass('tm-rounded', 'tm-border', 'tm-border-secondary', 'tm-bg-basic')
  })

  it('supports article semantics and forwards ref', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Card as="article" ref={ref} className="extra">
        Article card
      </Card>,
    )
    const el = screen.getByText('Article card')
    expect(el.tagName).toBe('ARTICLE')
    expect(el).toHaveClass('extra')
    expect(ref.current).toBe(el)
  })
})
