import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AdvertisementWidget } from './AdvertisementWidget'
import {
  allPortals,
  endedSame,
  endingSoonSame,
  expiredLongAgoSame,
  expiredRecentlySame,
  mixedEndedPortal,
  notPublished,
  runningDifferent,
  runningSame,
  withHighlights,
} from './fixtures'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV40/AdvertisementWidget',
  component: AdvertisementWidget,
  args: {
    advertisement: runningSame,
    onExtendAndRepublish: fn(),
    onAdvertisementPreviewClick: fn(),
    onHighlightAdvertisement: fn(),
    onCreateAdvertisement: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-w-[450px] tm-bg-cover-light tm-px-4 tm-py-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: 'Běží, jedno období',
}

export const RunningDifferentPeriods: Story = {
  name: 'Běží, každý portál jinak',
  args: { advertisement: runningDifferent },
}

export const RunningWithEndedPortal: Story = {
  name: 'Běží, některé portály už skončily',
  args: { advertisement: mixedEndedPortal },
}

export const EndingSoon: Story = {
  name: 'Brzy končí',
  args: { advertisement: endingSoonSame },
}

export const ExpiredRecently: Story = {
  name: 'Expirováno do 30 dní',
  args: { advertisement: expiredRecentlySame },
}

export const ExpiredLongAgo: Story = {
  name: 'Expirováno více než 30 dní',
  args: { advertisement: expiredLongAgoSame },
}

export const Ended: Story = {
  name: 'Expirováno (fixní data)',
  args: { advertisement: endedSame },
}

export const EndedManually: Story = {
  name: 'Ukončené vystavování',
  args: { advertisement: runningSame, endedBy: 'manual' },
}

export const NotPublished: Story = {
  name: 'Zatím nevystavený',
  args: { advertisement: notPublished },
}

export const AllPortals: Story = {
  name: 'Všechny portály (sbalené po 5)',
  args: { advertisement: allPortals },
}

export const WithHighlights: Story = {
  name: 'Jobstip a Topováno',
  args: { advertisement: withHighlights },
}

export const WithTitle: Story = {
  name: 'S názvem inzerátu',
  args: { advertisement: { ...runningSame, title: 'Řidič/ka sk. C – hlavní inzerát' }, showTitle: true },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-col tm-gap-4">
      {[
        runningSame,
        runningDifferent,
        mixedEndedPortal,
        endingSoonSame,
        expiredRecentlySame,
        expiredLongAgoSame,
        notPublished,
      ].map((advertisement) => (
        <AdvertisementWidget key={advertisement.id} {...args} advertisement={advertisement} />
      ))}
    </div>
  ),
}
