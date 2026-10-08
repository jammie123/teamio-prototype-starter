import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify3 } from './JobCardSimplify3'

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

function renderSimplify3(props: Partial<Parameters<typeof JobCardSimplify3>[0]> = {}) {
  return render(
    <JobCardSimplify3
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      hiringManagers={['Lukáš Procházka']}
      candidates={{
        new: 5,
        unassessed: 14,
        preselected: 8,
        opalcovani: 3,
        newOpalcovani: 2,
        invited: 5,
        hired: 2,
        total: 32,
      }}
      advertisements={[runningAdvertisement]}
      {...props}
    />,
  )
}

describe('JobCardSimplify3', () => {
  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSimplify3 ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })

  it('opens advertisement preview from the title-row search icon without a bell', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onPreviewAdvertisement = vi.fn()
    renderSimplify3({ onPreviewAdvertisement, onEditJob: vi.fn() })

    const preview = screen.getByTestId('job-card-preview-toggle')
    expect(preview).toHaveAttribute('aria-label', 'Zobrazit náhled')
    expect(preview.querySelector('[data-icon-name="search"]')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-activity-toggle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-preview')).not.toBeInTheDocument()

    const icons = screen.getByTestId('job-card-icon-buttons')
    expect(icons).toContainElement(preview)
    expect(
      preview.compareDocumentPosition(screen.getByTestId('job-card-actions-toggle')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    await user.click(preview)
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('hides the preview icon when the recruitment has no advertisement', () => {
    renderSimplify3({ advertisements: [], onPreviewAdvertisement: vi.fn() })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )
    expect(screen.queryByTestId('job-card-preview-toggle')).not.toBeInTheDocument()
  })

  it('keeps the new-candidates pill and adds the same number-only pill on Opalcovaný', () => {
    renderSimplify3({ onCandidatesClick: vi.fn() })

    expect(screen.getByTestId('job-card-new-candidates')).toHaveTextContent(formatCount(5))
    const opal = screen.getByTestId('job-card-new-opalcovani')
    expect(opal).toHaveTextContent(formatCount(2))
    expect(opal.querySelector('[data-icon-name]')).not.toBeInTheDocument()
    expect(opal).toHaveClass('tm-h-6', 'tm-min-w-6', 'tm-px-2', 'tm-text-sm', 'tm-font-semibold')
    expect(screen.getByTestId('job-card-stat-opalcovani')).toContainElement(opal)
    expect(screen.getByTestId('job-card-stat-total')).toHaveTextContent(`${formatCount(32)}Celkem`)
  })

  it('offers Upravit zapojení in the people dropdown and fires onInviteColleagues', async () => {
    const onInviteColleagues = vi.fn()
    renderSimplify3({ onInviteColleagues })

    fireEvent.click(screen.getByTestId('job-card-people'))
    const invite = await screen.findByTestId('job-card-people-invite')
    expect(invite).toHaveTextContent('Upravit zapojení')

    fireEvent.click(invite)
    expect(onInviteColleagues).toHaveBeenCalledTimes(1)
  })

  it('renders mixed-period dates as secondary text instead of colored tags', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      renderSimplify3({
        advertisements: [
          {
            id: 'ad-running-diff',
            publications: [
              { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
              { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '20. 9. 2026' },
            ],
          },
        ],
      })

      const badges = screen.getAllByTestId('job-card-publication-period-badge')
      expect(badges[0]).toHaveTextContent('20. 9. 2026')
      expect(badges[0]).toHaveClass('tm-text-sm', 'tm-text-secondary-default')
      expect(badges[0]).not.toHaveClass('tm-bg-emotion-info-background')
      expect(badges[1]).toHaveTextContent('30. 9. 2026')
    } finally {
      vi.useRealTimers()
    }
  })

  it('renders Jobstip, Supermax and Topováno chips after the parent portal', () => {
    renderSimplify3({
      advertisements: [
        {
          id: 'ad-highlights',
          publications: [
            {
              id: 'jobs',
              channel: 'Jobs.cz',
              startDate: '12. 7. 2026',
              endDate: '30. 10. 2026',
              viewCount: 842,
              highlights: [
                {
                  id: 'jobs-jobstip',
                  name: 'Jobstip',
                  startDate: '8. 6. 2026',
                  endDate: '30. 10. 2026',
                },
                {
                  id: 'jobs-top',
                  name: 'Topováno na jobs.cz',
                  startDate: '22. 6. 2026',
                  endDate: '30. 10. 2026',
                },
              ],
            },
            {
              id: 'prace',
              channel: 'Prace.cz',
              startDate: '12. 7. 2026',
              endDate: '30. 10. 2026',
              viewCount: 312,
              highlights: [
                {
                  id: 'prace-supermax',
                  name: 'Supermax',
                  startDate: '8. 6. 2026',
                  endDate: '30. 10. 2026',
                },
              ],
            },
          ],
        },
      ],
    })

    const chips = screen.getAllByTestId('job-card-publication-highlight')
    expect(chips.map((chip) => chip.textContent)).toEqual([
      'Jobstip',
      'Topováno na jobs.cz',
      'Supermax',
    ])
    chips.forEach((chip) => {
      expect(within(chip).getByTestId('job-card-publication-highlight-name')).toHaveClass(
        'tm-text-teamio-pink',
      )
    })
  })

  it('uses the Synteza Ads switcher for two advertisements', () => {
    renderSimplify3({ advertisements: [runningAdvertisement, secondRunning] })

    expect(screen.queryByTestId('job-card-running-ads-batch')).not.toBeInTheDocument()
    const switcher = screen.getByTestId('job-card-advertisement-switcher')
    expect(within(switcher).getByTestId('job-card-advertisement-title')).toHaveTextContent(
      'Aktuální inzerát',
    )
    expect(within(switcher).getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent(
      '1/2',
    )
  })

  it('hides the branch badge when no branches are provided', () => {
    renderSimplify3()
    expect(screen.queryByTestId('job-card-branch-badge')).not.toBeInTheDocument()
  })

  it('shows a single branch name and tooltip', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderSimplify3({ branches: [{ id: 'prague', name: 'Praha' }] })

    const badge = screen.getByTestId('job-card-branch-badge')
    expect(badge).toHaveTextContent('Praha')
    const people = screen.getByTestId('job-card-people')
    expect(
      badge.compareDocumentPosition(people) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    await user.hover(badge)
    expect(await screen.findByText('Pobočka Praha')).toBeInTheDocument()
  })

  it('shows a branch count and lists every branch in the tooltip', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderSimplify3({
      branches: [
        { id: 'prague', name: 'Praha' },
        { id: 'brno', name: 'Brno' },
      ],
    })

    const badge = screen.getByTestId('job-card-branch-badge')
    expect(badge).toHaveTextContent('Inzerce na 2 pobočkách')
    expect(badge).not.toHaveTextContent('Praha')

    await user.hover(badge)
    expect(await screen.findByText('Pobočka Praha')).toBeInTheDocument()
    expect(screen.getByText('Pobočka Brno')).toBeInTheDocument()
  })
})
