import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobAdvertisementChoiceCard } from './JobAdvertisementChoiceCard'
import type { JobModalAdvertisement } from './types'

const advertisement: JobModalAdvertisement = {
  id: 'ad-1',
  title: 'Hlavní inzerát',
  createdAt: '12. 3. 2026',
}

describe('JobAdvertisementChoiceCard', () => {
  it('renders the advertisement title and creation date', () => {
    render(
      <JobAdvertisementChoiceCard
        advertisement={advertisement}
        name="choose-ads"
        checked={false}
        onSelect={() => undefined}
      />,
    )

    expect(screen.getByText('Hlavní inzerát')).toBeInTheDocument()
    expect(screen.getByText('12. 3. 2026')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Hlavní inzerát' })).not.toBeChecked()
  })

  it('selects from the radio and from a click on the card', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <JobAdvertisementChoiceCard
        advertisement={advertisement}
        name="choose-ads"
        checked={false}
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByRole('radio', { name: 'Hlavní inzerát' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('ad-1')

    onSelect.mockClear()
    await user.click(screen.getByText('12. 3. 2026'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('ad-1')
  })

  it('marks the radio as checked when selected', () => {
    render(
      <JobAdvertisementChoiceCard
        advertisement={advertisement}
        name="choose-ads"
        checked
        onSelect={() => undefined}
      />,
    )

    expect(screen.getByRole('radio', { name: 'Hlavní inzerát' })).toBeChecked()
  })
})
