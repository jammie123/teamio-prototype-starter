import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { expect, fn, within } from 'storybook/test'
import { JobsFilterV2 } from '../JobsFilterV2'
import type { JobsFilterOption, JobsFilterValue } from '../JobsFilterV2/types'
import { EmptyJobSearch } from './EmptyJobSearch'

const recruiters: JobsFilterOption[] = [
  { value: 'martina', label: 'Martina Nováková' },
  { value: 'petra', label: 'Petra Svobodová' },
]

const managers: JobsFilterOption[] = [{ value: 'karel', label: 'Karel Horák' }]

const departments: JobsFilterOption[] = [{ value: 'centrala', label: 'Centrála' }]

const sortOptions: JobsFilterOption[] = [
  { value: 'latestAd', label: 'Nejnovější inzeráty' },
]

const emptyValue: JobsFilterValue = {
  query: '',
  recruiterId: '',
  managerId: '',
  departmentId: '',
  employmentType: '',
  advertisementStatus: '',
}

function FilterContext({
  value,
  children,
}: {
  value: JobsFilterValue
  children: ReactNode
}) {
  return (
    <div className="tm-flex tm-flex-col tm-gap-4">
      <JobsFilterV2
        value={value}
        onChange={fn()}
        recruiters={recruiters}
        managers={managers}
        departments={departments}
        sortValue="latestAd"
        sortOptions={sortOptions}
        onSortChange={fn()}
      />
      {children}
    </div>
  )
}

const meta = {
  title: 'Jobs/EmptyJobSearch',
  component: EmptyJobSearch,
  args: {
    onResetFilters: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyJobSearch>

export default meta
type Story = StoryObj<typeof meta>

async function expectEmptyCopy(canvasElement: HTMLElement, description: string) {
  const canvas = within(canvasElement)
  const empty = within(canvas.getByTestId('empty-job-search'))
  await expect(empty.getByRole('heading', { name: 'Nic jsme nenašli' })).toBeVisible()
  await expect(empty.getByText(description)).toBeVisible()
  await expect(empty.getByRole('button', { name: 'Resetovat filtry' })).toBeVisible()
}

export const Fulltext: Story = {
  name: 'Fulltext',
  args: {
    query: 'sdvsd',
  },
  render: (args) => (
    <FilterContext value={{ ...emptyValue, query: 'sdvsd' }}>
      <EmptyJobSearch {...args} />
    </FilterContext>
  ),
  play: async ({ canvasElement }) => {
    await expectEmptyCopy(
      canvasElement,
      'Pro „sdvsd“ nemáme žádný nábor. Zkontrolujte překlepy nebo zkuste obecnější hledání.',
    )
  },
}

export const FulltextAndFilters: Story = {
  name: 'Fulltext a filtry',
  args: {
    query: 'sdvsd',
    hasFilters: true,
  },
  render: (args) => (
    <FilterContext value={{ ...emptyValue, query: 'sdvsd', recruiterId: 'martina' }}>
      <EmptyJobSearch {...args} />
    </FilterContext>
  ),
  play: async ({ canvasElement }) => {
    await expectEmptyCopy(
      canvasElement,
      'Pro vybrané filtry nemáme žádný nábor. Zkuste některý filtr zrušit nebo nastavit šířeji.',
    )
  },
}

export const FiltersOnly: Story = {
  name: 'Jen filtry',
  args: {
    hasFilters: true,
  },
  render: (args) => (
    <FilterContext value={{ ...emptyValue, recruiterId: 'martina' }}>
      <EmptyJobSearch {...args} />
    </FilterContext>
  ),
  play: async ({ canvasElement }) => {
    await expectEmptyCopy(
      canvasElement,
      'Pro vybrané filtry nemáme žádný nábor. Zkuste některý filtr zrušit nebo nastavit šířeji.',
    )
  },
}
