import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCard } from './JobCard'
import type { JobAdvertisement } from './types'

const menuHandlers = {
  onEditJob: fn(),
  onDuplicateJob: fn(),
  onInviteColleagues: fn(),
  onTransferJob: fn(),
  onArchiveJob: fn(),
  onEditAdvertisement: fn(),
  onExtendAndRepublish: fn(),
  onEndPublication: fn(),
}

/** All portals still run and share one until-date → heading "Běží 12. 7. – 30. 9. 2026" and a portal row. */
const runningSameDate: JobAdvertisement = {
  id: 'ad-running-same',
  title: 'Hlavní inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1840 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 920 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 410 },
  ],
}

/** Every portal has ended on the same day → heading "Ukončeno 1. 9." and a portal row. */
const endedSameDate: JobAdvertisement = {
  id: 'ad-ended-same',
  title: 'Ukončený inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 2100 },
    { id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 760 },
    { id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 310 },
  ],
}

/** Two portals still run to the same date, two already ended on the same (earlier) date. */
const mixedSameDates: JobAdvertisement = {
  id: 'ad-mixed-same',
  title: 'Inzerát pro brigádníky',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1200 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 640 },
    { id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 280 },
    { id: 'atmoskop', channel: 'Atmoskop', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 90 },
  ],
}

/** Running portals with different until-dates → heading "Běží" and a date on each portal. */
const runningDifferentDates: JobAdvertisement = {
  id: 'ad-running-diff',
  title: 'Hlavní inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '20. 9. 2026', viewCount: 800 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 440 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '15. 9. 2026', viewCount: 210 },
  ],
}

/** Ended portals with different end dates → heading "Ukončeno" and a date on each portal. */
const endedDifferentDates: JobAdvertisement = {
  id: 'ad-ended-diff',
  title: 'Ukončený inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '15. 8. 2026', viewCount: 1900 },
    { id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 510 },
    { id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '1. 6. 2026', endDate: '12. 7. 2026', viewCount: 180 },
  ],
}

/** Mixed running/ended portals, each group with mismatched dates. */
const mixedDifferentDates: JobAdvertisement = {
  id: 'ad-mixed-diff',
  title: 'Inzerát pro brigádníky',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '20. 9. 2026', viewCount: 700 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 380 },
    { id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 220 },
    { id: 'atmoskop', channel: 'Atmoskop', status: 'expired', startDate: '12. 7. 2026', endDate: '12. 8. 2026', viewCount: 70 },
  ],
}

const meta = {
  title: 'Jobs/JobCard',
  component: JobCard,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    status: 'published',
    candidates: { new: 5, unassessed: 14, inProgress: 6, total: 52 },
    onCandidatesClick: fn(),
    onStatusChange: fn(),
    onCompleteDraft: fn(),
    onGoToPublish: fn(),
    onRestoreFromArchive: fn(),
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
} satisfies Meta<typeof JobCard>

export default meta
type Story = StoryObj<typeof meta>

export const RunningSameDate: Story = {
  args: {
    advertisements: [runningSameDate],
  },
}

export const EndedSameDate: Story = {
  args: {
    advertisements: [endedSameDate],
  },
}

export const MixedSameDates: Story = {
  args: {
    advertisements: [mixedSameDates],
  },
}

export const RunningDifferentDates: Story = {
  args: {
    advertisements: [runningDifferentDates],
  },
}

export const EndedDifferentDates: Story = {
  args: {
    advertisements: [endedDifferentDates],
  },
}

export const MixedDifferentDates: Story = {
  args: {
    advertisements: [mixedDifferentDates],
  },
}

export const MultipleAdvertisements: Story = {
  args: {
    advertisements: [runningSameDate, mixedSameDates, endedSameDate],
  },
}

export const MultipleHiringManagers: Story = {
  args: {
    hiringManagers: ['Klára Benešová', 'Michal Král'],
    candidates: { new: 0, unassessed: 14, inProgress: 6, total: 52 },
  },
}
