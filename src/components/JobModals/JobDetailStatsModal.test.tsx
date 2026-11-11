import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCard/formatCount'
import { JobDetailStatsModal } from './JobDetailStatsModal'
import { JOB_DETAIL_STATS_COPY, JOB_DETAIL_STATS_PERIOD_LABELS } from './jobDetailStatsCopy'
import {
  filterSeriesByRange,
  formatJobDetailStatsPublicationRange,
  formatJobDetailStatsReactionRate,
  resolvePeriodRange,
  toDateOnlyIso,
} from './jobDetailStatsPeriod'
import {
  buildDailySeries,
  jobDetailStatsFixtureForPeriod,
  sampleJobDetailStatsJobTitle,
  sampleJobDetailStatsPublishedAt,
  sampleJobDetailStatsPublishedRecent,
} from './jobDetailStatsFixtures'

const TODAY = new Date(2026, 10, 4)

const readyFixture = jobDetailStatsFixtureForPeriod(
  'sincePublication',
  sampleJobDetailStatsPublishedAt,
  TODAY,
)

describe('jobDetailStatsPeriod', () => {
  it('clips range start to publication date for young jobs', () => {
    const range = resolvePeriodRange(
      'last6Months',
      sampleJobDetailStatsPublishedRecent,
      TODAY,
    )
    expect(toDateOnlyIso(range.start)).toBe(sampleJobDetailStatsPublishedRecent)
  })

  it('filters series to the resolved range', () => {
    const series = buildDailySeries(sampleJobDetailStatsPublishedAt, TODAY)
    const range = resolvePeriodRange('lastMonth', sampleJobDetailStatsPublishedAt, TODAY)
    const filtered = filterSeriesByRange(series, range)
    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((point) => point.date >= toDateOnlyIso(range.start))).toBe(true)
  })

  it('formats a real from–to period for the header', () => {
    expect(formatJobDetailStatsPublicationRange('2026-08-01', '2026-11-04')).toBe(
      '1. 8. 2026 – 4. 11. 2026',
    )
  })

  it('formats reaction rate as reactions divided by views', () => {
    expect(formatJobDetailStatsReactionRate(100, 10)).toBe('10 %')
    expect(formatJobDetailStatsReactionRate(200, 5)).toBe('2,5 %')
    expect(formatJobDetailStatsReactionRate(0, 5)).toBe('–')
  })
})

