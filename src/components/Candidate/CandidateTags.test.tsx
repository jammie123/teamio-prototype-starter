import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateTags } from './CandidateTags'

const tags = [
  { id: 'inbox', label: 'inbox' },
  { id: 'senior', label: 'senior' },
]

describe('CandidateTags', () => {
  it('renders every tag', () => {
    render(<CandidateTags tags={tags} />)

    expect(screen.getAllByTestId('candidate-tag')).toHaveLength(2)
    expect(screen.getByText('inbox')).toBeInTheDocument()
    expect(screen.getByText('senior')).toBeInTheDocument()
  })

  it('has no controls when read-only', () => {
    render(<CandidateTags tags={tags} />)

    expect(screen.queryByTestId('candidate-tags-add')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('uses medium font weight on the new tag button', () => {
    render(<CandidateTags tags={tags} onAdd={vi.fn()} />)

    expect(screen.getByTestId('candidate-tags-add')).toHaveClass('!tm-font-medium')
  })

  it('calls onAdd from the new tag button', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<CandidateTags tags={tags} onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: 'Nový štítek' }))

    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove with the dismissed tag', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<CandidateTags tags={tags} onRemove={onRemove} />)

    await user.click(screen.getByRole('button', { name: 'Odebrat štítek inbox' }))

    expect(onRemove).toHaveBeenCalledWith(tags[0])
  })
})
