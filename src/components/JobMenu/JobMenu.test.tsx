import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobMenu } from './JobMenu'
import type { JobAdvertisement } from '../JobShared/types'

const advertisement: JobAdvertisement = { id: 'ad-1', title: 'Hlavní inzerát' }

const allHandlers = () => ({
  onEditJob: vi.fn(),
  onDuplicateJob: vi.fn(),
  onEndPublication: vi.fn(),
  onExtendAndRepublish: vi.fn(),
  onTopAdvertisement: vi.fn(),
  onInviteColleagues: vi.fn(),
  onTransferJob: vi.fn(),
  onArchiveJob: vi.fn(),
})

const optionLabels = () => screen.getAllByRole('option').map((option) => option.textContent)

describe('JobMenu', () => {
  it('lists all eight actions in a fixed order', async () => {
    const user = userEvent.setup()

    render(<JobMenu advertisements={[advertisement]} {...allHandlers()} />)
    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(optionLabels()).toEqual([
      'Editovat nábor',
      'Duplikovat',
      'Ukončit vystavování',
      'Prodloužit a znovuvystavit',
      'Topovat',
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
      ['Topovat', handlers.onTopAdvertisement],
      ['Zapojit kolegu', handlers.onInviteColleagues],
      ['Předat nábor', handlers.onTransferJob],
      ['Archivovat', handlers.onArchiveJob],
    ]

    render(<JobMenu advertisements={[advertisement]} {...handlers} />)

    for (const [label, handler] of byLabel) {
      await user.click(screen.getByTestId('job-menu-toggle'))
      await user.click(screen.getByRole('option', { name: label }))
      expect(handler).toHaveBeenCalledTimes(1)
    }
  })

  it('keeps the same list when the job has several advertisements', async () => {
    const user = userEvent.setup()

    render(
      <JobMenu
        advertisements={[advertisement, { id: 'ad-2', title: 'Druhý inzerát' }]}
        {...allHandlers()}
      />,
    )
    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(optionLabels()).toHaveLength(8)
  })

  it('hides end, extend and top when the job has no advertisement', async () => {
    const user = userEvent.setup()

    render(<JobMenu advertisements={[]} {...allHandlers()} />)
    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(optionLabels()).toEqual([
      'Editovat nábor',
      'Duplikovat',
      'Zapojit kolegu',
      'Předat nábor',
      'Archivovat',
    ])
  })

  it('leaves out actions without a handler', async () => {
    const user = userEvent.setup()

    render(
      <JobMenu
        advertisements={[advertisement]}
        onEditJob={vi.fn()}
        onTopAdvertisement={vi.fn()}
        onArchiveJob={vi.fn()}
      />,
    )
    await user.click(screen.getByTestId('job-menu-toggle'))

    expect(optionLabels()).toEqual(['Editovat nábor', 'Topovat', 'Archivovat'])
  })

  it('renders nothing when no handler is passed', () => {
    const { container } = render(<JobMenu advertisements={[advertisement]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
