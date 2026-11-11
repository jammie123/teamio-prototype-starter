import type {
  JobAdvertisement,
  JobPublication,
  JobPublicationHighlight,
  JobPublicationStatus,
} from '../types'
import {
  formatCompactDateRange,
  formatRemainingDaysLabel,
  getRemainingCalendarDays,
  richestDateLabel,
  stripYear,
} from './dates'

export const ENDING_SOON_DAYS = 7

export type AdvertisementTone = 'success' | 'warning' | 'ended' | 'neutral'

export type AdvertisementKind =
  | 'notPublished'
  | 'running'
  | 'runningDifferent'
  | 'runningMixed'
  | 'endingSoon'
  | 'ended'

export interface AdvertisementHeaderModel {
  tone: AdvertisementTone
  label: string
  /** From–to range shown next to the label (`1. 9. – 30. 9. 2026`). */
  dateInfo?: string
}

export interface PublicationModel {
  publication: JobPublication
  status: JobPublicationStatus
  /** `do 30. 9.` for live portals, `ukončeno 15. 8.` for ended ones. */
  dateLabel?: string
  highlights: JobPublicationHighlight[]
}

export interface AdvertisementModel {
  kind: AdvertisementKind
  header: AdvertisementHeaderModel
  publications: PublicationModel[]
  /** Sum of views over all portals. */
  viewCount?: number
  /** The advertisement is about to disappear, so offer "Prodloužit". */
  canProlong: boolean
  /** Status dots are only useful once portals differ in status. */
  showStatusDots: boolean
  /** All portals share the same start and end dates. Otherwise they stack in a column. */
  sharedDates: boolean
}

const NOT_PUBLISHED_LABEL = 'Zatím nevystavený inzerát'

function isExpired(publication: JobPublication) {
  return publication.status === 'expired'
}

function shareSameDate(
  publications: JobPublication[],
  pick: (publication: JobPublication) => string | undefined,
) {
  if (publications.length === 0) {
    return false
  }

  const labels = publications.map((publication) => {
    const date = pick(publication)
    return date ? stripYear(date) : undefined
  })

  if (labels.some((label) => label === undefined)) {
    return false
  }

  return labels.every((label) => label === labels[0])
}

const shareSameStartDate = (publications: JobPublication[]) =>
  shareSameDate(publications, (publication) => publication.startDate)

const shareSameEndDate = (publications: JobPublication[]) =>
  shareSameDate(publications, (publication) => publication.endDate)

function endDates(publications: JobPublication[]) {
  return publications
    .map((publication) => publication.endDate)
    .filter((date): date is string => Boolean(date))
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
  return days !== undefined && days >= 0 && days <= ENDING_SOON_DAYS
}

function remainingDays(publication: JobPublication, now: Date) {
  if (!publication.endDate) {
    return Number.POSITIVE_INFINITY
  }

  return getRemainingCalendarDays(publication.endDate, now) ?? Number.POSITIVE_INFINITY
}

/** Live portals first, soonest end first; ended portals last. */
function sortPublications(publications: JobPublication[], now: Date) {
  return [...publications].sort((left, right) => {
    const leftEnded = isExpired(left)
    const rightEnded = isExpired(right)

    if (leftEnded !== rightEnded) {
      return leftEnded ? 1 : -1
    }

    return remainingDays(left, now) - remainingDays(right, now)
  })
}

function soonestPublication(publications: JobPublication[], now: Date) {
  return publications.reduce<JobPublication | undefined>((current, publication) => {
    if (!publication.endDate) {
      return current
    }

    if (!current?.endDate) {
      return publication
    }

    return remainingDays(publication, now) < remainingDays(current, now) ? publication : current
  }, undefined)
}

/** Shared from–to for the heading; omitted when portals do not share one period. */
function headingDateRange(publications: JobPublication[]): string | undefined {
  if (publications.length === 0) {
    return undefined
  }

  if (!shareSameStartDate(publications) || !shareSameEndDate(publications)) {
    return undefined
  }

  const startDate = richestDateLabel(publications.map((publication) => publication.startDate))
  const endDate = richestDateLabel(endDates(publications))

  if (!startDate || !endDate) {
    return undefined
  }

  return formatCompactDateRange(startDate, endDate)
}

function publicationDateRange(publication: JobPublication): string | undefined {
  return publication.endDate
    ? formatCompactDateRange(publication.startDate, publication.endDate)
    : undefined
}

function formatEndingSoonLabel(endDate: string, now: Date) {
  const days = getRemainingCalendarDays(endDate, now)

  if (days === undefined) {
    return 'Končí'
  }

  return days <= 0 ? 'Končí dnes' : `Končí za ${formatRemainingDaysLabel(days)}`
}

