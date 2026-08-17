import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Option, OptionList } from '../OptionList'
import { Dropdown } from './Dropdown'
import { DropdownBody } from './DropdownBody'
import { DropdownToggle } from './DropdownToggle'

function SampleDropdown({
  onOpenChange,
  onOptionClick,
}: {
  onOpenChange?: (open: boolean) => void
  onOptionClick?: () => void
}) {
  return (
    <Dropdown onOpenChange={onOpenChange}>
      <DropdownToggle>Otevřít</DropdownToggle>
      <DropdownBody>
        <OptionList>
          <Option onClick={onOptionClick}>Možnost 1</Option>
          <Option onClick={vi.fn()}>Možnost 2</Option>
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

describe('Dropdown', () => {
  it('opens on toggle click and shows options', async () => {
    const user = userEvent.setup()
    render(<SampleDropdown />)

    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('dropdown-toggle'))
    expect(screen.getByTestId('dropdown-body')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Možnost 1' })).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<SampleDropdown />)

    await user.click(screen.getByTestId('dropdown-toggle'))
    expect(screen.getByTestId('dropdown-body')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
  })

  it('closes on outside click', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <SampleDropdown />
        <button type="button">Venku</button>
      </div>,
    )

    await user.click(screen.getByTestId('dropdown-toggle'))
    expect(screen.getByTestId('dropdown-body')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Venku' }))
    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
  })

  it('closes after selecting an option when autoClose is true', async () => {
    const user = userEvent.setup()
    const onOptionClick = vi.fn()
    render(<SampleDropdown onOptionClick={onOptionClick} />)

    await user.click(screen.getByTestId('dropdown-toggle'))
    await user.click(screen.getByRole('option', { name: 'Možnost 1' }))

    expect(onOptionClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
  })

  it('applies tertiary button classes on toggle variant', () => {
    render(
      <Dropdown>
        <DropdownToggle variant="button-tertiary">Přidat</DropdownToggle>
        <DropdownBody>Tělo</DropdownBody>
      </Dropdown>,
    )

    expect(screen.getByTestId('dropdown-toggle')).toHaveClass('tm-bg-transparent')
  })
})
