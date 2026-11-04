import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ActionWidget } from './ActionWidget'

describe('ActionWidget', () => {
  it('shows view count and action buttons', () => {
    render(
      <ActionWidget
        viewCount={2610}
        showProlong
        onPreview={vi.fn()}
        onDetail={vi.fn()}
        onProlong={vi.fn()}
      />,
    )

    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent('2 610')
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(
      'Zhlédnutí',
    )
    expect(screen.getByTestId('job-card-advertisement-preview-action')).toHaveTextContent('Náhled')
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toHaveTextContent('Detail')
    expect(screen.getByTestId('job-card-disappearance-prolong')).toHaveTextContent('Prodloužit')
  })

  it('hides Prodloužit when showProlong is false', () => {
    render(
      <ActionWidget viewCount={100} onPreview={vi.fn()} onDetail={vi.fn()} showProlong={false} />,
    )

    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('calls handlers when actions are clicked', async () => {
    const user = userEvent.setup()
    const onPreview = vi.fn()
    const onDetail = vi.fn()
    const onProlong = vi.fn()

    render(
      <ActionWidget
        viewCount={100}
        showProlong
        onPreview={onPreview}
        onDetail={onDetail}
        onProlong={onProlong}
      />,
    )

    await user.click(screen.getByTestId('job-card-advertisement-preview-action'))
    await user.click(screen.getByTestId('job-card-advertisement-detail-action'))
    await user.click(screen.getByTestId('job-card-disappearance-prolong'))

    expect(onPreview).toHaveBeenCalledOnce()
    expect(onDetail).toHaveBeenCalledOnce()
    expect(onProlong).toHaveBeenCalledOnce()
  })
})
