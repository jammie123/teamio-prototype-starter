import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { DraftWidget } from './DraftWidget'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV30/DraftWidget',
  component: DraftWidget,
  args: {
    lastChanged: '3. 11. 2026',
    onContinue: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DraftWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rozpracovaný',
}

export const WithoutDate: Story = {
  name: 'Bez data poslední změny',
  args: { lastChanged: undefined },
}
