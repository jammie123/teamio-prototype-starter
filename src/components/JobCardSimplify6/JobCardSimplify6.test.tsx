import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSimplify6 } from './JobCardSimplify6'

const runningAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
  ],
}

function renderSimplify6(props: Partial<Parameters<typeof JobCardSimplify6>[0]> = {}) {
  return render(
    <JobCardSimplify6
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

describe('JobCardSimplify6', () => {
  it('keeps people, preview and menu in the title row', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onPreviewAdvertisement = vi.fn()
    renderSimplify6({ onPreviewAdvertisement, onEditJob: vi.fn() })

    const titleRow = screen.getByTestId('job-card-title-row')
    const adColumn = screen.getByTestId('job-card-advertisements')

    expect(titleRow).toContainElement(screen.getByTestId('job-card-icon-buttons'))
    expect(adColumn).not.toContainElement(screen.getByTestId('job-card-icon-buttons'))
    expect(screen.queryByTestId('job-card-ad-toolbar')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('job-card-preview-toggle'))
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('separates recruitment and advertisements with a vertical border on md+', () => {
    renderSimplify6()

    expect(screen.getByTestId('job-card-advertisements')).toHaveClass(
      'md:tm-border-l',
      'md:tm-border-secondary',
    )
  })

  it('renders portal chips when publication end dates differ', () => {
    renderSimplify6()

    expect(screen.queryByTestId('job-card-advertisement-period-badges')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-publication-chip')).toHaveLength(2)
    expect(screen.queryByTestId('job-card-advertisement-status-row')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-mixed-running-cover')).toHaveClass(
      'tm-bg-cover-default',
      'tm-rounded',
      'tm-p-3',
    )
    expect(screen.getAllByTestId('job-card-publication-channel-logo')[0]).toHaveClass('tm-size-[20px]')
  })

  it('merges portals with the same end date into one chip below the heading', () => {
    renderSimplify6({
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 842 },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
            { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 120 },
            { id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7.', endDate: '12. 8. 2026', viewCount: 90 },
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent(
      'Běží v různá období',
    )
    const chips = screen.getAllByTestId('job-card-publication-chip')
    expect(chips).toHaveLength(2)
    expect(within(chips[0]).getAllByTestId('job-card-publication-channel-logo')).toHaveLength(1)
    expect(within(chips[1]).getAllByTestId('job-card-publication-channel-logo')).toHaveLength(3)
  })

  it('uses section horizontal padding and 35px logos when every portal shares one end date', () => {
    renderSimplify6({
      advertisements: [
        {
          id: 'ad-1',
          title: 'Aktuální inzerát',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 842 },
            { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
          ],
        },
      ],
    })

    expect(screen.getByTestId('job-card-recruitment')).toHaveClass('tm-px-6', 'md:tm-px-8')
    expect(screen.getByTestId('job-card-advertisements')).toHaveClass('tm-px-6', 'md:tm-px-8')
    expect(screen.queryByTestId('job-card-advertisement-mixed-running-cover')).not.toBeInTheDocument()

    const logo = screen.getAllByTestId('job-card-publication-channel-logo')[0]
    expect(logo).toHaveClass('tm-size-[35px]', 'tm-rounded-full')
  })
})
