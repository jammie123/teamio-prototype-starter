import type { JobAdvertisement, JobStatus } from '../types'
import {
  buildAdvertisementModel,
  type AdvertisementEndedBy,
  type AdvertisementModel,
} from './advertisementModel'

/** An unpublished or archived job keeps its advertisements, but every portal counts as ended. */
function asEndedAdvertisement(advertisement: JobAdvertisement): JobAdvertisement {
  return {
    ...advertisement,
    publications: advertisement.publications?.map((publication) => ({
      ...publication,
      status: 'expired' as const,
      highlights: publication.highlights?.map((highlight) => ({
        ...highlight,
        status: 'expired' as const,
      })),
    })),
  }
}

export interface JobCardAdvertisementsModel {
  /** Advertisements as the card shows them (ended for an unpublished or archived job). */
  advertisements: JobAdvertisement[]
  /** Model of the first advertisement, which feeds the stats footer. */
  stats?: AdvertisementModel
  /** Why the advertisements count as ended regardless of their dates. */
  endedBy?: AdvertisementEndedBy
  /**
   * The card is greyed out: job ended by the recruiter or archived, or advertisement expired more
   * than 7 days ago. A recently expired advertisement keeps the card active so its highlight stands out.
   */
  isMuted: boolean
}

export function jobEndedBy(status: JobStatus): AdvertisementEndedBy | undefined {
  if (status === 'unpublished') {
    return 'manual'
  }

  return status === 'archived' ? 'archived' : undefined
}

export function buildJobCardAdvertisements(
  status: JobStatus,
  advertisements: JobAdvertisement[],
  now?: Date,
): JobCardAdvertisementsModel {
  const endedBy = jobEndedBy(status)
  const shown = endedBy ? advertisements.map(asEndedAdvertisement) : advertisements
  const stats = shown[0] ? buildAdvertisementModel(shown[0], now, { endedBy }) : undefined

  return {
    advertisements: shown,
    stats,
    endedBy,
    isMuted: Boolean(endedBy) || stats?.kind === 'ended',
  }
}
