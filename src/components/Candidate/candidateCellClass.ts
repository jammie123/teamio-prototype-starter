/** Shared sticky-column classes so the header and every row stay aligned. */

// `Table` primitives ship their own `tm-px-3 tm-py-2`; class names are not merged,
// so the roomier Candidate spacing uses the important modifier to win reliably.
export const candidateCellPaddingClass = '!tm-px-4'
export const candidateHeaderPaddingClass = '!tm-px-4 !tm-py-4'

export const candidateHeaderTextClass = [
  'tm-text-sm',
  'tm-font-semibold',
  'tm-text-secondary-default',
] as const

/** Typography shared by the secondary data columns (last contact, source, AI, ...). */
export const candidateValueTextClass = 'tm-text-sm tm-font-normal tm-text-primary-default'
export const candidateMetaTextClass = 'tm-text-sm tm-font-normal tm-text-secondary-default'
export const candidateEmptyTextClass = 'tm-text-sm tm-font-normal tm-text-light-default'

export const candidateNameColumnClass = [
  'tm-sticky',
  'tm-left-0',
  'tm-min-w-[15rem]',
  'tm-w-[15rem]',
  'tm-border-r',
  'tm-border-r-secondary',
] as const

export const candidateNoteColumnClass = [
  'tm-sticky',
  'tm-right-0',
  'tm-min-w-[20rem]',
  'tm-w-[20rem]',
  'tm-max-w-[20rem]',
  'tm-border-l',
  'tm-border-l-secondary',
] as const
