import type { IconName } from '../Icon'

export interface CandidateFilterModalValue {
  status: string
  opinion: string
  source: string
  rating: string
  candidateTag: string
}

export interface CandidateFilterModalOption {
  value: string
  label: string
  /** Nesting level for hierarchical filter values (0 = root). */
  depth?: number
  icon?: IconName
}

export type CandidateFilterModalFieldKey = keyof CandidateFilterModalValue

export interface CandidateFilterModalFieldConfig {
  key: CandidateFilterModalFieldKey
  label: string
  emptyLabel: string
  options: CandidateFilterModalOption[]
}

export interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: CandidateFilterModalValue
  onApply: (value: CandidateFilterModalValue) => void
}

export type CandidateFilterV2Value = Omit<CandidateFilterModalValue, 'candidateTag'> & {
  candidateTag: string[]
}

export type CandidateFilterV2FlatControl = 'radio' | 'checkbox'

export interface CandidateFilterV2FieldMeta {
  flatControl?: CandidateFilterV2FlatControl
  multi?: boolean
}

export interface FilterModalV2Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: CandidateFilterV2Value
  onApply: (value: CandidateFilterV2Value) => void
}
