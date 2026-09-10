import type { OptionColor } from '../OptionList'

export type JobStatus = 'active' | 'published' | 'unpublished' | 'internal' | 'archived'

export type JobCardSelectableStatus = JobStatus

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

export interface JobAdvertisement {
  id: string
  title?: string
  publications?: JobPublication[]
}

export interface JobCardCandidates {
  new?: number
  unassessed?: number
  inProgress?: number
  total?: number
}

export type JobCandidateStat = keyof JobCardCandidates

export interface JobCardNote {
  author: string
  text: string
  addedAt: string
  showDate?: boolean
}
