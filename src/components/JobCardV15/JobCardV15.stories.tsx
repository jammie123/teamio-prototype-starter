import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  endedSame,
  endingSoonSame,
  mixedEndedPortal,
  notPublished,
  recruitmentNote,
  runningDifferent,
  runningSame,
  withHighlights,
} from '../JobCardV14/fixtures'
import { JobCardV15 } from './JobCardV15'

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
  title: 'Jobs/Job Cards Variant/JobCardV15',
  component: JobCardV15,
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
} satisfies Meta<typeof JobCardV15>

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
          <JobCardV15 {...args} advertisements={[advertisement]} />
        </section>
      ))}
    </div>
  ),
}

export const WithHighlights: Story = {
  name: 'Jobstip a Topováno',
  args: { advertisements: [withHighlights] },
}

export const EndingSoonWithActions: Story = {
  name: 'Stats row s Prodloužit',
  args: { advertisements: [endingSoonSame], note: undefined },
}
