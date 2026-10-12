import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { JobsPipelineProps } from './JobsPipeline'
import { JobsPipelineV2 } from './JobsPipelineV2'

const baseProps: JobsPipelineProps = {
  statusCounts: {
    unassessed: 1280,
    preselected: 24,
    opalcovani: 16,
    invited: 9,
    hired: 5,
    rejected: 2,
    total: 1338,
  },
  value: undefined,
  onChange: vi.fn(),
}

describe('JobsPipelineV2', () => {
  it('renders the hiring stages first and Zamítnutý and Celkem last as tabs', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    expect(screen.getByRole('tablist', { name: 'Filtr uchazečů' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab').map((tab) => tab.dataset.testid)).toEqual([
      'jobs-pipeline-status-unassessed',
      'jobs-pipeline-status-preselected',
      'jobs-pipeline-status-opalcovani',
      'jobs-pipeline-status-invited',
      'jobs-pipeline-status-hired',
      'jobs-pipeline-status-rejected',
      'jobs-pipeline-status-total',
    ])
  })

  it('shows the count above the title', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    const tab = screen.getByTestId('jobs-pipeline-status-preselected')
    expect(tab).toHaveClass('tm-flex-col')
    expect(screen.getByTestId('jobs-pipeline-status-preselected-count')).toHaveTextContent('24')
    expect(screen.getByTestId('jobs-pipeline-status-preselected-label')).toHaveTextContent(
      'Předvybraný',
    )
    expect(screen.getByTestId('jobs-pipeline-status-preselected-count')).toHaveClass(
      'tm-text-lg',
      'tm-font-medium',
    )
    expect(screen.getByTestId('jobs-pipeline-status-total-count').textContent).toMatch(
      /^1\s338$/,
    )
  })

  it('pads the tab at least as wide as the icon', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    expect(screen.getByTestId('jobs-pipeline-status-hired-icon')).toHaveClass('tm-text-2xl')
    expect(screen.getByTestId('jobs-pipeline-status-hired')).toHaveClass(
      '!tm-px-8',
      '!tm-py-5',
    )
  })

  it('shows the rejected count', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    expect(screen.getByTestId('jobs-pipeline-status-rejected-count')).toHaveTextContent('2')
    expect(screen.getByTestId('jobs-pipeline-status-rejected-label')).toHaveTextContent(
      'Zamítnutý',
    )
  })

  it('renders an icon for each status except Celkem', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    expect(screen.getByTestId('jobs-pipeline-status-rejected-icon')).toHaveAttribute(
      'data-icon-name',
      'ban',
    )
    expect(screen.getByTestId('jobs-pipeline-status-opalcovani-icon')).toHaveAttribute(
      'data-icon-name',
      'opal',
    )
    expect(screen.getByTestId('jobs-pipeline-status-hired-icon')).toHaveAttribute(
      'data-icon-name',
      'circle-check',
    )
    expect(screen.getByTestId('jobs-pipeline-status-unassessed-icon')).toHaveAttribute(
      'data-icon-name',
      'single-man-time',
    )
    expect(screen.getByTestId('jobs-pipeline-status-preselected-icon')).toHaveAttribute(
      'data-icon-name',
      'candidate-move',
    )
    expect(screen.queryByTestId('jobs-pipeline-status-total-icon')).not.toBeInTheDocument()
    for (const icon of screen.getAllByTestId(/-icon$/)) {
      expect(icon).not.toHaveAttribute('data-icon-fallback')
    }
  })

  it('does not point to a missing tab panel', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).not.toHaveAttribute('aria-controls')
    }
  })

  it('renders 0 for missing counts', () => {
    render(<JobsPipelineV2 {...baseProps} statusCounts={{}} />)

    expect(screen.getByTestId('jobs-pipeline-status-invited-count')).toHaveTextContent('0')
  })

  it('shows the new candidates pill only when there are new candidates', () => {
    render(<JobsPipelineV2 {...baseProps} newCounts={{ unassessed: 14, preselected: 0 }} />)

    expect(screen.getByTestId('jobs-pipeline-status-unassessed-new')).toHaveTextContent('14')
    expect(screen.getByTestId('jobs-pipeline-status-unassessed-new')).toHaveAccessibleName(
      'Noví uchazeči: 14',
    )
    expect(screen.queryByTestId('jobs-pipeline-status-preselected-new')).not.toBeInTheDocument()
  })

  it('selects Celkem while no status is set and the status tab otherwise', () => {
    const { rerender } = render(<JobsPipelineV2 {...baseProps} />)

    expect(screen.getByTestId('jobs-pipeline-status-total')).toHaveAttribute('aria-selected', 'true')

    rerender(<JobsPipelineV2 {...baseProps} value="hired" />)

    expect(screen.getByTestId('jobs-pipeline-status-total')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByTestId('jobs-pipeline-status-hired')).toHaveAttribute('aria-selected', 'true')
  })

  it('uses the active tab underline from Tabs', () => {
    render(<JobsPipelineV2 {...baseProps} value="hired" />)

    expect(screen.getByTestId('jobs-pipeline-status-hired')).toHaveClass(
      'data-[state=active]:after:tm-bg-teamio-pink',
    )
  })

  it('selects a status', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<JobsPipelineV2 {...baseProps} onChange={onChange} />)

    await user.click(screen.getByTestId('jobs-pipeline-status-preselected'))

    expect(onChange).toHaveBeenCalledWith('preselected')
  })

  it('clears the filter with Celkem', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<JobsPipelineV2 {...baseProps} value="opalcovani" onChange={onChange} />)

    await user.click(screen.getByTestId('jobs-pipeline-status-total'))

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('uses custom status options', () => {
    render(
      <JobsPipelineV2
        {...baseProps}
        statusOptions={[
          { id: 'a', label: 'Alfa' },
          { id: 'b', label: 'Beta' },
        ]}
        statusCounts={{ a: 2, b: 3 }}
      />,
    )

    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(screen.getByRole('tab', { name: '2 Alfa' })).toBeInTheDocument()
  })

  it('fills the width of its container', () => {
    render(<JobsPipelineV2 {...baseProps} className="custom" />)

    expect(screen.getByTestId('jobs-pipeline')).toHaveClass('tm-w-full', 'custom')
  })

  it('tints the status icons', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    for (const id of ['preselected', 'opalcovani']) {
      expect(screen.getByTestId(`jobs-pipeline-status-${id}-icon`)).toHaveClass(
        'tm-text-emotion-info-emphasis',
      )
    }
    for (const id of ['invited', 'hired']) {
      expect(screen.getByTestId(`jobs-pipeline-status-${id}-icon`)).toHaveClass(
        'tm-text-emotion-success-emphasis',
      )
    }
    expect(screen.getByTestId('jobs-pipeline-status-rejected-icon')).toHaveClass(
      'tm-text-emotion-danger-active',
    )
    expect(screen.getByTestId('jobs-pipeline-status-unassessed-icon')).toHaveClass(
      'tm-text-secondary-default',
    )
  })

  it('spans the full width of its container without negative margins', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    expect(screen.getByRole('tablist')).toHaveClass('!tm-mx-0')
    expect(screen.getByTestId('jobs-pipeline')).toHaveClass('tm-w-full')
  })

  it('gives the active tab a white background and the others the cover-light one', () => {
    render(<JobsPipelineV2 {...baseProps} value="hired" />)

    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toHaveClass('!tm-bg-cover-light', 'data-[state=active]:!tm-bg-basic')
    }
    expect(screen.getByTestId('jobs-pipeline-status-hired')).toHaveAttribute('data-state', 'active')
  })

  it('draws the active indicator across the whole cell on top', () => {
    render(<JobsPipelineV2 {...baseProps} value="hired" />)

    expect(screen.getByTestId('jobs-pipeline-status-hired')).toHaveClass(
      'data-[state=active]:after:!tm-top-0',
      'data-[state=active]:after:!tm-bottom-auto',
      'data-[state=active]:after:!tm-left-0',
      'data-[state=active]:after:!tm-right-0',
      'data-[state=active]:after:!tm-h-[3px]',
    )
  })

  it('draws no border of its own', () => {
    render(<JobsPipelineV2 {...baseProps} value="hired" />)

    const tablist = screen.getByRole('tablist')
    expect(tablist.parentElement).toBe(screen.getByTestId('jobs-pipeline'))
    expect(screen.getByTestId('jobs-pipeline').className).not.toMatch(/border/)
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab.className).not.toMatch(/(^|\s)tm-border-[bt]\b/)
    }
  })

  it('draws the oversized outline icons slightly smaller', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    for (const id of ['rejected', 'hired', 'invited']) {
      expect(screen.getByTestId(`jobs-pipeline-status-${id}-icon`)).toHaveClass('tm-scale-90')
    }
    for (const id of ['unassessed', 'preselected', 'opalcovani']) {
      expect(screen.getByTestId(`jobs-pipeline-status-${id}-icon`)).not.toHaveClass('tm-scale-90')
    }
  })

  it('stretches every tab to the full height of the strip', () => {
    render(<JobsPipelineV2 {...baseProps} newCounts={{ unassessed: 14 }} />)

    expect(screen.getByRole('tablist')).toHaveClass('!tm-items-stretch')
  })

  it('gives tabs without an icon the same count row height and font sizes', () => {
    render(<JobsPipelineV2 {...baseProps} />)

    const row = screen.getByTestId('jobs-pipeline-status-total-count').parentElement
    expect(row).toHaveClass('tm-min-h-6')
    for (const id of ['total', 'hired']) {
      expect(screen.getByTestId(`jobs-pipeline-status-${id}-count`)).toHaveClass('tm-text-lg')
      expect(screen.getByTestId(`jobs-pipeline-status-${id}-label`)).toHaveClass('tm-text-sm')
    }
  })
})
