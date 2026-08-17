import type { OptionColor } from '../OptionList'

export type JobStatus = 'open' | 'closed'

export type JobPublicationStatus = 'active' | 'expired'

export interface JobCardAction {
  id: string
  label: string
  color?: OptionColor
  onClick?: () => void
}

export interface JobPublication {
  id: string
  channel: string
  status?: JobPublicationStatus
  startDate: string
  endDate?: string
  viewCount?: number
}

export interface JobAdvertisement {
  id: string
  title?: string
  publications?: JobPublication[]
  actions?: JobCardAction[]
}

export interface JobCardCandidates {
  unreviewed?: number
  inProgress?: number
  total?: number
}
