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
} as const

export const CANDIDATE_DEFAULT_STATUSES: CandidateStatusOption[] = [
  { id: 'unassessed', label: 'Neposouzeni', color: 'neutral' },
  { id: 'interview', label: 'Pohovor', color: 'informative' },
  { id: 'offer', label: 'Nabídka', color: 'warning' },
  { id: 'hired', label: 'Nástup', color: 'success' },
  { id: 'rejected', label: 'Zamítnut', color: 'danger' },
]
