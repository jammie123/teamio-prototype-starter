import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobMenu } from './JobMenu'
import type { JobAdvertisement } from '../JobCardSynteza/types'

const advertisement: JobAdvertisement = { id: 'ad-1', title: 'Hlavní inzerát' }

describe('JobMenu', () => {
  it('opens advertisement actions and fires prolong, unpublish, and top handlers', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    const onEndPublication = vi.fn()
    const onTopAdvertisement = vi.fn()

    render(
      <JobMenu
        advertisements={[advertisement]}
        onExtendAndRepublish={onExtendAndRepublish}
        onEndPublication={onEndPublication}
        onTopAdvertisement={onTopAdvertisement}
      />,
    )

    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Prodloužit a znovu vystavit',
      'Ukončit vystavení',
      'Topovat',
    ])
    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Prodloužit a znovu vystavit' }))
    expect(onExtendAndRepublish).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTestId('job-menu-toggle'))
    await user.click(screen.getByRole('option', { name: 'Ukončit vystavení' }))
    expect(onEndPublication).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTestId('job-menu-toggle'))
    await user.click(screen.getByRole('option', { name: 'Topovat' }))
    expect(onTopAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('keeps advertisement actions flat when the job has several advertisements', async () => {
    const user = userEvent.setup()
    const onEndPublication = vi.fn()

    render(
      <JobMenu
        advertisements={[advertisement, { id: 'ad-2', title: 'Druhý inzerát' }]}
        onEndPublication={onEndPublication}
        onExtendAndRepublish={vi.fn()}
        onTopAdvertisement={vi.fn()}
      />,
    )

    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(screen.queryByTestId('option-submenu-toggle')).not.toBeInTheDocument()
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Prodloužit a znovu vystavit',
      'Ukončit vystavení',
      'Topovat',
    ])
  })

  it('lists Přidat inzerát instead of advertisement actions when the job has none', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()

    render(
      <JobMenu
        advertisements={[]}
        onCreateAdvertisement={onCreateAdvertisement}
        onExtendAndRepublish={vi.fn()}
        onEndPublication={vi.fn()}
        onTopAdvertisement={vi.fn()}
        onEditJob={vi.fn()}
      />,
    )

    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Přidat inzerát',
      'Editovat nábor',
    ])

    await user.click(screen.getByRole('option', { name: 'Přidat inzerát' }))
    expect(onCreateAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when no handler is passed', () => {
    const { container } = render(<JobMenu advertisements={[advertisement]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('lists Přidat poznámku in the job section and fires onAddNote', async () => {
    const user = userEvent.setup()
    const onAddNote = vi.fn()

    render(
      <JobMenu
        advertisements={[advertisement]}
        onEditJob={vi.fn()}
        onArchiveJob={vi.fn()}
        onAddNote={onAddNote}
      />,
    )

    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Editovat nábor',
      'Archivovat',
      'Přidat poznámku',
    ])

    await user.click(screen.getByRole('option', { name: 'Přidat poznámku' }))
    expect(onAddNote).toHaveBeenCalledTimes(1)
  })
})
