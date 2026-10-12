import { CANDIDATE_DEFAULT_COLUMNS, CANDIDATE_LOCKED_COLUMNS } from './candidateCopy'
import type { CandidateColumnId, CandidateColumnState } from './types'

export function isLockedColumn(id: CandidateColumnId) {
  return CANDIDATE_LOCKED_COLUMNS.includes(id)
}

/**
 * Ids of the columns to render, in display order. The name column is always first and the note
 * column always last (they are sticky) and are shown regardless of their `visible` flag.
 */
export function getVisibleColumnIds(
  columns: readonly CandidateColumnState[] = CANDIDATE_DEFAULT_COLUMNS,
): CandidateColumnId[] {
  const middle = columns
    .filter((column) => !isLockedColumn(column.id) && column.visible)
    .map((column) => column.id)
  return ['name', ...middle, 'note']
}

/** Returns `columns` with the locked columns pinned (name first, note last) and always visible. */
export function normalizeColumns(columns: readonly CandidateColumnState[]): CandidateColumnState[] {
  const middle = columns.filter((column) => !isLockedColumn(column.id))
  return [{ id: 'name', visible: true }, ...middle, { id: 'note', visible: true }]
}

/** Moves column `id` next to `targetId`. Locked columns cannot be moved or used as a target. */
export function moveColumn(
  columns: readonly CandidateColumnState[],
  id: CandidateColumnId,
  targetId: CandidateColumnId,
  position: 'before' | 'after',
): CandidateColumnState[] {
  if (id === targetId || isLockedColumn(id) || isLockedColumn(targetId)) return [...columns]
  const moving = columns.find((column) => column.id === id)
  const rest = columns.filter((column) => column.id !== id)
  const targetIndex = rest.findIndex((column) => column.id === targetId)
  if (!moving || targetIndex < 0) return [...columns]
  const insertAt = position === 'before' ? targetIndex : targetIndex + 1
  return normalizeColumns([...rest.slice(0, insertAt), moving, ...rest.slice(insertAt)])
}

/** Moves column `id` by `delta` places among the movable columns, clamped to the ends. */
export function shiftColumn(
  columns: readonly CandidateColumnState[],
  id: CandidateColumnId,
  delta: number,
): CandidateColumnState[] {
  const middle = columns.filter((column) => !isLockedColumn(column.id))
  const from = middle.findIndex((column) => column.id === id)
  if (from < 0) return [...columns]
  const to = Math.max(0, Math.min(middle.length - 1, from + delta))
  if (to === from) return [...columns]
  const [moving] = middle.splice(from, 1)
  middle.splice(to, 0, moving)
  return normalizeColumns(middle)
}
