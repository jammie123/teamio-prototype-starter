import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'

const meta = {
  title: 'Jobs/Job Card/Subkomponenty/AdvertisementEmptyState',
  component: AdvertisementEmptyState,
  tags: ['!autodocs'],
  args: {
    onCreateAdvertisement: fn(),
    onAdvertisementPreviewClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-w-[450px] tm-bg-cover-light tm-px-4 tm-py-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Nábor bez inzerátu',
}
