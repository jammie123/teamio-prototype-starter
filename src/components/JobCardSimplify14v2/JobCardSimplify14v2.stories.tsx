import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSimplify14v2 } from './JobCardSimplify14v2'
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
  onEnablePublication: fn(),
}

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

function withReactions(publication: JobPublication, reactionCount: number): JobPublication {
  return {
    ...publication,
    reactionCount,
  }
}

function publication(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
  reactionCount = 20,
): JobPublication {
  return withReactions({ startDate: '1. 10. 2026', viewCount: 640, ...partial }, reactionCount)
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

const runningSamePeriod: JobAdvertisement = {
  id: 'running-same',
  title: 'Běží — stejné období',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(40), viewCount: 1840 }, 56),
    publication({ id: 'prace', channel: 'Prace.cz', endDate: daysFromNow(40), viewCount: 920 }, 28),
    publication({ id: 'export', channel: 'Export', viewCount: 410 }, 9),
  ],
}

const runningMixedPeriods: JobAdvertisement = {
  id: 'running-mixed',
  title: 'Běží — různá období',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(40), viewCount: 1840 }, 56),
    publication({
      id: 'prace',
      channel: 'Prace.cz',
      startDate: '15. 9. 2026',
      endDate: daysFromNow(60),
      viewCount: 920,
    }, 28),
  ],
}

const endedSamePeriod: JobAdvertisement = {
  id: 'ended-same',
  title: 'Ukončena inzerce — stejné období',
  publications: [
    publication({
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '1. 10. 2025',
      endDate: '1. 1. 2026',
      viewCount: 2100,
    }, 48),
    publication({
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '1. 10. 2025',
      endDate: '1. 1. 2026',
      viewCount: 760,
    }, 22),
  ],
}

const endedMixedPeriods: JobAdvertisement = {
  id: 'ended-mixed',
  title: 'Ukončená inzerce',
  publications: [
    publication({
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '1. 10. 2025',
      endDate: '1. 1. 2026',
      viewCount: 2100,
    }, 48),
    publication({
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '1. 10. 2025',
      endDate: '15. 2. 2026',
      viewCount: 760,
    }, 22),
  ],
}

const endingSoonSamePeriod: JobAdvertisement = {
  id: 'ending-soon',
  title: 'Blíží se konec — stejné období',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(3), viewCount: 1840 }, 56),
    publication({ id: 'prace', channel: 'Prace.cz', endDate: daysFromNow(3), viewCount: 920 }, 28),
  ],
}

const runningAndEnded: JobAdvertisement = {
  id: 'running-and-ended',
  title: 'Běží 3 portály a 2 ukončené',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(40), viewCount: 1840 }, 56),
    publication({ id: 'prace', channel: 'Prace.cz', endDate: daysFromNow(40), viewCount: 920 }, 28),
    publication({ id: 'career', channel: 'Kariérní stránky', viewCount: 410 }, 9),
    publication({
      id: 'atmoskop',
      channel: 'Atmoskop',
      status: 'expired',
      startDate: '1. 10. 2025',
      endDate: '1. 1. 2026',
      viewCount: 310,
    }, 7),
    publication({
      id: 'recommend',
      channel: 'Doporučení',
      status: 'expired',
      startDate: '1. 10. 2025',
      endDate: '1. 1. 2026',
      viewCount: 180,
    }, 4),
  ],
}

const meta = {
  id: 'jobs-jobcard-simplify-14v2',
  title: 'Jobs/Job Cards Variant/JobCard Simplify 14v2',
  component: JobCardSimplify14v2,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    branches: [{ id: 'prague', name: 'Praha' }],
    candidates: defaultCandidates,
    onCandidatesClick: fn(),
    onViewStatisticsClick: fn(),
    advertisements: [runningSamePeriod],
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
} satisfies Meta<typeof JobCardSimplify14v2>

export default meta
type Story = StoryObj<typeof meta>

export const BeziStejneObdobi: Story = {
  name: 'Běží / Stejné období',
  args: {
    advertisements: [runningSamePeriod],
  },
}

export const BeziRuznaObdobi: Story = {
  name: 'Běží / Různá období',
  args: {
    advertisements: [runningMixedPeriods],
  },
}

export const UkoncenaInzerceStejneObdobi: Story = {
  name: 'Ukončena inzerce / Období od-do',
  args: {
    advertisements: [endedSamePeriod],
  },
}

export const UkoncenaInzerce: Story = {
  name: 'Ukončená inzerce',
  args: {
    advertisements: [endedMixedPeriods],
  },
}

export const BliziSeKonecStejneObdobi: Story = {
  name: 'Blíží se konec / Období od-do',
  args: {
    advertisements: [endingSoonSamePeriod],
  },
}

export const BeziTriADveUkoncene: Story = {
  name: 'Běží / 3 portály a 2 ukončené',
  args: {
    advertisements: [runningAndEnded],
  },
}

export const Prehled: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-8">
      {(
        [
          ['Běží — období od-do', runningSamePeriod],
          ['Běží v různá období', runningMixedPeriods],
          ['Ukončena inzerce — období od-do', endedSamePeriod],
          ['Ukončená inzerce', endedMixedPeriods],
          ['Blíží se konec — období od-do', endingSoonSamePeriod],
          ['Běží 3 portály a 2 ukončené', runningAndEnded],
        ] as const
      ).map(([label, advertisement]) => (
        <section key={advertisement.id} className="tm-flex tm-flex-col tm-gap-2">
          <h2 className="tm-m-0 tm-text-base tm-font-semibold tm-text-primary-default">{label}</h2>
          <JobCardSimplify14v2 {...args} advertisements={[advertisement]} />
        </section>
      ))}
    </div>
  ),
}
