import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementWidget } from './AdvertisementWidget'
import { allPortals } from './fixtures'
import type { JobAdvertisement, JobPublication } from './types'

const now = new Date(2026, 8, 27)

function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 1. 2026', viewCount: 100, ...partial }
}

const runningSame: JobAdvertisement = {
  id: 'ad-1',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026', viewCount: 2000 }),
    portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 800 }),
    portal({ id: 'career', channel: 'Kariérní stránky', endDate: '1. 2. 2026', viewCount: 370 }),
  ],
}

const endingSoon: JobAdvertisement = {
  id: 'ad-soon',
  publications: ['jobs', 'prace', 'career'].map((id) =>
    portal({ id, channel: id, startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
  ),
}

function renderWidget(advertisement: JobAdvertisement, props = {}) {
  return render(<AdvertisementWidget advertisement={advertisement} now={now} {...props} />)
}

describe('AdvertisementWidget', () => {
  it('offers Prodloužit in the portal hover card when the advertisement is ending soon', async () => {
    const user = userEvent.setup()
    const onExtendAndRepublish = vi.fn()
    renderWidget(endingSoon, { onExtendAndRepublish })

    await user.hover(screen.getAllByTestId('job-card-publication-channel')[0])
    const dropdown = await screen.findByTestId('job-card-publication-dropdown')
    fireEvent.click(within(dropdown).getByTestId('job-card-publication-prolong'))

    expect(onExtendAndRepublish).toHaveBeenCalledOnce()
  })

  it('collapses portals beyond the fifth into "+ N dalších"', () => {
    renderWidget(allPortals)

    expect(
      screen.getAllByTestId('job-card-publication-channel').map((channel) => channel.textContent),
    ).toEqual(['Atmoskop.cz', 'Export pozic', 'Intranet', 'Jobote', 'Jobs.cz'])

    const more = screen.getByTestId('job-card-publications-more')
    expect(more).toHaveTextContent('+ 4 dalších')
    expect(more).toHaveAttribute('type', 'button')
    expect(more).toHaveAttribute('aria-expanded', 'false')
    expect(more.previousElementSibling).toBe(screen.getAllByTestId('job-card-publication')[4])
  })

  it('expands with the remaining portals and collapses with "Zobrazit méně"', async () => {
    const user = userEvent.setup()
    renderWidget(allPortals)

    await user.click(screen.getByTestId('job-card-publications-more'))

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(9)
    expect(screen.getByText('Práce za rohem')).toBeInTheDocument()
    const toggle = screen.getByTestId('job-card-publications-more')
    expect(toggle).toHaveTextContent('Zobrazit méně')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(5)
    expect(screen.getByTestId('job-card-publications-more')).toHaveTextContent('+ 4 dalších')
  })

  it('shows all portals without a counter when there are at most five', () => {
    renderWidget({ id: 'five', publications: allPortals.publications!.slice(0, 5) })

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(5)
    expect(screen.queryByTestId('job-card-publications-more')).not.toBeInTheDocument()
  })

  it('shows only Znovuvystavit inzerát in the hover card of an ended portal', async () => {
    const user = userEvent.setup()
    const onRepublish = vi.fn()
    renderWidget(
      {
        id: 'ad-ended-portal',
        publications: [
          portal({
            id: 'jobs',
            channel: 'Jobs.cz',
            status: 'expired',
            startDate: '1. 8. 2026',
            endDate: '15. 8. 2026',
          }),
        ],
      },
      { onExtendAndRepublish: onRepublish },
    )

    await user.hover(screen.getByTestId('job-card-publication-channel'))
    const dropdown = await screen.findByTestId('job-card-publication-dropdown')

    expect(within(dropdown).queryByRole('button', { name: 'Zvýraznit' })).not.toBeInTheDocument()
    expect(within(dropdown).queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    fireEvent.click(within(dropdown).getByRole('button', { name: 'Znovuvystavit inzerát' }))
    expect(onRepublish).toHaveBeenCalledOnce()
  })

  it('stacks portals in a column when their dates differ', () => {
    renderWidget({
      id: 'ad-different-dates',
      publications: [
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '1. 8. 2026', endDate: '15. 10. 2026' }),
      ],
    })

    const channels = screen.getByTestId('job-card-advertisement-publications')
    expect(channels.className).toContain('tm-flex-col')
    expect(channels.className).not.toMatch(/(?:^|\s)tm-flex-row(?:\s|$)/)
  })

  it('renders status and portals without AdvertisementStats', () => {
    renderWidget(runningSame)

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).not.toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-w-full')
    expect(advertisement.className).toContain('tm-flex-col')
    expect(advertisement.className).not.toContain('tm-bg-emotion-warning-background/80')
    expect(advertisement.className).not.toMatch(/tm-bg-/)

    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')
    const channels = within(advertisement).getByTestId('job-card-advertisement-publications')

    expect(heading).toHaveTextContent('1. 1. – 1. 2. 2026')
    expect(within(heading).queryByTestId('job-card-advertisement-heading-label')).not.toBeInTheDocument()
    expect(heading.compareDocumentPosition(channels) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(channels.className).toContain('tm-flex-row')
    expect(channels.className).not.toContain('md:tm-flex-col')
    expect(channels.className).toContain('tm-gap-1')
    expect(channels.className).not.toMatch(/(?:^|\s)tm-flex-col(?:\s|$)/)
    expect(within(channels).getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(screen.queryByTestId('job-card-advertisement-stats')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-action')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-top')).not.toBeInTheDocument()
  })

  it('can show a top border when stacked under another advertisement', () => {
    renderWidget(runningSame, { hideTopBorder: false })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(advertisement.className).toContain('tm-border-t')
    expect(advertisement.className).toContain('tm-pt-4')
  })

  it('renders each portal with a status dot and dotted underline', () => {
    renderWidget(runningSame)

    const channels = screen.getAllByTestId('job-card-publication-channel')
    expect(channels.map((channel) => channel.textContent)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    expect(screen.getAllByTestId('job-card-publication-dot')).toHaveLength(3)
    for (const channel of channels) {
      expect(channel.className).toContain('tm-border-dotted')
    }
  })

  it('shows each live portal as do-date when periods differ', () => {
    renderWidget({
      id: 'ad-diff',
      publications: [
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '15. 9. 2026', endDate: '15. 11. 2026' }),
      ],
    })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(
      within(advertisement).queryByTestId('job-card-advertisement-heading-label'),
    ).not.toBeInTheDocument()
    expect(within(advertisement).getByText('do 30. 10.')).toBeInTheDocument()
    expect(within(advertisement).getByText('do 15. 11.')).toBeInTheDocument()
  })

  it('keeps a running advertisement with a finished portal in a vertical block', () => {
    renderWidget({
      id: 'ad-mixed',
      publications: [
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
        portal({
          id: 'career',
          channel: 'Kariérní stránky',
          startDate: '1. 9. 2026',
          endDate: '30. 10. 2026',
        }),
      ],
    })

    const advertisement = screen.getByTestId('job-card-advertisement')
    expect(within(advertisement).getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      '1. 9. – 30. 10. 2026',
    )
    expect(
      within(advertisement).getByTestId('job-card-advertisement-heading-date'),
    ).toHaveTextContent('1. 9. – 30. 10. 2026')
    expect(within(advertisement).getByText('ukončeno 15. 8.')).toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-publication-dot')).toHaveLength(3)
  })

  it('leaves the prolong action to the stats footer when ending soon', () => {
    renderWidget(endingSoon, { onExtendAndRepublish: vi.fn() })

    const advertisement = screen.getByTestId('job-card-advertisement')
    const heading = within(advertisement).getByTestId('job-card-advertisement-heading')

    expect(heading).toHaveTextContent('Končí za 3 dny 1. 9. – 30. 9. 2026')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(advertisement).toHaveAttribute('data-kind', 'endingSoon')
    expect(advertisement.className).not.toContain('tm-bg-emotion-warning-background/80')
    expect(advertisement.className).not.toMatch(/tm-bg-/)
    expect(within(advertisement).queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('shows an ended advertisement with from-to dates', () => {
    renderWidget({
      id: 'ad-ended',
      publications: [
        portal({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
      ],
    })

    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'ended')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent('Expirováno')
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveTextContent(
      'Expirováno 1. 8. – 15. 8. 2026',
    )
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('shows the unpublished advertisement promo without portals or views', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    const onAdvertisementPreviewClick = vi.fn()
    renderWidget(
      { id: 'ad-empty', publications: [] },
      { onCreateAdvertisement, onAdvertisementPreviewClick },
    )

    const advertisement = screen.getByTestId('job-card-advertisement')
    const empty = within(advertisement).getByTestId('job-card-no-advertisement')

    expect(advertisement).toHaveAttribute('data-kind', 'notPublished')
    expect(empty).not.toHaveTextContent('Zatím nevystavený inzerát')
    expect(empty).toHaveTextContent('Zatím neinzerujete')
    expect(empty).toHaveTextContent(
      'Zkontrolujte náhled a publikujte. Kandidáti se ozvou rychle.',
    )
    expect(screen.queryByTestId('job-card-advertisement-heading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-publications')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Zobrazit náhled' }))
    await user.click(screen.getByRole('button', { name: 'Publikovat' }))
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
    expect(onCreateAdvertisement).toHaveBeenCalledOnce()
  })

  it('renders Jobstip and Topováno highlights after their portal', () => {
    renderWidget({
      id: 'ad-highlights',
      publications: [
        {
          ...portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026' }),
          highlights: [
            { id: 'h1', name: 'Jobstip', startDate: '8. 6.', endDate: '30. 9. 2026' },
            { id: 'h2', name: 'Topováno', startDate: '22. 6.', status: 'expired' },
          ],
        },
      ],
    })

    const highlight = screen.getByTestId('job-card-publication-highlight')
    expect(highlight).toHaveTextContent('+ Jobstip')
    expect(screen.getAllByTestId('job-card-publication-highlight-name')).toHaveLength(1)
  })

  it('shows the title above the status when requested', () => {
    renderWidget({ ...runningSame, title: 'Hlavní inzerát' }, { showTitle: true })

    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Hlavní inzerát')
  })

  it('shows Ukončené vystavování when the job was ended manually', () => {
    renderWidget(
      {
        id: 'ad-manual',
        publications: [
          portal({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '15. 9. 2026' }),
        ],
      },
      { endedBy: 'manual' },
    )

    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'endedManually')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Ukončené vystavování',
    )
  })

  it('highlights an advertisement that expired within 30 days', () => {
    renderWidget({
      id: 'ad-recent',
      publications: [
        portal({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '1. 8. 2026', endDate: '15. 9. 2026' }),
      ],
    })

    expect(screen.getByTestId('job-card-advertisement')).toHaveAttribute('data-kind', 'endedRecently')
    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Expirováno před 12 dny',
    )
    expect(screen.getByTestId('job-card-advertisement-heading')).toHaveAttribute('data-tone', 'warning')
  })

  it('forwards Inzerát and Zvýraznit from the portal hover card while running', async () => {
    const user = userEvent.setup()
    const onAdvertisementPreviewClick = vi.fn()
    const onHighlightAdvertisement = vi.fn()
    renderWidget(runningSame, {
      onAdvertisementPreviewClick,
      onHighlightAdvertisement,
    })

    await user.hover(screen.getAllByTestId('job-card-publication-channel')[0])
    const dropdown = await screen.findByTestId('job-card-publication-dropdown')
    const actions = within(dropdown).getByTestId('job-card-publication-actions')

    expect(within(actions).queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    fireEvent.click(within(dropdown).getByTestId('job-card-publication-view-advertisement'))
    fireEvent.click(within(actions).getByRole('button', { name: 'Zvýraznit' }))
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
    expect(onHighlightAdvertisement).toHaveBeenCalledOnce()
  })
})
