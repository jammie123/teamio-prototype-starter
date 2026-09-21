import { partitionPublications } from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement } from '../JobCardSynteza/types'

export function isAdvertisementRunning(advertisement: JobAdvertisement) {
  return partitionPublications(advertisement.publications ?? []).active.length > 0
}