describe('JobDetailStatsModal', () => {
  it('exposes dialog title Detail inzerátu', async () => {
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName(JOB_DETAIL_STATS_COPY.title)
  })

  it('calls onPeriodChange when period is changed from the header menu', async () => {
    const user = userEvent.setup()
    const onPeriodChange = vi.fn()
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
        onPeriodChange={onPeriodChange}
      />,
    )
    await user.click(screen.getByTestId('job-detail-stats-period-change'))
    await user.click(
      screen.getByRole('option', { name: JOB_DETAIL_STATS_PERIOD_LABELS.lastMonth }),
    )
    expect(onPeriodChange).toHaveBeenCalledWith('lastMonth')
  })

  it('hides views series when legend is toggled', async () => {
    const user = userEvent.setup()
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    expect(screen.getByTestId('job-detail-stats-chart-views')).toBeInTheDocument()
    await user.click(screen.getByTestId('job-detail-stats-legend-views'))
    expect(screen.queryByTestId('job-detail-stats-chart-views')).not.toBeInTheDocument()
  })

  it('keeps legend hidden state after period change', async () => {
    const user = userEvent.setup()
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    await user.click(screen.getByTestId('job-detail-stats-legend-reactions'))
    expect(screen.queryByTestId('job-detail-stats-chart-reactions')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('job-detail-stats-period-change'))
    await user.click(
      screen.getByRole('option', { name: JOB_DETAIL_STATS_PERIOD_LABELS.last6Months }),
    )
    expect(screen.queryByTestId('job-detail-stats-chart-reactions')).not.toBeInTheDocument()
  })

  it('resets period when modal reopens', async () => {
    const user = userEvent.setup()
    const onPeriodChange = vi.fn()
    render(
      <JobDetailStatsModal
        jobId="job-1"
        trigger={<button type="button">Otevřít statistiky</button>}
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
        onPeriodChange={onPeriodChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Otevřít statistiky' }))
    expect(onPeriodChange).toHaveBeenCalledWith('sincePublication')
    await user.click(screen.getByTestId('job-detail-stats-period-change'))
    await user.click(
      screen.getByRole('option', { name: JOB_DETAIL_STATS_PERIOD_LABELS.lastMonth }),
    )
    await user.keyboard('{Escape}')
    onPeriodChange.mockClear()
    await user.click(screen.getByRole('button', { name: 'Otevřít statistiky' }))
    expect(onPeriodChange).toHaveBeenCalledWith('sincePublication')
    expect(screen.getByTestId('job-detail-stats-period-label')).toHaveTextContent(
      formatJobDetailStatsPublicationRange(
        readyFixture.summary.periodStartDate,
        readyFixture.summary.periodEndDate,
      ),
    )
  })

  it('shows the resolved from–to dates next to Období', () => {
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    expect(screen.getByTestId('job-detail-stats-period-label')).toHaveTextContent(
      formatJobDetailStatsPublicationRange(
        readyFixture.summary.periodStartDate,
        readyFixture.summary.periodEndDate,
      ),
    )
    expect(screen.getByTestId('job-detail-stats-period-label')).not.toHaveTextContent(
      JOB_DETAIL_STATS_PERIOD_LABELS.sincePublication,
    )
    expect(screen.getByTestId('job-detail-stats-period-header')).toHaveClass('tm-pb-8')
    expect(screen.getByRole('region', { name: 'Statistický widget' })).toHaveClass('tm-py-8')
  })

  it('falls back to the period preset when no dates are available', () => {
    render(<JobDetailStatsModal jobId="job-1" defaultOpen status="loading" />)
    expect(screen.getByTestId('job-detail-stats-period-label')).toHaveTextContent(
      JOB_DETAIL_STATS_PERIOD_LABELS.sincePublication,
    )
  })

  it('keeps title padding-bottom at 0', async () => {
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    const title = await screen.findByRole('heading', { name: JOB_DETAIL_STATS_COPY.title })
    expect(title).toHaveClass('tm-pb-0')
    expect(title).not.toHaveClass('tm-pb-2')
  })

  it('renders a shorter stats chart', () => {
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    const chart = screen.getByRole('img', { name: JOB_DETAIL_STATS_COPY.chartAriaLabel })
    expect(chart).toHaveAttribute('viewBox', '0 0 800 152')
  })

  it('shows empty copy when there is no data', () => {
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="empty"
        series={[]}
        summary={readyFixture.summary}
      />,
    )
    expect(screen.getByTestId('job-detail-stats-empty')).toHaveTextContent(
      JOB_DETAIL_STATS_COPY.empty,
    )
  })

  it('shows retry on error', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <JobDetailStatsModal jobId="job-1" defaultOpen status="error" onRetry={onRetry} />,
    )
    await user.click(screen.getByRole('button', { name: JOB_DETAIL_STATS_COPY.retry }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('renders publication rows in the table', () => {
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    const table = screen.getByRole('table', { name: JOB_DETAIL_STATS_COPY.tableAriaLabel })
    expect(within(table).getByText('Jobs.cz')).toBeInTheDocument()
    expect(within(table).getByText('Práce.cz')).toBeInTheDocument()
    expect(within(table).getByText('Jobs.cz')).toHaveClass('tm-font-normal')
    expect(within(table).getByText('Jobs.cz')).not.toHaveClass('tm-font-medium')
    expect(within(table).getAllByTestId('job-portal-logo')).toHaveLength(2)
    expect(within(table).getByTestId('job-detail-stats-table-total')).toBeInTheDocument()
  })

  it('shows the publication period as the second Vystaveno column', () => {
    render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={{
          periodStartDate: '2026-08-01',
          periodEndDate: '2026-11-04',
          places: [
            {
              id: 'jobs-cz',
              placeName: 'Jobs.cz',
              logoType: 'jobs-cz',
              views: 100,
              reactions: 10,
              startDate: '2026-08-01',
              endDate: '2026-11-04',
            },
            {
              id: 'prace-cz',
              placeName: 'Práce.cz',
              logoType: 'prace-cz',
              views: 50,
              reactions: 5,
              startDate: '2026-08-15',
              endDate: '2026-11-04',
            },
          ],
        }}
      />,
    )
    const table = screen.getByRole('table', { name: JOB_DETAIL_STATS_COPY.tableAriaLabel })
    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      JOB_DETAIL_STATS_COPY.columns.place,
      'Vystaveno',
      JOB_DETAIL_STATS_COPY.columns.views,
      JOB_DETAIL_STATS_COPY.columns.reactions,
      'Míra reakce',
    ])
    const jobsRow = within(table).getByText('Jobs.cz').closest('tr')
    const praceRow = within(table).getByText('Práce.cz').closest('tr')
    expect(jobsRow).toHaveTextContent('1. 8. 2026 – 4. 11. 2026')
    expect(praceRow).toHaveTextContent('15. 8. 2026 – 4. 11. 2026')
    expect(jobsRow).toHaveTextContent('10 %')
    expect(praceRow).toHaveTextContent('10 %')
    expect(within(table).getByTestId('job-detail-stats-table-total')).toHaveTextContent('10 %')
    expect(within(table).getByTestId('job-detail-stats-table-total').querySelectorAll('td')).toHaveLength(
      5,
    )
  })

  it('shows job title only when jobTitle prop is set', () => {
    const { rerender } = render(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
      />,
    )
    expect(screen.queryByTestId('job-detail-stats-job-title')).not.toBeInTheDocument()

    rerender(
      <JobDetailStatsModal
        jobId="job-1"
        defaultOpen
        status="ready"
        series={readyFixture.series}
        summary={readyFixture.summary}
        jobTitle={sampleJobDetailStatsJobTitle}
      />,
    )
    expect(screen.getByTestId('job-detail-stats-job-title')).toHaveTextContent(
      sampleJobDetailStatsJobTitle,
    )
  })
})
