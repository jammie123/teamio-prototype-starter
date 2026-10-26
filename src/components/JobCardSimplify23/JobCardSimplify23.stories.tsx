import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { fn } from 'storybook/test'
import { JobCardSimplify23 } from './JobCardSimplify23'
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
  onCreateAdvertisement: fn(),
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

const cardArgs = {
  title: 'Řidič/ka sk. C ČB PO–PÁ',
  owner: 'Petra Nováková',
  hiringManagers: ['Lukáš Procházka'],
  branches: [{ id: 'prague', name: 'Praha' }],
  candidates: defaultCandidates,
  onCandidatesClick: fn(),
  onViewStatisticsClick: fn(),
  ...menuHandlers,
}

/** Všechny portály běží se stejným datem konce (+ kariérní web bez data). */
const runningSamePeriod: JobAdvertisement = {
  id: 'ad-running-same',
  title: 'Běží — stejné období',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
      56,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026', viewCount: 920 },
      28,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '1. 10. 2026', viewCount: 410 },
      9,
    ),
  ],
}

/** Běžící portály s různými daty konce (žádný zatím není „brzy končí“). */
const runningMixedPeriods: JobAdvertisement = {
  id: 'ad-running-mixed',
  title: 'Běží — různá období',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(45), viewCount: 1200 },
      40,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(90), viewCount: 640 },
      18,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 210 },
      5,
    ),
  ],
}

/** Oba placené portály končí brzy ve stejný den. */
const endingSoonAllSameDate: JobAdvertisement = {
  id: 'ad-ending-soon-same',
  title: 'Brzy končí — stejný den',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 1200 },
      40,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 640 },
      18,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 210 },
      5,
    ),
  ],
}

/** Jen Jobs.cz končí brzy, ostatní běží déle. */
const endingSoonOnePortal: JobAdvertisement = {
  id: 'ad-ending-soon-one',
  title: 'Brzy končí — jeden portál',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: daysFromNow(5), viewCount: 1200 },
      40,
    ),
    withReactions(
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: daysFromNow(12), viewCount: 640 },
      18,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 210 },
      5,
    ),
  ],
}

/** Jeden portál ukončen, ostatní stále běží. */
const partialRunning: JobAdvertisement = {
  id: 'ad-partial',
  title: 'Běží částečně',
  publications: [
    withReactions(
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026', viewCount: 1840 },
      56,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: daysFromNow(-3),
        viewCount: 920,
      },
      28,
    ),
    withReactions(
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026', viewCount: 410 },
      9,
    ),
  ],
}

/** Všechny placené portály vypršely před 3 dny (do 5 dní = červený nadpis). */
const advertisingExpired: JobAdvertisement = {
  id: 'ad-expired',
  title: 'Inzerce vypršela',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: daysFromNow(-3),
        viewCount: 2100,
      },
      56,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: daysFromNow(-3),
        viewCount: 1070,
      },
      28,
    ),
  ],
}

/** Vědomě ukončená inzerce před 12 dny (starší než 5 dní = šedý nadpis). */
const advertisingConsciouslyEnded: JobAdvertisement = {
  id: 'ad-ended',
  title: 'Inzerce ukončena',
  publications: [
    withReactions(
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: daysFromNow(-12),
        viewCount: 2100,
      },
      56,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: daysFromNow(-12),
        viewCount: 1070,
      },
      28,
    ),
    withReactions(
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'disabled',
        startDate: '12. 7. 2026',
        viewCount: 410,
      },
      9,
    ),
  ],
}

const notAdvertisingAfterDecline: JobAdvertisement = {
  id: 'ad-not-advertising',
  status: 'notAdvertising',
  advertisingDeclinedAt: '20. 10. 2026',
  title: 'Neinzeruje se',
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
      56,
    ),
    withReactions(
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
        viewCount: 1070,
      },
      28,
    ),
  ],
}

