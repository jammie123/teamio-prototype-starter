import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateStatus } from './CandidateStatus'

describe('CandidateStatus', () => {
  it('shows the label of the current status on the toggle', () => {
    render(<CandidateStatus value="hired" />)

    const toggle = screen.getByTestId('candidate-status-toggle')
    expect(toggle).toHaveTextContent('Nástup')
    expect(toggle).toHaveClass('tm-bg-emotion-success-background')
  })

  it('uses medium font weight on the toggle', () => {
    render(<CandidateStatus value="hired" />)

    expect(screen.getByTestId('candidate-status-toggle')).toHaveClass('tm-font-medium')
    expect(screen.getByTestId('candidate-status-toggle')).not.toHaveClass('tm-font-semibold')
  })

  it('uses the neutral colour for an unassessed candidate', () => {
    render(<CandidateStatus value="unassessed" />)

    expect(screen.getByTestId('candidate-status-toggle')).toHaveClass('tm-bg-cover-dark')
  })

  it('opens a dropdown with all statuses and marks the current one as selected', async () => {
    const user = userEvent.setup()
    render(<CandidateStatus value="hired" />)

    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('candidate-status-toggle'))

    expect(screen.getAllByRole('option')).toHaveLength(5)
    expect(screen.getByRole('option', { name: 'Nástup' })).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onChange with the chosen status and closes the dropdown', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CandidateStatus value="unassessed" onChange={onChange} />)

    await user.click(screen.getByTestId('candidate-status-toggle'))
    await user.click(screen.getByRole('option', { name: 'Pohovor' }))

    expect(onChange).toHaveBeenCalledWith('interview', expect.objectContaining({ id: 'interview' }))
    expect(screen.queryByTestId('dropdown-body')).not.toBeInTheDocument()
  })
})
