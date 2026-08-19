import type { JobAdvertisement, JobPublication } from './types'

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
function parseCzechDate(value: string) {
  const match = value.trim().match(/^(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?\.?$/)

  if (!match) {
    return undefined
  }

  const [, day, month, year] = match

  return new Date(
    year ? Number(year) : new Date().getFullYear(),
    Number(month) - 1,
    Number(day),
  ).getTime()
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
