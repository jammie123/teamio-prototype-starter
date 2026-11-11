import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobCardV21 } from './JobCardV21'
import {
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
  title: 'Jobs/Job Cards Variant/JobCardV21',
  component: JobCardV21,
  args: {
    title: 'Řidič/ka sk. C ČB PO–PÁ',
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    status: 'published',
    candidates: { new: 5, newOpalcovani: 3, unassessed: 14, inProgress: 6, total: 52 },
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
} satisfies Meta<typeof JobCardV21>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: '1 · Běží, jedno období',
  args: { advertisements: [runningSame] },
}

export const RunningDifferentPeriods: Story = {
  name: '2 · Běží, každý portál jinak',
  args: { advertisements: [runningDifferent] },
}

export const RunningWithEndedPortal: Story = {
  name: '3 · Běží, některé portály už skončily',
  args: { advertisements: [mixedEndedPortal] },
}

export const Ended: Story = {
  name: '4 · Ukončená',
  args: { advertisements: [endedSame] },
}

export const EndingSoon: Story = {
  name: '5 · Brzy končí',
  args: { advertisements: [endingSoonSame] },
}

export const NotPublished: Story = {
  name: '6 · Zatím nevystavený inzerát',
  args: { advertisements: [notPublished] },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-8">
      {(
        [
          ['1 · Běží, jedno období', runningSame],
          ['2 · Běží, každý portál jinak', runningDifferent],
          ['3 · Běží, některé portály už skončily', mixedEndedPortal],
          ['4 · Ukončená', endedSame],
          ['5 · Brzy končí', endingSoonSame],
          ['6 · Zatím nevystavený inzerát', notPublished],
        ] as const
      ).map(([label, advertisement]) => (
        <section key={advertisement.id} className="tm-flex tm-flex-col tm-gap-2">
          <h2 className="tm-m-0 tm-text-xs tm-font-medium tm-tracking-wide tm-text-secondary-default">
            {label}
          </h2>
          <JobCardV21 {...args} advertisements={[advertisement]} />
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

export const MultipleAdvertisements: Story = {
  name: 'Více inzerátů',
  args: { advertisements: [runningSame, mixedEndedPortal, endedSame] },
}

export const AdditionalAdvertisements: Story = {
  name: 'Zobrazit další inzeráty',
  args: {
    advertisements: [runningSame, mixedEndedPortal, endedSame],
    showAdditionalAdvertisementsLink: true,
    onAdditionalAdvertisementsClick: fn(),
  },
}

export const NoAdvertisement: Story = {
  name: 'Nábor bez inzerátu',
  args: { advertisements: [], onCreateAdvertisement: fn() },
}

export const Unpublished: Story = {
  name: 'Nezveřejněný nábor',
  args: { status: 'unpublished', advertisements: [runningSame] },
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

export const WithHeadingLabel: Story = {
  name: 'Se stavovým labelem inzerátu',
  args: { showAdvertisementHeadingLabel: true },
}

export const PresentationUnit: Story = {
  name: 'Prezentační jednotka',
  args: { department: 'České Budějovice' },
}
