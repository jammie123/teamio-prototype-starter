import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Checkbox } from '../Checkbox'
import { TableHead, TableHeader, TableRow } from '../Table'
import {
  candidateHeaderPaddingClass,
  candidateHeaderTextClass,
  candidateNameColumnClass,
  candidateNameColumnWithSelectClass,
  candidateNoteColumnClass,
  candidateSelectColumnClass,
  candidateSelectHeaderPaddingClass,
} from './candidateCellClass'
import { getVisibleColumnIds } from './candidateColumns'
import { CANDIDATE_COPY } from './candidateCopy'
import type { CandidateColumnState } from './types'

export interface CandidateTableHeadProps extends StyleProps {
  /** Column order and visibility; defaults to every column in the standard order. */
  columns?: CandidateColumnState[]
  /** Number of selected rows; drives the checked and indeterminate state of the select-all checkbox. */
  selectedCount?: number
  /** Number of selectable rows. */
  totalCount?: number
  /** Shows the select-all checkbox in the leading column. */
  onSelectAllChange?: (checked: boolean) => void
  /** Renders the leading select column even without the checkbox, to align with rows that have one. */
  showSelectColumn?: boolean
}

/**
 * Header row matching the columns of `CandidateItem`, with the same sticky name and note columns.
 * With `onSelectAllChange` a leading sticky column holds the select-all checkbox.
 */
export function CandidateTableHead({
  columns,
  selectedCount = 0,
  totalCount = 0,
  onSelectAllChange,
  showSelectColumn = Boolean(onSelectAllChange),
  className,
}: CandidateTableHeadProps) {
  const labels = CANDIDATE_COPY.columns
  const stickyHeader = 'tm-bg-cover-light tm-z-20'
  const headerClass = cn(candidateHeaderPaddingClass, candidateHeaderTextClass)
  const allSelected = totalCount > 0 && selectedCount >= totalCount
  const someSelected = selectedCount > 0 && !allSelected
  const nameColumnClass = showSelectColumn ? candidateNameColumnWithSelectClass : candidateNameColumnClass

  return (
    <TableHead className={className}>
      <TableRow>
        {showSelectColumn ? (
          <TableHeader
            data-testid="candidate-header-select"
            className={cn(candidateSelectHeaderPaddingClass, candidateSelectColumnClass, stickyHeader)}
          >
            {onSelectAllChange ? (
              <Checkbox
                data-testid="candidate-select-all"
                aria-label={CANDIDATE_COPY.selection.selectAll}
                checked={allSelected}
                indeterminate={someSelected}
                isDisabled={totalCount === 0}
                onChange={(event) => onSelectAllChange(event.target.checked)}
              />
            ) : (
              <span className="tm-sr-only">{CANDIDATE_COPY.selection.selectAll}</span>
            )}
          </TableHeader>
        ) : null}
        {getVisibleColumnIds(columns).map((id) => (
          <TableHeader
            key={id}
            className={cn(
              headerClass,
              id === 'name' && [nameColumnClass, stickyHeader],
              id === 'note' && [candidateNoteColumnClass, stickyHeader],
            )}
          >
            {labels[id]}
          </TableHeader>
        ))}
      </TableRow>
    </TableHead>
  )
}

CandidateTableHead.displayName = 'CandidateTableHead'
