import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Option } from '../OptionList'
import { SplitButton } from './SplitButton'

describe('SplitButton', () => {
  it('renders the primary label and a menu toggle without opening the menu', () => {
    render(
      <SplitButton label="Přidat nábor" onClick={vi.fn()}>
        <Option>Přidat brigádu</Option>
      </SplitButton>,
    )

    expect(screen.getByRole('button', { name: 'Přidat nábor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Další možnosti' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Přidat brigádu' })).not.toBeInTheDocument()
  })

  it('fires onClick on the main button and keeps the menu closed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <SplitButton label="Přidat nábor" onClick={onClick}>
        <Option>Přidat brigádu</Option>
      </SplitButton>,
    )

    await user.click(screen.getByRole('button', { name: 'Přidat nábor' }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('option', { name: 'Přidat brigádu' })).not.toBeInTheDocument()
  })

  it('opens the menu from the chevron and selects an item', async () => {
    const user = userEvent.setup()
    const onAddBrigade = vi.fn()

    render(
      <SplitButton label="Přidat nábor" onClick={vi.fn()} menuLabel="Další možnosti přidání">
        <Option onClick={onAddBrigade}>Přidat brigádu</Option>
      </SplitButton>,
    )

    await user.click(screen.getByRole('button', { name: 'Další možnosti přidání' }))
    expect(screen.getByRole('option', { name: 'Přidat brigádu' })).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Přidat brigádu' }))
    expect(onAddBrigade).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('option', { name: 'Přidat brigádu' })).not.toBeInTheDocument()
  })

  it('blocks the main action and the menu when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onAddBrigade = vi.fn()

    render(
      <SplitButton label="Přidat nábor" onClick={onClick} isDisabled>
        <Option onClick={onAddBrigade}>Přidat brigádu</Option>
      </SplitButton>,
    )

    expect(screen.getByRole('button', { name: 'Přidat nábor' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Další možnosti' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Přidat nábor' }))
    await user.click(screen.getByRole('button', { name: 'Další možnosti' }))

    expect(onClick).not.toHaveBeenCalled()
    expect(screen.queryByRole('option', { name: 'Přidat brigádu' })).not.toBeInTheDocument()
  })
})
