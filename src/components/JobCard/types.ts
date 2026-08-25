import type { OptionColor } from '../OptionList'

export type JobStatus = 'active' | 'published' | 'unpublished' | 'draft' | 'archived'

export type JobCardSelectableStatus = Extract<JobStatus, 'published' | 'unpublished'>

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

export interface JobPublicationHighlight {
  id: string
  name: string
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

export type JobCandidateStat = Exclude<keyof JobCardCandidates, 'new'>
