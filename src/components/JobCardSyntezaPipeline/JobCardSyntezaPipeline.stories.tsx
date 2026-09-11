import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSyntezaPipeline } from './JobCardSyntezaPipeline'
import type { JobAdvertisement, JobCardActivity, JobPublication } from './types'

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
  onExtendPublication: fn(),
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

const runningSameDate: JobAdvertisement = {
  id: 'ad-running-same',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1840 }, 56),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 920 }, 28),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 410 }, 9),
  ],
}

const meta = {
  id: 'jobs-jobcard-synteza-pipeline',
  title: 'Jobs/JobCard Syntéza Pipeline',
  component: JobCardSyntezaPipeline,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    candidates: { new: 5, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 },
    activities: unreadActivities,
    onCandidatesClick: fn(),
    onActivityClick: fn(),
    onViewStatisticsClick: fn(),
    advertisements: [runningSameDate],
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
} satisfies Meta<typeof JobCardSyntezaPipeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoNewCandidates: Story = {
  args: {
    candidates: { new: 0, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 },
  },
}

export const WithNote: Story = {
  args: {
    note: {
      author: 'Petra Nováková',
      text: 'Nástup ideálně od 1. 9. 2026, možné se domluvit i na pozdější termín.',
      addedAt: '9. 9. 2026',
    },
    onExpandNote: fn(),
  },
}
