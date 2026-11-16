import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PublicationDetails } from './PublicationHoverCard'
import type { JobPublication } from './types'

const publication: JobPublication = {
  id: 'jobs',
  channel: 'Jobs.cz',
  startDate: '1. 9. 2026',
  endDate: '30. 9. 2026',
  viewCount: 100,
  reactionCount: 5,
}

describe('PublicationDetails', () => {
  it('renders portal stats without an advertisement detail link', () => {
    render(<PublicationDetails publication={publication} />)

    expect(screen.getByTestId('job-card-publication-stats')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-detail-link')).not.toBeInTheDocument()
  })
})
