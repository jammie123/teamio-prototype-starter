import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CandidateListPanel } from './CandidateListPanel'
import { CandidateTable } from './CandidateTable'
import { pipelineStatusCounts, sampleCandidates } from './fixtures'
import { PanelWithTable } from './jobsPipelineStoryData'

const meta = {
  title: 'Candidate/CandidateListPanel',
  component: CandidateListPanel,
  args: {
    statusCounts: pipelineStatusCounts,
    statusValue: undefined,
    onStatusChange: fn(),
    searchValue: '',
    onSearchChange: fn(),
    onFiltersClick: fn(),
  },
} satisfies Meta<typeof CandidateListPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="tm-max-w-[1100px]">
      <CandidateListPanel {...args}>
        <CandidateTable candidates={sampleCandidates} />
      </CandidateListPanel>
    </div>
  ),
}

export const WithNewBadgeAndActiveFilters: Story = {
  args: { newCounts: { unassessed: 14 }, activeFiltersCount: 2 },
  render: Default.render,
}

/** The secondary "Přizpůsobit sloupce" button next to "Filtry"; shown only when `onColumnsClick` is set. */
export const WithColumnsButton: Story = {
  args: { onColumnsClick: fn() },
  render: Default.render,
}

/** While candidates are selected, the `BulkAction` bar appears above the search and filter toolbar. */
export const WithSelection: Story = {
  args: { selectedCount: 2, bulkActions: { onClear: fn(), onReject: fn(), onInvite: fn() } },
  render: Default.render,
}

export const WithoutTable: Story = {}

/** Pipeline, search and table share one container and filter the same rows. */
export const Interactive: Story = {
  render: () => (
    <div className="tm-max-w-[1100px]">
      <PanelWithTable />
    </div>
  ),
}
