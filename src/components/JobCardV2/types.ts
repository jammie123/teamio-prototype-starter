export type {
  JobAdvertisement,
  JobCardAction,
  JobCardMenuItem,
  JobCardMenuSection,
  JobCardSelectableStatus,
  JobPublication,
  JobPublicationHighlight,
  JobPublicationStatus,
  JobStatus,
} from '../JobCard/types'
import type { JobCardCandidates as JobCardBaseCandidates } from '../JobCard/types'

export interface JobCardCandidates extends JobCardBaseCandidates {
  newOpalcovani?: number
}

export type JobCandidateStat = Exclude<keyof JobCardCandidates, 'new' | 'newOpalcovani'>
