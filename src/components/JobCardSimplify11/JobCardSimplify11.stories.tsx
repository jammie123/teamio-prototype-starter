import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSimplify11 } from './JobCardSimplify11'
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

const allDisabledAdvertisement: JobAdvertisement = {
  id: 'ad-all-disabled',
  title: 'Vše vypnuto',
  publications: [
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

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const mixedPeriodAdvertisement: JobAdvertisement = {
  id: 'ad-mixed',
  title: 'Různá období',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1200 },
      40,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 640 },
      18,
    ),
  ],
}

const endingSoonAdvertisement: JobAdvertisement = {
  id: 'ad-ending-soon',
  title: 'Končí brzy',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 1840 },
      56,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 920 },
      28,
    ),
  ],
}

const notAdvertisingAdvertisement: JobAdvertisement = {
  id: 'ad-not-advertising',
  title: 'Neinzeruje se',
  status: 'notAdvertising',
  advertisingDeclinedAt: '20. 10. 2026',
  publications: combinationF.publications,
}

const meta = {
  id: 'jobs-jobcard-simplify-11',
  title: 'Jobs/Job Cards Variant/JobCard Simplify 11',
  component: JobCardSimplify11,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    branches: [{ id: 'prague', name: 'Praha' }],
    candidates: defaultCandidates,
    onCandidatesClick: fn(),
    onViewStatisticsClick: fn(),
    advertisements: [combinationD],
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
} satisfies Meta<typeof JobCardSimplify11>

export default meta
type Story = StoryObj<typeof meta>

/** D — běží + expirováno + vypnuto. */
export const CombinationD: Story = {
  args: {
    advertisements: [combinationD],
  },
}

/** E — běží + vypnuto, bez panelového CTA. */
export const CombinationE: Story = {
  args: {
    advertisements: [combinationE],
  },
}

/** F — expirováno + vypnuto, Obnovit inzerci jen pro portály. */
export const CombinationF: Story = {
  args: {
    advertisements: [combinationF],
  },
}

export const AllChannelsDisabled: Story = {
  args: {
    advertisements: [allDisabledAdvertisement],
  },
}

export const MixedPeriods: Story = {
  args: {
    advertisements: [mixedPeriodAdvertisement],
  },
}

export const EndingSoon: Story = {
  args: {
    advertisements: [endingSoonAdvertisement],
  },
}

export const NotAdvertising: Story = {
  args: {
    advertisements: [notAdvertisingAdvertisement],
  },
}

export const KombinaceOverview: Story = {
  render: () => (
    <div className="tm-grid tm-grid-cols-1 tm-gap-4 xl:tm-grid-cols-3">
      <JobCardSimplify11
        title="Kombinace D"
        owner="Petra Nováková"
        candidates={defaultCandidates}
        advertisements={[combinationD]}
        {...menuHandlers}
      />
      <JobCardSimplify11
        title="Kombinace E"
        owner="Petra Nováková"
        candidates={defaultCandidates}
        advertisements={[combinationE]}
        {...menuHandlers}
      />
      <JobCardSimplify11
        title="Kombinace F"
        owner="Petra Nováková"
        candidates={defaultCandidates}
        advertisements={[combinationF]}
        {...menuHandlers}
      />
    </div>
  ),
}
