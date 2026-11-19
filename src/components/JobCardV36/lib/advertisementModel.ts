import type {
  JobAdvertisement,
  JobPublication,
  JobPublicationHighlight,
  JobPublicationStatus,
} from '../types'
import {
  formatCompactDateRange,
  formatDaysAgoLabel,
  formatRemainingDaysLabel,
  getRemainingCalendarDays,
  richestDateLabel,
  stripYear,
} from './dates'

export const ENDING_SOON_DAYS = 7

/** An advertisement that expired at most this many days ago still counts as "recently ended". */
export const RECENTLY_ENDED_DAYS = 7

export type AdvertisementTone = 'success' | 'warning' | 'ended' | 'neutral'

export type AdvertisementKind =
  | 'notPublished'
  | 'running'
  | 'runningDifferent'
  | 'runningMixed'
  | 'endingSoon'
  /** Expired 0 to 7 days ago; highlighted with the same tone as endingSoon. */
  | 'endedRecently'
  /** Expired more than a week ago. */
  | 'ended'
  /** Ended by the recruiter ("Ukončené vystavování"). */
  | 'endedManually'

/** Why every portal of the advertisement is shown as ended although the dates say otherwise. */
export type AdvertisementEndedBy = 'manual' | 'archived'

export interface BuildAdvertisementModelOptions {
  /** Set when the whole job was ended by the recruiter or archived; disables date based highlighting. */
  endedBy?: AdvertisementEndedBy
}

export interface AdvertisementHeaderModel {
  tone: AdvertisementTone
  /** Omitted for a running advertisement; the date (or the per portal dates) is enough then. */
  label?: string
  /** Date range or single date shown under (or next to) the label. */
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
  /** The advertisement is about to disappear or at least one portal has ended, so offer "Prodloužit". */
  canProlong: boolean
  /** Status dots are only useful once portals differ in status. */
  showStatusDots: boolean
}

const NOT_PUBLISHED_LABEL = 'Zatím nevystavený inzerát'
const ENDED_MANUALLY_LABEL = 'Ukončené vystavování'

/**
 * Calendar days since the most recent end date of the ended portals; 0 when it ended today.
 * Undefined when no end date is known or it lies in the future.
 */
function daysSinceLastEnd(publications: JobPublication[], now: Date) {
  const days = publications
    .map((publication) =>
      publication.endDate ? getRemainingCalendarDays(publication.endDate, now) : undefined,
    )
    .filter((value): value is number => value !== undefined)

  if (days.length === 0) {
    return undefined
  }

  const sinceEnd = -Math.max(...days)
  return sinceEnd >= 0 ? sinceEnd : undefined
}

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

function soonestEndDate(publications: JobPublication[], now: Date) {
  return publications.reduce<{ label: string; days: number } | undefined>((current, publication) => {
    if (!publication.endDate) {
      return current
    }

    const candidate = { label: publication.endDate, days: remainingDays(publication, now) }
    return !current || candidate.days < current.days ? candidate : current
  }, undefined)
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
}

/**
 * Turns an advertisement into everything the AdvertisementWidget renders:
 * header text and tone, portal items with their date labels, views and
 * whether the "Prodloužit" action is offered.
 */
export function buildAdvertisementModel(
  advertisement: JobAdvertisement,
  now = new Date(),
  options: BuildAdvertisementModelOptions = {},
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
      canProlong: canProlong || expired.length > 0,
      showStatusDots: new Set(items.map((item) => item.status)).size > 1,
    }
  }

  if (remaining.length === 0) {
    const sameEnd = shareSameEndDate(expired)
    const endDate = sameEnd ? richestDateLabel(endDates(expired)) : undefined
    const startDate = shareSameStartDate(expired)
      ? richestDateLabel(expired.map((publication) => publication.startDate))
      : undefined
    const dateInfo = endDate
      ? startDate
        ? formatCompactDateRange(startDate, endDate)
        : endDate
      : undefined

    const dateOptions = { showLiveDates: false, showEndedDates: !sameEnd }

    if (options.endedBy === 'manual') {
      return finish(
        'endedManually',
        { tone: 'ended', label: ENDED_MANUALLY_LABEL, dateInfo },
        'active',
        dateOptions,
        true,
      )
    }

    const daysSinceEnd = options.endedBy ? undefined : daysSinceLastEnd(expired, now)

    if (daysSinceEnd !== undefined && daysSinceEnd <= RECENTLY_ENDED_DAYS) {
      return finish(
        'endedRecently',
        {
          tone: 'warning',
          label: daysSinceEnd <= 0 ? 'Skončilo dnes' : `Skončilo ${formatDaysAgoLabel(daysSinceEnd)}`,
          dateInfo,
        },
        'active',
        dateOptions,
        true,
      )
    }

    return finish('ended', { tone: 'ended', label: 'Skončilo', dateInfo }, 'active', dateOptions, true)
  }

  const allRemainingDatedEndingSoon =
    remainingDated.length > 0 &&
    remainingDated.every((publication) => isPublicationEndingSoon(publication, now))

  if (allRemainingDatedEndingSoon) {
    const soonest = soonestEndDate(remainingDated, now)
    const liveDated = remaining.filter(
      (publication) => publication.startDate && publication.endDate,
    )
    const samePeriod = shareSameStartDate(liveDated) && shareSameEndDate(liveDated)
    const dateInfo = samePeriod
      ? formatCompactDateRange(liveDated[0].startDate, liveDated[0].endDate as string)
      : soonest
        ? stripYear(soonest.label)
        : undefined

    return finish(
      'endingSoon',
      {
        tone: 'warning',
        label: soonest ? formatEndingSoonLabel(soonest.label, now) : 'Končí brzy',
        dateInfo,
      },
      'endingSoon',
      { showLiveDates: !shareSameEndDate(remainingDated), showEndedDates: expired.length > 0 },
      true,
    )
  }

  if (expired.length > 0) {
    const remainingEnd = shareSameEndDate(remainingDated)
      ? richestDateLabel(endDates(remainingDated))
      : undefined

    const remainingStart = shareSameStartDate(remaining) ? remaining[0].startDate : undefined
    const runningHeader: AdvertisementHeaderModel =
      remainingEnd && remainingStart
        ? { tone: 'success', dateInfo: formatCompactDateRange(remainingStart, remainingEnd) }
        : remainingEnd
          ? { tone: 'success', label: 'Běžící', dateInfo: stripYear(remainingEnd) }
          : { tone: 'success' }

    return finish(
      'runningMixed',
      runningHeader,
      'active',
      { showLiveDates: !remainingEnd, showEndedDates: true },
    )
  }

  const samePeriod = shareSameStartDate(remaining) && shareSameEndDate(remaining)
  const startDate = remaining[0]?.startDate
  const endDate = samePeriod ? richestDateLabel(endDates(remaining)) : undefined

  if (samePeriod && startDate && endDate) {
    return finish(
      'running',
      { tone: 'success', dateInfo: formatCompactDateRange(startDate, endDate) },
      'active',
      { showLiveDates: false, showEndedDates: false },
    )
  }

  return finish(
    'runningDifferent',
    { tone: 'success' },
    'active',
    { showLiveDates: true, showEndedDates: false },
  )
}
