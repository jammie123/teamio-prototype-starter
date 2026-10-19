import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify } from './JobCardSimplify'

const runningAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
  ],
}

const secondRunning: JobAdvertisement = {
  id: 'ad-2',
  title: 'Inzerát pro brigádníky',
  publications: [
    { id: 'career', channel: 'Kariérní stránky', startDate: '20. 8. 2026', endDate: '31. 10. 2026', viewCount: 210 },
  ],
}

const endedAdvertisement: JobAdvertisement = {
  id: 'ad-ended',
  title: 'Ukončený inzerát',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '1. 9. 2026',
      viewCount: 2100,
    },
  ],
}

function renderSimplify(props: Partial<Parameters<typeof JobCardSimplify>[0]> = {}) {
  return render(
    <JobCardSimplify
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ new: 5, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 }}
      advertisements={[runningAdvertisement]}
      {...props}
    />,
  )
}

describe('JobCardSimplify', () => {
  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSimplify ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })

  it('opens advertisement preview from the title-row search icon and hides the text link', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onPreviewAdvertisement = vi.fn()
    renderSimplify({ onPreviewAdvertisement })

    const preview = screen.getByTestId('job-card-preview-toggle')
    expect(preview).toHaveAttribute('aria-label', 'Zobrazit náhled inzerátu')
    expect(preview.querySelector('[data-icon-name="advertisement-preview"]')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-preview')).not.toBeInTheDocument()

    const icons = screen.getByTestId('job-card-icon-buttons')
    expect(icons).toContainElement(preview)
    expect(
      icons.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      preview.compareDocumentPosition(screen.getByTestId('job-card-activity-toggle')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    await user.click(preview)
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('hides the preview icon when the recruitment has no advertisement', () => {
    renderSimplify({ advertisements: [], onPreviewAdvertisement: vi.fn() })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )
    expect(screen.queryByTestId('job-card-preview-toggle')).not.toBeInTheDocument()
  })

  it('lists Přidat poznámku in the job menu and fires onAddNote', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onAddNote = vi.fn()
    renderSimplify({
      onEditJob: vi.fn(),
      onArchiveJob: vi.fn(),
      onAddNote,
    })

    await user.click(screen.getByTestId('job-card-actions-toggle'))
    const menu = within(document.body)
    expect(menu.getByRole('option', { name: 'Přidat poznámku' })).toBeInTheDocument()
    expect(menu.queryByRole('option', { name: 'Zobrazit náhled inzerátu' })).not.toBeInTheDocument()

    await user.click(menu.getByRole('option', { name: 'Přidat poznámku' }))
    expect(onAddNote).toHaveBeenCalledTimes(1)
  })

  it('does not wrap a single advertisement in the running-ads batch', () => {
    renderSimplify({ advertisements: [runningAdvertisement] })

    expect(screen.queryByTestId('job-card-running-ads-batch')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-switcher')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement')).toBeInTheDocument()
  })

  it('shows a batch with the running count and switcher for two running advertisements', () => {
    renderSimplify({ advertisements: [runningAdvertisement, secondRunning] })

    const batch = screen.getByTestId('job-card-running-ads-batch')
    expect(within(batch).getByTestId('job-card-running-ads-count')).toHaveTextContent(
      '2 běžící inzeráty',
    )
    expect(within(batch).getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent(
      '1/2',
    )
    expect(within(batch).getByTestId('job-card-advertisement-title')).toHaveTextContent(
      'Aktuální inzerát',
    )
  })

  it('counts only the running advertisement when the other has ended', () => {
    renderSimplify({ advertisements: [runningAdvertisement, endedAdvertisement] })

    expect(screen.getByTestId('job-card-running-ads-count')).toHaveTextContent('1 běžící inzerát')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')
  })

  it('keeps published portals when a draft sits next to them in the switcher', () => {
    const draft = { id: 'ad-draft', status: 'draft' as const }
    renderSimplify({
      advertisements: [runningAdvertisement, draft],
      onCompleteAdvertisement: vi.fn(),
    })

    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-draft')).not.toBeInTheDocument()
  })
})
