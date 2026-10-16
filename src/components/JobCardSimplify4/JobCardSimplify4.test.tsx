import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify4 } from './JobCardSimplify4'

const runningAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
  ],
}

function renderSimplify4(props: Partial<Parameters<typeof JobCardSimplify4>[0]> = {}) {
  return render(
    <JobCardSimplify4
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

describe('JobCardSimplify4', () => {
  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSimplify4 ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })

  it('renders pipeline without an outer border and includes Nabídka', () => {
    renderSimplify4({ onCandidatesClick: vi.fn() })

    const candidates = screen.getByTestId('job-card-candidates')
    expect(candidates).not.toHaveClass('tm-border')
    expect(candidates).not.toHaveClass('tm-border-secondary')
    expect(screen.getByTestId('job-card-stat-nabidka')).toHaveTextContent(
      `${formatCount(4)}Nabídka`,
    )
  })

  it('uses smaller default pills for new counts', () => {
    renderSimplify4({ onCandidatesClick: vi.fn() })

    const pill = screen.getByTestId('job-card-new-candidates')
    expect(pill).not.toHaveClass('tm-h-6')
    expect(pill).toHaveClass('tm-h-5')
  })

  it('shows branch inline after the title with +N for extra branches', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderSimplify4({
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

  it('renders portal names without dotted underline decoration', () => {
    renderSimplify4()

    const channel = screen.getAllByTestId('job-card-publication-channel')[0]
    expect(channel).not.toHaveClass('tm-border-dotted')
    expect(channel).not.toHaveClass('tm-border-b')
  })

  it('renders highlights and aggregate views without dotted underline', () => {
    renderSimplify4({
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
              ],
            },
          ],
        },
      ],
    })

    const highlightName = screen.getByTestId('job-card-publication-highlight-name')
    expect(highlightName).not.toHaveClass('tm-border-dotted')
    const views = screen.getByTestId('job-card-advertisement-aggregate-views')
    expect(views).not.toHaveClass('tm-border-dotted')
  })

  it('opens advertisement preview from the title-row search icon', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onPreviewAdvertisement = vi.fn()
    renderSimplify4({ onPreviewAdvertisement, onEditJob: vi.fn() })

    await user.click(screen.getByTestId('job-card-preview-toggle'))
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('uses regular job title typography', () => {
    renderSimplify4()
    const title = within(screen.getByTestId('job-card-title-row')).getByRole('heading', {
      level: 3,
    })
    expect(title).toHaveClass('!tm-font-normal')
  })
})
