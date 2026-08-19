import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCard } from './JobCard'
import type { JobAdvertisement, JobCardAction } from './types'

function czechDate(daysFromNow: number) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const actions: JobCardAction[] = [
  { id: 'duplicate', label: 'Duplikovat nábor', onClick: fn() },
  { id: 'share', label: 'Sdílet nábor', onClick: fn() },
  { id: 'close', label: 'Uzavřít nábor', onClick: fn() },
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
    status: 'open',
    candidates: { unreviewed: 14, inProgress: 6, total: 52 },
    onCandidatesClick: fn(),
    advertisements: [activeAdvertisement],
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
    status: 'closed',
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
