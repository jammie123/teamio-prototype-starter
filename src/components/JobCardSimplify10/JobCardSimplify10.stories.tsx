import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSimplify10 } from './JobCardSimplify10'
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
  onDeclineAdvertising: fn(),
  onRepublishAdvertisement: fn(),
}

function withReactions(publication: JobPublication, reactionCount: number): JobPublication {
  return {
    ...publication,
    reactionCount,
  }
}

const defaultCandidates = {
  new: 2,
  unassessed: 14,
  preselected: 8,
  newOhodnoceni: 2,
  invited: 5,
  nabidka: 4,
  hired: 2,
  total: 32,
}

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const endingSoonAdvertisement: JobAdvertisement = {
  id: 'ad-ending-soon',
  title: 'Hlavní inzerát',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '12. 7. 2026',
        endDate: daysFromNow(5),
        viewCount: 1840,
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
      },
      28,
    ),
    withReactions(
      {
        id: 'career',
        channel: 'Kariérní stránky',
        startDate: '12. 7. 2026',
        endDate: daysFromNow(5),
        viewCount: 410,
      },
      9,
    ),
  ],
}

const expiredUnexpectedAdvertisement: JobAdvertisement = {
  id: 'ad-expired',
  title: 'Hlavní inzerát',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 2100,
      },
      48,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 760,
      },
      22,
    ),
    withReactions(
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 310,
      },
      7,
    ),
  ],
}

const notAdvertisingAdvertisement: JobAdvertisement = {
  id: 'ad-not-advertising',
  title: 'Hlavní inzerát',
  status: 'notAdvertising',
  advertisingDeclinedAt: '20. 10. 2026',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 2100,
      },
      48,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 760,
      },
      22,
    ),
    withReactions(
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 310,
      },
      7,
    ),
  ],
}

const mixedPeriodAdvertisement: JobAdvertisement = {
  id: 'ad-mixed',
  title: 'Inzerát pro brigádníky',
  publications: [
    withReactions({ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1200 }, 40),
    withReactions({ id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 640 }, 18),
    withReactions(
      { id: 'career', channel: 'Kariérní stránky', status: 'expired', startDate: '12. 7. 2026', endDate: '1. 9. 2026', viewCount: 280 },
      6,
    ),
  ],
}

const draftAdvertisement: JobAdvertisement = {
  id: 'ad-draft',
  title: 'Řidič/ka sk. C — druhý inzerát',
  status: 'draft',
}

const meta = {
  id: 'jobs-jobcard-simplify-10',
  title: 'Jobs/Job Cards Variant/JobCard Simplify 10',
  component: JobCardSimplify10,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    branches: [{ id: 'prague', name: 'Praha' }],
    candidates: defaultCandidates,
    onCandidatesClick: fn(),
    onViewStatisticsClick: fn(),
    advertisements: [endingSoonAdvertisement],
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
} satisfies Meta<typeof JobCardSimplify10>

export default meta
type Story = StoryObj<typeof meta>

/** TML 1 — Končí brzy: warning + hodiny, Prodloužit inzerci. */
export const EndingSoon: Story = {
  args: {
    advertisements: [endingSoonAdvertisement],
  },
}

/** TML 2 — Skončila (expirovala): danger + Obnovit / Už neinzeruji. */
export const ExpiredUnexpected: Story = {
  args: {
    advertisements: [expiredUnexpectedAdvertisement],
  },
}

/** TML 3 — Vědomě neinzerováno: quiet karta, view-off, Znovu inzerovat. */
export const NotAdvertising: Story = {
  args: {
    advertisements: [notAdvertisingAdvertisement],
  },
}

/** Smíšená období → fallback na Simplify 9 panel uvnitř karty. */
export const MixedPeriodFallback: Story = {
  args: {
    advertisements: [mixedPeriodAdvertisement],
  },
}

export const Draft: Story = {
  args: {
    advertisements: [draftAdvertisement],
  },
}

export const NoAdvertisements: Story = {
  args: {
    advertisements: [],
    onCreateAdvertisement: fn(),
  },
}

export const MultipleAdvertisements: Story = {
  args: {
    advertisements: [endingSoonAdvertisement, expiredUnexpectedAdvertisement, notAdvertisingAdvertisement],
  },
}
