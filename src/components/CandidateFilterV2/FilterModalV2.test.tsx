import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CANDIDATE_COPY } from '../Candidate/candidateCopy'
import { countActiveCandidateFiltersV2, EMPTY_CANDIDATE_FILTER_V2_VALUE } from '../Candidate/filterModalOptions'
import { FilterModalV2 } from './FilterModalV2'

function renderModal(props: Partial<ComponentProps<typeof FilterModalV2>> = {}) {
  const onApply = vi.fn()
  const onOpenChange = vi.fn()
  render(
    <FilterModalV2
      open
      value={EMPTY_CANDIDATE_FILTER_V2_VALUE}
      onApply={onApply}
      onOpenChange={onOpenChange}
      {...props}
    />,
  )
  return { onApply, onOpenChange }
}

describe('FilterModalV2', () => {
  it('renders dialog with five category headings and expand controls', () => {
    renderModal()

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAccessibleName(CANDIDATE_COPY.filterModal.title)

    for (const label of [
      'Stav uchazeče',
      'Názor manažera',
      'Zdroj reakce',
      'Hodnocení',
      'Štítky',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: label })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: CANDIDATE_COPY.filterModal.collapseCategory(label) })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    }
  })

  it('shows nested status options with deeper padding', () => {
    renderModal()

    const option = screen.getByRole('checkbox', { name: 'Předvýběr za HR' })
    expect(option.parentElement?.parentElement).toHaveClass('tm-pl-8')
  })

  it('calls onApply with selected values and closes', async () => {
    const user = userEvent.setup()
    const { onApply, onOpenChange } = renderModal()

    await user.click(screen.getByRole('radio', { name: '4 hvězdičky' }))
    await user.click(screen.getByRole('checkbox', { name: 'senior' }))
    await user.click(screen.getByRole('checkbox', { name: 'vip' }))
    await user.click(screen.getByRole('button', { name: CANDIDATE_COPY.filterModal.apply }))

    expect(onApply).toHaveBeenCalledWith({
      ...EMPTY_CANDIDATE_FILTER_V2_VALUE,
      rating: 'filter-RATING/4',
      candidateTag: ['filter-CANDIDATE_TAG/senior', 'filter-CANDIDATE_TAG/vip'],
    })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not call onApply when cancelled', async () => {
    const user = userEvent.setup()
    const { onApply } = renderModal()

    await user.click(screen.getByRole('radio', { name: 'LinkedIn' }))
    await user.click(screen.getByRole('button', { name: CANDIDATE_COPY.filterModal.cancel }))

    expect(onApply).not.toHaveBeenCalled()
  })

  it('resets draft to empty values on apply', async () => {
    const user = userEvent.setup()
    const { onApply } = renderModal({
      value: {
        ...EMPTY_CANDIDATE_FILTER_V2_VALUE,
        source: 'filter-SOURCE/linkedin',
        candidateTag: ['filter-CANDIDATE_TAG/inbox'],
      },
    })

    await user.click(screen.getByTestId('candidate-filter-v2-reset'))
    await user.click(screen.getByRole('button', { name: CANDIDATE_COPY.filterModal.apply }))

    expect(onApply).toHaveBeenCalledWith(EMPTY_CANDIDATE_FILTER_V2_VALUE)
  })
})

describe('countActiveCandidateFiltersV2', () => {
  it('counts non-empty filter fields and tags as one filter', () => {
    expect(countActiveCandidateFiltersV2(EMPTY_CANDIDATE_FILTER_V2_VALUE)).toBe(0)
    expect(
      countActiveCandidateFiltersV2({
        ...EMPTY_CANDIDATE_FILTER_V2_VALUE,
        status: 'filter-STATUS/IN_PROCESS',
        rating: 'filter-RATING/3',
        candidateTag: ['filter-CANDIDATE_TAG/senior', 'filter-CANDIDATE_TAG/vip'],
      }),
    ).toBe(3)
  })
})
