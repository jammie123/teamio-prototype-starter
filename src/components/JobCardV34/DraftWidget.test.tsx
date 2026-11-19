import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DraftWidget } from './DraftWidget'

describe('DraftWidget', () => {
  it('shows the last change and the Pokračovat button in a row', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()
    render(<DraftWidget lastChanged="3. 11. 2026" onContinue={onContinue} />)

    const root = screen.getByTestId('job-card-draft')
    expect(root.className).toContain('tm-flex-row')
    expect(screen.getByTestId('job-card-last-changed')).toHaveTextContent(
      'Poslední změna: 3. 11. 2026',
    )

    const button = screen.getByRole('button', { name: 'Pokračovat' })
    expect(root).toContainElement(button)
    await user.click(button)
    expect(onContinue).toHaveBeenCalledOnce()
  })

  it('omits the last change when it is unknown', () => {
    render(<DraftWidget />)

    expect(screen.queryByTestId('job-card-last-changed')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pokračovat' })).toBeInTheDocument()
  })
})
