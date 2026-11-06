import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JobAssignee } from './JobAssignee'

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
    expect(screen.getByTestId('job-card-hiring-managers').className).toContain('tm-font-medium')
  })

  it('renders only the owner without hiring managers', () => {
    render(<JobAssignee owner="Petra Nováková" />)

    expect(screen.getByTestId('job-card-owner')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-hiring-managers')).not.toBeInTheDocument()
  })

  it('renders nothing without people', () => {
    const { container } = render(<JobAssignee />)

    expect(container).toBeEmptyDOMElement()
  })
})
