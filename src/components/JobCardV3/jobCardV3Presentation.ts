import { getRemainingCalendarDays, stripYear } from '../JobCard/advertisementSummary'
import { buildJobCardV2AdvertisementModel } from '../JobCardV2/jobCardV2Presentation'
import type { JobAdvertisement, JobPublication } from './types'

const CHANNEL_COUNT_WORDS: Record<number, string> = {
  2: 'dvou',
  3: 'tří',
  4: 'čtyř',
}

function isExpired(publication: JobPublication) {
  return publication.status === 'expired'
}

function soonestEndDate(publications: JobPublication[], now: Date) {
  return publications.reduce<string | undefined>((current, publication) => {
    if (!publication.endDate || isExpired(publication)) {
      return current
    }

    if (!current) {
      return publication.endDate
    }

    const currentDays = getRemainingCalendarDays(current, now)
    const nextDays = getRemainingCalendarDays(publication.endDate, now)

    if (currentDays === undefined) {
      return publication.endDate
    }

    if (nextDays === undefined) {
      return current
    }

    return nextDays < currentDays ? publication.endDate : current
  }, undefined)
}

export function formatDisappearanceChannels(count: number) {
  if (count <= 1) {
    return 'z jediného kanálu'
  }

  const word = CHANNEL_COUNT_WORDS[count] ?? String(count)
  return `ze všech ${word} kanálů`
}

export function buildAdvertiseDisappearanceNotice(
  advertisement: JobAdvertisement,
  now = new Date(),
) {
  const model = buildJobCardV2AdvertisementModel(advertisement, now)

  if (model.kind !== 'endingSoon') {
    return undefined
  }

  const publications = advertisement.publications ?? []
  const endDate = soonestEndDate(publications, now)
  const count = publications.filter((publication) => !isExpired(publication)).length

  if (!endDate || count === 0) {
    return undefined
  }

  return {
    message: `Po ${stripYear(endDate)} zmizí inzerát ${formatDisappearanceChannels(count)}.`,
  }
}
