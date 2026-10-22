import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import type { CandidateFilterV2Value, FilterModalV2Props } from '../Candidate/filterModalTypes'
import { EMPTY_CANDIDATE_FILTER_V2_VALUE } from '../Candidate/filterModalOptions'
import { FilterModalV2 } from './FilterModalV2'

const filledValue: CandidateFilterV2Value = {
  status: 'filter-STATUS/40',
  opinion: 'filter-OPINION/SUITABLE',
  source: 'filter-SOURCE/linkedin',
  rating: 'filter-RATING/4',
  candidateTag: ['filter-CANDIDATE_TAG/senior', 'filter-CANDIDATE_TAG/vip'],
}

function InteractiveFilterModalV2({
  value: initialValue,
  onApply,
  open: initialOpen,
  onOpenChange,
}: FilterModalV2Props) {
  const [open, setOpen] = useState(initialOpen ?? false)
  const [value, setValue] = useState(initialValue)

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Otevřít filtry v2
      </Button>
      <FilterModalV2
        open={open}
        value={value}
        onApply={(next) => {
          setValue(next)
          onApply(next)
        }}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange(next)
        }}
      />
    </>
  )
}

const meta = {
  title: 'Candidate/FilterModalV2',
  component: FilterModalV2,
  args: {
    open: true,
    value: EMPTY_CANDIDATE_FILTER_V2_VALUE,
    onApply: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof FilterModalV2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Filtry uchazečů')
    await expect(within(dialog).getByRole('heading', { level: 2, name: 'Stav uchazeče' })).toBeInTheDocument()
    await expect(
      within(dialog).getByRole('button', { name: 'Sbalit Stav uchazeče' }),
    ).toHaveAttribute('aria-expanded', 'true')
  },
}

export const Filled: Story = {
  args: { value: filledValue },
}

export const Interactive: Story = {
  args: { open: false },
  render: (args) => <InteractiveFilterModalV2 {...args} />,
}
