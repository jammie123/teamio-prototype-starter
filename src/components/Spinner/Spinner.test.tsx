import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('exposes an accessible loading label and spin styles', () => {
    render(<Spinner label="Načítání" />)
    const spinner = screen.getByRole('status', { name: 'Načítání' })
    expect(spinner).toHaveClass('tm-h-[1em]', 'tm-w-[1em]')
    expect(spinner.className).toContain('after:tm-animate-spin')
  })

  it('defaults label to Loading', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })
})
