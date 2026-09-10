import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Note } from './Note'

describe('Note', () => {
  it('renders text and addedAt on a cover background without the author', () => {
    render(
      <Note
        author="Jan Fuxa"
        text="Nástup ideálně od 1. 9. 2026."
        addedAt="9. 9. 2026"
      />,
    )

    const note = screen.getByTestId('note')
    expect(note).toBeInTheDocument()
    expect(note).toHaveClass('tm-bg-cover-light')
    expect(screen.queryByTestId('note-author')).not.toBeInTheDocument()
    expect(note).not.toHaveTextContent('Jan Fuxa')
    expect(note).not.toHaveTextContent('Fuxa J.')
    expect(note).toHaveTextContent('Nástup ideálně od 1. 9. 2026.')
    expect(screen.getByTestId('note-added-at')).toHaveTextContent('9. 9. 2026')
    expect(screen.getByTestId('note-added-at')).toHaveClass(
      'tm-ml-auto',
      'tm-shrink-0',
      'tm-self-end',
      'tm-text-sm',
      'tm-text-secondary-default',
    )
  })

  it('hides the date when showDate is false', () => {
    render(
      <Note
        author="Jan Fuxa"
        text="Nástup ideálně od 1. 9. 2026."
        addedAt="9. 9. 2026"
        showDate={false}
      />,
    )

    expect(screen.queryByTestId('note-added-at')).not.toBeInTheDocument()
    expect(screen.getByTestId('note')).not.toHaveTextContent('9. 9. 2026')
  })

  it('clamps the note body to two lines and sits the date on the last line, right', () => {
    render(
      <Note author="Petra Nováková" text="Dlouhá poznámka k náboru." addedAt="9. 9. 2026" />,
    )

    expect(screen.getByTestId('note')).toHaveClass('tm-items-end')
    expect(screen.getByTestId('note-text')).toHaveClass('tm-line-clamp-2', 'tm-min-w-0', 'tm-flex-1')
    expect(screen.getByTestId('note-added-at')).toHaveClass('tm-ml-auto', 'tm-self-end')
  })

  it('reveals a maximize icon button on the right on hover or focus', () => {
    render(
      <Note
        author="Petra Nováková"
        text="Poznámka"
        addedAt="9. 9. 2026"
        onExpand={vi.fn()}
      />,
    )

    expect(screen.getByTestId('note')).toHaveClass('tm-group', 'tm-relative')
    const overlay = screen.getByTestId('note-expand-overlay')
    expect(overlay).toHaveClass(
      'tm-absolute',
      'tm-hidden',
      'tm-bg-note-expand-overlay',
      'group-hover:tm-block',
      'group-focus-within:tm-block',
    )
    const expand = screen.getByRole('button', { name: 'Zobrazit celou poznámku' })
    expect(expand).toHaveClass(
      'tm-absolute',
      'tm-right-1',
      'tm-size-8',
      'tm-hidden',
      'group-hover:tm-inline-flex',
      'group-focus-within:tm-inline-flex',
    )
    expect(screen.getByTestId('icon')).toHaveAttribute('data-icon-name', 'maximize')
    expect(screen.getByTestId('icon')).toHaveClass('tm-text-lg')
  })

  it('calls onExpand when the maximize button is clicked', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn()
    render(
      <Note
        author="Petra Nováková"
        text="Poznámka"
        addedAt="9. 9. 2026"
        onExpand={onExpand}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Zobrazit celou poznámku' }))
    expect(onExpand).toHaveBeenCalledTimes(1)
  })

  it('still reveals the maximize button when onExpand is omitted', () => {
    render(<Note author="Petra Nováková" text="Poznámka" addedAt="9. 9. 2026" />)

    expect(screen.getByRole('button', { name: 'Zobrazit celou poznámku' })).toBeInTheDocument()
  })

  it('uses a custom expand label', () => {
    render(
      <Note
        author="Petra Nováková"
        text="Poznámka"
        addedAt="9. 9. 2026"
        expandLabel="Rozbalit poznámku"
        onExpand={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Rozbalit poznámku' })).toBeInTheDocument()
  })
})
