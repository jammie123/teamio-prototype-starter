import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { TableHead, TableHeader, TableRow } from '../Table'
import {
  candidateHeaderPaddingClass,
  candidateHeaderTextClass,
  candidateNameColumnClass,
  candidateNoteColumnClass,
} from './candidateCellClass'
import { getVisibleColumnIds } from './candidateColumns'
import { CANDIDATE_COPY } from './candidateCopy'
import type { CandidateColumnState } from './types'

export interface CandidateTableHeadProps extends StyleProps {
  /** Column order and visibility; defaults to every column in the standard order. */
  columns?: CandidateColumnState[]
}

/** Header row matching the columns of `CandidateItem`, with the same sticky name and note columns. */
export function CandidateTableHead({ columns, className }: CandidateTableHeadProps) {
  const labels = CANDIDATE_COPY.columns
  const stickyHeader = 'tm-bg-cover-light tm-z-20'
  const headerClass = cn(candidateHeaderPaddingClass, candidateHeaderTextClass)

  return (
    <TableHead className={className}>
      <TableRow>
        {getVisibleColumnIds(columns).map((id) => (
          <TableHeader
            key={id}
            className={cn(
              headerClass,
              id === 'name' && [candidateNameColumnClass, stickyHeader],
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
