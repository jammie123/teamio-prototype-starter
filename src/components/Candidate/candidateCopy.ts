import type { CandidateColumnId, CandidateColumnState, CandidateStatusOption } from './types'

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
  newCandidateLabel: 'Nový uchazeč',
  newlyOpalcovaniLabel: 'Nově opalcovaný',
  pipeline: {
    label: 'Filtr uchazečů',
    newBadgeLabel: (count: string) => `Noví uchazeči: ${count}`,
    newCandidatesBadgeLabel: (count: string) => `Noví kandidáti: ${count}`,
    newOpalcovaniBadgeLabel: (count: string) => `Nově opalcovaní: ${count}`,
  },
  panel: {
    searchPlaceholder: 'Hledat uchazeče…',
    searchLabel: 'Hledat uchazeče',
    filters: 'Filtry',
    filtersWithCount: (count: number) => `Filtry (${count})`,
    columns: 'Přizpůsobit sloupce',
  },
  selection: {
    selectAll: 'Vybrat všechny uchazeče',
    selectCandidate: (name: string) => `Vybrat uchazeče ${name}`,
  },
  actions: {
    menuLabel: (name: string) => `Akce uchazeče ${name}`,
    reject: 'Zamítnout',
    moveTo: 'Posunout do',
    aiEvaluate: 'Zanalyzovat pomocí AI',
    recordContact: 'Zaznamenat kontakt',
    sendMessage: 'Napsat uchazeči',
    forward: 'Přeposlat',
    assignToPosition: 'Přiřadit k náboru',
    edit: 'Upravit údaje',
    requestConsent: 'Požádat o souhlas',
    addTag: 'Přidat štítek',
  },
  bulk: {
    label: 'Hromadné akce',
    selected: (count: number) => {
      const noun = count === 1 ? 'uchazeč' : count >= 2 && count <= 4 ? 'uchazeči' : 'uchazečů'
      return `Vybráno: ${count} ${noun}`
    },
    moveTo: 'Posunout do',
    reject: 'Zamítnout',
    invite: 'Pozvat',
    sendMessage: 'Napsat zprávu',
    clear: 'Zrušit výběr',
  },
  columnsDrawer: {
    title: 'Přizpůsobit sloupce',
    description: 'Vyberte, které sloupce se zobrazí, a přetažením změňte jejich pořadí.',
    listLabel: 'Sloupce tabulky',
    close: 'Zavřít panel',
    save: 'Uložit',
    cancel: 'Zrušit',
    reset: 'Obnovit výchozí',
    lockedHint: 'Tento sloupec nelze skrýt',
    dragHandle: (label: string) => `Přesunout sloupec ${label}`,
    moveUp: (label: string) => `Posunout sloupec ${label} nahoru`,
    moveDown: (label: string) => `Posunout sloupec ${label} dolů`,
    moved: (label: string, position: number, total: number) =>
      `Sloupec ${label} je na pozici ${position} z ${total}`,
  },
} as const

/** Columns that cannot be hidden or moved: the name sticks to the left, the note to the right. */
export const CANDIDATE_LOCKED_COLUMNS: readonly CandidateColumnId[] = ['name', 'note']

/** Current column order with every column visible. */
export const CANDIDATE_DEFAULT_COLUMNS: CandidateColumnState[] = [
  { id: 'name', visible: true },
  { id: 'rating', visible: true },
  { id: 'attachments', visible: true },
  { id: 'ai', visible: true },
  { id: 'status', visible: true },
  { id: 'lastContact', visible: true },
  { id: 'source', visible: true },
  { id: 'tags', visible: true },
  { id: 'note', visible: true },
]

export const CANDIDATE_DEFAULT_STATUSES: CandidateStatusOption[] = [
  { id: 'unassessed', label: 'Neposouzeni', color: 'neutral' },
  { id: 'interview', label: 'Pohovor', color: 'informative' },
  { id: 'offer', label: 'Nabídka', color: 'warning' },
  { id: 'hired', label: 'Nástup', color: 'success' },
  { id: 'rejected', label: 'Zamítnut', color: 'danger' },
]

/** Targets of "Posunout do" in the row menu and the bulk bar; rejecting is a separate action. */
export const CANDIDATE_DEFAULT_MOVE_TO_OPTIONS: CandidateStatusOption[] =
  CANDIDATE_DEFAULT_STATUSES.filter((status) => status.id !== 'rejected')

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
