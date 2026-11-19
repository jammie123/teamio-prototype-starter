import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdvertisementHeader } from './AdvertisementHeader'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV35/AdvertisementHeader',
  component: AdvertisementHeader,
  args: {
    tone: 'success',
    dateInfo: '1. 9. – 30. 9. 2026',
  },
  decorators: [
    (Story) => (
      <div className="tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: 'Běží od–do',
}

export const RunningWithEndedPortal: Story = {
  name: 'Běží do (společný konec, různý začátek)',
  args: { label: 'Běžící', dateInfo: '30. 9.' },
}

export const EndingSoon: Story = {
  name: 'Brzy končí od–do',
  args: { tone: 'warning', label: 'Končí za 3 dny', dateInfo: '1. 9. – 30. 9. 2026' },
}

export const Ended: Story = {
  name: 'Ukončeno od–do',
  args: { tone: 'ended', label: 'Ukončeno', dateInfo: '1. 8. – 15. 8. 2026' },
}

export const NotPublished: Story = {
  name: 'Zatím nevystavený inzerát',
  args: { tone: 'neutral', label: 'Zatím nevystavený inzerát', dateInfo: undefined },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: () => (
    <div className="tm-flex tm-flex-col tm-gap-4">
      <AdvertisementHeader tone="success" dateInfo="1. 9. – 30. 9. 2026" />
      <AdvertisementHeader tone="warning" label="Končí za 3 dny" dateInfo="1. 9. – 30. 9. 2026" />
      <AdvertisementHeader tone="ended" label="Ukončeno" dateInfo="1. 8. – 15. 8. 2026" />
      <AdvertisementHeader tone="neutral" label="Zatím nevystavený inzerát" />
    </div>
  ),
}
