import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { JobModalActionPlaces } from './JobModalActionPlaces'
import type { JobModalPublicationPlace } from './types'

const places: JobModalPublicationPlace[] = [
  {
    id: 'jobs',
    name: 'Jobs.cz',
    description: 'Hlavní portál',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: '1 290 Kč',
  },
  {
    id: 'prace',
    name: 'Prace.cz',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 8,
  },
]

const additionalPlaces: JobModalPublicationPlace[] = [
  {
    id: 'atmoskop',
    name: 'Atmoskop',
    description: 'Nové místo vystavení',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 3,
  },
]

describe('JobModalActionPlaces', () => {
  it('pre-checks every place and confirms the selected ids', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <JobModalActionPlaces
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        places={places}
        onConfirm={onConfirm}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('checkbox', { name: 'Jobs.cz' })).toBeChecked()
    expect(within(dialog).getByRole('checkbox', { name: 'Prace.cz' })).toBeChecked()

    await user.click(within(dialog).getByRole('button', { name: 'Ukončit vystavení' }))
    expect(onConfirm).toHaveBeenCalledWith(['jobs', 'prace'])
  })

  it('disables confirm when no place is selected', async () => {
    const user = userEvent.setup()

    render(
      <JobModalActionPlaces
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        places={places}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('checkbox', { name: 'Jobs.cz' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Prace.cz' }))

    expect(within(dialog).getByRole('button', { name: 'Ukončit vystavení' })).toBeDisabled()
  })

  it('supports controlled selectedPlaceIds', async () => {
    const user = userEvent.setup()
    const onSelectedPlaceIdsChange = vi.fn()

    function Controlled() {
      const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>(['jobs'])
      return (
        <JobModalActionPlaces
          defaultOpen
          title="Ukončit vystavení"
          confirmLabel="Ukončit vystavení"
          places={places}
          selectedPlaceIds={selectedPlaceIds}
          onSelectedPlaceIdsChange={(ids) => {
            onSelectedPlaceIdsChange(ids)
            setSelectedPlaceIds(ids)
          }}
        />
      )
    }

    render(<Controlled />)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('checkbox', { name: 'Jobs.cz' })).toBeChecked()
    expect(within(dialog).getByRole('checkbox', { name: 'Prace.cz' })).not.toBeChecked()

    await user.click(within(dialog).getByRole('checkbox', { name: 'Prace.cz' }))
    expect(onSelectedPlaceIdsChange).toHaveBeenCalledWith(['jobs', 'prace'])
  })

  it('keeps additional places hidden until the reveal button is used', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <JobModalActionPlaces
        defaultOpen
        title="Prodloužit a znovu vystavit"
        confirmLabel="Prodloužit"
        additionalPlacesLabel="Zobrazit další portály"
        additionalPlacesHideLabel="Skrýt tyto portály"
        places={places}
        additionalPlaces={additionalPlaces}
        onConfirm={onConfirm}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getAllByRole('separator')).toHaveLength(2)
    expect(within(dialog).queryByRole('checkbox', { name: 'Atmoskop' })).not.toBeInTheDocument()

    const reveal = within(dialog).getByRole('button', { name: 'Zobrazit další portály' })
    expect(within(dialog).getByTestId('job-modal-additional-places')).toBeInTheDocument()
    expect(reveal).toHaveAttribute('aria-expanded', 'false')
    expect(reveal).toHaveClass('tm-text-action-link-secondary-default')
    expect(reveal).not.toHaveClass('tm-rounded-full')

    await user.click(reveal)
    const hide = within(dialog).getByRole('button', { name: 'Skrýt tyto portály' })
    expect(hide).toHaveAttribute('aria-expanded', 'true')
    expect(within(dialog).getByRole('checkbox', { name: 'Atmoskop' })).not.toBeChecked()

    await user.click(hide)
    expect(within(dialog).getByRole('button', { name: 'Zobrazit další portály' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(within(dialog).queryByRole('checkbox', { name: 'Atmoskop' })).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Zobrazit další portály' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Atmoskop' }))
    await user.click(within(dialog).getByRole('button', { name: 'Prodloužit' }))
    expect(onConfirm).toHaveBeenCalledWith(['jobs', 'prace', 'atmoskop'])
  })

  it('does not render the additional-places section when the list is empty', async () => {
    render(
      <JobModalActionPlaces
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        places={places}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).queryByRole('separator')).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Zobrazit další portály' })).not.toBeInTheDocument()
  })
})
