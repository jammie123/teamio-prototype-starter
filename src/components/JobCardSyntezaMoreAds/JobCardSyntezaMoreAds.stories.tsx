import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSyntezaMoreAds } from './JobCardSyntezaMoreAds'
import type { JobAdvertisement, JobCardActivity, JobPublication } from '../JobCardSyntezaPipeline/types'

const menuHandlers = {
  onEditJob: fn(),
  onDuplicateJob: fn(),
  onInviteColleagues: fn(),
  onTransferJob: fn(),
  onArchiveJob: fn(),
  onEditAdvertisement: fn(),
  onExtendAndRepublish: fn(),
  onEndPublication: fn(),
  onPreviewPublication: fn(),
  onPreviewAdvertisement: fn(),
  onExtendPublication: fn(),
  onCreateAdvertisement: fn(),
  onCompleteAdvertisement: fn(),
}

function withReactions(publication: JobPublication, reactionCount: number): JobPublication {
  return {
    ...publication,
    reactionCount,
  }
}

const unreadActivities: JobCardActivity[] = [
  {
    id: 'rating-1',
    type: 'rating',
    actor: 'Lukáš Procházka',
    candidateName: 'Jana Malá',
    occurredAt: 'dnes 9:14',
    unread: true,
  },
  {
    id: 'note-1',
    type: 'note',
    actor: 'Lukáš Procházka',
    candidateName: 'Petr Horák',
    occurredAt: 'včera 16:02',
    unread: true,
  },
]

const mainAdvertisement: JobAdvertisement = {
  id: 'ad-main',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1840 }, 56),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 920 }, 28),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 410 }, 9),
  ],
}

const brigadeAdvertisement: JobAdvertisement = {
  id: 'ad-brigade',
  title: 'Inzerát pro brigádníky',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '20. 8. 2026', endDate: '31. 10. 2026', viewCount: 640 }, 18),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '20. 8. 2026', endDate: '31. 10. 2026', viewCount: 310 }, 7),
  ],
}

const shiftAdvertisement: JobAdvertisement = {
  id: 'ad-shifts',
  title: 'Inzerát na směny',
  publications: [
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '1. 9. 2026', endDate: '15. 11. 2026', viewCount: 280 }, 6),
    withReactions({ id: 'nearby', channel: 'Práce za rohem', startDate: '1. 9. 2026', endDate: '15. 11. 2026', viewCount: 90 }, 2),
  ],
}

const runningBatch = [mainAdvertisement, brigadeAdvertisement, shiftAdvertisement]

const meta = {
  id: 'jobs-jobcard-synteza-more-ads',
  title: 'Jobs/Job Cards Variant/JobCard Syntéza More Ads',
  component: JobCardSyntezaMoreAds,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    candidates: { new: 5, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 },
    activities: unreadActivities,
    onCandidatesClick: fn(),
    onActivityClick: fn(),
    onViewStatisticsClick: fn(),
    advertisements: runningBatch,
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
} satisfies Meta<typeof JobCardSyntezaMoreAds>

export default meta
type Story = StoryObj<typeof meta>

export const RunningBatch: Story = {}

export const OpenedAdvertisement: Story = {
  args: {
    defaultOpenedAdvertisementId: 'ad-main',
  },
}

export const SingleAdvertisement: Story = {
  args: {
    advertisements: [mainAdvertisement],
  },
}

export const NoAdvertisement: Story = {
  args: {
    advertisements: [],
  },
}
