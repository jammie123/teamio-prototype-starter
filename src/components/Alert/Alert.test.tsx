import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders info variant with status live region by default', () => {
    render(<Alert>Informace</Alert>)
    const alert = screen.getByRole('status')
    expect(alert).toHaveTextContent('Informace')
    expect(alert).toHaveClass(
      'tm-border',
      'tm-text-emotion-info-emphasis',
      'tm-bg-emotion-info-background',
      'tm-border-emotion-info-active',
    )
  })

  it('uses alert role for warning and error variants', () => {
    const { rerender } = render(<Alert variant="warning">Varování</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('tm-border-emotion-warning-active')

    rerender(<Alert variant="error">Chyba</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('tm-border-emotion-danger-active')
  })

  it('renders success variant with status role', () => {
    render(<Alert variant="success">Hotovo</Alert>)
    expect(screen.getByRole('status')).toHaveClass('tm-border-emotion-success-active')
  })

  it('supports optional dismiss', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert onDismiss={onDismiss} dismissLabel="Zavřít">
        Zavřítelná
      </Alert>,
    )
    await user.click(screen.getByRole('button', { name: 'Zavřít' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
