import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { CandidateTags } from './CandidateTags'
import type { CandidateTagData } from './types'

const meta = {
  title: 'Candidate/Candidate primitives/CandidateTags',
  component: CandidateTags,
  args: {
    tags: [
      { id: 'inbox', label: 'inbox' },
      { id: 'senior', label: 'senior' },
    ],
    onAdd: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof CandidateTags>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { tags: [] },
}

export const ReadOnly: Story = {
  args: { onAdd: undefined, onRemove: undefined },
}

function InteractiveTags({ initial }: { initial: CandidateTagData[] }) {
  const [tags, setTags] = useState(initial)
  return (
    <CandidateTags
      tags={tags}
      onAdd={() =>
        setTags((current) => [
          ...current,
          { id: `tag-${current.length + 1}`, label: `štítek ${current.length + 1}` },
        ])
      }
      onRemove={(tag) => setTags((current) => current.filter((item) => item.id !== tag.id))}
    />
  )
}

export const Interactive: Story = {
  render: (args) => <InteractiveTags initial={args.tags ?? []} />,
}
