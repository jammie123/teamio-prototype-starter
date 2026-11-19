import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AdvertisementStats } from './AdvertisementStats'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV33/AdvertisementStats',
  component: AdvertisementStats,
  args: {
    viewCount: 2610,
    onStatistics: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-flex tm-items-center tm-gap-3 tm-bg-cover-light tm-p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementStats>

export default meta
type Story = StoryObj<typeof meta>

export const WithViews: Story = {
  name: 'Zhlédnutí',
}
