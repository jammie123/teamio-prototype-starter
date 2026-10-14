import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { FilterModal, EMPTY_CANDIDATE_FILTER_VALUE } from './FilterModal'
import type { CandidateFilterModalValue, FilterModalProps } from './filterModalTypes'

const filledValue: CandidateFilterModalValue = {
  status: 'filter-STATUS/40',
  opinion: 'filter-OPINION/SUITABLE',
  source: 'filter-SOURCE/linkedin',
  rating: 'filter-RATING/4',
  candidateTag: 'filter-CANDIDATE_TAG/senior',
}

function InteractiveFilterModal({
  value: initialValue,
  onApply,
  open: initialOpen,
  onOpenChange,
}: FilterModalProps) {
  const [open, setOpen] = useState(initialOpen ?? false)
  const [value, setValue] = useState(initialValue)

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Otevřít filtry
      </Button>
      <FilterModal
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
  title: 'Candidate/FilterModal',
  component: FilterModal,
  args: {
    open: true,
    value: EMPTY_CANDIDATE_FILTER_VALUE,
    onApply: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof FilterModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Filtry uchazečů')
    await expect(within(dialog).getByText('Stav uchazeče')).toHaveClass('tm-font-medium')
    await expect(within(dialog).getByRole('button', { name: 'Stav uchazeče' })).toBeInTheDocument()
  },
}

export const Filled: Story = {
  args: { value: filledValue },
}

export const Interactive: Story = {
  args: { open: false },
  render: (args) => <InteractiveFilterModal {...args} />,
}
