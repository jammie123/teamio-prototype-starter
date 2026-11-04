import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PublicationHighlightItem, PublicationItem } from './PublicationItem'
import type { JobPublication } from './types'

const publication: JobPublication = {
  id: 'jobs',
  channel: 'Jobs.cz',
  startDate: '1. 9. 2026',
  endDate: '30. 9. 2026',
  viewCount: 1840,
}

describe('PublicationItem', () => {
  it('renders the portal name in an outlined chip with a success dot when running', () => {
    render(<PublicationItem publication={publication} status="active" />)

    const item = screen.getByTestId('job-card-publication')
    expect(item).toHaveAttribute('data-status', 'active')
    expect(item.className).toContain('tm-border-secondary')
    expect(item.className).toContain('tm-rounded-full')
    expect(screen.getByTestId('job-card-publication-channel')).toHaveTextContent('Jobs.cz')
    expect(screen.getByTestId('job-card-publication-channel').className).toContain('tm-font-normal')
    expect(screen.getByTestId('job-card-publication-dot').className).toContain(
      'tm-bg-emotion-success-emphasis',
    )
    expect(screen.queryByTestId('job-card-publication-dates')).not.toBeInTheDocument()
  })

  it('uses a warning dot when ending soon', () => {
    render(<PublicationItem publication={publication} status="endingSoon" dateLabel="do 30. 9." />)

    expect(screen.getByTestId('job-card-publication-dot').className).toContain(
      'tm-bg-emotion-warning-emphasis',
    )
    expect(screen.getByTestId('job-card-publication-dates')).toHaveTextContent('do 30. 9.')
  })

  it('mutes the name and uses a gray dot when ended', () => {
    render(<PublicationItem publication={publication} status="expired" dateLabel="ukončeno 15. 8." />)

    expect(screen.getByTestId('job-card-publication-dot').className).toContain('tm-bg-gray-300')
    expect(screen.getByTestId('job-card-publication-channel').className).toContain(
      'tm-text-secondary-default',
    )
    expect(screen.getByTestId('job-card-publication-dates')).toHaveTextContent('ukončeno 15. 8.')
  })

  it('can hide the status dot', () => {
    render(<PublicationItem publication={publication} status="active" showStatusDot={false} />)

    expect(screen.queryByTestId('job-card-publication-dot')).not.toBeInTheDocument()
  })
})

describe('PublicationHighlightItem', () => {
  it('renders the highlight name', () => {
    render(
      <PublicationHighlightItem
        publication={publication}
        highlight={{ id: 'h', name: 'Jobstip', startDate: '8. 6.', endDate: '30. 9. 2026' }}
      />,
    )

    expect(screen.getByTestId('job-card-publication-highlight-name')).toHaveTextContent('Jobstip')
  })
})
