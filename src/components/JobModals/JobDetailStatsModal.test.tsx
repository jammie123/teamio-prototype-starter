import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCard/formatCount'
import { JobDetailStatsModal } from './JobDetailStatsModal'
import { JOB_DETAIL_STATS_COPY } from './jobDetailStatsCopy'
import {
  filterSeriesByRange,
  resolvePeriodRange,
  toDateOnlyIso,
} from './jobDetailStatsPeriod'
import {
  buildDailySeries,
  jobDetailStatsFixtureForPeriod,
  sampleJobDetailStatsJobTitle,
  sampleJobDetailStatsPublicationEnd,
  sampleJobDetailStatsPublishedAt,
  sampleJobDetailStatsPublishedRecent,
} from './jobDetailStatsFixtures'

const TODAY = new Date(2026, 10, 4)

const readyFixture = jobDetailStatsFixtureForPeriod(
  'sincePublication',
  sampleJobDetailStatsPublishedAt,
  sampleJobDetailStatsPublicationEnd,
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

  it('calls onPeriodChange when period select changes', async () => {
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
    const select = screen.getByTestId('job-detail-stats-period-select')
    await user.selectOptions(select, 'lastMonth')
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
    await user.selectOptions(screen.getByTestId('job-detail-stats-period-select'), 'last6Months')
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
    await user.selectOptions(screen.getByTestId('job-detail-stats-period-select'), 'lastMonth')
    await user.keyboard('{Escape}')
    onPeriodChange.mockClear()
    await user.click(screen.getByRole('button', { name: 'Otevřít statistiky' }))
    expect(onPeriodChange).toHaveBeenCalledWith('sincePublication')
    const select = screen.getByTestId('job-detail-stats-period-select') as HTMLSelectElement
    expect(select.value).toBe('sincePublication')
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
    expect(within(table).getAllByTestId('job-portal-logo')).toHaveLength(2)
    const viewsCells = within(table)
      .getAllByRole('cell')
      .filter((cell) => cell.className.includes('tm-text-right'))
    expect(viewsCells[0].textContent?.replace(/\s/g, '')).toBe(
      formatCount(readyFixture.summary.places[0].views).replace(/\s/g, ''),
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
