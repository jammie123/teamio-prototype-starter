import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { JobAssignee } from './JobAssignee'

const manyManagers = ['Lukáš Procházka', 'Jana Svobodová', 'Tomáš Král']

describe('JobAssignee', () => {
  it('renders owner and hiring manager avatars with initials', () => {
    render(<JobAssignee owner="Petra Nováková" hiringManagers={['Lukáš Procházka']} />)

    expect(screen.getByTestId('job-card-owner')).toHaveTextContent('PN')
    expect(screen.getByTestId('job-card-owner').className).toContain('tm-font-normal')
    expect(screen.getByTestId('job-card-owner').className).not.toContain('tm-font-semibold')
    expect(screen.getByTestId('job-card-hiring-manager-0')).toHaveTextContent('LP')
    expect(screen.getByTestId('job-card-hiring-manager-0').className).toContain('tm-font-normal')
    expect(screen.getByTestId('job-card-hiring-manager-0').className).not.toContain('tm-font-semibold')
    expect(screen.getByTestId('job-card-people')).toHaveAttribute(
      'aria-label',
      'Petra Nováková (Náborář), Lukáš Procházka (Hiring manager)',
    )
  })

  it('renders the people toggle as a quiet rounded capsule with a secondary border', () => {
    render(<JobAssignee owner="Petra Nováková" hiringManagers={['Lukáš Procházka']} />)

    const toggle = screen.getByTestId('job-card-people')
    expect(toggle.className).toContain('tm-rounded-full')
    expect(toggle.className).toContain('tm-border-secondary')
    expect(toggle.className).toContain('tm-bg-transparent')
    expect(toggle.className).toContain('tm-text-sm')
    expect(toggle.className).not.toContain('tm-bg-basic')
    expect(toggle.className).not.toContain('tm-border-action-secondary-default')
  })

  it('separates initials with a divider and does not render circular avatars on the capsule', () => {
    render(<JobAssignee owner="Petra Nováková" hiringManagers={['Lukáš Procházka']} />)

    expect(screen.getByTestId('job-card-people-divider')).toBeInTheDocument()
    for (const testId of ['job-card-owner', 'job-card-hiring-manager-0']) {
      expect(screen.getByTestId(testId).className).not.toContain('tm-size-6')
      expect(screen.getByTestId(testId).className).not.toContain('tm-bg-cover-default')
      expect(screen.getByTestId(testId).className).not.toMatch(/(?:^|\s)(?:tm-)?border/)
    }
  })

  it('renders only the owner without hiring managers', () => {
    render(<JobAssignee owner="Petra Nováková" />)

    expect(screen.getByTestId('job-card-owner')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-hiring-managers')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-people-overflow')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-people-divider')).not.toBeInTheDocument()
  })

  it('shows two avatars without overflow', () => {
    render(<JobAssignee owner="Petra Nováková" hiringManagers={['Lukáš Procházka']} />)

    expect(screen.getByTestId('job-card-owner')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-hiring-manager-0')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-people-overflow')).not.toBeInTheDocument()
  })

  it('shows two avatars and +N when there are more than two people', () => {
    render(<JobAssignee owner="Petra Nováková" hiringManagers={manyManagers} />)

    expect(screen.getByTestId('job-card-owner')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-hiring-manager-0')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-hiring-manager-1')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-people-overflow')).toHaveTextContent('+2')
  })

  it('lists all people with roles on hover', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<JobAssignee owner="Petra Nováková" hiringManagers={manyManagers} />)

    await user.hover(screen.getByTestId('job-card-people'))
    const dropdown = await screen.findByTestId('job-card-people-dropdown')

    expect(within(dropdown).getAllByTestId('job-card-people-owner')).toHaveLength(1)
    expect(within(dropdown).getAllByTestId('job-card-people-hiring-manager')).toHaveLength(3)
    expect(within(dropdown).getByText('Tomáš Král')).toBeInTheDocument()
  })

  it('renders nothing without people', () => {
    const { container } = render(<JobAssignee />)

    expect(container).toBeEmptyDOMElement()
  })
})
