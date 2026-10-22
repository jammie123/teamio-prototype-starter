import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify5 } from './JobCardSimplify5'

const runningAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
  ],
}

function renderSimplify5(props: Partial<Parameters<typeof JobCardSimplify5>[0]> = {}) {
  return render(
    <JobCardSimplify5
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
        nabidka: 4,
        hired: 2,
        total: 32,
      }}
      advertisements={[runningAdvertisement]}
      {...props}
    />,
  )
}

describe('JobCardSimplify5', () => {
  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSimplify5 ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })

  it('renders pipeline without an outer border and includes Nabídka', () => {
    renderSimplify5({ onCandidatesClick: vi.fn() })

    const candidates = screen.getByTestId('job-card-candidates')
    expect(candidates).not.toHaveClass('tm-border')
    expect(candidates).not.toHaveClass('tm-border-secondary')
    expect(screen.getByTestId('job-card-stat-nabidka')).toHaveTextContent(
      `${formatCount(4)}Nabídka`,
    )
  })

  it('uses smaller default pills for new counts', () => {
    renderSimplify5({ onCandidatesClick: vi.fn() })

    const pill = screen.getByTestId('job-card-new-candidates')
    expect(pill).not.toHaveClass('tm-h-6')
    expect(pill).toHaveClass('tm-h-5')
  })

  it('shows branch inline after the title with +N for extra branches', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderSimplify5({
      branches: [
        { id: 'prague', name: 'Praha' },
        { id: 'brno', name: 'Brno' },
        { id: 'ostrava', name: 'Ostrava' },
      ],
    })

    expect(screen.queryByTestId('job-card-branch-badge')).not.toBeInTheDocument()
    const inline = screen.getByTestId('job-card-branch-inline')
    expect(inline).toHaveTextContent('Praha')
    expect(inline).toHaveTextContent('+2')

    const titleRow = screen.getByTestId('job-card-title-row')
    expect(titleRow).toContainElement(inline)

    await user.hover(inline)
    expect(await screen.findByText('Pobočka Brno')).toBeInTheDocument()
  })

  it('renders 30px portal logos in one row with the date heading', () => {
    renderSimplify5()

    expect(screen.getByTestId('job-card')).toHaveClass('!tm-rounded-xl')
    const panel = screen.getByTestId('job-card-advertisement-panel')
    expect(panel).not.toHaveClass('tm-bg-cover-light')
    expect(screen.queryByTestId('job-card-publication-channel')).not.toBeInTheDocument()

    const statusRow = screen.getByTestId('job-card-advertisement-status-row')
    const runningHeading = within(statusRow).getByTestId('job-card-advertisement-running-heading')
    expect(runningHeading).toHaveClass('tm-text-secondary-default')
    expect(within(statusRow).getByTestId('job-card-advertisement-active-publications')).toBeInTheDocument()

    const logos = screen.getAllByTestId('job-card-publication-channel-logo')
    expect(logos[0]).toHaveClass('tm-size-[30px]', 'tm-rounded-full')
    expect(logos[0].closest('[role="button"]')).toHaveAttribute('aria-label', 'Jobs.cz')
  })

  it('hides Jobstip, Supermax, Topováno and the product highlights section', () => {
    renderSimplify5({
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
                  kind: 'jobstip',
                  startDate: '8. 6. 2026',
                  endDate: '30. 10. 2026',
                },
                {
                  id: 'jobs-top',
                  name: 'Topováno na jobs.cz',
                  kind: 'top',
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
                  kind: 'supermax',
                  startDate: '8. 6. 2026',
                  endDate: '30. 10. 2026',
                },
              ],
            },
          ],
        },
      ],
    })

    expect(screen.queryByTestId('job-card-advertisement-product-highlights')).not.toBeInTheDocument()
    expect(screen.queryByText('Jobstip')).not.toBeInTheDocument()
    expect(screen.queryByText('Supermax')).not.toBeInTheDocument()
    expect(screen.queryByText('Topováno na jobs.cz')).not.toBeInTheDocument()
  })

  it('places people, preview and menu in the ad toolbar above the advertisement panel', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onPreviewAdvertisement = vi.fn()
    renderSimplify5({ onPreviewAdvertisement, onEditJob: vi.fn() })

    const titleRow = screen.getByTestId('job-card-title-row')
    const adColumn = screen.getByTestId('job-card-advertisements')
    const toolbar = screen.getByTestId('job-card-ad-toolbar')

    expect(adColumn).toContainElement(toolbar)
    expect(titleRow).not.toContainElement(screen.getByTestId('job-card-icon-buttons'))
    expect(toolbar).toContainElement(screen.getByTestId('job-card-icon-buttons'))
    expect(toolbar).toHaveClass('tm-justify-end')

    await user.click(screen.getByTestId('job-card-preview-toggle'))
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('renders portal logo and date in a subtle pill chip when periods differ', () => {
    renderSimplify5()

    expect(screen.queryByTestId('job-card-advertisement-period-badges')).not.toBeInTheDocument()

    const chips = screen.getAllByTestId('job-card-publication-chip')
    expect(chips).toHaveLength(2)
    chips.forEach((chip) => {
      expect(chip).toHaveClass('tm-rounded-full', 'tm-bg-emotion-info-background')
      expect(within(chip).getByTestId('job-card-publication-channel-logo')).toBeInTheDocument()
      expect(within(chip).getByTestId('job-card-publication-period-badge')).toBeInTheDocument()
    })

    const publication = screen.getAllByTestId('job-card-publication')[0]
    expect(publication).toContainElement(chips[0])
  })

  it('uses regular job title typography', () => {
    renderSimplify5()
    const title = within(screen.getByTestId('job-card-title-row')).getByRole('heading', {
      level: 3,
    })
    expect(title).toHaveClass('!tm-font-normal')
  })
})
