import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn, userEvent, within } from 'storybook/test'
import { JobCard } from './JobCard'
import type { JobAdvertisement, JobCardAction, JobCardSelectableStatus, JobStatus } from './types'

function czechDate(daysFromNow: number) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const menuHandlers = {
  onEditJob: fn(),
  onDuplicateJob: fn(),
  onInviteColleagues: fn(),
  onTransferJob: fn(),
  onArchiveJob: fn(),
  onEditAdvertisement: fn(),
  onManagePublications: fn(),
}

/** Extra actions are appended after the built-in job actions. */
const extraActions: JobCardAction[] = [
  { id: 'share', label: 'Sdílet nábor', onClick: fn() },
  { id: 'delete', label: 'Smazat nábor', color: 'danger', onClick: fn() },
]

const activeAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '12. 8. 2026', viewCount: 130 },
  ],
}

const meta = {
  title: 'Jobs/JobCard',
  component: JobCard,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    status: 'published',
    candidates: { unreviewed: 14, inProgress: 6, total: 52 },
    onCandidatesClick: fn(),
    onStatusChange: fn(),
    onCompleteDraft: fn(),
    onGoToPublish: fn(),
    onRestoreFromArchive: fn(),
    advertisements: [activeAdvertisement],
    ...menuHandlers,
  },
  decorators: [
    (Story) => (
      <div className="tm-max-w-[64rem] tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobCard>

export default meta
type Story = StoryObj<typeof meta>

const openMenu: Story['play'] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByTestId('job-card-actions-toggle'))
}

/** An open menu is taller than the card, so the story needs room below it. */
const roomForMenu: Story['decorators'] = [
  (Story) => (
    <div className="tm-min-h-[28rem]">
      <Story />
    </div>
  ),
]

export const Default: Story = {}

export const MenuOpen: Story = {
  decorators: roomForMenu,
  play: openMenu,
}

export const MenuWithExtraActions: Story = {
  args: {
    actions: extraActions,
  },
  decorators: roomForMenu,
  play: openMenu,
}

export const Active: Story = {
  args: {
    status: 'active',
  },
}

export const Published: Story = {
  args: {
    status: 'published',
  },
}

export const Unpublished: Story = {
  args: {
    status: 'unpublished',
  },
}

export const Draft: Story = {
  args: {
    status: 'draft',
    candidates: undefined,
    advertisements: [],
  },
}

export const Archived: Story = {
  args: {
    status: 'archived',
  },
}

export const ArchivedWithoutCandidates: Story = {
  args: {
    status: 'archived',
    candidates: undefined,
  },
}

export const WithoutAdvertisement: Story = {
  args: {
    advertisements: [],
    onCreateAdvertisement: fn(),
  },
}

export const MenuOpenWithoutAdvertisement: Story = {
  args: {
    advertisements: [],
    onCreateAdvertisement: fn(),
  },
  decorators: roomForMenu,
  play: openMenu,
}

export const TwoAdvertisements: Story = {
  args: {
    advertisements: [
      activeAdvertisement,
      {
        id: 'ad-2',
        title: 'Inzerát pro brigádníky',
        publications: [
          { id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.', endDate: '15. 9. 2026', viewCount: 96 },
          { id: 'prace-2', channel: 'Prace.cz', startDate: '1. 8.', endDate: '20. 9. 2026', viewCount: 41 },
        ],
      },
    ],
  },
}

export const EndingSoonPublication: Story = {
  args: {
    advertisements: [
      {
        id: 'ad-1',
        title: 'Aktuální inzerát',
        publications: [
          {
            id: 'jobs',
            channel: 'Jobs.cz',
            startDate: '12. 7.',
            endDate: czechDate(1),
            viewCount: 842,
          },
          {
            id: 'prace',
            channel: 'Prace.cz',
            startDate: '12. 7.',
            endDate: czechDate(5),
            viewCount: 312,
          },
        ],
      },
    ],
  },
}

export const ExpiredPublication: Story = {
  args: {
    advertisements: [
      {
        id: 'ad-1',
        title: 'Aktuální inzerát',
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
          {
            id: 'prace',
            channel: 'Prace.cz',
            status: 'expired',
            startDate: '12. 7.',
            endDate: '12. 8.',
            viewCount: 312,
          },
        ],
      },
    ],
  },
}

export const AllPublicationsExpired: Story = {
  args: {
    status: 'unpublished',
    advertisements: [
      {
        id: 'ad-1',
        title: 'Aktuální inzerát',
        publications: [
          {
            id: 'jobs',
            channel: 'Jobs.cz',
            status: 'expired',
            startDate: '12. 6.',
            endDate: '12. 7.',
            viewCount: 842,
          },
          {
            id: 'prace',
            channel: 'Prace.cz',
            status: 'expired',
            startDate: '12. 6.',
            endDate: '15. 8. 2026',
            viewCount: 312,
          },
          {
            id: 'career',
            channel: 'Kariérní stránky',
            status: 'expired',
            startDate: '1. 6.',
            endDate: '1. 7. 2026',
            viewCount: 130,
          },
        ],
      },
    ],
  },
}

export const ChangeStatus: Story = {
  render: function ChangeStatusStory(args) {
    const [status, setStatus] = useState<JobStatus>(args.status ?? 'published')

    return (
      <JobCard
        {...args}
        status={status}
        onArchiveJob={() => {
          setStatus('archived')
          args.onArchiveJob?.()
        }}
        onStatusChange={(nextStatus: JobCardSelectableStatus) => {
          setStatus(nextStatus)
          args.onStatusChange?.(nextStatus)
        }}
        onGoToPublish={() => {
          setStatus('published')
          args.onGoToPublish?.()
        }}
        onCompleteDraft={() => {
          setStatus('active')
          args.onCompleteDraft?.()
        }}
        onRestoreFromArchive={() => {
          setStatus('unpublished')
          args.onRestoreFromArchive?.()
        }}
      />
    )
  },
}

export const StaticStats: Story = {
  args: {
    onCandidatesClick: undefined,
  },
}

export const CollapsedAdvertisement: Story = {
  args: {
    defaultOpenAdvertisementIds: [],
  },
}
