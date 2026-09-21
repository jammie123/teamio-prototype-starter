import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JobModalBoost } from './JobModalBoost'
import { JobModalProlong } from './JobModalProlong'
import { JobModalPublish } from './JobModalPublish'
import { JobModalTop } from './JobModalTop'
import { JobModalUnpublish } from './JobModalUnpublish'
import type { JobModalPublicationPlace } from './types'

const places: JobModalPublicationPlace[] = [
  { id: 'jobs', name: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
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
    expect(await screen.findByRole('button', { name: 'Prodloužit' })).toBeInTheDocument()

    rerender(<JobModalPublish defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Zveřejnit' })).toBeInTheDocument()

    rerender(<JobModalBoost defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Zvýraznit' })).toBeInTheDocument()

    rerender(<JobModalTop defaultOpen places={places} />)
    expect(await screen.findByRole('button', { name: 'Topovat' })).toBeInTheDocument()
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
