import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AdvertisementStats } from './AdvertisementStats'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV21/AdvertisementStats',
  component: AdvertisementStats,
  args: {
    viewCount: 2610,
    onStatistics: fn(),
    onDetail: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-w-[300px] tm-bg-cover-light tm-p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementStats>

export default meta
type Story = StoryObj<typeof meta>

export const WithViews: Story = {
  name: 'Zhlédnutí a Přehled',
}

export const WithoutViews: Story = {
  name: 'Jen Přehled',
  args: { viewCount: undefined },
}
