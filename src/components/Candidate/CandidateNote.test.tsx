import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateNote } from './CandidateNote'

describe('CandidateNote', () => {
  it('renders the note text and date when a note exists', () => {
    render(<CandidateNote note={{ text: 'Dnehh', addedAt: '2 roky' }} />)

    expect(screen.getByTestId('note-text')).toHaveTextContent('Dnehh')
    expect(screen.getByTestId('note-added-at')).toHaveTextContent('2 roky')
    expect(screen.queryByTestId('candidate-note-empty')).not.toBeInTheDocument()
  })

  it('calls onExpand from the expand button', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn()
    render(<CandidateNote note={{ text: 'Dnehh' }} onExpand={onExpand} />)

    await user.click(screen.getByRole('button', { name: 'Zobrazit celou poznámku' }))

    expect(onExpand).toHaveBeenCalledTimes(1)
  })

  it('uses medium weight and muted colour on the add note button', () => {
    render(<CandidateNote onAdd={vi.fn()} />)

    expect(screen.getByTestId('candidate-note-add')).toHaveClass(
      '!tm-font-medium',
      'tm-text-secondary-default',
    )
  })

  it('is always visible unless asked to reveal on row hover', () => {
    render(<CandidateNote onAdd={vi.fn()} />)

    expect(screen.getByTestId('candidate-note-add')).not.toHaveClass('tm-opacity-0')
  })

  it('hides the add button until the row is hovered or focused', () => {
    render(<CandidateNote onAdd={vi.fn()} revealOnRowHover />)

    expect(screen.getByTestId('candidate-note-add')).toHaveClass(
      'tm-opacity-0',
      'group-hover/row:tm-opacity-100',
      'group-focus-within/row:tm-opacity-100',
      'focus-visible:tm-opacity-100',
    )
  })

  it('renders an add button when there is no note', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<CandidateNote onAdd={onAdd} />)

    expect(screen.queryByTestId('note')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Přidat poznámku' }))

    expect(onAdd).toHaveBeenCalledTimes(1)
  })
})
