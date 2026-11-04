import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ActionWidget } from './ActionWidget'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV15/ActionWidget',
  component: ActionWidget,
  args: {
    viewCount: 2610,
    onPreview: fn(),
    onDetail: fn(),
    onProlong: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-inline-flex tm-overflow-hidden tm-rounded-xl tm-border tm-border-solid tm-border-secondary tm-bg-cover-light">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: 'Běží (bez Prodloužit)',
  args: { showProlong: false },
}

export const EndingSoon: Story = {
  name: 'Brzy končí (s Prodloužit)',
  args: { showProlong: true },
}
