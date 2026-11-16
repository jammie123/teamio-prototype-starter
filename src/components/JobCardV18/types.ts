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

/** Extra placement of a publication (e.g. Jobstip, Topováno). */
export interface JobPublicationHighlight {
  id: string
  name: string
  status?: JobPublicationStatus
  /** Pre-formatted `D. M.` or `D. M. YYYY`. */
  startDate: string
  endDate?: string
  viewCount?: number
  reactionCount?: number
}

/** One job portal the advertisement is published on. Dates are pre-formatted `D. M.` or `D. M. YYYY`. */
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
  /** Highlighted "N nový" badge on Neposouzený. */
  new?: number
  /** Highlighted "N opalcovaný" badge on Ve hře. */
  newOpalcovani?: number
  unassessed?: number
  inProgress?: number
  total?: number
}

export type JobCandidateStat = Exclude<keyof JobCardCandidates, 'new' | 'newOpalcovani'>

export interface JobCardNote {
  author: string
  text: string
  addedAt: string
  showDate?: boolean
}
