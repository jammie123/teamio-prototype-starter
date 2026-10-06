import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { formatPublicationRange } from '../JobCardSynteza/advertisementSummary'
import { JobModalActionPlaces } from './JobModalActionPlaces'
import type { JobModalAdvertisementSection, JobModalPublicationPlace } from './types'

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
    expect(dialog).toHaveClass('tm-max-w-[900px]')
    expect(within(dialog).getByTestId('job-modal-places-table')).toHaveClass(
      'tm-text-sm',
      'tm-table-fixed',
    )
    expect(within(dialog).getByRole('columnheader', { name: 'Název místa' })).toHaveClass(
      'tm-text-13',
      'tm-w-56',
    )
    expect(within(dialog).getByRole('columnheader', { name: 'Vystavení' })).toHaveClass('tm-w-48')
    expect(within(dialog).getByRole('columnheader', { name: 'Cena' })).toHaveClass('tm-w-40')
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
    expect(within(dialog).getAllByTestId('job-modal-places-table')).toHaveLength(1)
    expect(within(dialog).getAllByTestId('job-modal-place-row')).toHaveLength(3)
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

  it('renders a titled table for each selected advertisement', async () => {
    const sections: JobModalAdvertisementSection[] = [
      {
        advertisement: { id: 'ad-1', title: 'Hlavní inzerát', createdAt: '12. 3. 2026' },
        places: places,
      },
      {
        advertisement: { id: 'ad-2', title: 'Inzerát pro brigádníky', createdAt: '20. 4. 2026' },
        places: [
          {
            id: 'ad-2-jobs',
            name: 'Jobs.cz',
            startDate: '20. 4. 2026',
            endDate: '31. 10. 2026',
          },
        ],
      },
    ]

    render(
      <JobModalActionPlaces
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        advertisementSections={sections}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getAllByTestId('job-modal-advertisement-title').map((node) => node.textContent)).toEqual([
      'Hlavní inzerát',
      'Inzerát pro brigádníky',
    ])
    const tables = within(dialog).getAllByTestId('job-modal-places-table')
    expect(tables).toHaveLength(2)
    for (const table of tables) {
      expect(table).toHaveClass('tm-table-fixed')
      expect(within(table).getByRole('columnheader', { name: 'Název místa' })).toHaveClass('tm-w-56')
      expect(within(table).getByRole('columnheader', { name: 'Vystavení' })).toHaveClass('tm-w-48')
      expect(within(table).getByRole('columnheader', { name: 'Cena' })).toHaveClass('tm-w-40')
    }
    expect(within(dialog).getAllByRole('checkbox', { name: 'Jobs.cz' })).toHaveLength(2)
  })

  it('hides the Cena column when hideCostColumn is set', async () => {
    render(
      <JobModalActionPlaces
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        places={places}
        hideCostColumn
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).queryByRole('columnheader', { name: 'Cena' })).not.toBeInTheDocument()
    expect(within(dialog).queryByText('1 290 Kč')).not.toBeInTheDocument()
    expect(within(dialog).getByRole('columnheader', { name: 'Název místa' })).toBeInTheDocument()
    expect(within(dialog).getByRole('columnheader', { name: 'Vystavení' })).toBeInTheDocument()
  })

  it('uses Inzerováno with a from–to range and a dash when never advertised', async () => {
    render(
      <JobModalActionPlaces
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        hideCostColumn
        placesTableVariant="unpublish"
        places={[
          places[0],
          { id: 'new-portal', name: 'Atmoskop' },
        ]}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('columnheader', { name: 'Inzerováno' })).toBeInTheDocument()
    expect(within(dialog).queryByRole('columnheader', { name: 'Vystavení' })).not.toBeInTheDocument()
    expect(within(dialog).getAllByTestId('job-modal-place-advertised-from').map((cell) => cell.textContent)).toEqual([
      '12. 7. – 30. 9. 2026',
      '–',
    ])
    expect(within(dialog).getAllByTestId('job-modal-place-status')).toHaveLength(1)
  })

  it('puts status under Inzerováno and sorts oldest advertised places first', async () => {
    const now = new Date()
    const daysFromNow = (days: number) => {
      const date = new Date(now)
      date.setDate(date.getDate() + days)
      return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
    }
    const runningEnd = daysFromNow(20)
    const endingSoonEnd = daysFromNow(3)
    const endedEnd = daysFromNow(-10)

    render(
      <JobModalActionPlaces
        defaultOpen
        title="Prodloužit a znovu vystavit"
        placesTableVariant="prolong"
        places={[
          {
            id: 'jobs',
            name: 'Jobs.cz',
            startDate: '12. 7. 2026',
            endDate: runningEnd,
            priceLabel: '1 290 Kč',
          },
          { id: 'prace', name: 'Prace.cz', startDate: '12. 7. 2026', endDate: endingSoonEnd },
          { id: 'career', name: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: endedEnd },
          { id: 'new-portal', name: 'Atmoskop' },
        ]}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).queryByRole('columnheader', { name: 'Stav' })).not.toBeInTheDocument()
    expect(within(dialog).getByRole('columnheader', { name: 'Inzerováno' })).toHaveClass(
      '!tm-border-b-0',
    )
    expect(within(dialog).getByRole('columnheader', { name: 'Nové období' })).toHaveClass('tm-w-52')
    expect(within(dialog).getByRole('columnheader', { name: 'Cena' })).toHaveClass('tm-w-40')
    expect(within(dialog).getByText('1 290 Kč')).toBeInTheDocument()
    expect(within(dialog).getAllByTestId('job-modal-place-status').map((cell) => cell.textContent)).toEqual([
      'ukončeno',
      'brzy končí',
      'běží',
    ])
    const lastRow = within(dialog).getAllByTestId('job-modal-place-row').at(-1)
    expect(lastRow?.querySelector('td')).toHaveClass('!tm-border-b-0')
    expect(within(dialog).getAllByText('Prodloužení o 30 dní.')).toHaveLength(2)
    expect(within(dialog).getAllByText('Na 30 dní')).toHaveLength(2)
    expect(within(dialog).getAllByTestId('job-modal-place-advertised-from').map((cell) => cell.textContent)).toEqual([
      formatPublicationRange('12. 7. 2026', endedEnd),
      formatPublicationRange('12. 7. 2026', endingSoonEnd),
      formatPublicationRange('12. 7. 2026', runningEnd),
      '–',
    ])
    expect(within(dialog).getByRole('button', { name: 'Prodloužit a znovuvystavit' })).toBeInTheDocument()
  })

  it('changes the Prolong confirm label with the selected mix of places', async () => {
    const user = userEvent.setup()
    const now = new Date()
    const daysFromNow = (days: number) => {
      const date = new Date(now)
      date.setDate(date.getDate() + days)
      return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
    }

    render(
      <JobModalActionPlaces
        defaultOpen
        title="Prodloužit a znovu vystavit"
        placesTableVariant="prolong"
        places={[
          { id: 'jobs', name: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(20) },
          { id: 'career', name: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: daysFromNow(-10) },
        ]}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Prodloužit a znovuvystavit' })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('checkbox', { name: 'Kariérní stránky' }))
    expect(within(dialog).getByRole('button', { name: 'Prodloužit' })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('checkbox', { name: 'Jobs.cz' }))
    await user.click(within(dialog).getByRole('checkbox', { name: 'Kariérní stránky' }))
    expect(within(dialog).getByRole('button', { name: 'Znovuvystavit inzeráty' })).toBeInTheDocument()
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

  it('selects only visible places with Označit vše and leaves hidden additional places unchecked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <JobModalActionPlaces
        defaultOpen
        title="Prodloužit a znovu vystavit"
        confirmLabel="Prodloužit"
        places={places}
        additionalPlaces={additionalPlaces}
        onConfirm={onConfirm}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    const selectAll = within(dialog).getByRole('checkbox', { name: 'Označit vše' })
    expect(selectAll.closest('th')).toBeInTheDocument()
    expect(within(dialog).getByRole('columnheader', { name: 'Název místa' })).toBeInTheDocument()
    expect(selectAll).toBeChecked()
    expect(within(dialog).queryByRole('checkbox', { name: 'Atmoskop' })).not.toBeInTheDocument()

    await user.click(selectAll)
    expect(within(dialog).getByRole('checkbox', { name: 'Jobs.cz' })).not.toBeChecked()
    expect(within(dialog).getByRole('checkbox', { name: 'Prace.cz' })).not.toBeChecked()

    await user.click(selectAll)
    expect(within(dialog).getByRole('checkbox', { name: 'Jobs.cz' })).toBeChecked()
    expect(within(dialog).getByRole('checkbox', { name: 'Prace.cz' })).toBeChecked()

    await user.click(within(dialog).getByRole('button', { name: 'Zobrazit další portály' }))
    expect(within(dialog).getByRole('checkbox', { name: 'Atmoskop' })).not.toBeChecked()
    expect(selectAll).toHaveProperty('indeterminate', true)

    await user.click(within(dialog).getByRole('button', { name: 'Prodloužit' }))
    expect(onConfirm).toHaveBeenCalledWith(['jobs', 'prace'])
  })

  it('summarizes one advertisement without Inzerátů', async () => {
    render(
      <JobModalActionPlaces
        defaultOpen
        title="Prodloužit a znovu vystavit"
        confirmLabel="Prodloužit"
        places={places}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    const summary = within(dialog).getByTestId('job-modal-places-summary')
    expect(summary).toHaveTextContent('vystavení 2 · celkem 1 290 Kč / 8 kreditů')
    expect(summary.parentElement).toHaveClass('tm-text-sm', 'tm-text-primary-default', 'tm-ml-auto')
  })

  it('summarizes multiple advertisements with Inzerátů', async () => {
    render(
      <JobModalActionPlaces
        defaultOpen
        title="Prodloužit a znovu vystavit"
        confirmLabel="Prodloužit"
        advertisementSections={[
          {
            advertisement: { id: 'ad-1', title: 'Hlavní inzerát', createdAt: '12. 3. 2026' },
            places,
          },
          {
            advertisement: { id: 'ad-2', title: 'Inzerát pro brigádníky', createdAt: '20. 4. 2026' },
            places: [{ id: 'ad-2-jobs', name: 'Jobs.cz', priceLabel: '890 Kč' }],
          },
        ]}
      />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByTestId('job-modal-places-summary')).toHaveTextContent(
      'Inzerátů 2 · vystavení 3 · celkem 2 180 Kč / 8 kreditů',
    )
  })
})
