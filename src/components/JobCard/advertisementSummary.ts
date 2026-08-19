import type { JobAdvertisement, JobPublication } from './types'
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

function stripYear(value: string) {
  return value.replace(/\s+\d{4}\.?$/, '')
}

function pickEndDate(publications: JobPublication[], pick: 'earliest' | 'latest') {
  return publications.reduce<{ label: string; time: number } | undefined>((current, publication) => {
    if (!publication.endDate) {
      return current
    }

    const time = parseCzechDate(publication.endDate)
    const candidate =
      time === undefined
        ? {
            label: publication.endDate,
            time: pick === 'earliest' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY,
          }
        : { label: publication.endDate, time }

    if (!current) {
      return candidate
    }

    if (pick === 'earliest') {
      return current.time <= candidate.time ? current : candidate
    }

    return current.time >= candidate.time ? current : candidate
  }, undefined)
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
