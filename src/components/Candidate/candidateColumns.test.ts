import { describe, expect, it } from 'vitest'
import { getVisibleColumnIds, moveColumn, normalizeColumns, shiftColumn } from './candidateColumns'
import { CANDIDATE_DEFAULT_COLUMNS } from './candidateCopy'

const ids = (columns: { id: string }[]) => columns.map((column) => column.id)

describe('candidateColumns', () => {
  it('lists every column in the default order', () => {
    expect(getVisibleColumnIds()).toEqual(ids(CANDIDATE_DEFAULT_COLUMNS))
  })

  it('omits hidden columns but never the locked ones', () => {
    const columns = CANDIDATE_DEFAULT_COLUMNS.map((column) => ({ ...column, visible: false }))
    expect(getVisibleColumnIds(columns)).toEqual(['name', 'note'])
  })

  it('pins the locked columns and keeps them visible', () => {
    const result = normalizeColumns([
      { id: 'note', visible: false },
      { id: 'tags', visible: true },
      { id: 'name', visible: false },
    ])
    expect(result).toEqual([
      { id: 'name', visible: true },
      { id: 'tags', visible: true },
      { id: 'note', visible: true },
    ])
  })

  it('moves a column before or after another one', () => {
    expect(ids(moveColumn(CANDIDATE_DEFAULT_COLUMNS, 'tags', 'rating', 'before'))).toEqual([
      'name',
      'tags',
      'rating',
      'attachments',
      'ai',
      'status',
      'lastContact',
      'source',
      'note',
    ])
    expect(ids(moveColumn(CANDIDATE_DEFAULT_COLUMNS, 'rating', 'source', 'after')).slice(4)).toEqual([
      'lastContact',
      'source',
      'rating',
      'tags',
      'note',
    ])
  })

  it('ignores moves of or onto locked columns', () => {
    expect(moveColumn(CANDIDATE_DEFAULT_COLUMNS, 'name', 'tags', 'after')).toEqual(
      CANDIDATE_DEFAULT_COLUMNS,
    )
    expect(moveColumn(CANDIDATE_DEFAULT_COLUMNS, 'tags', 'note', 'after')).toEqual(
      CANDIDATE_DEFAULT_COLUMNS,
    )
  })

  it('shifts a column and clamps at the ends of the movable range', () => {
    expect(ids(shiftColumn(CANDIDATE_DEFAULT_COLUMNS, 'status', -1)).slice(1, 5)).toEqual([
      'rating',
      'attachments',
      'status',
      'ai',
    ])
    expect(ids(shiftColumn(CANDIDATE_DEFAULT_COLUMNS, 'rating', -1))).toEqual(
      ids(CANDIDATE_DEFAULT_COLUMNS),
    )
    expect(ids(shiftColumn(CANDIDATE_DEFAULT_COLUMNS, 'tags', 1))).toEqual(
      ids(CANDIDATE_DEFAULT_COLUMNS),
    )
  })
})
