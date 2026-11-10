import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobNote } from './JobNote'

const note = {
  author: 'Petra Nováková',
  text: 'Čekáme na schválení rozpočtu, start až od října',
  addedAt: '12. 9. 2026',
}

describe('JobNote', () => {
  it('renders icon, text and initials with date', () => {
    render(<JobNote note={note} />)

    const element = screen.getByTestId('job-card-note')
    expect(element.tagName).toBe('DIV')
    expect(element.className).toContain('tm-bg-cover-light')
    expect(within(element).getByTestId('icon')).toHaveAttribute('data-icon-name', 'message-square')
    expect(within(element).getByTestId('note-text')).toHaveTextContent(note.text)
    expect(within(element).getByTestId('note-added-at')).toHaveTextContent('PN · 12. 9. 2026')
  })

  it('hides the date when showDate is false', () => {
    render(<JobNote note={{ ...note, showDate: false }} />)

    expect(screen.getByTestId('note-added-at')).toHaveTextContent('PN')
    expect(screen.getByTestId('note-added-at')).not.toHaveTextContent('2026')
  })

  it('renders nothing for an empty text', () => {
    const { container } = render(<JobNote note={{ ...note, text: '   ' }} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('becomes a button that calls onExpand', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn()
    render(<JobNote note={note} onExpand={onExpand} />)

    const element = screen.getByTestId('job-card-note')
    expect(element.tagName).toBe('BUTTON')

    await user.click(element)
    expect(onExpand).toHaveBeenCalledOnce()
  })
})
