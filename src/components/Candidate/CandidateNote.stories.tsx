import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CandidateNote } from './CandidateNote'

const meta = {
  title: 'Candidate/Candidate primitives/CandidateNote',
  component: CandidateNote,
  args: {
    note: {
      author: 'Fuxa J.',
      text: 'Změna nástupu: dlouhý text poznámky se ořízne na dva řádky a celý je vidět po rozbalení.',
      addedAt: '3 roky',
    },
    onAdd: fn(),
    onExpand: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-w-[20rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CandidateNote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Short: Story = {
  args: { note: { text: 'Dnehh', addedAt: '2 roky' } },
}

export const Empty: Story = {
  args: { note: undefined },
}