/**
 * Pět míst vystavení: Práce, Jobs, Kariérní stránky, Atmoskop, Práce za rohem.
 * `ended` = portál je ukončený (před 3 dny), jinak běží do stejného data.
 */
function fivePortalAdvertisement(
  id: string,
  title: string,
  ended: { jobs?: boolean; prace?: boolean; career?: boolean; atmoskop?: boolean; praceZaRohem?: boolean },
): JobAdvertisement {
  const portal = (
    key: keyof typeof ended,
    publication: Pick<JobPublication, 'id' | 'channel' | 'viewCount'>,
    reactionCount: number,
  ): JobPublication =>
    withReactions(
      ended[key]
        ? {
            ...publication,
            status: 'expired',
            startDate: '12. 6. 2026',
            endDate: daysFromNow(-3),
          }
        : {
            ...publication,
            startDate: '12. 7. 2026',
            ...(key === 'career' ? {} : { endDate: daysFromNow(40) }),
          },
      reactionCount,
    )

  return {
    id,
    title,
    publications: [
      portal('prace', { id: 'prace', channel: 'Prace.cz', viewCount: 920 }, 28),
      portal('jobs', { id: 'jobs', channel: 'Jobs.cz', viewCount: 1840 }, 56),
      portal('career', { id: 'career', channel: 'Kariérní stránky', viewCount: 410 }, 9),
      portal('atmoskop', { id: 'atmoskop', channel: 'Atmoskop', viewCount: 260 }, 6),
      portal('praceZaRohem', { id: 'prace-za-rohem', channel: 'Práce za rohem', viewCount: 340 }, 11),
    ],
  }
}

const fivePortalsAllRunning = fivePortalAdvertisement(
  'ad-five-running',
  '5 portálů — všechny běží',
  {},
)

const fivePortalsPartiallyRunning = fivePortalAdvertisement(
  'ad-five-partial',
  '5 portálů — část běží',
  { prace: true, praceZaRohem: true },
)

const fivePortalsAllEnded = fivePortalAdvertisement('ad-five-ended', '5 portálů — všechny ukončené', {
  prace: true,
  jobs: true,
  career: true,
  atmoskop: true,
  praceZaRohem: true,
})

