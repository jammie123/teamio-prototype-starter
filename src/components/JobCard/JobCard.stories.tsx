import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCard } from './JobCard'
import type { JobAdvertisement, JobCardAction } from './types'

const actions: JobCardAction[] = [
  { id: 'duplicate', label: 'Duplikovat nábor', onClick: fn() },
  { id: 'share', label: 'Sdílet nábor', onClick: fn() },
  { id: 'close', label: 'Uzavřít nábor', onClick: fn() },
  { id: 'delete', label: 'Smazat nábor', color: 'danger', onClick: fn() },
]

const advertisementActions: JobCardAction[] = [
  { id: 'edit-ad', label: 'Editovat inzerát', onClick: fn() },
  { id: 'end-ad', label: 'Ukončit vystavení', onClick: fn() },
]

const activeAdvertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  actions: advertisementActions,
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', viewCount: 312 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', viewCount: 130 },
  ],
}

const meta = {
  title: 'Jobs/JobCard',
  component: JobCard,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    totalViewCount: 1284,
    status: 'open',
    candidates: { unreviewed: 14, inProgress: 6, total: 52 },
    onCandidatesClick: fn(),
    advertisements: [activeAdvertisement],
    onEdit: fn(),
    actions,
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

export const Default: Story = {}

export const Closed: Story = {
  args: {
    status: 'closed',
  },
}

export const WithoutAdvertisement: Story = {
  args: {
    advertisements: [],
    onCreateAdvertisement: fn(),
  },
}

export const TwoAdvertisements: Story = {
  args: {
    advertisements: [
      activeAdvertisement,
      {
        id: 'ad-2',
        title: 'Inzerát pro brigádníky',
        actions: advertisementActions,
        publications: [
          { id: 'jobs-2', channel: 'Jobs.cz', startDate: '1. 8.', viewCount: 96 },
          { id: 'prace-2', channel: 'Prace.cz', startDate: '1. 8.', viewCount: 41 },
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
        actions: advertisementActions,
        publications: [
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', viewCount: 842 },
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
    status: 'closed',
    advertisements: [
      {
        id: 'ad-1',
        title: 'Aktuální inzerát',
        actions: advertisementActions,
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
            endDate: '12. 7.',
            viewCount: 312,
          },
        ],
      },
    ],
  },
}

export const StaticStats: Story = {
  args: {
    onCandidatesClick: undefined,
  },
}

export const AllPublicationsVisible: Story = {
  args: {
    publicationLimit: 'all',
  },
}

export const Playground: Story = {
  args: {
    publicationLimit: 2,
  },
}
