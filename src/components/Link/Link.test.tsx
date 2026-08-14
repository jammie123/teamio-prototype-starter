import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Link } from './Link'

describe('Link', () => {
  it('renders primary inline link styles and secondary variant', () => {
    const { rerender } = render(
      <Link href="https://example.com">Primary</Link>,
    )
    const link = screen.getByRole('link', { name: 'Primary' })
    expect(link).toHaveClass('tm-text-action-link-default')
    expect(link).toHaveClass('focus-visible:tm-ring')

    rerender(
      <Link href="https://example.com" variant="secondary">
        Secondary
      </Link>,
    )
    expect(screen.getByRole('link', { name: 'Secondary' })).toHaveClass(
      'tm-text-action-link-secondary-default',
    )
  })

  it('renders a button when onClick is provided without href', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Link onClick={onClick}>Action</Link>)
    const button = screen.getByRole('button', { name: 'Action' })
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disables interaction and applies never-underline class', () => {
    render(
      <Link href="https://example.com" isDisabled underlined="never">
        Disabled
      </Link>,
    )
    const link = screen.getByText('Disabled')
    expect(link).toHaveClass('tm-pointer-events-none')
    expect(link).toHaveClass('hover:tm-no-underline')
  })

  it('forwards ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement | HTMLButtonElement>()
    render(
      <Link ref={ref} href="#top">
        Top
      </Link>,
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('forwards ref to the button in button mode', () => {
    const ref = createRef<HTMLAnchorElement | HTMLButtonElement>()
    render(
      <Link ref={ref} onClick={() => undefined}>
        Action
      </Link>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('adds noopener noreferrer when target is _blank and rel is omitted', () => {
    render(
      <Link href="https://example.com" target="_blank">
        External
      </Link>,
    )
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
  })
})
