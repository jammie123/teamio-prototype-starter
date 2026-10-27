import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardSimplify26 } from './JobCardSimplify26'
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
  onCreateAdvertisement: fn(),
  onRepublishAdvertisement: fn(),
}

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

const screenCandidates = {
  unassessed: 21,
  preselected: 5,
  invited: 2,
  hired: 3,
  total: 72,
}

const cardArgs = {
  title: 'Operátor/ka přepisu záznamů o provozu vozidel',
  owner: 'Petra Nováková',
  hiringManagers: ['Lukáš Procházka'],
  candidates: screenCandidates,
  onCandidatesClick: fn(),
  onViewStatisticsClick: fn(),
  ...menuHandlers,
}

function publication(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 10. 2026', ...partial }
}

const runningSamePeriod: JobAdvertisement = {
  id: 'running-same',
  title: 'Běží — stejné období',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(40) }),
    publication({ id: 'prace', channel: 'Prace.cz', endDate: daysFromNow(40) }),
    publication({ id: 'export', channel: 'Export' }),
  ],
}

const runningMixedPeriods: JobAdvertisement = {
  id: 'running-mixed',
  title: 'Běží — různá období',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(40) }),
    publication({
      id: 'recommend',
      channel: 'Doporučení',
      startDate: '15. 9. 2026',
      endDate: daysFromNow(60),
    }),
    publication({ id: 'export', channel: 'Export' }),
  ],
}

const endingSoonSameDate: JobAdvertisement = {
  id: 'ending-soon-same',
  title: 'Brzy končí — stejný den',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(3) }),
    publication({ id: 'prace', channel: 'Prace.cz', endDate: daysFromNow(3) }),
  ],
}

const endingSoonDifferentDates: JobAdvertisement = {
  id: 'ending-soon-different',
  title: 'Brzy končí — různě',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(2) }),
    publication({ id: 'prace', channel: 'Prace.cz', endDate: daysFromNow(5) }),
  ],
}

const endedSameDate: JobAdvertisement = {
  id: 'ended-same',
  title: 'Inzerce skončila — stejný den',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
    publication({ id: 'recommend', channel: 'Doporučení', status: 'expired', endDate: '1. 1. 2026' }),
    publication({ id: 'export', channel: 'Export', status: 'expired' }),
  ],
}

const endedDifferentDates: JobAdvertisement = {
  id: 'ended-different',
  title: 'Inzerce skončila — různě',
  publications: [
    publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
    publication({ id: 'prace', channel: 'Prace.cz', status: 'expired', endDate: '15. 2. 2026' }),
  ],
}

/** Screen: running portals in different periods, ended portals share one day. */
const screenAdvertisement: JobAdvertisement = {
  id: 'screen',
  title: 'Běží v různá období a ukončeno',
  publications: [
    ...runningMixedPeriods.publications!,
    publication({ id: 'jobs-ended', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
    publication({
      id: 'recommend-ended',
      channel: 'Doporučení',
      status: 'expired',
      endDate: '1. 1. 2026',
    }),
    publication({ id: 'export-ended', channel: 'Export', status: 'expired' }),
  ],
}

const notAdvertising: JobAdvertisement = {
  id: 'not-advertising',
  status: 'notAdvertising',
  publications: [],
}

const meta = {
  id: 'jobs-jobcard-simplify-26',
  title: 'Jobs/Job Cards Variant/Job Card Simplify 26',
  component: JobCardSimplify26,
  args: {
    ...cardArgs,
    advertisements: [screenAdvertisement],
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="tm-min-w-[1100px] tm-w-full tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobCardSimplify26>

export default meta
type Story = StoryObj<typeof meta>

export const Screen: Story = {
  name: 'Screen — různá období a ukončeno',
  args: {
    advertisements: [screenAdvertisement],
  },
}

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

export const BrzyKonciStejne: Story = {
  name: 'Brzy končí / Stejný den',
  args: {
    advertisements: [endingSoonSameDate],
  },
}

export const BrzyKonciRuzne: Story = {
  name: 'Brzy končí / Různě',
  args: {
    advertisements: [endingSoonDifferentDates],
  },
}

export const InzerceSkoncilaStejne: Story = {
  name: 'Inzerce skončila / Stejný den',
  args: {
    advertisements: [endedSameDate],
  },
}

export const InzerceSkoncilaRuzne: Story = {
  name: 'Inzerce skončila / Různě',
  args: {
    advertisements: [endedDifferentDates],
  },
}

export const NeinzerujeSe: Story = {
  name: 'Neinzeruje se',
  args: {
    advertisements: [notAdvertising],
  },
}

export const BezInzeratu: Story = {
  name: 'Bez inzerátu',
  args: {
    advertisements: [],
  },
}

export const Prehled: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-8">
      {(
        [
          ['Screen', screenAdvertisement],
          ['Běží — stejné období', runningSamePeriod],
          ['Běží — různá období', runningMixedPeriods],
          ['Brzy končí — stejný den', endingSoonSameDate],
          ['Brzy končí — různě', endingSoonDifferentDates],
          ['Inzerce skončila — stejný den', endedSameDate],
          ['Inzerce skončila — různě', endedDifferentDates],
          ['Neinzeruje se', notAdvertising],
        ] as const
      ).map(([label, advertisement]) => (
        <section key={advertisement.id} className="tm-flex tm-flex-col tm-gap-2">
          <h2 className="tm-m-0 tm-text-base tm-font-semibold tm-text-primary-default">{label}</h2>
          <JobCardSimplify26 {...args} advertisements={[advertisement]} />
        </section>
      ))}
    </div>
  ),
}
