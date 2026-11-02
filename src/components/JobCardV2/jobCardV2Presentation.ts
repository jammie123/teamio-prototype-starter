import {
  formatCompactDateRange,
  formatExpiredPortalsLabel,
  formatRemainingDaysLabel,
  getRemainingCalendarDays,
  shareSameEndDate,
  stripYear,
} from '../JobCard/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCard/types'

export const JOB_CARD_V2_ENDING_SOON_DAYS = 7

export type JobCardV2AdvertisementKind =
  | 'empty'
  | 'runningSame'
  | 'runningDifferent'
  | 'mixed'
  | 'ended'
  | 'endingSoon'

export type JobCardV2Tone = 'success' | 'warning' | 'ended'

export interface JobCardV2PortalModel {
  publication: JobPublication
  tone: JobCardV2Tone
  dateLabel?: string
}

export type JobCardV2AdvertisementModel =
  | { kind: 'empty' }
  | {
      kind: Exclude<JobCardV2AdvertisementKind, 'empty'>
      heading: string
      headingTone: JobCardV2Tone
      portals: JobCardV2PortalModel[]
    }

function isExpired(publication: JobPublication) {
  return publication.status === 'expired'
}

function shareSameStartDate(publications: JobPublication[]) {
  if (publications.length === 0) {
    return false
  }

  const labels = publications.map((publication) =>
    publication.startDate ? stripYear(publication.startDate) : undefined,
  )

  if (labels.some((label) => label === undefined)) {
    return false
  }

  return labels.every((label) => label === labels[0])
}

function richestEndDate(publications: JobPublication[]) {
  const dates = publications
    .map((publication) => publication.endDate)
    .filter((date): date is string => Boolean(date))

  return dates.find((date) => /\d{4}/.test(date)) ?? dates[0]
}

function isPublicationEndingSoon(publication: JobPublication, now: Date) {
  if (isExpired(publication)) {
    return false
  }

  if (publication.status === 'endingSoon') {
    return true
  }

  if (!publication.endDate) {
    return false
  }

  const days = getRemainingCalendarDays(publication.endDate, now)
  return days !== undefined && days >= 0 && days <= JOB_CARD_V2_ENDING_SOON_DAYS
}

function remainingPublications(publications: JobPublication[]) {
  return publications.filter((publication) => !isExpired(publication))
}

function datedPublications(publications: JobPublication[]) {
  return publications.filter((publication) => Boolean(publication.endDate))
}

function formatRunningSameHeading(startDate: string, endDate: string) {
  return `Běží od ${formatCompactDateRange(startDate, endDate).replace(' – ', ' do ')}`
}

function formatEndedOnLabel(endDate: string) {
  return `ukončeno ${stripYear(endDate)}`
}

function formatPortalDateRange(startDate: string, endDate: string) {
  return `${stripYear(startDate)} – ${stripYear(endDate)}`
}

function formatLivePortalDateLabel(publication: JobPublication) {
  if (publication.startDate && publication.endDate) {
    return formatPortalDateRange(publication.startDate, publication.endDate)
  }

  if (publication.endDate) {
    return `do ${stripYear(publication.endDate)}`
  }

  return undefined
}

function formatEndingSoonHeading(endDate: string, now: Date) {
  const days = getRemainingCalendarDays(endDate, now)
  const date = stripYear(endDate)

  if (days === undefined) {
    return `Končí · ${date}`
  }

  if (days <= 0) {
    return `Končí dnes · ${date}`
  }

  return `Končí za ${formatRemainingDaysLabel(days)} · ${date}`
}

function earliestRemainingEndDate(publications: JobPublication[], now: Date) {
  return publications.reduce<{ label: string; time: number } | undefined>((current, publication) => {
    if (!publication.endDate) {
      return current
    }

    const days = getRemainingCalendarDays(publication.endDate, now)
    const time = days === undefined ? Number.POSITIVE_INFINITY : days
    const candidate = { label: publication.endDate, time }

    if (!current || candidate.time < current.time) {
      return candidate
    }

    return current
  }, undefined)
}

function portalDateLabel(
  publication: JobPublication,
  options: { showLiveDates: boolean; showEndedDates: boolean },
) {
  if (isExpired(publication)) {
    return options.showEndedDates && publication.endDate
      ? formatEndedOnLabel(publication.endDate)
      : undefined
  }

  return options.showLiveDates ? formatLivePortalDateLabel(publication) : undefined
}

