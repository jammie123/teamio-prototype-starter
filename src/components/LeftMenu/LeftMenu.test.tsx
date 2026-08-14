import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LeftMenu, type LeftMenuItemData } from './LeftMenu'

const items: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'statistiky', label: 'Statistiky', icon: 'bar-chart', href: '#statistiky' },
]

describe('LeftMenu', () => {
  it('renders a labelled navigation with all items', () => {
    render(<LeftMenu items={items} activeItemId="prehled" />)

    expect(screen.getByRole('navigation', { name: 'Hlavní navigace' })).toBeInTheDocument()
    expect(screen.getAllByTestId('left-menu-item')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Nábory' })).toHaveAttribute('href', '#nabory')
  })

  it('marks the active item with aria-current and active classes', () => {
    render(<LeftMenu items={items} activeItemId="nabory" />)

    const active = screen.getByRole('link', { name: 'Nábory' })
    expect(active).toHaveAttribute('aria-current', 'page')
    expect(active).toHaveClass('tm-bg-basic/20', 'tm-text-primary-inverted-default')

    const inactive = screen.getByRole('link', { name: 'Přehled' })
    expect(inactive).not.toHaveAttribute('aria-current')
    expect(inactive).toHaveClass('tm-text-secondary-inverted-default')
  })

  it('prefers the item isActive flag over activeItemId', () => {
    render(
      <LeftMenu
        items={[{ ...items[0], isActive: true }, items[1]]}
        activeItemId="nabory"
      />,
    )

    expect(screen.getByRole('link', { name: 'Přehled' })).toHaveAttribute('aria-current', 'page')
  })

  it('calls onClick when an item is activated', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<LeftMenu items={[{ id: 'prehled', label: 'Přehled', icon: 'home', onClick }]} />)

    await user.click(screen.getByRole('button', { name: 'Přehled' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders disabled items as disabled buttons', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <LeftMenu
        items={[{ id: 'databaze', label: 'Databáze', href: '#databaze', isDisabled: true, onClick }]}
      />,
    )

    const item = screen.getByRole('button', { name: 'Databáze' })
    expect(item).toBeDisabled()
    expect(item).toHaveClass('tm-cursor-not-allowed', 'tm-opacity-50')

    await user.click(item)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('toggles collapsed state when uncontrolled', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<LeftMenu items={items} onCollapsedChange={onCollapsedChange} />)

    const menu = screen.getByTestId('left-menu')
    expect(menu).toHaveAttribute('data-collapsed', 'false')
    expect(menu).toHaveClass('tm-w-left-menu')

    await user.click(screen.getByRole('button', { name: 'Sbalit navigaci' }))

    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(menu).toHaveAttribute('data-collapsed', 'true')
    expect(menu).toHaveClass('tm-w-left-menu-collapsed')
    expect(screen.getByRole('button', { name: 'Rozbalit navigaci' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('keeps the controlled collapsed state until the consumer updates it', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<LeftMenu items={items} isCollapsed onCollapsedChange={onCollapsedChange} />)

    expect(screen.getByTestId('left-menu')).toHaveAttribute('data-collapsed', 'true')

    await user.click(screen.getByRole('button', { name: 'Rozbalit navigaci' }))

    expect(onCollapsedChange).toHaveBeenCalledWith(false)
    expect(screen.getByTestId('left-menu')).toHaveAttribute('data-collapsed', 'true')
  })

  it('hides item labels visually but keeps accessible names when collapsed', () => {
    render(<LeftMenu items={items} defaultCollapsed />)

    const item = screen.getByRole('link', { name: 'Přehled' })
    expect(item.querySelector('.tm-sr-only')).toHaveTextContent('Přehled')
  })

  it('reveals the label in a tooltip on hover when collapsed', async () => {
    const user = userEvent.setup()
    render(<LeftMenu items={items} defaultCollapsed />)

    await user.hover(screen.getByRole('link', { name: 'Nábory' }))
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Nábory')
    })
  })

  it('does not wrap items in tooltips when expanded', async () => {
    const user = userEvent.setup()
    render(<LeftMenu items={items} />)

    await user.hover(screen.getByRole('link', { name: 'Nábory' }))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('omits the toggle when not collapsible', () => {
    render(<LeftMenu items={items} isCollapsible={false} defaultCollapsed />)

    expect(screen.queryByRole('button', { name: /navigaci/ })).not.toBeInTheDocument()
    expect(screen.getByTestId('left-menu')).toHaveClass('tm-w-left-menu')
  })

  it('applies fixed positioning by default and supports a static variant', () => {
    const { rerender } = render(<LeftMenu items={items} />)
    expect(screen.getByTestId('left-menu')).toHaveClass('tm-fixed', 'tm-left-0')

    rerender(<LeftMenu items={items} position="static" />)
    expect(screen.getByTestId('left-menu')).not.toHaveClass('tm-fixed')
  })

  it('renders the edition logo and an optional footer slot', () => {
    render(<LeftMenu items={items} edition="default" footer={<span>Alma Career</span>} />)

    expect(screen.getByTestId('teamio-logo')).toHaveAttribute('data-edition', 'default')
    expect(screen.getByText('Alma Career')).toBeInTheDocument()
  })

  it('allows replacing the logo through the logo slot', () => {
    render(<LeftMenu items={items} logo={<span data-testid="custom-logo">Vlastní</span>} />)

    expect(screen.getByTestId('custom-logo')).toBeInTheDocument()
    expect(screen.queryByTestId('teamio-logo')).not.toBeInTheDocument()
  })
})
