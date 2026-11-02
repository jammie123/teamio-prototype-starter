import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardV3 } from './JobCardV3'
import type { JobAdvertisement, JobPublication } from './types'

const menuHandlers = {
  onEditJob: fn(),
  onDuplicateJob: fn(),
  onInviteColleagues: fn(),
  onTransferJob: fn(),
  onArchiveJob: fn(),
  onEditAdvertisement: fn(),
  onExtendAndRepublish: fn(),
  onEndPublication: fn(),
  onHighlightAdvertisement: fn(),
  onTopAdvertisement: fn(),
}

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 1. 2026', viewCount: 1000, ...partial }
}

const runningSame: JobAdvertisement = {
  id: 'ad-running-same',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026', viewCount: 1840 }),
    portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 920 }),
    portal({ id: 'career', channel: 'Kariérní stránky', endDate: '1. 2. 2026', viewCount: 410 }),
  ],
}

const runningDifferent: JobAdvertisement = {
  id: 'ad-running-diff',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 9. 2026',
      endDate: '30. 9. 2026',
      viewCount: 1840,
    }),
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      startDate: '15. 9. 2026',
      endDate: '15. 10. 2026',
      viewCount: 920,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '',
      endDate: '1. 11. 2026',
      viewCount: 410,
    }),
  ],
}

const mixedEndedPortal: JobAdvertisement = {
  id: 'ad-mixed',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 9. 2026',
      endDate: '30. 9. 2026',
      viewCount: 1840,
    }),
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '1. 8. 2026',
      endDate: '15. 8. 2026',
      viewCount: 920,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '1. 9. 2026',
      endDate: '30. 9. 2026',
      viewCount: 410,
    }),
  ],
}

const endedSame: JobAdvertisement = {
  id: 'ad-ended',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026', viewCount: 1840 }),
    portal({ id: 'prace', channel: 'Prace.cz', status: 'expired', endDate: '1. 1. 2026', viewCount: 920 }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'expired',
      endDate: '1. 1. 2026',
      viewCount: 410,
    }),
  ],
}

const endingSoonSame: JobAdvertisement = {
  id: 'ad-ending-soon',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 9. 2026',
      endDate: daysFromNow(3),
      viewCount: 1840,
    }),
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      startDate: '1. 9. 2026',
      endDate: daysFromNow(3),
      viewCount: 920,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '1. 9. 2026',
      endDate: daysFromNow(3),
      viewCount: 410,
    }),
  ],
}

const withHighlights: JobAdvertisement = {
  id: 'ad-highlights',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 1. 2026',
      endDate: '1. 2. 2026',
      viewCount: 1840,
      reactionCount: 34,
      highlights: [
        {
          id: 'jobs-jobstip',
          name: 'Jobstip',
          startDate: '8. 6.',
          endDate: '30. 9. 2026',
          viewCount: 699,
          reactionCount: 13,
        },
        {
          id: 'jobs-top',
          name: 'Topováno',
          startDate: '22. 6.',
          endDate: '30. 9. 2026',
          viewCount: 331,
          reactionCount: 6,
        },
      ],
    },
    portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 920, reactionCount: 15 }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      endDate: '1. 2. 2026',
      viewCount: 410,
      reactionCount: 8,
    }),
  ],
}

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV3',
  component: JobCardV3,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    status: 'published',
    candidates: { new: 5, newOpalcovani: 3, unassessed: 14, inProgress: 6, total: 52 },
    onCandidatesClick: fn(),
    advertisements: [runningSame],
    ...menuHandlers,
  },
  decorators: [
    (Story) => (
      <div className="tm-max-w-[64rem] tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobCardV3>

export default meta
type Story = StoryObj<typeof meta>

export const RunningSamePeriod: Story = {
  name: '1 · Běží, jedno období',
  args: {
    advertisements: [runningSame],
  },
}

export const RunningDifferentPeriods: Story = {
  name: '2 · Běží, každý portál jinak',
  args: {
    advertisements: [runningDifferent],
  },
}

export const MixedEndedPortal: Story = {
  name: '3 · Běží, některé portály už skončily',
  args: {
    advertisements: [mixedEndedPortal],
  },
}

export const Ended: Story = {
  name: '4 · Ukončená',
  args: {
    advertisements: [endedSame],
  },
}

export const EndingSoon: Story = {
  name: '5 · Brzy končí',
  args: {
    advertisements: [endingSoonSame],
  },
}

export const Prehled: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-8">
      {(
        [
          ['1 · Běží, jedno období', runningSame],
          ['2 · Běží, každý portál jinak', runningDifferent],
          ['3 · Běží, některé portály už skončily', mixedEndedPortal],
          ['4 · Ukončená', endedSame],
          ['5 · Brzy končí', endingSoonSame],
        ] as const
      ).map(([label, advertisement]) => (
        <section key={advertisement.id} className="tm-flex tm-flex-col tm-gap-2">
          <h2 className="tm-m-0 tm-text-xs tm-font-medium tm-tracking-wide tm-text-secondary-default">
            {label}
          </h2>
          <JobCardV3 {...args} advertisements={[advertisement]} />
        </section>
      ))}
    </div>
  ),
}

export const WithHighlights: Story = {
  args: {
    advertisements: [withHighlights],
  },
}

export const MultipleAdvertisements: Story = {
  args: {
    advertisements: [runningSame, mixedEndedPortal, endedSame],
  },
}

export const AdditionalAdvertisements: Story = {
  args: {
    advertisements: [runningSame, mixedEndedPortal, endedSame],
    showAdditionalAdvertisementsLink: true,
    onAdditionalAdvertisementsClick: fn(),
  },
}

export const NoAdvertisement: Story = {
  args: {
    advertisements: [],
    onCreateAdvertisement: fn(),
  },
}

export const Unpublished: Story = {
  args: {
    status: 'unpublished',
    advertisements: [runningSame],
  },
}
