export type {
  JobAdvertisement,
  JobCardAction,
  JobCardNote,
  JobCardSelectableStatus,
  JobPublication,
  JobPublicationHighlight,
  JobPublicationStatus,
  JobStatus,
} from '../JobCardV14/types'

export interface JobCardCandidates {
  /** Highlighted "N nový" badge on Neposouzený. */
  new?: number
  unassessed?: number
  preselected?: number
  evaluated?: number
}

export type JobCandidateStat = Exclude<keyof JobCardCandidates, 'new'>
