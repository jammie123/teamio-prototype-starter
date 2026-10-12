import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateActionsMenu } from './CandidateActionsMenu'

describe('CandidateActionsMenu', () => {
  it('renders a tertiary three-dots toggle and keeps the menu closed', () => {
    render(<CandidateActionsMenu label="Akce uchazeče Karl" />)

    const toggle = screen.getByRole('button', { name: 'Akce uchazeče Karl' })
    expect(toggle).toHaveClass('tm-bg-transparent')
    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
  })

  it('opens a menu with reject, move-to statuses and the other actions', async () => {
    const user = userEvent.setup()
    render(<CandidateActionsMenu />)

    await user.click(screen.getByTestId('candidate-actions-toggle'))

    const labels = screen.getAllByRole('option').map((option) => option.textContent)
    expect(labels).toEqual([
      'Zamítnout',
      'Neposouzeni',
      'Pohovor',
      'Nabídka',
      'Nástup',
      'Zanalyzovat pomocí AI',
      'Zaznamenat kontakt',
      'Napsat uchazeči',
      'Přeposlat',
      'Přiřadit k náboru',
      'Upravit údaje',
      'Požádat o souhlas',
      'Přidat štítek',
    ])
    expect(screen.getByText('Posunout do')).toBeInTheDocument()
  })

  it('calls onAction for a simple action and closes the menu', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<CandidateActionsMenu onAction={onAction} />)

    await user.click(screen.getByTestId('candidate-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Napsat uchazeči' }))

    expect(onAction).toHaveBeenCalledWith('send-message')
    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
  })

  it('passes the target status for the move action', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<CandidateActionsMenu onAction={onAction} />)

    await user.click(screen.getByTestId('candidate-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Nástup' }))

    expect(onAction).toHaveBeenCalledWith('move', 'hired')
  })

  it('omits the move section without move targets', async () => {
    const user = userEvent.setup()
    render(<CandidateActionsMenu moveToOptions={[]} />)

    await user.click(screen.getByTestId('candidate-actions-toggle'))

    expect(screen.queryByText('Posunout do')).not.toBeInTheDocument()
  })
})
