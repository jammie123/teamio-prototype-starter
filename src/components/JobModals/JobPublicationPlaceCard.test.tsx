import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobPublicationPlaceCard } from './JobPublicationPlaceCard'
import type { JobModalPublicationPlace } from './types'

const jobsCz: JobModalPublicationPlace = {
  id: 'jobs',
  name: 'Jobs.cz',
  description: 'Inzerát na hlavní pracovní portál',
  startDate: '12. 7. 2026',
  endDate: '30. 9. 2026',
  priceLabel: '1 290 Kč',
  credits: 12,
}

describe('JobPublicationPlaceCard', () => {
  it('renders logo, name, description, date range, price and credits', () => {
    render(
      <JobPublicationPlaceCard place={jobsCz} checked onCheckedChange={() => undefined} />,
    )

    expect(screen.getByTestId('job-portal-logo')).toHaveAttribute('data-logo-type', 'jobs-cz')
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.getByText('Inzerát na hlavní pracovní portál')).toBeInTheDocument()
    expect(screen.getByText('12. 7. – 30. 9. 2026')).toBeInTheDocument()
    expect(screen.getByText('1 290 Kč')).toBeInTheDocument()
    expect(screen.getByText('12 kreditů')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Jobs.cz' })).toBeChecked()
  })

  it('uses an explicit logoType when provided', () => {
    render(
      <JobPublicationPlaceCard
        place={{ ...jobsCz, logoType: 'profesia' }}
        checked={false}
        onCheckedChange={() => undefined}
      />,
    )

    expect(screen.getByTestId('job-portal-logo')).toHaveAttribute('data-logo-type', 'profesia')
  })

  it('toggles from the checkbox and from a click on the card', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(
      <JobPublicationPlaceCard
        place={jobsCz}
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Jobs.cz' }))
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledWith(true)

    onCheckedChange.mockClear()
    await user.click(screen.getByText('Inzerát na hlavní pracovní portál'))
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('omits missing optional fields', () => {
    render(
      <JobPublicationPlaceCard
        place={{ id: 'career', name: 'Kariérní stránky', startDate: '12. 7. 2026' }}
        checked={false}
        onCheckedChange={() => undefined}
      />,
    )

    expect(screen.queryByText('kreditů')).not.toBeInTheDocument()
    expect(screen.getByText('12. 7. 2026')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Kariérní stránky' })).not.toBeChecked()
  })
})
