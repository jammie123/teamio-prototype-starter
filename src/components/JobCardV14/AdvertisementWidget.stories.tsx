import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AdvertisementWidget } from './AdvertisementWidget'
import {
  endedSame,
  endingSoonSame,
  mixedEndedPortal,
  notPublished,
  runningDifferent,
  runningSame,
  withHighlights,
} from './fixtures'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV14/AdvertisementWidget',
  component: AdvertisementWidget,
  args: {
    advertisement: runningSame,
    onProlong: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-max-w-[56rem] tm-bg-cover-light tm-px-6">
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
  name: 'Brzy končí (Prodloužit)',
  args: { advertisement: endingSoonSame },
}

export const Ended: Story = {
  name: 'Ukončený',
  args: { advertisement: endedSame },
}

export const NotPublished: Story = {
  name: 'Zatím nevystavený',
  args: { advertisement: notPublished },
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
    <div className="tm-flex tm-flex-col">
      {[runningSame, runningDifferent, mixedEndedPortal, endingSoonSame, endedSame, notPublished].map(
        (advertisement) => (
          <AdvertisementWidget key={advertisement.id} {...args} advertisement={advertisement} />
        ),
      )}
    </div>
  ),
}
