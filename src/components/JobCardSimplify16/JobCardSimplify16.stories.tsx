import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSimplify16 } from './JobCardSimplify16'
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

/** HTML mock — Tvoje karta: Jobs.cz + Kariérní stránky. */
const htmlYourCard: JobAdvertisement = {
  id: 'ad-html-your',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '20. 1. 2027', viewCount: 4301 },
      56,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 410 },
      9,
    ),
  ],
}

/** HTML mock — smíšené stavy, promo, vypnutý kanál. */
const htmlMixedStates: JobAdvertisement = {
  id: 'ad-html-mixed',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '12. 7. 2026',
        endDate: daysFromNow(5),
        viewCount: 1840,
        highlights: [
          {
            id: 'top',
            name: 'Top',
            kind: 'top',
            startDate: '1. 10. 2026',
            endDate: daysFromNow(2),
          },
        ],
      },
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
      { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 410 },
      9,
    ),
    withReactions(
      {
        id: 'export',
        channel: 'Export do sítě',
        status: 'disabled',
        startDate: '12. 10. 2026',
        viewCount: 100,
      },
      2,
    ),
  ],
}

const combinationA: JobAdvertisement = {
  id: 'ad-a',
  title: 'Kombinace A',
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
      { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 410 },
      9,
    ),
  ],
}

const combinationC: JobAdvertisement = {
  id: 'ad-c',
  title: 'Kombinace C',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 2100 },
      48,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(12), viewCount: 760 },
      22,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 310 },
      7,
    ),
  ],
}

const combinationD: JobAdvertisement = {
  id: 'ad-d',
  title: 'Kombinace D',
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
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'disabled',
        startDate: '12. 7. 2026',
        viewCount: 410,
      },
      9,
    ),
  ],
}

const combinationE: JobAdvertisement = {
  id: 'ad-e',
  title: 'Kombinace E',
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
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'disabled',
        startDate: '12. 7. 2026',
        viewCount: 410,
      },
      9,
    ),
  ],
}

const combinationF: JobAdvertisement = {
  id: 'ad-f',
  title: 'Kombinace F',
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
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'disabled',
        startDate: '12. 7. 2026',
        viewCount: 310,
      },
      7,
    ),
  ],
}

const eightChannels: JobAdvertisement = {
  id: 'ad-eight',
  title: '8 kanálů',
  publications: [
    'Jobs.cz',
    'Prace.cz',
    'Kariérní stránky',
    'Export do sítě',
    'Atmoskop',
    'Profesia',
    'Teamio',
    'Doporučení',
  ].map((channel, index) => ({
    id: `ch-${index}`,
    channel,
    startDate: '12. 7. 2026',
    endDate: '14. 11. 2026',
    viewCount: 100 + index * 50,
  })),
}

const notAdvertising: JobAdvertisement = {
  id: 'ad-na',
  status: 'notAdvertising',
  advertisingDeclinedAt: '20. 10. 2026',
  publications: combinationF.publications,
}

const meta = {
  id: 'jobs-jobcard-simplify-16',
  title: 'Jobs/Job Cards Variant/JobCard Simplify 16',
  component: JobCardSimplify16,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    branches: [{ id: 'prague', name: 'Praha' }],
    candidates: defaultCandidates,
    onCandidatesClick: fn(),
    onViewStatisticsClick: fn(),
    advertisements: [htmlYourCard],
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
} satisfies Meta<typeof JobCardSimplify16>

export default meta
type Story = StoryObj<typeof meta>

export const HtmlMock_YourCard: Story = {
  args: {
    advertisements: [htmlYourCard],
  },
}

export const HtmlMock_MixedStates: Story = {
  args: {
    advertisements: [htmlMixedStates],
  },
}

export const CombinationA: Story = {
  args: {
    advertisements: [combinationA],
  },
}

export const CombinationC: Story = {
  args: {
    advertisements: [combinationC],
  },
}

export const CombinationD: Story = {
  args: {
    advertisements: [combinationD],
  },
}

export const CombinationE: Story = {
  args: {
    advertisements: [combinationE],
  },
}

export const CombinationF: Story = {
  args: {
    advertisements: [combinationF],
  },
}

export const EightChannelsOverflow: Story = {
  args: {
    advertisements: [eightChannels],
  },
}

export const NotAdvertising: Story = {
  args: {
    advertisements: [notAdvertising],
  },
}

export const GridOverview: Story = {
  render: () => (
    <div className="tm-flex tm-flex-col tm-gap-6">
      <JobCardSimplify16
        title="Tvoje karta (HTML)"
        branches={[{ id: 'prague', name: 'Praha' }]}
        candidates={defaultCandidates}
        advertisements={[htmlYourCard]}
        {...menuHandlers}
      />
      <JobCardSimplify16
        title="Smíšené stavy (HTML)"
        branches={[{ id: 'prague', name: 'Praha' }]}
        candidates={defaultCandidates}
        advertisements={[htmlMixedStates]}
        {...menuHandlers}
      />
    </div>
  ),
}
