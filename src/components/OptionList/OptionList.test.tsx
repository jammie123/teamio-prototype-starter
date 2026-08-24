import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Option } from './Option'
import { OptionList } from './OptionList'
import { OptionSubmenu } from './OptionSubmenu'

describe('OptionList', () => {
  it('renders options inside a dropdown', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Dropdown>
        <DropdownToggle>Otevřít</DropdownToggle>
        <DropdownBody>
          <OptionList>
            <Option onClick={onClick}>Položka</Option>
            <Option href="#link">Odkaz</Option>
            <Option color="danger" onClick={vi.fn()}>
              Smazat
            </Option>
          </OptionList>
        </DropdownBody>
      </Dropdown>,
    )

    await user.click(screen.getByTestId('dropdown-toggle'))
    expect(screen.getByTestId('option-list')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Položka' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Odkaz' })).toHaveAttribute('href', '#link')
    expect(screen.getByRole('option', { name: 'Smazat' })).toHaveClass(
      'tm-text-emotion-danger-active',
    )

    await user.click(screen.getByRole('option', { name: 'Položka' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('marks the selected option with a check icon and darker background', async () => {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <DropdownToggle>Řadit</DropdownToggle>
        <DropdownBody>
          <OptionList>
            <Option onClick={vi.fn()} isSelected>
              Nejnovější
            </Option>
            <Option onClick={vi.fn()}>Nejstarší</Option>
          </OptionList>
        </DropdownBody>
      </Dropdown>,
    )

    await user.click(screen.getByTestId('dropdown-toggle'))

    const selected = screen.getByRole('option', { name: 'Nejnovější' })
    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(selected.querySelector('[data-icon-name="check"]')).toBeInTheDocument()
    expect(selected).toHaveClass('tm-bg-interactive-active', 'hover:tm-bg-interactive-active')
    expect(selected).not.toHaveClass('tm-bg-transparent')

    const unselected = screen.getByRole('option', { name: 'Nejstarší' })
    expect(unselected).toHaveAttribute('aria-selected', 'false')
    expect(unselected.querySelector('[data-icon-name="check"]')).not.toBeInTheDocument()
    expect(unselected).toHaveClass('hover:tm-bg-interactive-hover', 'tm-bg-transparent')
    expect(unselected).not.toHaveClass('tm-bg-interactive-active')
  })

  it('renders a two-line option with a description', async () => {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <DropdownToggle>Otevřít</DropdownToggle>
        <DropdownBody>
          <OptionList>
            <Option onClick={vi.fn()} description="Popis a znění inzerátu">
              Editovat inzerát
            </Option>
          </OptionList>
        </DropdownBody>
      </Dropdown>,
    )

    await user.click(screen.getByTestId('dropdown-toggle'))

    const option = screen.getByRole('option', {
      name: 'Editovat inzerát Popis a znění inzerátu',
    })
    expect(option).toHaveClass('tm-items-start')
    expect(screen.getByTestId('option-description')).toHaveTextContent('Popis a znění inzerátu')
  })

  it('opens a submenu on click and closes both menus after picking a nested action', async () => {
    const user = userEvent.setup()
    const onNestedClick = vi.fn()

    render(
      <Dropdown>
        <DropdownToggle>Otevřít</DropdownToggle>
        <DropdownBody overflow="visible">
          <OptionList>
            <OptionSubmenu label="Inzeráty" count={2}>
              <OptionList>
                <Option onClick={onNestedClick}>Editovat inzerát</Option>
              </OptionList>
            </OptionSubmenu>
          </OptionList>
        </DropdownBody>
      </Dropdown>,
    )

    await user.click(screen.getByTestId('dropdown-toggle'))
    const toggle = screen.getByTestId('option-submenu-toggle')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAccessibleName('Inzeráty, 2')
    expect(screen.getByTestId('option-submenu-count')).toHaveTextContent('2')
    expect(screen.queryByTestId('option-submenu-body')).not.toBeInTheDocument()

    await user.click(toggle)
    expect(screen.getByTestId('option-submenu-toggle')).toHaveAttribute('aria-expanded', 'true')

    const submenu = screen.getByTestId('option-submenu-body')
    await user.click(within(submenu).getByRole('option', { name: 'Editovat inzerát' }))

    expect(onNestedClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('option-submenu-body')).not.toBeInTheDocument()
    expect(screen.queryByTestId('option-list')).not.toBeInTheDocument()
  })
})
