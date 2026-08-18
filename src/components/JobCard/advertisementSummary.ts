import type { JobAdvertisement } from './types'

export interface JobAdvertisementSummary {
  portalCount: number
  runsUntil?: string
  viewCount?: number
}

export function portalCountLabel(count: number) {
  if (count === 1) {
    return `${count} portál`
  }

  if (count < 5) {
    return `${count} portály`
  }

  return `${count} portálů`
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

export function getAdvertisementSummary(advertisement: JobAdvertisement): JobAdvertisementSummary {
  const publications = advertisement.publications ?? []

  const viewCounts = publications
    .map((publication) => publication.viewCount)
    .filter((viewCount): viewCount is number => viewCount !== undefined)

  const latestEndDate = publications.reduce<{ label: string; time: number } | undefined>(
    (latest, publication) => {
      if (!publication.endDate) {
        return latest
      }

      const time = parseCzechDate(publication.endDate)

      if (time === undefined) {
        return latest ?? { label: publication.endDate, time: Number.NEGATIVE_INFINITY }
      }

      return latest && latest.time >= time ? latest : { label: publication.endDate, time }
    },
    undefined,
  )

  return {
    portalCount: publications.length,
    runsUntil: latestEndDate?.label,
    viewCount: viewCounts.length === 0 ? undefined : viewCounts.reduce((sum, count) => sum + count, 0),
  }
}
