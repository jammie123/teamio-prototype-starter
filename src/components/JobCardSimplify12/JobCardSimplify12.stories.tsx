import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSimplify12 } from './JobCardSimplify12'
import type { JobAdvertisement, JobPublication } from '../JobCardSyntezaPipeline/types'

const menuHandlers = {
  onEditJob: fn(),
  onDuplicateJob: fn(),
  onInviteColleagues: fn(),
  onTransferJob: fn(),
  onArchiveJob: fn(),
  onEditAdvertisement: fn(),
  onExtendAndRepublish: fn(),
  onEndPublication: fn(),
  onTopAdvertisement: fn(),
  onPreviewPublication: fn(),
  onPreviewAdvertisement: fn(),
  onExtendPublication: fn(),
  onCompleteAdvertisement: fn(),
  onAddNote: fn(),
  onDeclineAdvertising: fn(),
  onRepublishAdvertisement: fn(),
  onEnablePublication: fn(),
}

function withReactions(publication: JobPublication, reactionCount: number): JobPublication {
  return {
    ...publication,
    reactionCount,
  }
}

const defaultCandidates = {
  new: 2,
  unassessed: 14,
  preselected: 8,
  newOhodnoceni: 2,
  invited: 5,
  nabidka: 4,
  hired: 2,
  total: 32,
}

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const stateA: JobAdvertisement = {
  id: 'ad-a',
  title: 'Stav A',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
      56,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 920 },
      28,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 410 },
      9,
    ),
  ],
}

const stateB: JobAdvertisement = {
  id: 'ad-b',
  title: 'Stav B',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
      56,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 920,
      },
      28,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 410 },
      9,
    ),
  ],
}

const stateC: JobAdvertisement = {
  id: 'ad-c',
  title: 'Stav C',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 1200 },
      40,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(12), viewCount: 640 },
      18,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 210 },
      5,
    ),
  ],
}

const paidEndedOwnChannels: JobAdvertisement = {
  id: 'ad-paid-own',
  title: 'Jen kariérní web',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 2100,
      },
      48,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 760,
      },
      22,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 310 },
      7,
    ),
  ],
}

const meta = {
  id: 'jobs-jobcard-simplify-12',
  title: 'Jobs/Job Cards Variant/JobCard Simplify 12',
  component: JobCardSimplify12,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    branches: [{ id: 'prague', name: 'Praha' }],
    candidates: defaultCandidates,
    onCandidatesClick: fn(),
    onViewStatisticsClick: fn(),
    advertisements: [stateA],
    ...menuHandlers,
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="tm-min-w-[1300px] tm-w-full tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobCardSimplify12>

export default meta
type Story = StoryObj<typeof meta>

export const StateA_Running: Story = {
  args: {
    advertisements: [stateA],
  },
}

export const StateB_Partial: Story = {
  args: {
    advertisements: [stateB],
  },
}

export const StateC_MixedDates: Story = {
  args: {
    advertisements: [stateC],
  },
}

export const PaidEndedOwnChannelsOnly: Story = {
  args: {
    advertisements: [paidEndedOwnChannels],
  },
}

export const StatesOverview: Story = {
  render: () => (
    <div className="tm-flex tm-flex-col tm-gap-6">
      <JobCardSimplify12
        title="Řidič/ka sk. C ČB PO–PÁ"
        branches={[{ id: 'prague', name: 'Praha' }]}
        candidates={defaultCandidates}
        advertisements={[stateA]}
        {...menuHandlers}
      />
      <JobCardSimplify12
        title="Řidič/ka sk. C ČB PO–PÁ"
        branches={[{ id: 'prague', name: 'Praha' }]}
        candidates={defaultCandidates}
        advertisements={[stateB]}
        {...menuHandlers}
      />
      <JobCardSimplify12
        title="Řidič/ka sk. C ČB PO–PÁ"
        branches={[{ id: 'prague', name: 'Praha' }]}
        candidates={defaultCandidates}
        advertisements={[stateC]}
        {...menuHandlers}
      />
    </div>
  ),
}
