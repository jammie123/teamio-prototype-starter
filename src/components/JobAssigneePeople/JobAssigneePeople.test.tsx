import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { JobAssigneePeople } from './JobAssigneePeople'

const manyManagers = [
  'Lukáš Procházka',
  'Jana Svobodová',
  'Tomáš Král',
  'Eva Dvořáková',
  'Martin Veselý',
  'Klára Horáková',
]

describe('JobAssigneePeople', () => {
  it('renders owner and hiring manager avatars without overflow', () => {
    render(<JobAssigneePeople owner="Petra Nováková" hiringManagers={['Lukáš Procházka']} />)

    expect(screen.getByTestId('job-card-owner')).toHaveTextContent('PN')
    expect(screen.getByTestId('job-card-hiring-manager-0')).toHaveTextContent('LP')
    expect(screen.queryByTestId('job-card-people-overflow')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-people')).toHaveAttribute(
      'aria-label',
      'Petra Nováková (Náborář), Lukáš Procházka (Hiring manager)',
    )
  })

  it('renders only the owner without hiring managers', () => {
    render(<JobAssigneePeople owner="Petra Nováková" />)

    expect(screen.getByTestId('job-card-owner')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-hiring-managers')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-people-overflow')).not.toBeInTheDocument()
  })

  it('shows all avatars up to four people', () => {
    render(<JobAssigneePeople owner="Petra Nováková" hiringManagers={manyManagers.slice(0, 3)} />)

    expect(screen.getByTestId('job-card-owner')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-hiring-manager-2')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-people-overflow')).not.toBeInTheDocument()
  })

  it('shows 3 avatars and +N for more than four people', () => {
    render(<JobAssigneePeople owner="Petra Nováková" hiringManagers={manyManagers} />)

    expect(screen.getByTestId('job-card-owner')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-hiring-manager-0')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-hiring-manager-1')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-hiring-manager-2')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-people-overflow')).toHaveTextContent('+4')
  })

  it('lists all people with roles on hover', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<JobAssigneePeople owner="Petra Nováková" hiringManagers={manyManagers} />)

    await user.hover(screen.getByTestId('job-card-people'))
    const dropdown = await screen.findByTestId('job-card-people-dropdown')

    expect(within(dropdown).getAllByTestId('job-card-people-owner')).toHaveLength(1)
    expect(within(dropdown).getAllByTestId('job-card-people-hiring-manager')).toHaveLength(6)
    expect(within(dropdown).getByText('Klára Horáková')).toBeInTheDocument()
  })

  it('renders nothing without people', () => {
    const { container } = render(<JobAssigneePeople />)

    expect(container).toBeEmptyDOMElement()
  })
})
