import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobPublication } from './types'

const jobsCz: JobPublication = {
  id: 'jobs',
  channel: 'Jobs.cz',
  startDate: '1. 9. 2026',
  endDate: '30. 9. 2026',
  viewCount: 1840,
  reactionCount: 34,
}

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV20/PublicationItem',
  component: PublicationItem,
  args: {
    publication: jobsCz,
    status: 'active',
    onViewAdvertisement: fn(),
    onProlong: fn(),
    onHighlight: fn(),
    onRepublish: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-min-h-64 tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PublicationItem>

export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  name: 'Běží',
}

export const RunningWithDate: Story = {
  name: 'Běží s datem do',
  args: { dateLabel: 'do 30. 9.' },
}

export const Ended: Story = {
  name: 'Ukončený',
  args: {
    status: 'expired',
    dateLabel: 'ukončeno 15. 8.',
    publication: { ...jobsCz, startDate: '1. 8. 2026', endDate: '15. 8. 2026' },
  },
}

export const EndingSoon: Story = {
  name: 'Brzy končí',
  args: { status: 'endingSoon', dateLabel: 'do 30. 9.', showProlong: true },
}

export const WithoutDot: Story = {
  name: 'Bez tečky stavu',
  args: { showStatusDot: false },
}

export const Overview: Story = {
  name: 'Přehled stavů',
  render: (args) => (
    <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-2">
      <PublicationItem {...args} status="active" dateLabel="do 30. 9." />
      <PublicationItem {...args} status="endingSoon" dateLabel="do 30. 9." showProlong />
      <PublicationItem {...args} status="expired" dateLabel="ukončeno 15. 8." />
      <PublicationHighlights
        publication={jobsCz}
        highlights={[
          {
            id: 'jobstip',
            name: 'Jobstip',
            startDate: '8. 6.',
            endDate: '30. 9. 2026',
            viewCount: 699,
            reactionCount: 13,
          },
        ]}
        onViewAdvertisement={args.onViewAdvertisement}
        onProlong={args.onProlong}
        onHighlight={args.onHighlight}
      />
    </div>
  ),
}
