import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobBulkAction } from './JobBulkAction'

describe('JobBulkAction', () => {
  it('renders the select-all checkbox and secondary archive and transfer actions', () => {
    render(<JobBulkAction selectedCount={0} totalCount={3} />)

    const bar = screen.getByTestId('job-bulk-action')
    expect(bar).toHaveAttribute('role', 'group')
    expect(bar).toHaveClass('tm-bg-basic')
    expect(bar).toHaveClass('tm-rounded-md')
    expect(bar).toHaveClass('tm-shadow-md')
    expect(bar).toHaveClass('tm-border-secondary')
    expect(screen.getByRole('checkbox', { name: 'Vybrat vše' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Archivovat' })).toHaveClass('tm-bg-basic')
    expect(screen.getByRole('button', { name: 'Předat nábor' })).toHaveClass('tm-bg-basic')
    const turnOff = screen.getByRole('button', { name: 'Vypnout hromadné úpravy' })
    expect(turnOff).toBeEnabled()
    expect(turnOff).toHaveClass('tm-bg-transparent', 'tm-size-8', 'tm-rounded-full')
    expect(within(turnOff).getByTestId('icon')).toHaveAttribute('data-icon-name', 'x')
    expect(screen.getByTestId('job-bulk-action-actions').className).toContain('tm-ml-auto')
    expect(screen.getByTestId('job-bulk-action-actions')).toContainElement(turnOff)
  })

  it.each([
    [0, 'Vybráno: 0 náborů'],
    [1, 'Vybráno: 1 nábor'],
    [3, 'Vybráno: 3 nábory'],
    [5, 'Vybráno: 5 náborů'],
    [14, 'Vybráno: 14 náborů'],
  ])('shows that %i jobs are selected in 14px type', (count, text) => {
    render(<JobBulkAction selectedCount={count} totalCount={14} />)

    const label = screen.getByTestId('job-bulk-action-count')
    expect(label).toHaveTextContent(text)
    expect(label).toHaveClass('tm-text-sm')
  })

  it('disables archive and transfer until a job is selected', () => {
    const { rerender } = render(<JobBulkAction selectedCount={0} totalCount={3} />)

    expect(screen.getByRole('button', { name: 'Archivovat' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Předat nábor' })).toBeDisabled()

    rerender(<JobBulkAction selectedCount={1} totalCount={3} />)

    expect(screen.getByRole('button', { name: 'Archivovat' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Předat nábor' })).toBeEnabled()
  })

  it('checks select-all when every job is selected and uses indeterminate for a partial selection', () => {
    const { rerender } = render(<JobBulkAction selectedCount={0} totalCount={3} />)
    const checkbox = () => screen.getByRole('checkbox', { name: 'Vybrat vše' }) as HTMLInputElement

    expect(checkbox()).not.toBeChecked()
    expect(checkbox().indeterminate).toBe(false)

    rerender(<JobBulkAction selectedCount={1} totalCount={3} />)
    expect(checkbox()).not.toBeChecked()
    expect(checkbox().indeterminate).toBe(true)

    rerender(<JobBulkAction selectedCount={3} totalCount={3} />)
    expect(checkbox()).toBeChecked()
    expect(checkbox().indeterminate).toBe(false)
  })

  it('disables select-all when there are no jobs', () => {
    render(<JobBulkAction selectedCount={0} totalCount={0} />)

    expect(screen.getByRole('checkbox', { name: 'Vybrat vše' })).toBeDisabled()
  })

  it('calls onSelectAllChange when the select-all checkbox is toggled', async () => {
    const user = userEvent.setup()
    const onSelectAllChange = vi.fn()
    render(
      <JobBulkAction selectedCount={0} totalCount={3} onSelectAllChange={onSelectAllChange} />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Vybrat vše' }))

    expect(onSelectAllChange).toHaveBeenCalledWith(true)
  })

  it('calls archive and transfer handlers', async () => {
    const user = userEvent.setup()
    const onArchive = vi.fn()
    const onTransfer = vi.fn()
    render(
      <JobBulkAction
        selectedCount={2}
        totalCount={3}
        onArchive={onArchive}
        onTransfer={onTransfer}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Archivovat' }))
    await user.click(screen.getByRole('button', { name: 'Předat nábor' }))

    expect(onArchive).toHaveBeenCalledTimes(1)
    expect(onTransfer).toHaveBeenCalledTimes(1)
  })

  it('keeps Vypnout hromadné úpravy enabled and calls onTurnOff', async () => {
    const user = userEvent.setup()
    const onTurnOff = vi.fn()
    render(<JobBulkAction selectedCount={0} totalCount={3} onTurnOff={onTurnOff} />)

    const turnOff = screen.getByRole('button', { name: 'Vypnout hromadné úpravy' })
    expect(turnOff).toBeEnabled()
    await user.click(turnOff)

    expect(onTurnOff).toHaveBeenCalledTimes(1)
  })
})
