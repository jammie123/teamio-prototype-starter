import type { JobAdvertisement, JobPublication, JobPublicationHighlight } from './types'
import { formatCount } from './formatCount'

export interface JobAdvertisementSummary {
  activePortalNames: string[]
  firstEndsOn?: string
  expiredPortalCount: number
  lastEndedOn?: string
  viewCount?: number
}

function isActive(publication: JobPublication) {
  return publication.status !== 'expired'
}

function isExpired(publication: JobPublication) {
  return publication.status === 'expired'
}

/** Dates come pre-formatted as `D. M.` or `D. M. YYYY`; the year is optional in the UI. */
function parseCzechDate(value: string, now = new Date()) {
  const match = value.trim().match(/^(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?\.?$/)

  if (!match) {
    return undefined
  }

  const [, day, month, year] = match

  return new Date(
    year ? Number(year) : now.getFullYear(),
    Number(month) - 1,
    Number(day),
  ).getTime()
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function getRemainingCalendarDays(endDate: string, now = new Date()) {
  const time = parseCzechDate(endDate, now)

  if (time === undefined) {
    return undefined
  }

  return Math.round((startOfDay(new Date(time)) - startOfDay(now)) / MS_PER_DAY)
}

export function formatRemainingDaysLabel(days: number) {
  if (days === 0) {
    return 'dnes'
  }

  if (days === 1) {
    return '1 den'
  }

  if (days >= 2 && days <= 4) {
    return `${days} dny`
  }

  return `${days} dní`
}

/** Insertions ending today through one week from now get the warning treatment. */
export const ENDING_SOON_MAX_DAYS = 7

export function isEndingSoonDays(days: number | undefined) {
  return days !== undefined && days >= 0 && days <= ENDING_SOON_MAX_DAYS
}

export function isEndingSoon(endDate?: string, now = new Date()) {
  if (!endDate) {
    return false
  }

  return isEndingSoonDays(getRemainingCalendarDays(endDate, now))
}

export function formatEndingSoonLabel(days: number) {
  if (days === 0) {
    return 'Končí dnes'
  }

  return `Končí za ${formatRemainingDaysLabel(days)}`
}

export function formatEndingSoonWithDate(days: number, endDate: string) {
  return `${formatEndingSoonLabel(days)} · ${endDate}`
}

export function formatPublicationDateLabel({
  startDate,
  endDate,
  remainingDays,
}: {
  startDate: string
  endDate?: string
  remainingDays?: number
}) {
  if (endDate && remainingDays !== undefined && isEndingSoonDays(remainingDays)) {
    return formatEndingSoonWithDate(remainingDays, endDate)
  }

  return formatPublicationRange(startDate, endDate)
}

export function stripYear(value: string) {
  return value.replace(/\s+\d{4}\.?$/, '')
}

function dateYear(value: string) {
  return value.trim().match(/(\d{4})\.?$/)?.[1]
}

/** Same year once at the end; both years only when the range crosses a year. */
export function formatCompactDateRange(startDate: string, endDate: string) {
  const startYear = dateYear(startDate)
  const endYear = dateYear(endDate)
  const startDay = stripYear(startDate)
  const endDay = stripYear(endDate)
  const yearsDiffer = Boolean(startYear && endYear && startYear !== endYear)

  if (startDay === endDay && !yearsDiffer) {
    const year = endYear ?? startYear
    return year ? `${startDay} ${year}` : startDay
  }

  if (yearsDiffer) {
    return `${startDay} ${startYear} – ${endDay} ${endYear}`
  }

  const year = endYear ?? startYear
  const endLabel = year ? `${endDay} ${year}` : endDay
  return `${startDay} – ${endLabel}`
}

export function formatUntilDate(endDate: string, { expiredSameDate = false } = {}) {
  return expiredSameDate ? `ukončeno do ${endDate}` : `do ${endDate}`
}

export function formatPublicationRange(startDate: string, endDate?: string) {
  if (!endDate) {
    return startDate
  }

  return formatCompactDateRange(startDate, endDate)
}

export function shareSameStartDate(publications: JobPublication[]) {
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

export function richestDateLabel(dates: string[]) {
  return dates.find((date) => /\d{4}/.test(date)) ?? dates[0]
}

export function shareSameEndDate(publications: JobPublication[]) {
  if (publications.length === 0) {
    return false
  }

  const labels = publications.map((publication) =>
    publication.endDate ? stripYear(publication.endDate) : undefined,
  )

  if (labels.some((label) => label === undefined)) {
    return false
  }

  return labels.every((label) => label === labels[0])
}

export function publicationDateKey(publication: JobPublication) {
  return [
    publication.startDate ? stripYear(publication.startDate) : '',
    publication.endDate ? stripYear(publication.endDate) : '',
  ].join('|')
}

/** Portals that share a start and end day stay in first-seen order, one group per date. */
export function groupPublicationsByDate(publications: JobPublication[]) {
  const groups: JobPublication[][] = []
  const indexByKey = new Map<string, number>()

  for (const publication of publications) {
    const key = publicationDateKey(publication)
    const existing = indexByKey.get(key)

    if (existing === undefined) {
      indexByKey.set(key, groups.length)
      groups.push([publication])
      continue
    }

    groups[existing].push(publication)
  }

  return groups
}

export function isEndingSoonPublication(publication: JobPublication, now = new Date()) {
  if (isExpired(publication) || !publication.endDate) {
    return false
  }

  return isEndingSoonDays(getRemainingCalendarDays(publication.endDate, now))
}

export function partitionPublications(publications: JobPublication[], now = new Date()) {
  const expired = publications.filter(isExpired)
  const active = publications.filter((publication) => !isExpired(publication))
  const endingSoon = active.filter((publication) => isEndingSoonPublication(publication, now))
  const running = active.filter((publication) => !isEndingSoonPublication(publication, now))

  return { active, running, endingSoon, expired }
}

export function visibleHighlights(publication: JobPublication): JobPublicationHighlight[] {
  if (publication.status === 'expired') {
    return []
  }

  return (publication.highlights ?? []).filter((highlight) => highlight.status !== 'expired')
}

function pickDate(
  publications: JobPublication[],
  field: 'startDate' | 'endDate',
  pick: 'earliest' | 'latest',
) {
  return publications.reduce<{ label: string; time: number } | undefined>((current, publication) => {
    const value = publication[field]
    if (!value) {
      return current
    }

    const time = parseCzechDate(value)
    const candidate =
      time === undefined
        ? {
            label: value,
            time: pick === 'earliest' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY,
          }
        : { label: value, time }

    if (!current) {
      return candidate
    }

    if (pick === 'earliest') {
      return current.time <= candidate.time ? current : candidate
    }

    return current.time >= candidate.time ? current : candidate
  }, undefined)
}

function pickEndDate(publications: JobPublication[], pick: 'earliest' | 'latest') {
  return pickDate(publications, 'endDate', pick)
}

export function earliestStartDateLabel(publications: JobPublication[]) {
  return pickDate(publications, 'startDate', 'earliest')?.label
}

export function isAdvertisementFullyExpired(advertisement: JobAdvertisement) {
  const publications = advertisement.publications ?? []
  return publications.length > 0 && publications.every(isExpired)
}

export function formatExpiredPortalsLabel(count: number) {
  if (count === 1) {
    return '1 portál ukončen'
  }

  if (count >= 2 && count <= 4) {
    return `${count} portály ukončeny`
  }

  return `${count} portálů ukončeno`
}

export function formatRunningHeading({
  sameDate,
  startDate,
  endDate,
  remainingDays,
}: {
  sameDate: boolean
  startDate?: string
  endDate?: string
  remainingDays?: number
}) {
  if (!sameDate || !endDate) {
    return 'Běží'
  }

  if (remainingDays !== undefined && isEndingSoonDays(remainingDays)) {
    return formatEndingSoonWithDate(remainingDays, endDate)
  }

  if (startDate) {
    return `Běží ${formatCompactDateRange(startDate, endDate)}`
  }

  return `Běží do ${endDate}`
}

export function formatEndingSoonHeading({
  sameDate,
  endDate,
  remainingDays,
}: {
  sameDate: boolean
  endDate?: string
  remainingDays?: number
}) {
  if (sameDate && endDate && remainingDays !== undefined && isEndingSoonDays(remainingDays)) {
    return formatEndingSoonWithDate(remainingDays, endDate)
  }

  return 'Končí brzy'
}

export function formatEndedHeading({
  sameDate,
  date,
}: {
  sameDate: boolean
  date?: string
}) {
  if (!sameDate || !date) {
    return 'Ukončeno'
  }

  return `Ukončeno ${date}`
}

/** Simplify 10 — unexpected expiry (all portals ended). */
export function formatAdvertisementExpiredHeading(date?: string) {
  if (!date) {
    return 'Inzerce skončila'
  }

  return `Inzerce skončila ${date}`
}

export function formatViewCountLabel(count: number) {
  const formatted = formatCount(count)

  if (count === 1) {
    return `${formatted} zhlédnutí`
  }

  if (count >= 2 && count <= 4) {
    return `${formatted} zhlédnutí`
  }

  return `${formatted} zhlédnutí`
}

const conversionPercentFormat = new Intl.NumberFormat('cs-CZ', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
})

/** Conversion = reactions / views, shown as a Czech percent. */
export function formatConversionRate(reactionCount?: number, viewCount?: number) {
  if (reactionCount === undefined || viewCount === undefined || viewCount <= 0) {
    return undefined
  }

  return `${conversionPercentFormat.format((reactionCount / viewCount) * 100)} %`
}

export function getAdvertisementSummary(advertisement: JobAdvertisement): JobAdvertisementSummary {
  const publications = advertisement.publications ?? []
  const activePublications = publications.filter(isActive)
  const expiredPublications = publications.filter(isExpired)

  const viewCounts = publications
    .map((publication) => publication.viewCount)
    .filter((viewCount): viewCount is number => viewCount !== undefined)

  const earliestEndDate = pickEndDate(activePublications, 'earliest')
  const latestExpiredEndDate = pickEndDate(expiredPublications, 'latest')

  return {
    activePortalNames: activePublications.map((publication) => publication.channel),
    firstEndsOn: earliestEndDate ? stripYear(earliestEndDate.label) : undefined,
    expiredPortalCount: expiredPublications.length,
    lastEndedOn: latestExpiredEndDate ? stripYear(latestExpiredEndDate.label) : undefined,
    viewCount: viewCounts.length === 0 ? undefined : viewCounts.reduce((sum, count) => sum + count, 0),
  }
}
