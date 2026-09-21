import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSyntezaAds } from './JobCardSyntezaAds'
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
  onTopAdvertisement: fn(),
  onPreviewPublication: fn(),
  onPreviewAdvertisement: fn(),
  onExtendPublication: fn(),
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

/** Most running portals share an until-date; one ends earlier → mixed-period heading and informative badges. */
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

/** Most ended portals share an end date; one ended earlier → balanced badge grid under Ukončeno. */
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

/** Jobs.cz ends within a week → mixed-period heading with a warning badge; the rest get date badges. */
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

/** Two different ending-soon dates → heading "Běží v různá období" and warning badges. */
const endingSoonMultipleDates: JobAdvertisement = {
  id: 'ad-ending-many',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(2), viewCount: 800 }, 31),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 440 }, 14),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 210 }, 5),
    withReactions({ id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 90 }, 2),
  ],
}

/** Five mixed-period portals → columns of three and two. */
const mixedPeriodsOddCount: JobAdvertisement = {
  id: 'ad-mixed-odd',
  title: 'Hlavní inzerát',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(3), viewCount: 800 }, 31),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 440 }, 14),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '20. 9. 2026', viewCount: 210 }, 5),
    withReactions({ id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7. 2026', endDate: '12. 10. 2026', viewCount: 90 }, 2),
    withReactions({ id: 'nearby', channel: 'Práce za rohem', startDate: '12. 7. 2026', endDate: daysFromNow(6), viewCount: 70 }, 1),
  ],
}

/** Ending soon, still running, and already ended — mixed-period badges plus Ukončeno. */
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

/** Mixed running/ended portals; both groups use badges when dates differ. */
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

/** Open recruitment, unfinished advertisement wizard — follow-up card instead of publications. */
const draftAdvertisement: JobAdvertisement = {
  id: 'ad-draft',
  title: 'Řidič/ka sk. C — druhý inzerát',
  status: 'draft',
}

const meta = {
  id: 'jobs-jobcard-synteza-ads',
  title: 'Jobs/Job Cards Variant/JobCard Syntéza Ads',
  component: JobCardSyntezaAds,
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
} satisfies Meta<typeof JobCardSyntezaAds>

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

export const EndingSoonMultipleDates: Story = {
  args: {
    advertisements: [endingSoonMultipleDates],
  },
}

export const MixedPeriodsOddCount: Story = {
  args: {
    advertisements: [mixedPeriodsOddCount],
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

export const MultipleAdvertisements: Story = {
  args: {
    advertisements: [runningSameDate, mixedSameDates, endedSameDate],
  },
}

export const Draft: Story = {
  args: {
    advertisements: [draftAdvertisement],
  },
}

export const MultipleAdvertisementsWithDraft: Story = {
  args: {
    advertisements: [runningSameDate, draftAdvertisement],
  },
}

export const MultipleHiringManagers: Story = {
  args: {
    hiringManagers: ['Klára Benešová', 'Michal Král'],
  },
}

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
