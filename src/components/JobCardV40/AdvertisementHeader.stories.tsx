import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdvertisementHeader } from './AdvertisementHeader'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV40/AdvertisementHeader',
  component: AdvertisementHeader,
  args: {
    tone: 'success',
    label: undefined,
    dateInfo: '1. 9. – 30. 9. 2026',
  },
  decorators: [
    (Story) => (
      <div className="tm-w-[450px] tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: 'Běží (bez labelu, jen datum)',
}

export const EndingSoon: Story = {
  name: 'Brzy končí',
  args: {
    tone: 'warning',
    label: 'Končí za 3 dny',
    dateInfo: '1. 9. – 30. 9. 2026',
    highlighted: true,
  },
}

export const ExpiredRecently: Story = {
  name: 'Expirováno do 8 dní (zvýrazněno)',
  args: {
    tone: 'warning',
    label: 'Expirováno před 5 dny',
    dateInfo: '1. 8. – 15. 8. 2026',
    highlighted: true,
  },
}

export const ExpiredWithin30Days: Story = {
  name: 'Expirováno před 9–30 dny (bez pozadí)',
  args: { tone: 'warning', label: 'Expirováno před 12 dny', dateInfo: '1. 8. – 15. 8. 2026' },
}

export const Expired: Story = {
  name: 'Expirováno více než 30 dní',
  args: { tone: 'ended', label: 'Expirováno', dateInfo: '1. 6. – 15. 6. 2026' },
}

export const EndedManually: Story = {
  name: 'Ukončené vystavování',
  args: { tone: 'ended', label: 'Ukončené vystavování', dateInfo: '1. 8. – 15. 8. 2026' },
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
      <AdvertisementHeader
        highlighted
        tone="warning"
        label="Končí za 3 dny"
        dateInfo="1. 9. – 30. 9. 2026"
      />
      <AdvertisementHeader
        highlighted
        tone="warning"
        label="Expirováno před 5 dny"
        dateInfo="1. 8. – 15. 8. 2026"
      />
      <AdvertisementHeader
        tone="warning"
        label="Expirováno před 12 dny"
        dateInfo="1. 8. – 15. 8. 2026"
      />
      <AdvertisementHeader tone="ended" label="Expirováno" dateInfo="1. 6. – 15. 6. 2026" />
      <AdvertisementHeader
        tone="ended"
        label="Ukončené vystavování"
        dateInfo="1. 8. – 15. 8. 2026"
      />
      <AdvertisementHeader tone="neutral" label="Zatím nevystavený inzerát" />
    </div>
  ),
}
