import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobMenu } from './JobMenu'
import type { JobAdvertisement } from '../JobShared/types'

const runningAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Hlavní inzerát',
  publications: [{ id: 'p-1', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' }],
}

const endedAdvertisement: JobAdvertisement = {
  id: 'ad-2',
  title: 'Starý inzerát',
  publications: [
    {
      id: 'p-2',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '1. 7. 2026',
      endDate: '31. 7. 2026',
    },
  ],
}

const allHandlers = () => ({
  onEditJob: vi.fn(),
  onDuplicateJob: vi.fn(),
  onEndPublication: vi.fn(),
  onExtendAndRepublish: vi.fn(),
  onHighlightAdvertisement: vi.fn(),
  onTopAdvertisement: vi.fn(),
  onAddNote: vi.fn(),
  onInviteColleagues: vi.fn(),
  onTransferJob: vi.fn(),
  onArchiveJob: vi.fn(),
})

const optionLabels = () => screen.getAllByRole('option').map((option) => option.textContent)

async function openMenu(advertisements: JobAdvertisement[]) {
  const user = userEvent.setup()

  render(<JobMenu advertisements={advertisements} {...allHandlers()} />)
  await user.click(screen.getByTestId('job-menu-toggle'))
}

describe('JobMenu', () => {
  it('lists all ten actions in a fixed order for running advertising', async () => {
    await openMenu([runningAdvertisement])

    expect(optionLabels()).toEqual([
      'Editovat nábor',
      'Duplikovat',
      'Ukončit vystavování',
      'Prodloužit a znovuvystavit',
      'Zvýraznit',
      'Topovat',
      'Přidat poznámku',
      'Zapojit kolegu',
      'Předat nábor',
      'Archivovat',
    ])
    expect(screen.queryByTestId('job-card-actions-divider')).not.toBeInTheDocument()
    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()
  })

  it('fires the matching handler for every action', async () => {
    const user = userEvent.setup()
    const handlers = allHandlers()
    const byLabel: Array<[string, () => void]> = [
      ['Editovat nábor', handlers.onEditJob],
      ['Duplikovat', handlers.onDuplicateJob],
      ['Ukončit vystavování', handlers.onEndPublication],
      ['Prodloužit a znovuvystavit', handlers.onExtendAndRepublish],
      ['Zvýraznit', handlers.onHighlightAdvertisement],
      ['Topovat', handlers.onTopAdvertisement],
      ['Přidat poznámku', handlers.onAddNote],
      ['Zapojit kolegu', handlers.onInviteColleagues],
      ['Předat nábor', handlers.onTransferJob],
      ['Archivovat', handlers.onArchiveJob],
    ]

    render(<JobMenu advertisements={[runningAdvertisement]} {...handlers} />)

    for (const [label, handler] of byLabel) {
      await user.click(screen.getByTestId('job-menu-toggle'))
      await user.click(screen.getByRole('option', { name: label }))
      expect(handler).toHaveBeenCalledTimes(1)
    }
  })

  it('keeps the same list when the job has several advertisements', async () => {
    await openMenu([runningAdvertisement, { ...runningAdvertisement, id: 'ad-3' }])

    expect(optionLabels()).toHaveLength(10)
  })

  it('offers Zvýraznit and Topovat when at least one portal still runs', async () => {
    await openMenu([endedAdvertisement, runningAdvertisement])

    expect(optionLabels()).toContain('Zvýraznit')
    expect(optionLabels()).toContain('Topovat')
  })

  it('treats a portal without a status as running', async () => {
    await openMenu([
      { id: 'ad', publications: [{ id: 'p', channel: 'Jobs.cz', startDate: '1. 9. 2026' }] },
    ])

    expect(optionLabels()).toContain('Zvýraznit')
    expect(optionLabels()).toContain('Topovat')
  })

  it('hides Zvýraznit and Topovat but keeps Ukončit and Prodloužit for ended advertising', async () => {
    await openMenu([endedAdvertisement])

    expect(optionLabels()).toEqual([
      'Editovat nábor',
      'Duplikovat',
      'Ukončit vystavování',
      'Prodloužit a znovuvystavit',
      'Přidat poznámku',
      'Zapojit kolegu',
      'Předat nábor',
      'Archivovat',
    ])
  })

  it('hides Ukončit, Zvýraznit and Topovat without advertising but still offers Prodloužit', async () => {
    await openMenu([])

    expect(optionLabels()).toEqual([
      'Editovat nábor',
      'Duplikovat',
      'Prodloužit a znovuvystavit',
      'Přidat poznámku',
      'Zapojit kolegu',
      'Předat nábor',
      'Archivovat',
    ])
  })

  it('does not count an advertisement without portals as advertising', async () => {
    await openMenu([{ id: 'ad', title: 'Zatím nevystavený', publications: [] }])

    expect(optionLabels()).not.toContain('Ukončit vystavování')
    expect(optionLabels()).toContain('Prodloužit a znovuvystavit')
  })

  it('leaves out actions without a handler', async () => {
    const user = userEvent.setup()

    render(
      <JobMenu
        advertisements={[runningAdvertisement]}
        onEditJob={vi.fn()}
        onTopAdvertisement={vi.fn()}
        onAddNote={vi.fn()}
        onArchiveJob={vi.fn()}
      />,
    )
    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(optionLabels()).toEqual(['Editovat nábor', 'Topovat', 'Přidat poznámku', 'Archivovat'])
  })

  it('renders nothing when no handler is passed', () => {
    const { container } = render(<JobMenu advertisements={[runningAdvertisement]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
