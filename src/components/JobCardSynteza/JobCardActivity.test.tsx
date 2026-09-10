import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardActivity } from './JobCardActivity'

describe('JobCardActivity', () => {
  it('shows a tooltip on hover and keeps the unread dot until the bell is clicked', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(
      <JobCardActivity
        activities={[
          {
            id: 'rating-1',
            type: 'rating',
            actor: 'Lukáš Procházka',
            candidateName: 'Jana Malá',
            occurredAt: 'dnes 9:14',
            unread: true,
          },
        ]}
      />,
    )

    await user.hover(screen.getByTestId('job-card-activity-toggle'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Zobrazit upozornění')
    expect(screen.getByTestId('job-card-activity-dot')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-activity-menu')).not.toBeInTheDocument()
  })

  it('lists hiring-manager updates and clears the unread dot after click', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onActivityClick = vi.fn()
    render(
      <JobCardActivity
        activities={[
          {
            id: 'rating-1',
            type: 'rating',
            actor: 'Lukáš Procházka',
            candidateName: 'Jana Malá',
            occurredAt: 'dnes 9:14',
            unread: true,
          },
          {
            id: 'note-1',
            type: 'note',
            actor: 'Lukáš Procházka',
            candidateName: 'Petr Horák',
            occurredAt: 'včera 16:02',
            unread: true,
          },
        ]}
        onActivityClick={onActivityClick}
      />,
    )

    const unreadDot = screen.getByTestId('job-card-activity-dot')
    expect(unreadDot).toHaveClass('tm-absolute', 'tm-bottom-0.5', 'tm-right-0.5')
    expect(screen.getAllByTestId('job-card-activity-dot')).toHaveLength(1)

    await user.click(screen.getByTestId('job-card-activity-toggle'), { skipHover: true })
    const menu = await screen.findByTestId('job-card-activity-menu')
    expect(menu).toHaveTextContent('Lukáš Procházka ohodnotil/a uchazeče Jana Malá')
    expect(menu).toHaveTextContent('Lukáš Procházka přidal/a poznámku k uchazeči Petr Horák')
    expect(menu).toHaveTextContent('dnes 9:14')
    expect(screen.queryByTestId('job-card-activity-dot')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('job-card-activity-rating-1'), { skipHover: true })
    expect(onActivityClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'rating-1', type: 'rating' }),
    )
  })

  it('shows an empty message when there are no updates', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<JobCardActivity activities={[]} />)

    expect(screen.queryByTestId('job-card-activity-dot')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('job-card-activity-toggle'), { skipHover: true })
    expect(await screen.findByTestId('job-card-activity-empty')).toHaveTextContent(
      'Žádné nové aktivity',
    )
  })
})
