import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CANDIDATE_COPY } from './candidateCopy'
import { FilterModal } from './FilterModal'
import { countActiveCandidateFilters, EMPTY_CANDIDATE_FILTER_VALUE } from './filterModalOptions'

function renderModal(props: Partial<ComponentProps<typeof FilterModal>> = {}) {
  const onApply = vi.fn()
  const onOpenChange = vi.fn()
  render(
    <FilterModal
      open
      value={EMPTY_CANDIDATE_FILTER_VALUE}
      onApply={onApply}
      onOpenChange={onOpenChange}
      {...props}
    />,
  )
  return { onApply, onOpenChange }
}

describe('FilterModal', () => {
  it('renders dialog with five labeled filter rows', () => {
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
      expect(screen.getByText(label, { selector: 'span.tm-font-medium' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('shows nested status options with deeper padding', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole('button', { name: 'Stav uchazeče' }))
    const option = await screen.findByRole('option', { name: 'Předvýběr za HR' })
    expect(option).toHaveClass('tm-pl-8')
  })

  it('calls onApply with selected values and closes', async () => {
    const user = userEvent.setup()
    const { onApply, onOpenChange } = renderModal()

    await user.click(screen.getByRole('button', { name: 'Hodnocení' }))
    await user.click(await screen.findByRole('option', { name: '4 hvězdičky' }))
    await user.click(screen.getByRole('button', { name: CANDIDATE_COPY.filterModal.apply }))

    expect(onApply).toHaveBeenCalledWith({
      ...EMPTY_CANDIDATE_FILTER_VALUE,
      rating: 'filter-RATING/4',
    })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not call onApply when cancelled', async () => {
    const user = userEvent.setup()
    const { onApply } = renderModal()

    await user.click(screen.getByRole('button', { name: 'Zdroj reakce' }))
    await user.click(await screen.findByRole('option', { name: 'LinkedIn' }))
    await user.click(screen.getByRole('button', { name: CANDIDATE_COPY.filterModal.cancel }))

    expect(onApply).not.toHaveBeenCalled()
  })

  it('resets draft to empty values on apply', async () => {
    const user = userEvent.setup()
    const { onApply } = renderModal({
      value: {
        ...EMPTY_CANDIDATE_FILTER_VALUE,
        source: 'filter-SOURCE/linkedin',
      },
    })

    await user.click(screen.getByTestId('candidate-filter-reset'))
    await user.click(screen.getByRole('button', { name: CANDIDATE_COPY.filterModal.apply }))

    expect(onApply).toHaveBeenCalledWith(EMPTY_CANDIDATE_FILTER_VALUE)
  })
})

describe('countActiveCandidateFilters', () => {
  it('counts non-empty filter fields', () => {
    expect(countActiveCandidateFilters(EMPTY_CANDIDATE_FILTER_VALUE)).toBe(0)
    expect(
      countActiveCandidateFilters({
        ...EMPTY_CANDIDATE_FILTER_VALUE,
        status: 'filter-STATUS/IN_PROCESS',
        rating: 'filter-RATING/3',
      }),
    ).toBe(2)
  })
})
