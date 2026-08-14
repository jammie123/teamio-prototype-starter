import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('is aria-hidden by default and animates shimmer', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    expect(skeleton).toHaveClass('tm-animate-shimmer', 'tm-bg-skeleton-light')
  })

  it('supports dark circle variant and count', () => {
    render(<Skeleton variant="dark" isCircle count={2} data-testid="skeleton" />)
    const items = screen.getAllByTestId('skeleton')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveClass('tm-bg-skeleton-dark', 'tm-rounded-full')
  })
})
