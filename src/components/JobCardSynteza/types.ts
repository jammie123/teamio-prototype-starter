import type { OptionColor } from '../OptionList'

export type JobPublicationStatus = 'active' | 'endingSoon' | 'expired'

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

export interface JobPublication {
  id: string
  channel: string
  status?: JobPublicationStatus
  startDate: string
  endDate?: string
  viewCount?: number
  reactionCount?: number
}

export type JobAdvertisementStatus = 'draft'

export interface JobAdvertisement {
  id: string
  title?: string
  status?: JobAdvertisementStatus
  publications?: JobPublication[]
}

export interface JobCardCandidates {
  new?: number
  unassessed?: number
  preselected?: number
  opalcovani?: number
  newOpalcovani?: number
  invited?: number
  hired?: number
  total?: number
}

export type JobCandidateStat = Exclude<keyof JobCardCandidates, 'newOpalcovani' | 'total'>

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
