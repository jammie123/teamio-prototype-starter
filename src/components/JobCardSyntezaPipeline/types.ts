export type {
  JobAdvertisement,
  JobAdvertisementStatus,
  JobCardAction,
  JobCardActivity,
  JobCardActivityType,
  JobCardCandidates,
  JobCardNote,
  JobPublication,
  JobPublicationStatus,
} from '../JobCardSynteza/types'
import type { JobCardCandidates } from '../JobCardSynteza/types'

export type JobCandidateStat = Exclude<keyof JobCardCandidates, 'new' | 'newOpalcovani'>
