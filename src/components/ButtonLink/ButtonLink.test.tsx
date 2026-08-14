import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ButtonLink } from './ButtonLink'

describe('ButtonLink', () => {
  it('renders an anchor with button visual classes and safe blank target rel', () => {
    render(
      <ButtonLink href="https://example.com" target="_blank" variant="primary">
        Open
      </ButtonLink>,
    )
    const link = screen.getByRole('link', { name: 'Open' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveClass('tm-bg-action-primary-default', 'focus-visible:tm-ring')
  })

  it('keeps an inert disabled anchor without href', () => {
    render(
      <ButtonLink href="https://example.com" isDisabled>
        Disabled
      </ButtonLink>,
    )
    const el = screen.getByText('Disabled')
    expect(el.tagName).toBe('A')
    expect(el).not.toHaveAttribute('href')
    expect(el).toHaveAttribute('aria-disabled', 'true')
    expect(el).toHaveAttribute('tabIndex', '-1')
    expect(el).toHaveClass('tm-opacity-50')
  })

  it('forwards ref to the anchor when disabled', () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <ButtonLink ref={ref} href="https://example.com" isDisabled>
        Disabled
      </ButtonLink>,
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    expect(ref.current).toHaveAttribute('aria-disabled', 'true')
    expect(ref.current).not.toHaveAttribute('href')
  })

  it('forwards ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <ButtonLink ref={ref} href="#section">
        Jump
      </ButtonLink>,
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('prevents activation when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ButtonLink href="https://example.com" isDisabled onClick={onClick}>
        Disabled
      </ButtonLink>,
    )
    await user.click(screen.getByText('Disabled'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
