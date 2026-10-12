import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders earlier items as links and the last one as the current page', () => {
    render(
      <Breadcrumbs items={[{ label: 'Nábory', href: '/nabory' }, { label: 'Product Manager' }]} />,
    )

    expect(screen.getByRole('navigation', { name: 'Drobečková navigace' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nábory' })).toHaveAttribute('href', '/nabory')

    const current = screen.getByText('Product Manager')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Product Manager' })).not.toBeInTheDocument()
  })

  it('keeps the last item inactive even when it has an href', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Nábory', href: '/nabory' },
          { label: 'Product Manager', href: '/nabory/1' },
        ]}
      />,
    )

    expect(screen.queryByRole('link', { name: 'Product Manager' })).not.toBeInTheDocument()
    expect(screen.getByText('Product Manager')).toHaveAttribute('aria-current', 'page')
  })

  it('calls onClick of an earlier item', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Breadcrumbs items={[{ label: 'Nábory', onClick }, { label: 'Product Manager' }]} />)

    await user.click(screen.getByRole('button', { name: 'Nábory' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders an earlier item without href or onClick as plain text', () => {
    render(<Breadcrumbs items={[{ label: 'Nábory' }, { label: 'Product Manager' }]} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('accepts a custom aria-label and forwards the ref to the nav', () => {
    const ref = createRef<HTMLElement>()
    render(<Breadcrumbs ref={ref} aria-label="Cesta" items={[{ label: 'Nábory' }]} />)

    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(screen.getByRole('navigation', { name: 'Cesta' })).toBe(ref.current)
  })
})
