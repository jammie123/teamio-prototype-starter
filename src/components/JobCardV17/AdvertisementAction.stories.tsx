import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AdvertisementAction } from './AdvertisementAction'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV17/AdvertisementAction',
  component: AdvertisementAction,
  args: {
    viewCount: 2610,
    onStatistics: fn(),
    onDetail: fn(),
    onProlong: fn(),
    onPreview: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-inline-flex tm-overflow-hidden tm-rounded-xl tm-border tm-border-solid tm-border-secondary tm-bg-cover-light">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementAction>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: 'Běží (statistiky, Detail, Náhled)',
  args: { showProlong: false },
}

export const EndingSoon: Story = {
  name: 'Brzy končí (s Prodloužit)',
  args: { showProlong: true },
}

export const WithoutStatistics: Story = {
  name: 'Bez statistik',
  args: { viewCount: undefined, showProlong: false },
}

export const InlineStatsAndDetail: Story = {
  name: 'Inline (statistiky + Detail)',
  args: { layout: 'inline', showProlong: false },
}

export const ColumnStatsAndDetail: Story = {
  name: 'Column (statistiky nad Detailem o inzerci)',
  args: { layout: 'column', showProlong: false },
}

export const ColumnWithProlong: Story = {
  name: 'Column (s Prodloužit)',
  args: { layout: 'column', showProlong: true },
}
