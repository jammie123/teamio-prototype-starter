import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { TeamioLogo } from './TeamioLogo'

describe('TeamioLogo', () => {
  it('renders the default wordmark with an accessible name', () => {
    render(<TeamioLogo />)

    const logo = screen.getByRole('img', { name: 'Teamio' })
    expect(logo).toHaveAttribute('data-edition', 'default')
    expect(logo).toHaveAttribute('data-variant', 'full')
    expect(logo).toHaveTextContent('teamio')
    expect(logo).toHaveTextContent('®')
  })

  it('renders a compact mark without the registered sign', () => {
    render(<TeamioLogo variant="compact" />)

    const logo = screen.getByTestId('teamio-logo')
    expect(logo).toHaveAttribute('data-variant', 'compact')
    expect(logo).not.toHaveTextContent('®')
  })

  it('falls back to the default edition for unknown editions', () => {
    render(<TeamioLogo edition="enterprise-neznama" />)

    const logo = screen.getByTestId('teamio-logo')
    expect(logo).toHaveAttribute('data-edition', 'enterprise-neznama')
    expect(logo).toHaveAttribute('data-edition-fallback', 'true')
    expect(logo).toHaveTextContent('teamio')
  })

  it('can be rendered as decorative', () => {
    render(<TeamioLogo title="" />)

    const logo = screen.getByTestId('teamio-logo')
    expect(logo).toHaveAttribute('aria-hidden', 'true')
    expect(logo).not.toHaveAttribute('role')
  })

  it('forwards ref and className', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<TeamioLogo ref={ref} className="tm-text-xl" />)

    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveClass('tm-text-xl')
  })
})
