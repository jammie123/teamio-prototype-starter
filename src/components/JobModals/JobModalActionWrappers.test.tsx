import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JobModalBoost } from './JobModalBoost'
import { JobModalProlong } from './JobModalProlong'
import { JobModalPublish } from './JobModalPublish'
import { JobModalTop } from './JobModalTop'
import { JobModalUnpublish } from './JobModalUnpublish'
import type { JobModalPublicationPlace } from './types'

const places: JobModalPublicationPlace[] = [
  {
    id: 'jobs',
    name: 'Jobs.cz',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: '1 290 Kč',
  },
]

describe('JobModal action wrappers', () => {
  it.each([
    ['Ukončit vystavení', () => <JobModalUnpublish defaultOpen places={places} />],
    ['Prodloužit a znovu vystavit', () => <JobModalProlong defaultOpen places={places} />],
    ['Zveřejnit inzerát', () => <JobModalPublish defaultOpen places={places} />],
    ['Zvýraznit inzerát', () => <JobModalBoost defaultOpen places={places} />],
    ['Topovat', () => <JobModalTop defaultOpen places={places} />],
  ] as const)('renders default title %s', async (title, renderModal) => {
    render(renderModal())
    expect(await screen.findByRole('dialog')).toHaveAccessibleName(title)
  })

  it('uses default confirm labels', async () => {
    const { rerender } = render(<JobModalUnpublish defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Ukončit vystavení' })).toBeInTheDocument()

    rerender(<JobModalProlong defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Znovuvystavit inzeráty' })).toBeInTheDocument()

    rerender(<JobModalPublish defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Zveřejnit' })).toBeInTheDocument()

    rerender(<JobModalBoost defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Zvýraznit' })).toBeInTheDocument()

    rerender(<JobModalTop defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Topovat' })).toBeInTheDocument()
  })

  it('keeps Cena off Unpublish, shows it on Prolong, and uses Inzerováno', async () => {
    const { rerender } = render(<JobModalUnpublish defaultOpen places={places} />)
    const unpublish = await screen.findByRole('dialog')
    expect(within(unpublish).queryByRole('columnheader', { name: 'Cena' })).not.toBeInTheDocument()
    expect(within(unpublish).queryByText('1 290 Kč')).not.toBeInTheDocument()
    expect(within(unpublish).getByRole('columnheader', { name: 'Inzerováno' })).toBeInTheDocument()
    expect(within(unpublish).getByText('12. 7. – 30. 9. 2026')).toBeInTheDocument()
    expect(within(unpublish).queryByRole('columnheader', { name: 'Vystavení' })).not.toBeInTheDocument()
    expect(within(unpublish).queryByTestId('job-modal-places-summary')).not.toBeInTheDocument()

    rerender(<JobModalProlong defaultOpen places={places} />)
    const prolong = await screen.findByRole('dialog')
    expect(within(prolong).getByTestId('job-modal-places-summary')).toBeInTheDocument()
    expect(within(prolong).getByRole('columnheader', { name: 'Cena' })).toBeInTheDocument()
    expect(within(prolong).getByText('1 290 Kč')).toBeInTheDocument()
    expect(within(prolong).queryByRole('columnheader', { name: 'Stav' })).not.toBeInTheDocument()
    expect(within(prolong).getByRole('columnheader', { name: 'Inzerováno' })).toBeInTheDocument()
    expect(within(prolong).getByTestId('job-modal-place-status')).toBeInTheDocument()
    expect(within(prolong).getByRole('columnheader', { name: 'Nové období' })).toBeInTheDocument()
  })

  it('lets Prolong reveal extra portals with the default label', async () => {
    render(
      <JobModalProlong
        defaultOpen
        places={places}
        additionalPlaces={[
          { id: 'atmoskop', name: 'Atmoskop', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        ]}
      />,
    )

    const reveal = await screen.findByRole('button', { name: 'Zobrazit další portály' })
    expect(reveal).toBeInTheDocument()
  })
})
