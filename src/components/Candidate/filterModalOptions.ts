import type {
  CandidateFilterModalFieldConfig,
  CandidateFilterModalFieldKey,
  CandidateFilterModalOption,
  CandidateFilterModalValue,
  CandidateFilterV2FieldMeta,
  CandidateFilterV2Value,
} from './filterModalTypes'

export const EMPTY_CANDIDATE_FILTER_VALUE: CandidateFilterModalValue = {
  status: '',
  opinion: '',
  source: '',
  rating: '',
  candidateTag: '',
}

export const EMPTY_CANDIDATE_FILTER_V2_VALUE: CandidateFilterV2Value = {
  status: '',
  opinion: '',
  source: '',
  rating: '',
  candidateTag: [],
}

const STATUS_OPTIONS: CandidateFilterModalOption[] = [
  { value: 'filter-STATUS/IN_PROCESS', label: 'V náboru', depth: 0 },
  { value: 'filter-STATUS/NOT_EVALUATED', label: 'Neposouzeni', depth: 1 },
  { value: 'filter-STATUS/IN_THE_GAME', label: 'Ve hře', depth: 1 },
  { value: 'filter-STATUS/40', label: 'Předvýběr za HR', depth: 2 },
  { value: 'filter-STATUS/41', label: 'Odsouhlaný od LM', depth: 2 },
  { value: 'filter-STATUS/IN_HIRED', label: 'Nástup', depth: 0 },
  { value: 'filter-STATUS/OUT_OF_THE_GAME', label: 'Mimo nábor', depth: 0 },
]

const OPINION_OPTIONS: CandidateFilterModalOption[] = [
  {
    value: 'filter-OPINION/WAITING_FOR_OPINION',
    label: 'Čeká na názor',
    depth: 0,
    icon: 'hourglass',
  },
  { value: 'filter-OPINION/EVALUATED', label: 'Všichni ohodnocení manažerem', depth: 0 },
  { value: 'filter-OPINION/SUITABLE', label: 'K pozvání', depth: 1, icon: 'thumb-up' },
  { value: 'filter-OPINION/UNSUITABLE', label: 'Nevyhovující', depth: 1, icon: 'thumb-down' },
  { value: 'filter-OPINION/LATER', label: 'Nechat na později', depth: 1, icon: 'stop-reason' },
  { value: 'filter-OPINION/NOT_PRESELECTED', label: 'Neodeslaní manažerovi', depth: 0 },
]

const SOURCE_OPTIONS: CandidateFilterModalOption[] = [
  { value: 'filter-SOURCE/doporuceni', label: 'Doporučení' },
  { value: 'filter-SOURCE/veletrh', label: 'Veletrh práce' },
  { value: 'filter-SOURCE/linkedin', label: 'LinkedIn' },
  { value: 'filter-SOURCE/jobote', label: 'Jobote' },
  { value: 'filter-SOURCE/databaze', label: 'Databáze uchazečů' },
]

const RATING_OPTIONS: CandidateFilterModalOption[] = [
  { value: 'filter-RATING/0', label: 'Bez hodnocení' },
  { value: 'filter-RATING/1', label: '1 hvězdička' },
  { value: 'filter-RATING/2', label: '2 hvězdičky' },
  { value: 'filter-RATING/3', label: '3 hvězdičky' },
  { value: 'filter-RATING/4', label: '4 hvězdičky' },
  { value: 'filter-RATING/5', label: '5 hvězdiček' },
]

const CANDIDATE_TAG_OPTIONS: CandidateFilterModalOption[] = [
  { value: 'filter-CANDIDATE_TAG/senior', label: 'senior' },
  { value: 'filter-CANDIDATE_TAG/inbox', label: 'inbox' },
  { value: 'filter-CANDIDATE_TAG/vip', label: 'vip' },
  { value: 'filter-CANDIDATE_TAG/follow-up', label: 'follow-up' },
]

export const CANDIDATE_FILTER_MODAL_FIELDS: CandidateFilterModalFieldConfig[] = [
  { key: 'status', label: 'Stav uchazeče', emptyLabel: 'Všechny', options: STATUS_OPTIONS },
  { key: 'opinion', label: 'Názor manažera', emptyLabel: 'Všechny', options: OPINION_OPTIONS },
  { key: 'source', label: 'Zdroj reakce', emptyLabel: 'Všechny', options: SOURCE_OPTIONS },
  { key: 'rating', label: 'Hodnocení', emptyLabel: 'Všechna', options: RATING_OPTIONS },
  { key: 'candidateTag', label: 'Štítky', emptyLabel: 'Všechny', options: CANDIDATE_TAG_OPTIONS },
]

export const CANDIDATE_FILTER_V2_FIELD_META: Record<
  CandidateFilterModalFieldKey,
  CandidateFilterV2FieldMeta
> = {
  status: {},
  opinion: {},
  source: { flatControl: 'radio' },
  rating: { flatControl: 'radio' },
  candidateTag: { flatControl: 'checkbox', multi: true },
}

export function optionsHaveHierarchy(options: CandidateFilterModalOption[]): boolean {
  return options.some((option) => (option.depth ?? 0) > 0)
}

export function findFilterModalOptionLabel(
  options: CandidateFilterModalOption[],
  value: string,
): string | undefined {
  return options.find((option) => option.value === value)?.label
}

export function countActiveCandidateFilters(value: CandidateFilterModalValue): number {
  return (Object.keys(EMPTY_CANDIDATE_FILTER_VALUE) as (keyof CandidateFilterModalValue)[]).filter(
    (key) => Boolean(value[key]),
  ).length
}

export function countActiveCandidateFiltersV2(value: CandidateFilterV2Value): number {
  let count = 0
  if (value.status) count += 1
  if (value.opinion) count += 1
  if (value.source) count += 1
  if (value.rating) count += 1
  if (value.candidateTag.length > 0) count += 1
  return count
}
