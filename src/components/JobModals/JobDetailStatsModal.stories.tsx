import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { useState } from 'react'
import { Button } from '../Button'
import { JobDetailStatsModal } from './JobDetailStatsModal'
import {
  jobDetailStatsFixtureForPeriod,
  sampleJobDetailStatsJobTitle,
  sampleJobDetailStatsPublicationEnd,
  sampleJobDetailStatsPublishedAt,
  sampleJobDetailStatsPublishedRecent,
} from './jobDetailStatsFixtures'
import type { JobDetailStatsPeriod } from './jobDetailStatsPeriod'

const STORY_TODAY = new Date(2026, 10, 4)

const defaultFixture = jobDetailStatsFixtureForPeriod(
  'sincePublication',
  sampleJobDetailStatsPublishedAt,
  sampleJobDetailStatsPublicationEnd,
  STORY_TODAY,
)

const meta = {
  id: 'jobs-jobmodals-detail-stats',
  title: 'Jobs/JobModals/DetailStats',
  component: JobDetailStatsModal,
  args: {
    jobId: 'job-pm-001',
    status: 'ready',
    series: defaultFixture.series,
    summary: defaultFixture.summary,
    onPeriodChange: fn(),
    onRetry: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof JobDetailStatsModal>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const WithJobTitle: Story = {
  args: {
    defaultOpen: true,
    jobTitle: sampleJobDetailStatsJobTitle,
  },
}

export const Loading: Story = {
  args: {
    defaultOpen: true,
    status: 'loading',
    series: undefined,
    summary: undefined,
  },
}

export const PeriodLoading: Story = {
  args: {
    defaultOpen: true,
    isPeriodLoading: true,
  },
}

export const EmptyPeriod: Story = {
  args: {
    defaultOpen: true,
    status: 'empty',
    series: [],
    summary: { places: [] },
  },
}

export const Error: Story = {
  args: {
    defaultOpen: true,
    status: 'error',
    series: undefined,
    summary: undefined,
  },
}

export const YoungJob: Story = {
  args: {
    defaultOpen: true,
    ...jobDetailStatsFixtureForPeriod(
      'last6Months',
      sampleJobDetailStatsPublishedRecent,
      sampleJobDetailStatsPublicationEnd,
      STORY_TODAY,
    ),
  },
}

export const WithTrigger: Story = {
  args: {
    trigger: <Button>Statistiky inzerátu</Button>,
  },
}

function PeriodSwitchDemo() {
  const [period, setPeriod] = useState<JobDetailStatsPeriod>('sincePublication')
  const [isPeriodLoading, setIsPeriodLoading] = useState(false)
  const fixture = jobDetailStatsFixtureForPeriod(
    period,
    sampleJobDetailStatsPublishedAt,
    sampleJobDetailStatsPublicationEnd,
    STORY_TODAY,
  )

  return (
    <JobDetailStatsModal
      jobId="job-pm-period"
      defaultOpen
      period={period}
      status="ready"
      series={fixture.series}
      summary={fixture.summary}
      isPeriodLoading={isPeriodLoading}
      onPeriodChange={(next) => {
        setIsPeriodLoading(true)
        setPeriod(next)
        window.setTimeout(() => setIsPeriodLoading(false), 600)
      }}
    />
  )
}

export const PeriodSwitch: Story = {
  render: () => <PeriodSwitchDemo />,
}
