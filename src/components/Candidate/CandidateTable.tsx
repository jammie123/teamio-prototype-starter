import { forwardRef, useCallback, useMemo, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Table, TableBody, TableCell, TableRow } from '../Table'
import { candidateEmptyTextClass } from './candidateCellClass'
import { getVisibleColumnIds } from './candidateColumns'
import { CANDIDATE_COPY, CANDIDATE_DEFAULT_STATUSES } from './candidateCopy'
import { CandidateItem, type CandidateItemProps } from './CandidateItem'
import { CandidateTableHead } from './CandidateTableHead'
import type { CandidateColumnState, CandidateItemData } from './types'
import { useScrollEdges } from './useScrollEdges'

type RowCallbacks = Pick<
  CandidateItemProps,
  | 'statusOptions'
  | 'onNameClick'
  | 'onAttachmentsClick'
  | 'onStatusChange'
  | 'onTagAdd'
  | 'onTagRemove'
  | 'onNoteAdd'
  | 'onNoteExpand'
  | 'onAction'
  | 'moveToOptions'
>

export interface CandidateTableProps extends StyleProps, RowCallbacks {
  candidates: CandidateItemData[]
  /** Column order and visibility; defaults to every column in the standard order. */
  columns?: CandidateColumnState[]
  /** Content shown when `candidates` is empty. */
  emptyMessage?: ReactNode
  /** Ids of the selected candidates (controlled). */
  selectedIds?: string[]
  /**
   * Called with the new selection. Setting it adds the select column with a checkbox per row and
   * the select-all checkbox in the header.
   */
  onSelectionChange?: (selectedIds: string[]) => void
  'aria-label'?: string
}

/**
 * Candidate list composed of `CandidateTableHead` and one `CandidateItem` row per candidate.
 * The name column sticks left and the note column sticks right when the table scrolls horizontally.
 * Their dividers appear while the table is wider than its viewport, and a shadow is added on the
 * edge with hidden content only while the table is being scrolled. When everything fits, neither shows.
 */
export const CandidateTable = forwardRef<HTMLTableElement, CandidateTableProps>(
  function CandidateTable(
    {
      candidates,
      columns,
      statusOptions = CANDIDATE_DEFAULT_STATUSES,
      emptyMessage = CANDIDATE_COPY.emptyTable,
      selectedIds,
      onSelectionChange,
      className,
      'aria-label': ariaLabel = CANDIDATE_COPY.tableLabel,
      ...rowCallbacks
    },
    ref,
  ) {
    const { ref: scrollRef, state: scroll } = useScrollEdges<HTMLTableElement>()
    const selectable = Boolean(onSelectionChange)
    const hasSelectColumn = selectable || Boolean(rowCallbacks.onAction)
    const columnCount = getVisibleColumnIds(columns).length + (hasSelectColumn ? 1 : 0)
    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
    const selectedCount = candidates.filter((candidate) => selectedSet.has(candidate.id)).length

    const handleSelectAll = (checked: boolean) =>
      onSelectionChange?.(checked ? candidates.map((candidate) => candidate.id) : [])

    const handleSelectRow = (candidate: CandidateItemData, checked: boolean) => {
      const next = new Set(selectedSet)
      if (checked) next.add(candidate.id)
      else next.delete(candidate.id)
      onSelectionChange?.(candidates.filter((item) => next.has(item.id)).map((item) => item.id))
    }
    const setRef = useCallback(
      (node: HTMLTableElement | null) => {
        scrollRef(node)
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref, scrollRef],
    )

    return (
      <div
        data-testid="candidate-table"
        data-overflow={scroll.start || scroll.end}
        data-shadow-start={scroll.isScrolling && scroll.start}
        data-shadow-end={scroll.isScrolling && scroll.end}
        className={cn(
          'tm-group/candidate-table',
          'tm-overflow-hidden',
          'tm-rounded',
          'tm-border',
          'tm-border-secondary',
          className,
        )}
      >
        <Table ref={setRef} aria-label={ariaLabel} className={hasSelectColumn ? 'tm-min-w-[1346px]' : 'tm-min-w-[1250px]'}>
          <CandidateTableHead
            columns={columns}
            showSelectColumn={hasSelectColumn}
            selectedCount={selectedCount}
            totalCount={candidates.length}
            onSelectAllChange={selectable ? handleSelectAll : undefined}
          />
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow data-testid="candidate-table-empty">
                <TableCell
                  colSpan={columnCount}
                  className={cn('!tm-py-10', 'tm-text-center', candidateEmptyTextClass)}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate) => (
                <CandidateItem
                  key={candidate.id}
                  candidate={candidate}
                  columns={columns}
                  statusOptions={statusOptions}
                  isSelected={selectedSet.has(candidate.id)}
                  onSelectChange={selectable ? handleSelectRow : undefined}
                  {...rowCallbacks}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  },
)

CandidateTable.displayName = 'CandidateTable'
