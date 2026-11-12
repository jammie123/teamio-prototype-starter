export type JobStatus = 'published' | 'unpublished' | 'draft'

export type JobPublicationStatus = 'active' | 'endingSoon' | 'expired'

export interface JobCardMenuItem {
  id: string
  label: string
  onClick?: () => void
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
