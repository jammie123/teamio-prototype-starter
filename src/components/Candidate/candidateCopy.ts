import type { CandidateStatusOption } from './types'

export const CANDIDATE_COPY = {
  columns: {
    name: 'Uchazeč',
    rating: 'Hodnocení',
    attachments: 'Přílohy',
    ai: 'AI',
    status: 'Stav',
    lastContact: 'Poslední kontakt',
    source: 'Zdroj',
    tags: 'Štítky',
    note: 'Poznámka',
  },
  tableLabel: 'Uchazeči',
  emptyTable: 'Žádní uchazeči',
  addPhone: 'Přidat telefon',
  notContacted: 'Nekontaktován/a',
  emptyValue: '–',
  attachmentsLabel: (count: number) => `Přílohy: ${count}`,
  ratingLabel: (value: number) => `Hodnocení ${value} z 5`,
  aiLabel: (score: string | number) => `AI hodnocení: ${score}`,
  statusLabel: 'Změnit stav',
  addTag: 'Nový štítek',
  removeTag: (label: string) => `Odebrat štítek ${label}`,
  addNote: 'Přidat poznámku',
  expandNote: 'Zobrazit celou poznámku',
  pipeline: {
    label: 'Filtr uchazečů',
    newBadgeLabel: (count: string) => `Noví uchazeči: ${count}`,
  },
  panel: {
    searchPlaceholder: 'Hledat uchazeče…',
    searchLabel: 'Hledat uchazeče',
    filters: 'Filtry',
    filtersWithCount: (count: number) => `Filtry (${count})`,
  },
} as const

export const CANDIDATE_DEFAULT_STATUSES: CandidateStatusOption[] = [
  { id: 'unassessed', label: 'Neposouzeni', color: 'neutral' },
  { id: 'interview', label: 'Pohovor', color: 'informative' },
  { id: 'offer', label: 'Nabídka', color: 'warning' },
  { id: 'hired', label: 'Nástup', color: 'success' },
  { id: 'rejected', label: 'Zamítnut', color: 'danger' },
]

/** Id of the pipeline cell that clears the status filter (the "Celkem" cell). */
export const CANDIDATE_PIPELINE_ALL_STATUS_ID = 'total'

/** Same cells and order as the Job Card stats strip; the last one clears the status filter. */
export const CANDIDATE_PIPELINE_STATUSES: CandidateStatusOption[] = [
  { id: 'unassessed', label: 'Neposouzení' },
  { id: 'preselected', label: 'Předvybraný' },
  { id: 'opalcovani', label: 'Opalcovaný' },
  { id: 'invited', label: 'Pozvaný' },
  { id: 'hired', label: 'Přijatý' },
  { id: CANDIDATE_PIPELINE_ALL_STATUS_ID, label: 'Celkem' },
]

/**
 * Cells of the tab-style pipeline (`JobsPipelineV2`): the hiring stages with an icon each, then
 * "Zamítnutý" and "Celkem" at the end. "Celkem" clears the status filter.
 */
export const CANDIDATE_PIPELINE_V2_STATUSES: CandidateStatusOption[] = [
  { id: 'unassessed', label: 'Neposouzení', icon: 'single-man-time' },
  { id: 'preselected', label: 'Předvybraný', icon: 'candidate-move', iconColor: 'info' },
  { id: 'opalcovani', label: 'Opalcovaný', icon: 'opal', iconColor: 'info' },
  { id: 'invited', label: 'Pozvaný', icon: 'message-square', iconColor: 'success' },
  { id: 'hired', label: 'Přijatý', icon: 'circle-check', iconColor: 'success' },
  { id: 'rejected', label: 'Zamítnutý', icon: 'ban', iconColor: 'danger' },
  { id: CANDIDATE_PIPELINE_ALL_STATUS_ID, label: 'Celkem' },
]
