import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { LeftMenuItemData } from '../LeftMenu'
import { PageTemplate } from './PageTemplate'

const menuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
]

const headerTop = {
  user: {
    name: 'Jan Fuxa',
    company: 'LMCTEST_Teamio s.r.o.',
  },
}

const leftMenu = {
  items: menuItems,
  activeItemId: 'prehled',
}

describe('PageTemplate', () => {
  it('renders LeftMenu, HeaderTop and children', () => {
    render(
      <PageTemplate leftMenu={leftMenu} headerTop={headerTop}>
        <p>Obsah stránky</p>
      </PageTemplate>,
    )

    expect(screen.getByTestId('page-template')).toBeInTheDocument()
    expect(screen.getByTestId('left-menu')).toBeInTheDocument()
    expect(screen.getByTestId('header-top')).toBeInTheDocument()
    expect(screen.getByTestId('page-template-content')).toHaveTextContent('Obsah stránky')
    expect(screen.getByText('Přehled')).toBeInTheDocument()
    expect(screen.getByText('Jan Fuxa')).toBeInTheDocument()
  })

  it('uses expanded content margin by default and forces fixed LeftMenu', () => {
    render(
      <PageTemplate leftMenu={{ ...leftMenu, position: 'static' }} headerTop={headerTop}>
        content
      </PageTemplate>,
    )

    expect(screen.getByTestId('page-template-column')).toHaveClass('tm-ml-left-menu')
    expect(screen.getByTestId('page-template-column')).not.toHaveClass(
      'tm-ml-left-menu-collapsed',
    )
    expect(screen.getByTestId('left-menu')).toHaveClass('tm-fixed')
  })

  it('uses collapsed content margin when leftMenu is collapsed', () => {
    render(
      <PageTemplate
        leftMenu={{ ...leftMenu, isCollapsed: true }}
        headerTop={headerTop}
      >
        content
      </PageTemplate>,
    )

    expect(screen.getByTestId('page-template-column')).toHaveClass(
      'tm-ml-left-menu-collapsed',
    )
    expect(screen.getByTestId('left-menu')).toHaveAttribute('data-collapsed', 'true')
  })

  it('updates content margin and forwards onCollapsedChange when toggled', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()

    render(
      <PageTemplate
        leftMenu={{ ...leftMenu, onCollapsedChange }}
        headerTop={headerTop}
      >
        content
      </PageTemplate>,
    )

    expect(screen.getByTestId('page-template-column')).toHaveClass('tm-ml-left-menu')

    await user.click(screen.getByRole('button', { name: 'Sbalit navigaci' }))

    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(screen.getByTestId('page-template-column')).toHaveClass(
      'tm-ml-left-menu-collapsed',
    )
    expect(screen.getByTestId('left-menu')).toHaveAttribute('data-collapsed', 'true')
  })

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<PageTemplate ref={ref} leftMenu={leftMenu} headerTop={headerTop} />)
    expect(ref.current).toBe(screen.getByTestId('page-template'))
  })

  it('pads main when pageHeader is omitted', () => {
    render(
      <PageTemplate leftMenu={leftMenu} headerTop={headerTop}>
        obsah
      </PageTemplate>,
    )

    expect(screen.getByTestId('page-template-content')).toHaveClass('tm-p-6')
    expect(screen.queryByTestId('page-template-body')).not.toBeInTheDocument()
  })

  it('renders pageHeader flush and pads only the body', () => {
    render(
      <PageTemplate
        leftMenu={leftMenu}
        headerTop={headerTop}
        pageHeader={<header>Hlavička stránky</header>}
      >
        obsah
      </PageTemplate>,
    )

    const main = screen.getByTestId('page-template-content')
    expect(main).not.toHaveClass('tm-p-6')
    expect(main).toHaveTextContent('Hlavička stránky')
    expect(screen.getByTestId('page-template-body')).toHaveClass('tm-p-6')
    expect(screen.getByTestId('page-template-body')).toHaveTextContent('obsah')
  })
})
