import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobsPipeline, type JobsPipelineProps } from './JobsPipeline'

const baseProps: JobsPipelineProps = {
  statusCounts: {
    unassessed: 1280,
    preselected: 24,
    opalcovani: 16,
    invited: 9,
    hired: 5,
    total: 1338,
  },
  value: undefined,
  onChange: vi.fn(),
}

describe('JobsPipeline', () => {
  it('renders the Job Card stats cells in order with their counts', () => {
    render(<JobsPipeline {...baseProps} />)

    expect(screen.getAllByRole('button').map((button) => button.dataset.testid)).toEqual([
      'jobs-pipeline-status-unassessed',
      'jobs-pipeline-status-preselected',
      'jobs-pipeline-status-opalcovani',
      'jobs-pipeline-status-invited',
      'jobs-pipeline-status-hired',
      'jobs-pipeline-status-total',
    ])
    expect(screen.getByRole('button', { name: /^Neposouzení: 1\s280$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Předvybraný: 24' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Opalcovaný: 16' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pozvaný: 9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Přijatý: 5' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Celkem: 1\s338$/ })).toBeInTheDocument()
  })

  it('renders 0 for missing counts', () => {
    render(<JobsPipeline {...baseProps} statusCounts={{}} />)

    expect(screen.getByRole('button', { name: 'Pozvaný: 0' })).toBeInTheDocument()
  })

  it('shows the new candidates pill only when there are new candidates', () => {
    render(<JobsPipeline {...baseProps} newCounts={{ unassessed: 14, opalcovani: 2, preselected: 0 }} />)

    expect(screen.getByTestId('jobs-pipeline-status-unassessed-new')).toHaveTextContent('14')
    expect(screen.getByTestId('jobs-pipeline-status-opalcovani-new')).toHaveTextContent('2')
    expect(screen.queryByTestId('jobs-pipeline-status-preselected-new')).not.toBeInTheDocument()
    expect(screen.getByTestId('jobs-pipeline-status-unassessed')).toHaveAccessibleName(
      /Noví uchazeči: 14/,
    )
  })

  it('marks Celkem as pressed while no status is selected', () => {
    const { rerender } = render(<JobsPipeline {...baseProps} />)

    expect(screen.getByTestId('jobs-pipeline-status-total')).toHaveAttribute('aria-pressed', 'true')

    rerender(<JobsPipeline {...baseProps} value="hired" />)

    expect(screen.getByTestId('jobs-pipeline-status-total')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('jobs-pipeline-status-hired')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('jobs-pipeline-status-invited')).toHaveAttribute('aria-pressed', 'false')
  })

  it('styles the selected cell like an active tab', () => {
    render(<JobsPipeline {...baseProps} value="hired" />)

    const selected = screen.getByTestId('jobs-pipeline-status-hired')
    expect(selected).toHaveClass(
      'after:tm-bg-teamio-pink',
      'after:tm-h-[3px]',
      'after:tm-left-0',
      'after:tm-right-0',
    )
    expect(screen.getByText('Přijatý')).toHaveClass('tm-text-primary-default')

    const idle = screen.getByTestId('jobs-pipeline-status-invited')
    expect(idle).not.toHaveClass('after:tm-bg-teamio-pink')
    expect(screen.getByText('Pozvaný')).toHaveClass(
      'tm-text-secondary-default',
      'group-hover:tm-text-primary-default',
    )
  })

  it('selects a status', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<JobsPipeline {...baseProps} onChange={onChange} />)

    await user.click(screen.getByTestId('jobs-pipeline-status-preselected'))

    expect(onChange).toHaveBeenCalledWith('preselected')
  })

  it('replaces the selected status', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<JobsPipeline {...baseProps} value="preselected" onChange={onChange} />)

    await user.click(screen.getByTestId('jobs-pipeline-status-opalcovani'))

    expect(onChange).toHaveBeenCalledWith('opalcovani')
  })

  it('clears the filter when the selected cell is clicked again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<JobsPipeline {...baseProps} value="preselected" onChange={onChange} />)

    await user.click(screen.getByTestId('jobs-pipeline-status-preselected'))

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('clears the filter with Celkem', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<JobsPipeline {...baseProps} value="opalcovani" onChange={onChange} />)

    await user.click(screen.getByTestId('jobs-pipeline-status-total'))

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('uses custom status options', () => {
    render(
      <JobsPipeline
        {...baseProps}
        statusOptions={[
          { id: 'a', label: 'Alfa' },
          { id: 'b', label: 'Beta' },
        ]}
        statusCounts={{ a: 2, b: 3 }}
      />,
    )

    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Alfa: 2' })).toBeInTheDocument()
  })

  it('gives the count more weight than the label', () => {
    render(<JobsPipeline {...baseProps} />)

    expect(screen.getByText('24')).toHaveClass('tm-text-2xl', 'tm-font-semibold')
    expect(screen.getByText('Předvybraný')).toHaveClass('tm-text-sm', 'tm-font-normal')
  })

  it('uses a white background for every cell', () => {
    render(<JobsPipeline {...baseProps} value="hired" />)

    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('tm-bg-basic')
    }
  })

  it('fills the width of its container', () => {
    render(<JobsPipeline {...baseProps} className="custom" />)

    expect(screen.getByTestId('jobs-pipeline')).toHaveClass('tm-w-full', 'custom')
  })
})
