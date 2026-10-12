import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BulkAction } from './BulkAction'

describe('BulkAction', () => {
  it.each([
    [1, 'Vybráno: 1 uchazeč'],
    [3, 'Vybráno: 3 uchazeči'],
    [5, 'Vybráno: 5 uchazečů'],
    [12, 'Vybráno: 12 uchazečů'],
  ])('shows the count of %i selected candidates', (count, text) => {
    render(<BulkAction count={count} />)

    expect(screen.getByTestId('bulk-action-count')).toHaveTextContent(text)
  })

  it('renders move, reject, invite and message actions', () => {
    render(<BulkAction count={2} />)

    const bar = screen.getByTestId('bulk-action')
    expect(within(bar).getByRole('button', { name: /Posunout do/ })).toBeInTheDocument()
    expect(within(bar).getByRole('button', { name: 'Zamítnout' })).toHaveClass(
      'tm-bg-action-danger-default',
    )
    expect(within(bar).getByRole('button', { name: 'Pozvat' })).toBeInTheDocument()
    expect(within(bar).getByRole('button', { name: 'Napsat zprávu' })).toBeInTheDocument()
  })

  it('calls the action handlers', async () => {
    const user = userEvent.setup()
    const onReject = vi.fn()
    const onInvite = vi.fn()
    const onSendMessage = vi.fn()
    render(
      <BulkAction count={2} onReject={onReject} onInvite={onInvite} onSendMessage={onSendMessage} />,
    )

    await user.click(screen.getByRole('button', { name: 'Zamítnout' }))
    await user.click(screen.getByRole('button', { name: 'Pozvat' }))
    await user.click(screen.getByRole('button', { name: 'Napsat zprávu' }))

    expect(onReject).toHaveBeenCalledTimes(1)
    expect(onInvite).toHaveBeenCalledTimes(1)
    expect(onSendMessage).toHaveBeenCalledTimes(1)
  })

  it('moves the selection to the chosen status', async () => {
    const user = userEvent.setup()
    const onMoveTo = vi.fn()
    render(<BulkAction count={2} onMoveTo={onMoveTo} />)

    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('bulk-action-move'))
    expect(screen.queryByRole('option', { name: 'Zamítnut' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Pohovor' }))

    expect(onMoveTo).toHaveBeenCalledWith('interview', expect.objectContaining({ id: 'interview' }))
    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
  })

  it('shows the clear button only when onClear is set', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const { rerender } = render(<BulkAction count={2} />)
    expect(screen.queryByTestId('bulk-action-clear')).not.toBeInTheDocument()

    rerender(<BulkAction count={2} onClear={onClear} />)
    await user.click(screen.getByRole('button', { name: 'Zrušit výběr' }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
