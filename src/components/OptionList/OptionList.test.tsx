import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Option } from './Option'
import { OptionList } from './OptionList'

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
})
