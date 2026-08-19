import type { JobAdvertisement, JobPublication } from './types'

export interface JobAdvertisementSummary {
  activePortalNames: string[]
  firstEndsOn?: string
  viewCount?: number
}

function isActive(publication: JobPublication) {
  return publication.status !== 'expired'
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

export function getAdvertisementSummary(advertisement: JobAdvertisement): JobAdvertisementSummary {
  const publications = advertisement.publications ?? []
  const activePublications = publications.filter(isActive)

  const viewCounts = publications
    .map((publication) => publication.viewCount)
    .filter((viewCount): viewCount is number => viewCount !== undefined)

  const earliestEndDate = activePublications.reduce<{ label: string; time: number } | undefined>(
    (earliest, publication) => {
      if (!publication.endDate) {
        return earliest
      }

      const time = parseCzechDate(publication.endDate)

      if (time === undefined) {
        return earliest ?? { label: publication.endDate, time: Number.POSITIVE_INFINITY }
      }

      return earliest && earliest.time <= time
        ? earliest
        : { label: publication.endDate, time }
    },
    undefined,
  )

  return {
    activePortalNames: activePublications.map((publication) => publication.channel),
    firstEndsOn: earliestEndDate ? stripYear(earliestEndDate.label) : undefined,
    viewCount: viewCounts.length === 0 ? undefined : viewCounts.reduce((sum, count) => sum + count, 0),
  }
}
