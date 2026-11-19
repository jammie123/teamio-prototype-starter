import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardV40 } from './JobCardV40'
import {
  allPortals,
  endingSoonSame,
  expiredLongAgoSame,
  expiredRecentlySame,
  mixedEndedPortal,
  notPublished,
  recruitmentNote,
  runningDifferent,
  runningSame,
  withHighlights,
} from './fixtures'

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

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV40',
  component: JobCardV40,
  tags: ['!autodocs'],
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    status: 'published',
    candidates: { new: 5, unassessed: 14, inProgress: 6, opalcovani: 3, total: 52 },
    onCandidatesClick: fn(),
    advertisements: [runningSame],
    note: recruitmentNote,
    onExpandNote: fn(),
    onViewStatisticsClick: fn(),
    onAdvertisementDetailClick: fn(),
    onAdvertisementPreviewClick: fn(),
    onCreateAdvertisement: fn(),
    ...menuHandlers,
  },
  decorators: [
    (Story) => (
      <div className="tm-max-w-[64rem] tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobCardV40>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: '1 · Běží, jedno období',
  args: { advertisements: [runningSame] },
}

export const RunningDifferentPeriods: Story = {
  name: '2 · Běží v různých obdobích',
  args: { advertisements: [runningDifferent] },
}

export const RunningWithEndedPortal: Story = {
  name: '3 · Běží, některé portály už skončily',
  args: { advertisements: [mixedEndedPortal] },
}

export const EndingSoon: Story = {
  name: '4 · Brzy končí',
  args: { advertisements: [endingSoonSame] },
}

export const ExpiredRecently: Story = {
  name: '5 · Expirováno nedávno (do 30 dní)',
  args: { advertisements: [expiredRecentlySame] },
}

export const ExpiredLongAgo: Story = {
  name: '6 · Expirováno před více než 30 dny',
  args: { advertisements: [expiredLongAgoSame] },
}

export const EndedManually: Story = {
  name: '7 · Ukončené vystavování (ručně)',
  args: { status: 'unpublished', advertisements: [runningSame] },
}

export const Archived: Story = {
  name: '8 · Archivní',
  args: { status: 'archived', advertisements: [runningSame] },
}

export const NotPublished: Story = {
  name: '9 · Zatím nevystavený inzerát',
  args: { advertisements: [notPublished] },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-8">
      {(
        [
          ['1 · Běží, jedno období', { advertisements: [runningSame] }],
          ['2 · Běží v různých obdobích', { advertisements: [runningDifferent] }],
          ['3 · Běží, některé portály už skončily', { advertisements: [mixedEndedPortal] }],
          ['4 · Brzy končí', { advertisements: [endingSoonSame] }],
          ['5 · Expirováno nedávno (do 30 dní)', { advertisements: [expiredRecentlySame] }],
          ['6 · Expirováno před více než 30 dny', { advertisements: [expiredLongAgoSame] }],
          [
            '7 · Ukončené vystavování (ručně)',
            { status: 'unpublished', advertisements: [runningSame] },
          ],
          ['8 · Archivní', { status: 'archived', advertisements: [runningSame] }],
          ['9 · Zatím nevystavený inzerát', { advertisements: [notPublished] }],
        ] as const
      ).map(([label, overrides]) => (
        <section key={label} className="tm-flex tm-flex-col tm-gap-2">
          <h2 className="tm-m-0 tm-text-xs tm-font-medium tm-tracking-wide tm-text-secondary-default">
            {label}
          </h2>
          <JobCardV40 {...args} {...(overrides as Partial<typeof args>)} />
        </section>
      ))}
    </div>
  ),
}

export const WithHighlights: Story = {
  name: 'Jobstip a Topováno',
  args: { advertisements: [withHighlights] },
}

export const WithoutNote: Story = {
  name: 'Bez poznámky',
  args: { note: undefined },
}

export const NoAdvertisement: Story = {
  name: 'Nábor bez inzerátu',
  args: { advertisements: [], onCreateAdvertisement: fn() },
}

export const Draft: Story = {
  name: 'Rozpracovaný nábor',
  args: {
    title: 'Řidič/ka sk. C ČB turnusový režim PO–NE',
    owner: 'Martina Nováková',
    hiringManagers: ['Lukáš Procházka'],
    status: 'draft',
    lastChanged: '22. 8. 2026',
    onCompleteDraft: fn(),
    candidates: undefined,
    advertisements: [],
    note: undefined,
  },
}

export const AllPortals: Story = {
  name: 'Všechny portály',
  args: { advertisements: [allPortals] },
}

export const HiringManager: Story = {
  name: 'Hiring Manager',
  args: {
    isHiringManager: true,
    candidates: { toAssess: 4, total: 52 },
  },
}

export const PresentationUnit: Story = {
  name: 'Prezentační jednotka',
  args: { department: 'České Budějovice' },
}
