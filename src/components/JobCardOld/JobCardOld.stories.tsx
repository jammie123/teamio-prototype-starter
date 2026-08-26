import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardOld } from './JobCardOld'
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
  onHighlightAndTop: fn(),
  onAddNote: fn(),
  onPreviewPublication: fn(),
  onExtendPublication: fn(),
}

function withReactions(publication: JobPublication, reactionCount: number): JobPublication {
  return {
    ...publication,
    reactionCount,
  }
}

/** All portals still run and share one until-date → heading "Běží 12. 7. – 30. 9. 2026" and a portal row. */
const runningSameDate: JobAdvertisement = {
  id: 'ad-running-same',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1840 }, 56),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 920 }, 28),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 410 }, 9),
  ],
}

/** Every portal has ended on the same day → heading "Ukončeno 1. 9." and a portal row. */
const endedSameDate: JobAdvertisement = {
  id: 'ad-ended-same',
  title: 'Ukončený inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 2100 }, 48),
    withReactions({ id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 760 }, 22),
    withReactions({ id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 310 }, 7),
  ],
}

/** Two portals still run to the same date, two already ended on the same (earlier) date. */
const mixedSameDates: JobAdvertisement = {
  id: 'ad-mixed-same',
  title: 'Inzerát pro brigádníky',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1200 }, 40),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 640 }, 18),
    withReactions({ id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 280 }, 6),
    withReactions({ id: 'atmoskop', channel: 'Atmoskop', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 90 }, 3),
  ],
}

/** Most running portals share an until-date; one ends earlier → grouped date rows. */
const runningDifferentDates: JobAdvertisement = {
  id: 'ad-running-diff',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 800 }, 31),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 440 }, 14),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 210 }, 5),
    withReactions({ id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7. 2026', endDate: '12. 8. 2026', viewCount: 90 }, 2),
  ],
}

/** Most ended portals share an end date; one ended earlier → grouped date rows. */
const endedDifferentDates: JobAdvertisement = {
  id: 'ad-ended-diff',
  title: 'Ukončený inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 1900 }, 44),
    withReactions({ id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 510 }, 16),
    withReactions({ id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 6. 2026', endDate: '1. 9. 2026', viewCount: 180 }, 4),
    withReactions({ id: 'atmoskop', channel: 'Atmoskop', status: 'expired', startDate: '1. 6. 2026', endDate: '12. 8. 2026', viewCount: 70 }, 2),
  ],
}

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

/** Shared until-date within a week → warning heading "Končí za 6 dní · …". */
const endingSoonSameDate: JobAdvertisement = {
  id: 'ad-ending-same',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(6), viewCount: 1840 }, 56),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(6), viewCount: 920 }, 28),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: daysFromNow(6), viewCount: 410 }, 9),
  ],
}

/** Jobs.cz ends within a week → own "Končí za …" heading; the rest stay under Běží. */
const endingSoonDifferentDates: JobAdvertisement = {
  id: 'ad-ending-diff',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(6), viewCount: 800 }, 31),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 440 }, 14),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 210 }, 5),
    withReactions({ id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 90 }, 2),
  ],
}

/** Ending soon, still running, and already ended — three category headings. */
const endingSoonMixed: JobAdvertisement = {
  id: 'ad-ending-mixed',
  title: 'Disponent dopravy',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '20. 8. 2026', endDate: daysFromNow(5), viewCount: 410 }, 7),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '20. 8. 2026', endDate: '31. 10. 2026', viewCount: 260 }, 4),
    withReactions(
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'expired',
        startDate: '2. 6. 2026',
        endDate: '10. 8. 2026',
        viewCount: 95,
      },
      1,
    ),
    withReactions(
      {
        id: 'atmoskop',
        channel: 'Atmoskop',
        status: 'expired',
        startDate: '2. 6. 2026',
        endDate: '10. 8. 2026',
        viewCount: 48,
      },
      0,
    ),
  ],
}

/** Mixed running/ended portals; each group has a shared date plus one outlier. */
const mixedDifferentDates: JobAdvertisement = {
  id: 'ad-mixed-diff',
  title: 'Inzerát pro brigádníky',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 700 }, 24),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 380 }, 12),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '20. 9. 2026', viewCount: 210 }, 5),
    withReactions({ id: 'atmoskop', channel: 'Atmoskop', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 220 }, 5),
    withReactions({ id: 'nearby', channel: 'Práce za rohem', status: 'expired', startDate: '12. 7. 2026', endDate: '12. 8. 2026', viewCount: 70 }, 2),
  ],
}

/** Running paid highlights sit after their parent portal in Teamio pink. Ended highlights stay hidden. */
const withHighlights: JobAdvertisement = {
  id: 'ad-highlights',
  title: 'Hlavní inzerát',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '1. 6. 2026',
        endDate: '30. 9. 2026',
        viewCount: 1840,
        highlights: [
          {
            id: 'jobs-jobstip',
            name: 'Jobstip',
            startDate: '8. 6. 2026',
            endDate: '30. 9. 2026',
            viewCount: 699,
            reactionCount: 13,
          },
          {
            id: 'jobs-top',
            name: 'Topováno',
            startDate: '22. 6. 2026',
            endDate: '30. 9. 2026',
            viewCount: 331,
            reactionCount: 6,
          },
        ],
      },
      34,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        startDate: '1. 6. 2026',
        endDate: '30. 9. 2026',
        viewCount: 920,
        highlights: [
          {
            id: 'prace-supermax',
            name: 'Supermax',
            startDate: '8. 6. 2026',
            endDate: '30. 9. 2026',
            viewCount: 331,
            reactionCount: 5,
          },
        ],
      },
      15,
    ),
    withReactions(
      {
        id: 'career',
        channel: 'Kariérní stránky',
        startDate: '1. 6. 2026',
        endDate: '30. 9. 2026',
        viewCount: 410,
      },
      8,
    ),
    withReactions(
      {
        id: 'pzr',
        channel: 'Práce za rohem',
        startDate: '1. 7. 2026',
        endDate: '30. 9. 2026',
        viewCount: 560,
        highlights: [
          {
            id: 'pzr-highlight',
            name: 'Zvýraznění inzerátu na Práce za rohem',
            startDate: '4. 7. 2026',
            endDate: '30. 9. 2026',
            viewCount: 157,
            reactionCount: 3,
          },
        ],
      },
      11,
    ),
  ],
}

const meta = {
  title: 'Jobs/JobCardOld',
  component: JobCardOld,
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
    onPreviewAdvertisement: fn(),
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
} satisfies Meta<typeof JobCardOld>

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

export const EndingSoonSameDate: Story = {
  args: {
    advertisements: [endingSoonSameDate],
  },
}

export const EndingSoonDifferentDates: Story = {
  args: {
    advertisements: [endingSoonDifferentDates],
  },
}

export const EndingSoonMixed: Story = {
  args: {
    advertisements: [endingSoonMixed],
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

export const WithHighlights: Story = {
  args: {
    advertisements: [withHighlights],
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

export const NoAdvertisement: Story = {
  args: {
    advertisements: [],
    onCreateAdvertisement: fn(),
  },
}

export const AdvertisementNotPublished: Story = {
  args: {
    advertisements: [{ id: 'ad-unpublished', title: 'Hlavní inzerát', publications: [] }],
  },
}
