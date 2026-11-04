import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobNote } from './JobNote'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV13/JobNote',
  component: JobNote,
  args: {
    note: {
      author: 'Petra Nováková',
      text: 'Čekáme na schválení rozpočtu, start až od října',
      addedAt: '12. 9. 2026',
    },
  },
  decorators: [
    (Story) => (
      <div className="tm-max-w-[48rem] tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobNote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Poznámka',
}

export const Clickable: Story = {
  name: 'Klikací (rozbalit)',
  args: { onExpand: fn() },
}

export const WithoutDate: Story = {
  name: 'Bez data',
  args: {
    note: {
      author: 'Petra Nováková',
      text: 'Čekáme na schválení rozpočtu, start až od října',
      addedAt: '12. 9. 2026',
      showDate: false,
    },
  },
}

export const LongText: Story = {
  name: 'Dlouhý text (zkrácení)',
  args: {
    note: {
      author: 'Petra Nováková',
      text: 'Čekáme na schválení rozpočtu od finančního oddělení, start až od října, mezitím pokračujeme s pohovory s předvybranými kandidáty a doplňujeme požadavky na pozici o jazykové znalosti.',
      addedAt: '12. 9. 2026',
    },
  },
}
