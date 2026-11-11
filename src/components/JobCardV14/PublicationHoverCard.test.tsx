import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PublicationDetails, PublicationHoverCard } from './PublicationHoverCard'
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
    expect(screen.getByText('Míra reakce')).toBeInTheDocument()
    expect(screen.queryByText('Konverze')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-detail-link')).not.toBeInTheDocument()
  })
})

describe('PublicationHoverCard', () => {
  it('shows a secondary Zobrazit inzerát button at the bottom', async () => {
    const user = userEvent.setup()
    const onViewAdvertisement = vi.fn()
    render(
      <PublicationHoverCard
        dropdownTestId="job-card-publication-dropdown"
        trigger={<span>Jobs.cz</span>}
        onViewAdvertisement={onViewAdvertisement}
      >
        <PublicationDetails publication={publication} />
      </PublicationHoverCard>,
    )

    await user.hover(screen.getByText('Jobs.cz'))
    const button = await screen.findByRole('button', { name: 'Zobrazit inzerát' })
    expect(button).toHaveClass('tm-bg-basic')
    expect(button).toHaveClass('tm-border-action-secondary-default')
    fireEvent.click(button)
    expect(onViewAdvertisement).toHaveBeenCalledOnce()
  })
})
