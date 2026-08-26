import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

describe('Tabs', () => {
  it('renders tab list and switches panels on click', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Ukázkové záložky">
          <TabsTrigger value="one">První</TabsTrigger>
          <TabsTrigger value="two">Druhá</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Obsah jedna</TabsContent>
        <TabsContent value="two">Obsah dvě</TabsContent>
      </Tabs>,
    )

    expect(screen.getByRole('tablist', { name: 'Ukázkové záložky' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'První' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Obsah jedna')).toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'Druhá' }))
    expect(screen.getByRole('tab', { name: 'Druhá' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Obsah dvě')).toBeVisible()
  })

  it('supports keyboard navigation between triggers', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">Alpha</TabsTrigger>
          <TabsTrigger value="two">Beta</TabsTrigger>
          <TabsTrigger value="three">Gamma</TabsTrigger>
        </TabsList>
        <TabsContent value="one">A</TabsContent>
        <TabsContent value="two">B</TabsContent>
        <TabsContent value="three">C</TabsContent>
      </Tabs>,
    )

    const alpha = screen.getByRole('tab', { name: 'Alpha' })
    alpha.focus()
    expect(alpha).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveFocus()
  })

  it('applies selected visual classes on the active trigger', () => {
    render(
      <Tabs defaultValue="selected">
        <TabsList>
          <TabsTrigger value="selected">Vybraná</TabsTrigger>
          <TabsTrigger value="other">Jiná</TabsTrigger>
        </TabsList>
        <TabsContent value="selected">S</TabsContent>
        <TabsContent value="other">O</TabsContent>
      </Tabs>,
    )

    const selected = screen.getByRole('tab', { name: 'Vybraná' })
    expect(selected).toHaveAttribute('data-state', 'active')
    expect(selected).toHaveClass(
      'tm-font-semibold',
      'data-[state=active]:tm-text-primary-default',
      'data-[state=active]:after:tm-bg-teamio-pink',
    )
    expect(screen.getByRole('tab', { name: 'Jiná' })).toHaveClass('tm-text-secondary-default')
    expect(screen.getByRole('tab', { name: 'Jiná' })).toHaveAttribute('data-state', 'inactive')
  })

  it('shows a subtle count pill on a trigger when count is set', () => {
    render(
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" count={14}>
            Aktivní
          </TabsTrigger>
          <TabsTrigger value="published" count={11}>
            Zveřejněný
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">Open</TabsContent>
        <TabsContent value="published">Live</TabsContent>
      </Tabs>,
    )

    expect(screen.getByRole('tab', { name: 'Aktivní 14' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Zveřejněný 11' })).toBeInTheDocument()
    expect(screen.getAllByTestId('tabs-trigger-count').map((pill) => pill.textContent)).toEqual([
      '14',
      '11',
    ])
    expect(screen.getAllByTestId('tabs-trigger-count')[0]).toHaveClass('tm-bg-teamio-dark/5')
    expect(screen.getAllByTestId('tabs-trigger-count')[0].querySelector('span')).toHaveClass(
      'tm-text-secondary-default',
    )
  })

  it('replaces the count with an informative icon on hover and shows the tab info tooltip', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger
            value="active"
            count={14}
            info="Aktivní nábor, který mohou a nemusí mít inzeráty"
          >
            Aktivní
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">Open</TabsContent>
      </Tabs>,
    )

    const tab = screen.getByRole('tab', { name: 'Aktivní 14' })
    const count = screen.getByTestId('tabs-trigger-count')
    const info = screen.getByTestId('tabs-trigger-info')

    expect(count).toHaveClass('tm-group-hover:tm-hidden')
    expect(info).toHaveClass('tm-hidden', 'tm-group-hover:tm-inline-flex')
    expect(info.firstElementChild).toHaveClass('tm-bg-emotion-info-active')
    expect(within(info).getByTestId('icon')).toHaveAttribute('data-icon-name', 'info')

    await user.hover(tab)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    await user.hover(info)
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Aktivní nábor, který mohou a nemusí mít inzeráty',
    )
  })
})
