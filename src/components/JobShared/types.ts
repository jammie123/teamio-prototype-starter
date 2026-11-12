import type { OptionColor } from '../OptionList'

export type JobPublicationStatus = 'active' | 'endingSoon' | 'expired' | 'disabled'

export interface JobCardAction {
  id: string
  label: string
  description?: string
  color?: OptionColor
  onClick?: () => void
}

/** A menu item turns into a submenu once it carries nested actions. */
export interface JobCardMenuItem extends JobCardAction {
  count?: number
  actions?: JobCardMenuItem[]
}

export interface JobCardMenuSection {
  id: string
  items: JobCardMenuItem[]
}

export type JobPublicationHighlightKind = 'jobstip' | 'supermax' | 'top' | 'pzr_highlight'

export interface JobPublicationHighlight {
  id: string
  name: string
  kind?: JobPublicationHighlightKind
  status?: JobPublicationStatus
  startDate: string
  endDate?: string
  viewCount?: number
  reactionCount?: number
}

export interface JobPublication {
  id: string
  channel: string
  status?: JobPublicationStatus
  startDate: string
  endDate?: string
  viewCount?: number
  reactionCount?: number
  highlights?: JobPublicationHighlight[]
}

export type JobAdvertisementStatus = 'draft' | 'notAdvertising'

export interface JobAdvertisement {
  id: string
  title?: string
  status?: JobAdvertisementStatus
  /** When status is notAdvertising — shown in meta; falls back to latest publication end date. */
  advertisingDeclinedAt?: string
  publications?: JobPublication[]
}

export interface JobCardCandidates {
  new?: number
  unassessed?: number
  preselected?: number
  opalcovani?: number
  newOpalcovani?: number
  /** Nově ohodnocení manažerem (Simplify 8 badge u Předvybraný). */
  newOhodnoceni?: number
  invited?: number
  nabidka?: number
  hired?: number
  total?: number
}

export type JobCandidateStat = Exclude<
  keyof JobCardCandidates,
  'newOpalcovani' | 'newOhodnoceni' | 'total'
>

export type JobCardActivityType = 'rating' | 'note'

export interface JobCardActivity {
  id: string
  type: JobCardActivityType
  actor: string
  candidateName: string
  occurredAt: string
  unread?: boolean
}

export interface JobCardNote {
  author: string
  text: string
  addedAt: string
  showDate?: boolean
}
