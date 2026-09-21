import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementTimeline } from './AdvertisementTimeline'
import {
  sampleAdvertisementTimelineCycles,
  sampleAdvertisementTimelineEvents,
} from './fixtures'
import type { AdvertisementTimelineCycle, AdvertisementTimelineEvent } from './types'

const cycles: AdvertisementTimelineCycle[] = [
  {
    id: 'cycle-jobs-running',
    portalName: 'Jobs.cz',
    logoType: 'jobs-cz',
    publishedAt: '2026-06-01T08:00:00.000Z',
    tops: ['2026-06-22T12:32:00.000Z'],
  },
  {
    id: 'cycle-prace-ended',
    portalName: 'Prace.cz',
    logoType: 'prace-cz',
    publishedAt: '2026-03-01T08:00:00.000Z',
    endedAt: '2026-04-28T15:00:00.000Z',
    endedReason: 'manual',
  },
]

const events: AdvertisementTimelineEvent[] = [
  {
    id: 'evt-published-jobs',
    type: 'published',
    occurredAt: '2026-06-01T08:00:00.000Z',
    cycleId: 'cycle-jobs-running',
  },
  {
    id: 'evt-topped-jobs',
    type: 'topped',
    occurredAt: '2026-06-22T12:32:00.000Z',
    cycleId: 'cycle-jobs-running',
  },
  {
    id: 'evt-ended-prace',
    type: 'ended',
    occurredAt: '2026-04-28T15:00:00.000Z',
    cycleId: 'cycle-prace-ended',
  },
  {
    id: 'evt-published-prace',
    type: 'published',
    occurredAt: '2026-03-01T08:00:00.000Z',
    cycleId: 'cycle-prace-ended',
  },
]

describe('AdvertisementTimeline', () => {
  it('renders event labels and timestamps newest first', () => {
    render(<AdvertisementTimeline events={events} cycles={cycles} />)

    const rows = screen.getAllByRole('button')
    expect(rows).toHaveLength(4)
    expect(rows[0]).toHaveAccessibleName(/Topování inzerátu/)
    expect(rows[0]).toHaveTextContent('22. 6. 2026 14:32')
    expect(rows[1]).toHaveAccessibleName(/Vystavení inzerátu/)
    expect(rows[1]).toHaveTextContent('1. 6. 2026 10:00')
    expect(rows[2]).toHaveAccessibleName(/Ukončení vystavení/)
    expect(rows[3]).toHaveAccessibleName(/Vystavení inzerátu/)
    expect(screen.getAllByLabelText('Jobs.cz')).toHaveLength(2)
    expect(screen.getAllByLabelText('Prace.cz')).toHaveLength(2)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('gives the activity name highest priority, then timestamp, then job board', () => {
    render(<AdvertisementTimeline events={events} cycles={cycles} />)

    const topped = screen.getByRole('button', { name: /Topování inzerátu/ })
    const title = within(topped).getByText('Topování inzerátu')
    const timestamp = within(topped).getByText('22. 6. 2026 14:32')
    const portal = within(topped).getByText('Jobs.cz')

    expect(title).toHaveClass('tm-text-base', 'tm-font-medium', 'tm-text-primary-default')
    expect(title).not.toHaveClass('tm-font-semibold')
    expect(timestamp).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-secondary-default')
    expect(portal).toHaveClass('tm-text-sm', 'tm-font-normal', 'tm-text-secondary-default')
    expect(title.compareDocumentPosition(timestamp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(timestamp.compareDocumentPosition(portal) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    const item = topped.closest('li') as HTMLElement
    expect(item).not.toHaveClass('tm-pb-8')
    expect(topped).toHaveClass('tm-pt-0', 'tm-pb-3')
    expect(topped).not.toHaveClass('tm-py-4')

    const marker = item.querySelector('[data-timeline-marker]') as HTMLElement
    expect(marker).toHaveClass(
      'tm-mt-0',
      'tm-size-[13px]',
      'tm-rounded-full',
      'tm-border-2',
      'tm-border-text-secondary-default',
      'tm-bg-transparent',
    )
    expect(marker).not.toHaveClass('tm-bg-cover-dark', 'tm-bg-action-primary-default')
  })

  it('opens a modal with the full cycle, including tops and end reason', async () => {
    const user = userEvent.setup()
    render(<AdvertisementTimeline events={events} cycles={cycles} />)

    const topped = screen.getByRole('button', { name: /Topování inzerátu/ })
    expect(topped).toHaveAttribute('aria-haspopup', 'dialog')
    expect(topped).toHaveAttribute('aria-expanded', 'false')

    await user.click(topped)

    const dialog = await screen.findByRole('dialog', { name: 'Životní cyklus inzerátu' })
    expect(topped).toHaveAttribute('aria-expanded', 'true')
    expect(dialog).toHaveTextContent('Vystavení inzerátu')
    expect(dialog).toHaveTextContent('1. 6. 2026 10:00')
    expect(dialog).toHaveTextContent('Topování inzerátu')
    expect(dialog).toHaveTextContent('22. 6. 2026 14:32')
    expect(dialog).not.toHaveTextContent('Ukončeno mnou')
    expect(dialog).not.toHaveTextContent('Expirace inzerátu')

    await user.click(within(dialog).getByRole('button', { name: 'Zavřít detail' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Ukončení vystavení/ }))
    const endedDialog = await screen.findByRole('dialog', { name: 'Životní cyklus inzerátu' })
    expect(within(endedDialog).getByText('Ukončeno mnou')).toBeInTheDocument()
    expect(endedDialog).toHaveTextContent('28. 4. 2026 17:00')
  })

  it('opens a single activity dialog at a time', async () => {
    const user = userEvent.setup()
    render(<AdvertisementTimeline events={events} cycles={cycles} />)

    await user.click(screen.getByRole('button', { name: /Topování inzerátu/ }))
    expect(await screen.findAllByRole('dialog')).toHaveLength(1)
  })

  it('shows an empty message when there is no history', () => {
    render(<AdvertisementTimeline events={[]} cycles={[]} />)

    expect(screen.getByText('Zatím tu není žádná historie inzerce.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('supports a controlled open event id', async () => {
    const user = userEvent.setup()
    const onOpenEventIdChange = vi.fn()

    function Controlled() {
      const [openEventId, setOpenEventId] = useState<string | null>('evt-topped-jobs')
      return (
        <AdvertisementTimeline
          events={events}
          cycles={cycles}
          openEventId={openEventId}
          onOpenEventIdChange={(next) => {
            onOpenEventIdChange(next)
            setOpenEventId(next)
          }}
        />
      )
    }

    render(<Controlled />)

    expect(await screen.findByRole('dialog', { name: 'Životní cyklus inzerátu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Topování inzerátu/, hidden: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await user.click(screen.getByRole('button', { name: 'Zavřít detail' }))
    await waitFor(() => {
      expect(onOpenEventIdChange).toHaveBeenCalledWith(null)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('shows expired cycle detail without a manual end label', async () => {
    const user = userEvent.setup()
    render(
      <AdvertisementTimeline
        events={sampleAdvertisementTimelineEvents}
        cycles={sampleAdvertisementTimelineCycles}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Expirace inzerátu/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Životní cyklus inzerátu' })
    expect(within(dialog).getByText('Expirace inzerátu')).toBeInTheDocument()
    expect(dialog).toHaveTextContent('28. 2. 2026 23:59')
    expect(within(dialog).queryByText('Ukončeno mnou')).not.toBeInTheDocument()
  })
})
