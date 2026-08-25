import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, within } from 'storybook/test'
import { JobsFilter } from './JobsFilter'
import type { JobsFilterOption, JobsFilterProps, JobsFilterValue } from './types'

const recruiters: JobsFilterOption[] = [
  { value: 'martina', label: 'Martina Nováková' },
  { value: 'petra', label: 'Petra Svobodová' },
  { value: 'jan', label: 'Jan Dvořák' },
  { value: 'eva', label: 'Eva Králová' },
  { value: 'tomas', label: 'Tomáš Novotný' },
]

const managers: JobsFilterOption[] = [
  { value: 'karel', label: 'Karel Horák' },
  { value: 'lucie', label: 'Lucie Černá' },
  { value: 'martin', label: 'Martin Veselý' },
  { value: 'alena', label: 'Alena Pokorná' },
  { value: 'pavel', label: 'Pavel Němec' },
]

const departments: JobsFilterOption[] = [
  { value: 'centrala', label: 'Centrála' },
  { value: 'provoz', label: 'Provoz' },
]

const emptyValue: JobsFilterValue = {
  query: '',
  recruiterId: '',
  managerId: '',
  departmentId: '',
  employmentType: '',
  advertisementStatus: '',
}

const filledValue: JobsFilterValue = {
  query: 'Řidič',
  recruiterId: 'martina',
  managerId: 'karel',
  departmentId: 'centrala',
  employmentType: 'fullTime',
  advertisementStatus: 'active',
}

const sortOptions: JobsFilterOption[] = [
  { value: 'latestAd', label: 'Nejnověji vystavený inzerát' },
  { value: 'newestJob', label: 'Nejnovější nábor' },
  { value: 'endingSoon', label: 'Nejdřív končí inzerát' },
  { value: 'mostCandidates', label: 'Nejvíc uchazečů' },
  { value: 'titleAz', label: 'Název A–Z' },
]

function InteractiveJobsFilter({
  value: initialValue,
  onChange,
  moreFiltersOpen: initialOpen,
  defaultMoreFiltersOpen,
  onMoreFiltersOpenChange,
  sortValue: initialSort,
  onSortChange,
  ...rest
}: JobsFilterProps) {
  const [value, setValue] = useState(initialValue)
  const [sortValue, setSortValue] = useState(initialSort ?? 'latestAd')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(
    initialOpen ?? defaultMoreFiltersOpen ?? false,
  )

  return (
    <JobsFilter
      {...rest}
      value={value}
      sortValue={sortValue}
      moreFiltersOpen={moreFiltersOpen}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
      onSortChange={(next) => {
        setSortValue(next)
        onSortChange?.(next)
      }}
      onMoreFiltersOpenChange={(open) => {
        setMoreFiltersOpen(open)
        onMoreFiltersOpenChange?.(open)
      }}
    />
  )
}

const meta = {
  title: 'Jobs/JobsFilter',
  component: JobsFilter,
  args: {
    value: emptyValue,
    onChange: fn(),
    recruiters,
    managers,
    departments,
    sortValue: 'latestAd',
    sortOptions,
    onSortChange: fn(),
    onMoreFiltersOpenChange: fn(),
  },
  render: (args) => <InteractiveJobsFilter {...args} />,
  decorators: [
    (Story) => (
      <div className="tm-max-w-[64rem] tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobsFilter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Zobrazit více filtrů' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Liniový manažer' })).not.toBeInTheDocument()
  },
}

export const MoreFiltersOpen: Story = {
  args: { moreFiltersOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Zobrazit méně filtrů' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Liniový manažer' })).toBeVisible()
  },
}

export const Filled: Story = {
  args: {
    moreFiltersOpen: true,
    value: filledValue,
  },
}
