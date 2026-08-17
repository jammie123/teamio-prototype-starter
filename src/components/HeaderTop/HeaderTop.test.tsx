import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { HeaderTop } from './HeaderTop'

const user = {
  name: 'Jan Fuxa',
  company: 'LMCTEST_Teamio s.r.o.',
}

describe('HeaderTop', () => {
  it('renders search, add, messages, notifications and user medallion', () => {
    render(<HeaderTop user={user} />)

    expect(screen.getByTestId('header-top')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Hledat uchazeče' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Přidat' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zprávy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notifikace' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Jan Fuxa, LMCTEST_Teamio s.r.o.' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Jan Fuxa')).toBeInTheDocument()
    expect(screen.getByText('LMCTEST_Teamio s.r.o.')).toBeInTheDocument()
  })

  it('opens add and user menus with default items', async () => {
    const userEvt = userEvent.setup()
    render(<HeaderTop user={user} />)

    await userEvt.click(screen.getByRole('button', { name: 'Přidat' }))
    expect(screen.getByRole('option', { name: 'Nábor' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Uchazeč' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Brigáda' })).toBeInTheDocument()

    await userEvt.keyboard('{Escape}')

    await userEvt.click(
      screen.getByRole('button', { name: 'Jan Fuxa, LMCTEST_Teamio s.r.o.' }),
    )
    expect(screen.getByRole('option', { name: 'Nastavení' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Akademie' })).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', async () => {
    const userEvt = userEvent.setup()
    const onSearchChange = vi.fn()
    render(<HeaderTop user={user} onSearchChange={onSearchChange} />)

    await userEvt.type(screen.getByRole('searchbox'), 'ana')
    expect(onSearchChange).toHaveBeenCalled()
    expect(onSearchChange).toHaveBeenLastCalledWith('ana')
  })

  it('shows badges when counts are greater than zero', () => {
    render(<HeaderTop user={user} messagesCount={3} notificationsCount={12} />)

    const header = screen.getByTestId('header-top')
    expect(within(header).getByText('3')).toBeInTheDocument()
    expect(within(header).getByText('12')).toBeInTheDocument()
  })

  it('does not show badges when counts are zero', () => {
    render(<HeaderTop user={user} messagesCount={0} notificationsCount={0} />)

    const header = screen.getByTestId('header-top')
    expect(within(header).queryByText('0')).not.toBeInTheDocument()
  })

  it('fires message and notification click handlers', async () => {
    const userEvt = userEvent.setup()
    const onMessagesClick = vi.fn()
    const onNotificationsClick = vi.fn()

    render(
      <HeaderTop
        user={user}
        onMessagesClick={onMessagesClick}
        onNotificationsClick={onNotificationsClick}
      />,
    )

    await userEvt.click(screen.getByRole('button', { name: 'Zprávy' }))
    await userEvt.click(screen.getByRole('button', { name: 'Notifikace' }))

    expect(onMessagesClick).toHaveBeenCalledTimes(1)
    expect(onNotificationsClick).toHaveBeenCalledTimes(1)
  })

  it('uses empty menu when explicit empty arrays are passed', async () => {
    const userEvt = userEvent.setup()
    render(<HeaderTop user={user} addMenuItems={[]} userMenuItems={[]} />)

    await userEvt.click(screen.getByRole('button', { name: 'Přidat' }))
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>()
    render(<HeaderTop ref={ref} user={user} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveAttribute('data-testid', 'header-top')
  })
})
