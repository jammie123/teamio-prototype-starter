import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Table, TableBody } from '../Table'
import { CandidateItem, type CandidateItemProps } from './CandidateItem'
import { CandidateTableHead } from './CandidateTableHead'
import type { CandidateItemData } from './types'

const candidate: CandidateItemData = {
  id: 'karl',
  name: 'Karl Jakub',
  phone: '776802520',
  rating: { value: 3, count: 2 },
  attachmentsCount: 4,
  aiScore: 82,
  statusId: 'interview',
  lastContact: '5. 12. 2023',
  source: { name: 'LinkedIn', date: '1. 12. 2023' },
  tags: [{ id: 'senior', label: 'senior' }],
  note: { author: 'Messi L.', text: 'Dlouhá poznámka', addedAt: '3 roky' },
}

function renderItem(props: Partial<CandidateItemProps> = {}) {
  return render(
    <Table>
      <TableBody>
        <CandidateItem candidate={candidate} {...props} />
      </TableBody>
    </Table>,
  )
}

describe('CandidateItem', () => {
  it('renders a table row with all attributes', () => {
    renderItem()

    const row = screen.getByTestId('candidate-item')
    expect(row.tagName).toBe('TR')
    expect(within(row).getAllByRole('cell')).toHaveLength(9)
    expect(screen.getByTestId('candidate-name')).toHaveTextContent('Karl Jakub')
    expect(screen.getByTestId('candidate-phone')).toHaveTextContent('776802520')
    expect(screen.getByTestId('candidate-phone')).toHaveClass('tm-text-secondary-default')
    expect(screen.getByTestId('candidate-phone')).not.toHaveClass('tm-text-action-link-default')
    expect(screen.getByTestId('candidate-rating')).toHaveAttribute('data-rating', '3')
    expect(screen.getByTestId('candidate-rating')).toHaveTextContent('(2)')
    expect(screen.getByTestId('candidate-attachments')).toHaveTextContent('4')
    expect(screen.getByTestId('candidate-ai')).toHaveTextContent('82')
    expect(screen.getByTestId('candidate-status-toggle')).toHaveTextContent('Pohovor')
    expect(screen.getByTestId('candidate-cell-last-contact')).toHaveTextContent('5. 12. 2023')
    expect(screen.getByTestId('candidate-cell-source')).toHaveTextContent('LinkedIn')
    expect(screen.getByTestId('candidate-cell-source')).toHaveTextContent('1. 12. 2023')
    expect(screen.getByText('senior')).toBeInTheDocument()
    expect(screen.getByTestId('note-text')).toHaveTextContent('Dlouhá poznámka')
  })

  it('fills the number of stars equal to the rating', () => {
    renderItem()

    const stars = within(screen.getByTestId('candidate-rating')).getAllByTestId('icon')
    expect(stars).toHaveLength(5)
    expect(stars.filter((star) => star.dataset.filled === 'true')).toHaveLength(3)
  })

  it('renders empty states', () => {
    renderItem({
      candidate: {
        id: 'empty',
        name: 'Soušek Josef',
        statusId: 'unassessed',
      },
    })

    expect(screen.getByTestId('candidate-phone')).toHaveTextContent('Přidat telefon')
    expect(screen.getByTestId('candidate-rating')).toHaveAttribute('data-rating', '0')
    expect(screen.getByTestId('candidate-attachments')).toHaveTextContent('0')
    expect(screen.getByTestId('candidate-ai')).toHaveTextContent('–')
    expect(screen.getByTestId('candidate-cell-last-contact')).toHaveTextContent('Nekontaktován/a')
    expect(screen.getByTestId('candidate-note-empty')).toBeInTheDocument()
  })

  it('keeps the name column sticky on the left and the note column sticky on the right', () => {
    renderItem()

    expect(screen.getByTestId('candidate-cell-name')).toHaveClass('tm-sticky', 'tm-left-0', 'tm-bg-basic')
    expect(screen.getByTestId('candidate-cell-note')).toHaveClass('tm-sticky', 'tm-right-0', 'tm-bg-basic')
    expect(screen.getByTestId('candidate-cell-rating')).not.toHaveClass('tm-sticky')
  })

  it('uses the same typography for last contact and source dates', () => {
    renderItem()

    const lastContact = screen.getByTestId('candidate-last-contact')
    const sourceDate = screen.getByTestId('candidate-source-date')
    for (const date of [lastContact, sourceDate]) {
      expect(date).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-secondary-default')
    }
    expect(lastContact.className).toBe(sourceDate.className)
  })

  it('gives body cells roomier horizontal padding', () => {
    renderItem()

    expect(screen.getByTestId('candidate-cell-source')).toHaveClass('!tm-px-6', '!tm-py-5')
  })

  it('uses a named hover group so Note hover state is not triggered by the row', () => {
    renderItem()

    const row = screen.getByTestId('candidate-item')
    expect(row).toHaveClass('tm-group/row')
    expect(row).not.toHaveClass('tm-group')
  })

  it('reveals the add note and new tag buttons only on row hover', () => {
    renderItem({ candidate: { ...candidate, note: undefined }, onNoteAdd: vi.fn(), onTagAdd: vi.fn() })

    expect(screen.getByTestId('candidate-note-add')).toHaveClass('tm-opacity-0', 'group-hover/row:tm-opacity-100')
    expect(screen.getByTestId('candidate-tags-add')).toHaveClass('tm-opacity-0', 'group-hover/row:tm-opacity-100')
  })

  it('hides the new tag button on row hover for a candidate without tags too', () => {
    renderItem({ candidate: { ...candidate, tags: [] }, onTagAdd: vi.fn() })

    expect(screen.getByTestId('candidate-tags-add')).toHaveClass('tm-opacity-0', 'group-hover/row:tm-opacity-100')
  })

  it('calls the row callbacks with the candidate', async () => {
    const user = userEvent.setup()
    const onNameClick = vi.fn()
    const onAttachmentsClick = vi.fn()
    const onStatusChange = vi.fn()
    const onTagAdd = vi.fn()
    const onTagRemove = vi.fn()
    const onNoteExpand = vi.fn()
    renderItem({
      onNameClick,
      onAttachmentsClick,
      onStatusChange,
      onTagAdd,
      onTagRemove,
      onNoteExpand,
    })

    await user.click(screen.getByRole('button', { name: 'Karl Jakub' }))
    expect(onNameClick).toHaveBeenCalledWith(candidate)

    await user.click(screen.getByTestId('candidate-attachments'))
    expect(onAttachmentsClick).toHaveBeenCalledWith(candidate)

    await user.click(screen.getByRole('button', { name: 'Nový štítek' }))
    expect(onTagAdd).toHaveBeenCalledWith(candidate)

    await user.click(screen.getByRole('button', { name: 'Odebrat štítek senior' }))
    expect(onTagRemove).toHaveBeenCalledWith(candidate, candidate.tags![0])

    await user.click(screen.getByRole('button', { name: 'Zobrazit celou poznámku' }))
    expect(onNoteExpand).toHaveBeenCalledWith(candidate)

    await user.click(screen.getByTestId('candidate-status-toggle'))
    await user.click(screen.getByRole('option', { name: 'Nástup' }))
    expect(onStatusChange).toHaveBeenCalledWith(candidate, 'hired')
  })

  it('calls onNoteAdd when the candidate has no note', async () => {
    const user = userEvent.setup()
    const onNoteAdd = vi.fn()
    const noNote = { ...candidate, note: undefined }
    renderItem({ candidate: noNote, onNoteAdd })

    await user.click(screen.getByRole('button', { name: 'Přidat poznámku' }))

    expect(onNoteAdd).toHaveBeenCalledWith(noNote)
  })
})

describe('CandidateTableHead', () => {
  it('renders column headers with matching sticky name and note columns', () => {
    render(
      <Table>
        <CandidateTableHead />
      </Table>,
    )

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(9)
    expect(headers[0]).toHaveTextContent('Uchazeč')
    expect(headers[0]).toHaveClass('tm-sticky', 'tm-left-0')
    expect(headers[8]).toHaveTextContent('Poznámka')
    expect(headers[8]).toHaveClass('tm-sticky', 'tm-right-0')
    for (const header of headers) {
      expect(header).toHaveClass('!tm-px-6', '!tm-py-4', 'tm-text-sm', 'tm-text-secondary-default')
    }
  })
})