const meta = {
  id: 'jobs-jobcard-simplify-23',
  title: 'Jobs/Job Cards Variant/Job Card Simplify 23',
  component: JobCardSimplify23,
  args: {
    ...cardArgs,
    advertisements: [runningSamePeriod],
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
} satisfies Meta<typeof JobCardSimplify23>

export default meta
type Story = StoryObj<typeof meta>

export const Bezi_StejneObdobi: Story = {
  name: 'Běží / Stejné období',
  args: {
    advertisements: [runningSamePeriod],
  },
}

export const Bezi_RuznaObdobi: Story = {
  name: 'Běží / Různá období',
  args: {
    advertisements: [runningMixedPeriods],
  },
}

export const BrzyKonci_VsechnyStejne: Story = {
  name: 'Brzy končí / Všechny stejně brzy',
  args: {
    advertisements: [endingSoonAllSameDate],
    onExtendAndRepublish: fn(),
  },
}

export const BrzyKonci_JedenPortál: Story = {
  name: 'Brzy končí / Jen jeden portál',
  args: {
    advertisements: [endingSoonOnePortal],
    onExtendAndRepublish: fn(),
  },
}

export const BeziCastecne: Story = {
  name: 'Běží částečně',
  args: {
    advertisements: [partialRunning],
    onExtendAndRepublish: fn(),
  },
}

export const InzerceVyprsela: Story = {
  name: 'Inzerce vypršela',
  args: {
    advertisements: [advertisingExpired],
    onExtendAndRepublish: fn(),
    onDeclineAdvertising: fn(),
    onEditAdvertisement: fn(),
  },
}

export const InzerceUkoncena: Story = {
  name: 'Inzerce ukončena',
  args: {
    advertisements: [advertisingConsciouslyEnded],
    onExtendAndRepublish: fn(),
    onEditAdvertisement: fn(),
  },
}

export const NeinzerujePoOdmitnuti: Story = {
  name: 'Neinzeruje po odmítnutí',
  args: {
    advertisements: [notAdvertisingAfterDecline],
    onRepublishAdvertisement: fn(),
    onEditAdvertisement: fn(),
  },
}

function InteractiveDeclineCard(args: ComponentProps<typeof JobCardSimplify23>) {
  const [advertisements, setAdvertisements] = useState<JobAdvertisement[]>([advertisingExpired])

  return (
    <JobCardSimplify23
      {...args}
      advertisements={advertisements}
      onDeclineAdvertising={() => {
        setAdvertisements([
          {
            ...advertisingExpired,
            status: 'notAdvertising',
            advertisingDeclinedAt: daysFromNow(-3),
          },
        ])
      }}
      onExtendAndRepublish={fn()}
      onRepublishAdvertisement={fn()}
      onEditAdvertisement={fn()}
    />
  )
}

export const InzerceVyprsela_Interaktivni: Story = {
  name: 'Inzerce vypršela / Interaktivní decline',
  render: (args) => <InteractiveDeclineCard {...args} />,
}

export const ZatimNeinzerovano: Story = {
  name: 'Zatím neinzerováno',
  args: {
    advertisements: [],
  },
}

export const PetPortalu_VsechnyBezi: Story = {
  name: '5 portálů / Všechny běží',
  args: {
    advertisements: [fivePortalsAllRunning],
    onExtendAndRepublish: fn(),
  },
}

export const PetPortalu_CastBezi: Story = {
  name: '5 portálů / Část běží',
  args: {
    advertisements: [fivePortalsPartiallyRunning],
    onExtendAndRepublish: fn(),
  },
}

export const PetPortalu_VsechnyUkoncene: Story = {
  name: '5 portálů / Všechny ukončené',
  args: {
    advertisements: [fivePortalsAllEnded],
    onExtendAndRepublish: fn(),
    onDeclineAdvertising: fn(),
    onEditAdvertisement: fn(),
  },
}

export const Stavy_Přehled: Story = {
  name: 'Stavy / Přehled',
  parameters: {
    docs: {
      description: {
        story: 'Všechny požadované stavy inzerce na jedné stránce pro rychlé srovnání.',
      },
    },
  },
  render: () => (
    <div className="tm-flex tm-flex-col tm-gap-8">
      {(
        [
          ['Zatím neinzerováno', null],
          ['Běží — stejné období', runningSamePeriod],
          ['Běží — různá období', runningMixedPeriods],
          ['Brzy končí — všechny stejně brzy', endingSoonAllSameDate],
          ['Brzy končí — jen jeden portál', endingSoonOnePortal],
          ['Běží částečně', partialRunning],
          ['Inzerce vypršela', advertisingExpired],
          ['Inzerce ukončena', advertisingConsciouslyEnded],
          ['Neinzeruje po odmítnutí', notAdvertisingAfterDecline],
          ['5 portálů — všechny běží', fivePortalsAllRunning],
          ['5 portálů — část běží', fivePortalsPartiallyRunning],
          ['5 portálů — všechny ukončené', fivePortalsAllEnded],
        ] as const
      ).map(([label, advertisement]) => (
        <section
          key={advertisement?.id ?? 'never-advertised'}
          className="tm-flex tm-flex-col tm-gap-2"
        >
          <h2 className="tm-m-0 tm-text-base tm-font-semibold tm-text-primary-default">{label}</h2>
          <JobCardSimplify23
            {...cardArgs}
            advertisements={advertisement ? [advertisement] : []}
            onExtendAndRepublish={fn()}
            onDeclineAdvertising={fn()}
            onRepublishAdvertisement={fn()}
            onEditAdvertisement={fn()}
          />
        </section>
      ))}
    </div>
  ),
}
