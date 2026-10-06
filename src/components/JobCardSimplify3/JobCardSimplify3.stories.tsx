import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSimplify3 } from './JobCardSimplify3'
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
}

function withReactions(publication: JobPublication, reactionCount: number): JobPublication {
  return {
    ...publication,
    reactionCount,
  }
}

const defaultCandidates = {
  new: 5,
  unassessed: 14,
  preselected: 8,
  opalcovani: 3,
  newOpalcovani: 2,
  invited: 5,
  hired: 2,
  total: 32,
}

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

/** All portals still run and share one until-date within a week → heading "Končí za … dní". */
const runningSameDate: JobAdvertisement = {
  id: 'ad-running-same',
  title: 'Hlavní inzerát',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '12. 7. 2026',
        endDate: daysFromNow(5),
        viewCount: 1840,
        highlights: [
          {
            id: 'jobs-jobstip',
            name: 'Jobstip',
            kind: 'jobstip',
            startDate: '12. 7. 2026',
            endDate: daysFromNow(5),
            viewCount: 699,
            reactionCount: 13,
          },
        ],
      },
      56,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        startDate: '12. 7. 2026',
        endDate: daysFromNow(5),
        viewCount: 920,
        highlights: [
          {
            id: 'prace-supermax',
            name: 'Supermax',
            kind: 'supermax',
            startDate: '12. 7. 2026',
            endDate: daysFromNow(5),
            viewCount: 265,
            reactionCount: 4,
          },
        ],
      },
      28,
    ),
    withReactions({ id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 410 }, 9),
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

/** Most running portals share an until-date; one ends earlier → mixed-period heading and secondary date text. */
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

/** Most ended portals share an end date; one ended earlier → balanced date grid under Ukončeno. */
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

/** Jobs.cz ends within a week → mixed-period heading with secondary remaining-days text. */
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

/** Two different ending-soon dates → heading "Běží v různá období" and secondary remaining-days text. */
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

/** Ending soon, still running, and already ended — mixed-period dates plus Ukončeno. */
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

/** Mixed running/ended portals; both groups use secondary date text when dates differ. */
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

/** Running paid highlights sit after their parent portal in Teamio pink. */
const highlightedAdvertisement: JobAdvertisement = {
  id: 'ad-highlights',
  title: 'Hlavní inzerát',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '12. 7. 2026',
        endDate: '30. 10. 2026',
        viewCount: 1840,
        highlights: [
          {
            id: 'jobs-jobstip',
            name: 'Jobstip',
            kind: 'jobstip',
            startDate: '8. 6. 2026',
            endDate: '30. 10. 2026',
            viewCount: 699,
            reactionCount: 13,
          },
          {
            id: 'jobs-top',
            name: 'Topováno na jobs.cz',
            kind: 'top',
            startDate: '22. 6. 2026',
            endDate: '30. 10. 2026',
            viewCount: 331,
            reactionCount: 6,
          },
        ],
      },
      56,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        startDate: '12. 7. 2026',
        endDate: '30. 10. 2026',
        viewCount: 920,
        highlights: [
          {
            id: 'prace-supermax',
            name: 'Supermax',
            kind: 'supermax',
            startDate: '8. 6. 2026',
            endDate: '30. 10. 2026',
            viewCount: 265,
            reactionCount: 4,
          },
        ],
      },
      28,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 10. 2026', viewCount: 410 },
      9,
    ),
  ],
}

/** Open recruitment, unfinished advertisement wizard — follow-up card instead of publications. */
const draftAdvertisement: JobAdvertisement = {
  id: 'ad-draft',
  title: 'Řidič/ka sk. C — druhý inzerát',
  status: 'draft',
}

const meta = {
  id: 'jobs-jobcard-simplify-3',
  title: 'Jobs/Job Cards Variant/JobCard Simplify 3',
  component: JobCardSimplify3,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    branches: [{ id: 'prague', name: 'Praha' }],
    candidates: defaultCandidates,
    onCandidatesClick: fn(),
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
} satisfies Meta<typeof JobCardSimplify3>

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

export const HighlightedAdvertisement: Story = {
  args: {
    advertisements: [highlightedAdvertisement],
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

export const NewlyOpalcovani: Story = {
  args: {
    candidates: defaultCandidates,
  },
}

export const NoNewOpalcovani: Story = {
  args: {
    candidates: { ...defaultCandidates, newOpalcovani: 0 },
  },
}

export const NoNewCandidates: Story = {
  args: {
    candidates: { ...defaultCandidates, new: 0 },
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

export const NoAdvertisements: Story = {
  args: {
    advertisements: [],
    onCreateAdvertisement: fn(),
  },
}

export const NoBranch: Story = {
  args: {
    branches: [],
  },
}

export const SingleBranch: Story = {
  args: {
    branches: [{ id: 'prague', name: 'Praha' }],
  },
}

export const MultipleBranches: Story = {
  args: {
    branches: [
      { id: 'prague', name: 'Praha' },
      { id: 'brno', name: 'Brno' },
    ],
    advertisements: [runningSameDate, mixedSameDates],
  },
}