function sumViews(publications: JobPublication[]) {
  const counts = publications
    .map((publication) => publication.viewCount)
    .filter((count): count is number => count !== undefined)

  return counts.length === 0 ? undefined : counts.reduce((sum, count) => sum + count, 0)
}

interface DateLabelOptions {
  showLiveDates: boolean
  showEndedDates: boolean
}

function toPublicationModel(
  publication: JobPublication,
  liveStatus: Exclude<JobPublicationStatus, 'expired'>,
  options: DateLabelOptions,
): PublicationModel {
  const endDate = publication.endDate

  if (isExpired(publication)) {
    return {
      publication,
      status: 'expired',
      dateLabel: options.showEndedDates && endDate ? `ukončeno ${stripYear(endDate)}` : undefined,
      highlights: [],
    }
  }

  return {
    publication,
    status: liveStatus,
    dateLabel: options.showLiveDates && endDate ? `do ${stripYear(endDate)}` : undefined,
    highlights: (publication.highlights ?? []).filter((highlight) => highlight.status !== 'expired'),
  }
}

const NOT_PUBLISHED_MODEL: AdvertisementModel = {
  kind: 'notPublished',
  header: { tone: 'neutral', label: NOT_PUBLISHED_LABEL },
  publications: [],
  canProlong: false,
  showStatusDots: false,
  sharedDates: true,
}

/**
 * Turns an advertisement into everything the AdvertisementWidget renders:
 * header text and tone, portal items with their date labels, views and
 * whether the "Prodloužit" action is offered.
 */
export function buildAdvertisementModel(
  advertisement: JobAdvertisement,
  now = new Date(),
): AdvertisementModel {
  const all = advertisement.publications ?? []

  if (all.length === 0) {
    return NOT_PUBLISHED_MODEL
  }

  const publications = sortPublications(all, now)
  const remaining = publications.filter((publication) => !isExpired(publication))
  const expired = publications.filter(isExpired)
  const remainingDated = remaining.filter((publication) => Boolean(publication.endDate))
  const viewCount = sumViews(all)

  const finish = (
    kind: AdvertisementKind,
    header: AdvertisementHeaderModel,
    liveStatus: Exclude<JobPublicationStatus, 'expired'>,
    options: DateLabelOptions,
    canProlong = false,
  ): AdvertisementModel => {
    const items = publications.map((publication) =>
      toPublicationModel(publication, liveStatus, options),
    )

    return {
      kind,
      header,
      publications: items,
      viewCount,
      canProlong,
      showStatusDots: new Set(items.map((item) => item.status)).size > 1,
      sharedDates: shareSameStartDate(publications) && shareSameEndDate(publications),
    }
  }

  if (remaining.length === 0) {
    const dateInfo = headingDateRange(expired)

    return finish(
      'ended',
      { tone: 'ended', label: 'Ukončeno', dateInfo },
      'active',
      { showLiveDates: false, showEndedDates: !dateInfo },
    )
  }

  const allRemainingDatedEndingSoon =
    remainingDated.length > 0 &&
    remainingDated.every((publication) => isPublicationEndingSoon(publication, now))

  if (allRemainingDatedEndingSoon) {
    const soonest = soonestPublication(remainingDated, now)
    const liveDated = remaining.filter(
      (publication) => publication.startDate && publication.endDate,
    )
    const dateInfo =
      headingDateRange(liveDated) ?? (soonest ? publicationDateRange(soonest) : undefined)

    return finish(
      'endingSoon',
      {
        tone: 'warning',
        label: soonest?.endDate ? formatEndingSoonLabel(soonest.endDate, now) : 'Končí brzy',
        dateInfo,
      },
      'endingSoon',
      { showLiveDates: !shareSameEndDate(remainingDated), showEndedDates: expired.length > 0 },
      true,
    )
  }

  if (expired.length > 0) {
    const remainingRange = headingDateRange(remainingDated)

    return finish(
      'runningMixed',
      remainingRange
        ? { tone: 'success', label: 'Běží', dateInfo: remainingRange }
        : { tone: 'success', label: 'Běží v různých obdobích' },
      'active',
      { showLiveDates: !remainingRange, showEndedDates: true },
    )
  }

  const runningRange = headingDateRange(remaining)

  if (runningRange) {
    return finish(
      'running',
      { tone: 'success', label: 'Běží', dateInfo: runningRange },
      'active',
      { showLiveDates: false, showEndedDates: false },
    )
  }

  return finish(
    'runningDifferent',
    { tone: 'success', label: 'Běží v různých obdobích' },
    'active',
    { showLiveDates: true, showEndedDates: false },
  )
}