function publicationDateSortKey(publication: JobPublication, now: Date) {
  if (!publication.endDate) {
    return Number.POSITIVE_INFINITY
  }

  const days = getRemainingCalendarDays(publication.endDate, now)
  return days ?? Number.POSITIVE_INFINITY
}

function sortPublications(publications: JobPublication[], now: Date) {
  return [...publications].sort((left, right) => {
    const leftEnded = isExpired(left)
    const rightEnded = isExpired(right)

    if (leftEnded !== rightEnded) {
      return leftEnded ? 1 : -1
    }

    return publicationDateSortKey(left, now) - publicationDateSortKey(right, now)
  })
}

function mapPortals(
  publications: JobPublication[],
  liveTone: Exclude<JobCardV2Tone, 'ended'>,
  options: { showLiveDates: boolean; showEndedDates: boolean },
): JobCardV2PortalModel[] {
  return publications.map((publication) => ({
    publication,
    tone: isExpired(publication) ? 'ended' : liveTone,
    dateLabel: portalDateLabel(publication, options),
  }))
}

export function buildJobCardV2AdvertisementModel(
  advertisement: JobAdvertisement,
  now = new Date(),
): JobCardV2AdvertisementModel {
  const publications = sortPublications(advertisement.publications ?? [], now)

  if (publications.length === 0) {
    return { kind: 'empty' }
  }

  const remaining = remainingPublications(publications)
  const expired = publications.filter(isExpired)
  const remainingDated = datedPublications(remaining)

  if (remaining.length === 0) {
    const sameEnd = shareSameEndDate(expired)
    const endDate = sameEnd ? richestEndDate(expired) : undefined

    return {
      kind: 'ended',
      heading: endDate ? `Ukončeno ${endDate}` : 'Ukončeno',
      headingTone: 'ended',
      portals: mapPortals(publications, 'success', {
        showLiveDates: false,
        showEndedDates: !sameEnd,
      }),
    }
  }

  const allRemainingDatedEndingSoon =
    remainingDated.length > 0 &&
    remainingDated.every((publication) => isPublicationEndingSoon(publication, now))

  if (allRemainingDatedEndingSoon) {
    const sameEnd = shareSameEndDate(remainingDated)
    const soonest = earliestRemainingEndDate(remainingDated, now)
    const heading = soonest
      ? formatEndingSoonHeading(soonest.label, now)
      : 'Končí brzy'

    return {
      kind: 'endingSoon',
      heading,
      headingTone: 'warning',
      portals: mapPortals(publications, 'warning', {
        showLiveDates: !sameEnd,
        showEndedDates: expired.length > 0,
      }),
    }
  }

  if (expired.length > 0) {
    const sameRemainingEnd = shareSameEndDate(remainingDated)
    const remainingEnd = sameRemainingEnd ? richestEndDate(remainingDated) : undefined
    const endedNote = formatExpiredPortalsLabel(expired.length)
    const heading = remainingEnd
      ? `Běží do ${stripYear(remainingEnd)} · ${endedNote}`
      : `Běží v různých obdobích · ${endedNote}`

    return {
      kind: 'mixed',
      heading,
      headingTone: 'success',
      portals: mapPortals(publications, 'success', {
        showLiveDates: !remainingEnd,
        showEndedDates: true,
      }),
    }
  }

  const samePeriod = shareSameStartDate(remaining) && shareSameEndDate(remaining)
  const startDate = remaining[0]?.startDate
  const endDate = samePeriod ? richestEndDate(remaining) : undefined

  if (samePeriod && startDate && endDate) {
    return {
      kind: 'runningSame',
      heading: formatRunningSameHeading(startDate, endDate),
      headingTone: 'success',
      portals: mapPortals(publications, 'success', {
        showLiveDates: false,
        showEndedDates: false,
      }),
    }
  }

  return {
    kind: 'runningDifferent',
    heading: 'Běží v různých obdobích',
    headingTone: 'success',
    portals: mapPortals(publications, 'success', {
      showLiveDates: true,
      showEndedDates: false,
    }),
  }
}
