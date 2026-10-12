export type CandidateStatusColor = 'neutral' | 'informative' | 'success' | 'warning' | 'danger'

export interface CandidateStatusOption {
  id: string
  label: string
  color?: CandidateStatusColor
}

export interface CandidateTagData {
  id: string
  label: string
}

export interface CandidateNoteData {
  author?: string
  text: string
  addedAt?: string
}

export interface CandidateSource {
  name: string
  date?: string
}

export interface CandidateRating {
  /** Number of filled stars, 0–5. */
  value: number
  /** Number of ratings, shown in brackets next to the stars. */
  count?: number
}

export interface CandidateItemData {
  id: string
  name: string
  phone?: string
  rating?: CandidateRating
  attachmentsCount?: number
  /** AI score; undefined renders an empty value. */
  aiScore?: string | number
  statusId: string
  /** Last contact date; undefined means the candidate has not been contacted yet. */
  lastContact?: string
  source?: CandidateSource
  tags?: CandidateTagData[]
  note?: CandidateNoteData
}
