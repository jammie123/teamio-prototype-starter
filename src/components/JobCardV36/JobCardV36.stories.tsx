import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardV36 } from './JobCardV36'
import {
  allPortals,
  endedRecently,
  endedSame,
  endingSoonSame,
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
  title: 'Jobs/Job Cards Variant/JobCardV36',
  component: JobCardV36,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    status: 'published',
    candidates: { new: 5, unassessed: 14, inProgress: 6, opalcovani: 3, total: 52 },
    onCandidatesClick: fn(),
    onCreateAdvertisement: fn(),
    advertisements: [runningSame],
    note: recruitmentNote,
    onExpandNote: fn(),
    onViewStatisticsClick: fn(),
    onAdvertisementDetailClick: fn(),
    onAdvertisementPreviewClick: fn(),
    ...menuHandlers,
  },
  decorators: [
    (Story) => (
      <div className="tm-max-w-[64rem] tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobCardV36>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: '1 · Běžící, jedno období',
  args: { advertisements: [runningSame] },
}

export const RunningDifferentPeriods: Story = {
  name: '2 · Běžící, každý portál jinak',
  args: { advertisements: [runningDifferent] },
}

export const RunningWithEndedPortal: Story = {
  name: '3 · Běžící, některé portály už skončily',
  args: { advertisements: [mixedEndedPortal] },
}

export const EndingSoon: Story = {
  name: '4 · Brzy končí',
  args: { advertisements: [endingSoonSame] },
}

export const EndedRecently: Story = {
  name: '5 · Ukončený: skončilo nedávno (1–7 dní)',
  args: { advertisements: [endedRecently] },
}

export const Ended: Story = {
  name: '6 · Ukončený: skončilo před více než týdnem',
  args: { advertisements: [endedSame] },
}

export const EndedManually: Story = {
  name: '7 · Ukončený: ukončené vystavování (ručně)',
  args: { status: 'unpublished', advertisements: [runningSame] },
}

export const Archived: Story = {
  name: '8 · Archivní',
  args: { status: 'archived', advertisements: [runningSame] },
}

export const Draft: Story = {
  name: '9 · Draft',
  args: {
    status: 'draft',
    candidates: undefined,
    advertisements: [],
    note: undefined,
    lastChanged: '3. 11. 2026',
    onContinueDraft: fn(),
  },
}

export const NotPublished: Story = {
  name: '10 · Zatím nevystavený inzerát',
  args: { advertisements: [notPublished] },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-8">
      {(
        [
          ['1 · Běžící, jedno období', { advertisements: [runningSame] }],
          ['2 · Běžící, každý portál jinak', { advertisements: [runningDifferent] }],
          ['3 · Běžící, některé portály už skončily', { advertisements: [mixedEndedPortal] }],
          ['4 · Brzy končí', { advertisements: [endingSoonSame] }],
          ['5 · Ukončený: skončilo nedávno (1–7 dní)', { advertisements: [endedRecently] }],
          ['6 · Ukončený: skončilo před více než týdnem', { advertisements: [endedSame] }],
          [
            '7 · Ukončený: ukončené vystavování (ručně)',
            { status: 'unpublished', advertisements: [runningSame] },
          ],
          ['8 · Archivní', { status: 'archived', advertisements: [runningSame] }],
          [
            '9 · Draft',
            {
              status: 'draft',
              candidates: undefined,
              advertisements: [],
              note: undefined,
              lastChanged: '3. 11. 2026',
              onContinueDraft: fn(),
            },
          ],
          ['10 · Zatím nevystavený inzerát', { advertisements: [notPublished] }],
        ] as const
      ).map(([label, overrides]) => (
        <section key={label} className="tm-flex tm-flex-col tm-gap-2">
          <h2 className="tm-m-0 tm-text-xs tm-font-medium tm-tracking-wide tm-text-secondary-default">
            {label}
          </h2>
          <JobCardV36 {...args} {...(overrides as Partial<typeof args>)} />
        </section>
      ))}
    </div>
  ),
}

export const WithHighlights: Story = {
  name: 'Jobstip a Topováno',
  args: { advertisements: [withHighlights] },
}

export const AllPortals: Story = {
  name: 'Všechny portály',
  args: { advertisements: [allPortals] },
}

export const MultipleAdvertisements: Story = {
  name: 'Více inzerátů, sbalené',
  args: {
    advertisements: [runningSame, endingSoonSame, endedSame],
    onAdditionalAdvertisementsClick: fn(),
  },
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

export const WithoutNote: Story = {
  name: 'Bez poznámky',
  args: { note: undefined },
}
