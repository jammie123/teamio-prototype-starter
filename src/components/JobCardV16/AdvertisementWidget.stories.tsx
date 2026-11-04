import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  endedSame,
  endingSoonSame,
  mixedEndedPortal,
  notPublished,
  runningDifferent,
  runningSame,
  withHighlights,
} from '../JobCardV14/fixtures'
import { AdvertisementWidget } from './AdvertisementWidget'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV16/AdvertisementWidget',
  component: AdvertisementWidget,
  args: {
    advertisement: runningSame,
    onProlong: fn(),
    onViewStatisticsClick: fn(),
    onAdvertisementDetailClick: fn(),
    onAdvertisementPreviewClick: fn(),
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

export const ActionStates: Story = {
  name: 'Inzerát brzy končí / běží dál',
  render: (args) => (
    <div className="tm-flex tm-flex-col">
      <h2 className="tm-mb-0 tm-text-sm tm-font-medium tm-text-secondary-default">
        Inzerát brzy končí
      </h2>
      <AdvertisementWidget {...args} advertisement={endingSoonSame} />
      <h2 className="tm-mb-0 tm-text-sm tm-font-medium tm-text-secondary-default">
        Inzerát běží dál
      </h2>
      <AdvertisementWidget {...args} advertisement={runningSame} />
    </div>
  ),
}
