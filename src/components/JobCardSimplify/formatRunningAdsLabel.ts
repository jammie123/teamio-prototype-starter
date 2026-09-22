import { isAdvertisementRunning } from '../JobCardSyntezaMoreAds/advertisementBatch'
import type { JobAdvertisement } from '../JobCardSynteza/types'

export function countRunningAdvertisements(advertisements: JobAdvertisement[]) {
  return advertisements.filter(isAdvertisementRunning).length
}

export function formatRunningAdsLabel(count: number) {
  if (count <= 0) {
    return null
  }

  if (count === 1) {
    return '1 běžící inzerát'
  }

  if (count <= 4) {
    return `${count} běžící inzeráty`
  }

  return `${count} běžících inzerátů`
}
