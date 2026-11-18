import type { JobAdvertisement, JobStatus } from '../types'
import { buildAdvertisementModel, type AdvertisementModel } from './advertisementModel'

/** An unpublished job keeps its advertisements, but every portal counts as ended. */
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
  /** Advertisements as the card shows them (ended for an unpublished job). */
  advertisements: JobAdvertisement[]
  /** Model of the first advertisement, which feeds the stats footer. */
  stats?: AdvertisementModel
  /** The card is greyed out: unpublished job or ended advertisement. */
  isMuted: boolean
}

export function buildJobCardAdvertisements(
  status: JobStatus,
  advertisements: JobAdvertisement[],
  now?: Date,
): JobCardAdvertisementsModel {
  const shown = status === 'unpublished' ? advertisements.map(asEndedAdvertisement) : advertisements
  const stats = shown[0] ? buildAdvertisementModel(shown[0], now) : undefined

  return {
    advertisements: shown,
    stats,
    isMuted: status === 'unpublished' || stats?.kind === 'ended',
  }
}
