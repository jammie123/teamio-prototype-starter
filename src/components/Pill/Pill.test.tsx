import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pill } from './Pill'

describe('Pill', () => {
  it('renders primary color by default', () => {
    render(<Pill>3</Pill>)
    const pill = screen.getByText('3')
    expect(pill).toHaveClass(
      'tm-inline-flex',
      'tm-justify-center',
      'tm-items-center',
      'tm-rounded-full',
      'tm-text-xs',
      'tm-font-semibold',
      'tm-text-primary-inverted-default',
      'tm-bg-emotion-danger-active',
    )
  })

  it('supports secondary, tertiary, and emotion colors', () => {
    const { rerender } = render(<Pill color="secondary">2</Pill>)
    expect(screen.getByText('2')).toHaveClass('tm-bg-action-secondary-default')

    rerender(<Pill color="tertiary">1</Pill>)
    expect(screen.getByText('1')).toHaveClass(
      'tm-text-primary-default',
      'tm-bg-teamio-dark/5',
    )

    rerender(<Pill color="informative">I</Pill>)
    expect(screen.getByText('I')).toHaveClass('tm-bg-emotion-info-active')

    rerender(<Pill color="success">S</Pill>)
    expect(screen.getByText('S')).toHaveClass('tm-bg-emotion-success-active')

    rerender(<Pill color="warning">W</Pill>)
    expect(screen.getByText('W')).toHaveClass('tm-bg-emotion-warning-active')

    rerender(<Pill color="danger">D</Pill>)
    expect(screen.getByText('D')).toHaveClass('tm-bg-emotion-danger-active')
  })

  it('supports optional dismiss with accessible label', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Pill onDismiss={onDismiss} dismissLabel="Odebrat pill">
        9
      </Pill>,
    )
    await user.click(screen.getByRole('button', { name: 'Odebrat pill' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
