import type { JobPortalLogoType } from '../JobPortalLogo'

export type JobDetailStatsPeriod = 'sincePublication' | 'last6Months' | 'lastMonth'

export interface JobDetailStatsTimeSeriesByPlace {
  placeId: string
  placeName: string
  views: number
  reactions: number
  logoType?: JobPortalLogoType
}

export interface JobDetailStatsTimeSeriesPoint {
  date: string
  views: number
  reactions: number
  byPlace: JobDetailStatsTimeSeriesByPlace[]
}

export interface JobDetailStatsPublicationRow {
  id: string
  placeName: string
  views: number
  reactions: number
  logoType?: JobPortalLogoType
}

export interface JobDetailStatsSummary {
  periodStartDate: string
  periodEndDate: string
  places: JobDetailStatsPublicationRow[]
}

export interface JobDetailStatsDateRange {
  start: Date
  end: Date
}

export const JOB_DETAIL_STATS_PERIODS: JobDetailStatsPeriod[] = [
  'sincePublication',
  'last6Months',
  'lastMonth',
]

export function parseDateOnly(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toDateOnlyIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function subtractDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() - days)
  return startOfDay(next)
}

function subtractMonths(date: Date, months: number): Date {
  const next = new Date(date)
  next.setMonth(next.getMonth() - months)
  return startOfDay(next)
}

export function resolvePeriodRange(
  period: JobDetailStatsPeriod,
  publishedAt: string,
  today: Date = new Date(),
): JobDetailStatsDateRange {
  const end = startOfDay(today)
  const publicationStart = startOfDay(parseDateOnly(publishedAt))

  let computedStart: Date
  switch (period) {
    case 'sincePublication':
      computedStart = publicationStart
      break
    case 'last6Months':
      computedStart = subtractMonths(end, 6)
      break
    case 'lastMonth':
      computedStart = subtractDays(end, 30)
      break
    default: {
      const exhaustive: never = period
      return exhaustive
    }
  }

  const start = computedStart > publicationStart ? computedStart : publicationStart
  return { start, end }
}

export function filterSeriesByRange(
  series: JobDetailStatsTimeSeriesPoint[],
  range: JobDetailStatsDateRange,
): JobDetailStatsTimeSeriesPoint[] {
  const startIso = toDateOnlyIso(range.start)
  const endIso = toDateOnlyIso(range.end)
  return series.filter((point) => point.date >= startIso && point.date <= endIso)
}

export function sumJobDetailStatsPlaces(places: JobDetailStatsPublicationRow[]) {
  return places.reduce(
    (acc, place) => ({
      views: acc.views + place.views,
      reactions: acc.reactions + place.reactions,
    }),
    { views: 0, reactions: 0 },
  )
}

const chartAxisDateFormatter = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'numeric',
})

const summaryDateFormatter = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
})

export function formatJobDetailStatsChartDate(iso: string): string {
  return chartAxisDateFormatter.format(parseDateOnly(iso))
}

export function formatJobDetailStatsPublishedDate(iso: string): string {
  return summaryDateFormatter.format(parseDateOnly(iso))
}

export function formatJobDetailStatsPublicationRange(startDate: string, endDate: string): string {
  const start = formatJobDetailStatsPublishedDate(startDate)
  const end = formatJobDetailStatsPublishedDate(endDate)
  if (startDate === endDate) {
    return start
  }
  return `${start} – ${end}`
}
