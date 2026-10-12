/** Shared sticky-column classes so the header and every row stay aligned. */

// `Table` primitives ship their own `tm-px-3 tm-py-2`; class names are not merged,
// so the roomier Candidate spacing uses the important modifier to win reliably.
export const candidateCellPaddingClass = '!tm-px-6 !tm-py-5'
export const candidateHeaderPaddingClass = '!tm-px-6 !tm-py-4'

export const candidateHeaderTextClass = [
  'tm-text-sm',
  'tm-font-semibold',
  'tm-text-secondary-default',
] as const

/** Typography shared by the secondary data columns (last contact, source, AI, ...). */
export const candidateValueTextClass = 'tm-text-sm tm-font-normal tm-text-primary-default'
export const candidateMetaTextClass = 'tm-text-sm tm-font-normal tm-text-secondary-default'
export const candidateEmptyTextClass = 'tm-text-sm tm-font-normal tm-text-light-default'

/** Low-priority "add" actions (new tag, new note): medium weight and muted colour. */
export const candidateAddButtonClass = '!tm-font-medium tm-text-secondary-default'

/**
 * Keeps an action invisible until the surrounding `tm-group/row` is hovered or focused.
 * It stays in the layout (no jumping) and is always visible on touch devices without hover.
 */
export const candidateRevealOnRowHoverClass = [
  'tm-opacity-0',
  'tm-transition-opacity',
  'group-hover/row:tm-opacity-100',
  'group-focus-within/row:tm-opacity-100',
  'focus-visible:tm-opacity-100',
  'hover-none:tm-opacity-100',
] as const

// The sticky columns read data attributes of the `tm-group/candidate-table` wrapper rendered by
// `CandidateTable`: `data-overflow` is set while the table is wider than its viewport and shows
// the dividers on both columns; `data-shadow-start` / `data-shadow-end` are set only while the table
// is being scrolled and content is hidden past that edge, and add the shadow.
// Class names are written out in full so Tailwind can detect them.
export const candidateNameColumnClass = [
  'tm-sticky',
  'tm-left-0',
  'tm-min-w-[15rem]',
  'tm-w-[15rem]',
  'tm-border-r',
  'tm-border-r-transparent',
  'tm-transition-shadow',
  'group-data-[overflow=true]/candidate-table:tm-border-r-secondary',
  'group-data-[shadow-start=true]/candidate-table:tm-shadow-[4px_0_8px_-4px_rgba(0,13,60,0.16)]',
] as const

/**
 * Leading column with the row checkbox and the actions menu. It sticks to the left edge and the
 * name column is offset by its width (`tm-left-[6rem]`), so keep both widths in sync.
 */
export const candidateSelectColumnClass = [
  'tm-sticky',
  'tm-left-0',
  'tm-w-[6rem]',
  'tm-min-w-[6rem]',
  'tm-max-w-[6rem]',
] as const

/** Narrower padding than the data columns. */
export const candidateSelectCellPaddingClass = '!tm-pl-4 !tm-pr-2 !tm-py-5'
export const candidateSelectHeaderPaddingClass = '!tm-pl-4 !tm-pr-2 !tm-py-4'

/** `candidateNameColumnClass` when a select column precedes it. */
export const candidateNameColumnWithSelectClass = [
  'tm-sticky',
  'tm-left-[6rem]',
  'tm-min-w-[15rem]',
  'tm-w-[15rem]',
  'tm-border-r',
  'tm-border-r-transparent',
  'tm-transition-shadow',
  'group-data-[overflow=true]/candidate-table:tm-border-r-secondary',
  'group-data-[shadow-start=true]/candidate-table:tm-shadow-[4px_0_8px_-4px_rgba(0,13,60,0.16)]',
] as const

export const candidateNoteColumnClass = [
  'tm-sticky',
  'tm-right-0',
  'tm-min-w-[20rem]',
  'tm-w-[20rem]',
  'tm-max-w-[20rem]',
  'tm-border-l',
  'tm-border-l-transparent',
  'tm-transition-shadow',
  'group-data-[overflow=true]/candidate-table:tm-border-l-secondary',
  'group-data-[shadow-end=true]/candidate-table:tm-shadow-[-4px_0_8px_-4px_rgba(0,13,60,0.16)]',
] as const
