import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardPeople } from './JobCardPeople'

const people = [
  { name: 'Petra Nováková', role: 'Náborář' },
  { name: 'Lukáš Procházka', role: 'Hiring manager' },
]

describe('JobCardPeople', () => {
  it('does not show Zapojit další unless onInviteMore is provided', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<JobCardPeople people={people} />)

    await user.hover(screen.getByTestId('job-card-people'))
    const dropdown = await screen.findByTestId('job-card-people-dropdown')
    expect(dropdown).toBeInTheDocument()
    expect(dropdown).toHaveClass('tm-min-w-72')
    expect(screen.queryByTestId('job-card-people-invite')).not.toBeInTheDocument()
  })

  it('shows a secondary Zapojit další button that calls onInviteMore', async () => {
    const onInviteMore = vi.fn()
    render(<JobCardPeople people={people} onInviteMore={onInviteMore} />)

    fireEvent.click(screen.getByTestId('job-card-people'))
    const invite = await screen.findByTestId('job-card-people-invite')
    expect(invite).toHaveTextContent('Zapojit další')
    expect(invite).toHaveClass('tm-w-full', 'tm-min-h-8')
    expect(invite).not.toHaveFocus()

    fireEvent.click(invite)
    expect(onInviteMore).toHaveBeenCalledTimes(1)
  })
})
