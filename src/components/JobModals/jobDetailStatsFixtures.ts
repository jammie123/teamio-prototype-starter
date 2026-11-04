import {
  filterSeriesByRange,
  resolvePeriodRange,
  toDateOnlyIso,
  type JobDetailStatsPeriod,
  type JobDetailStatsPublicationRow,
  type JobDetailStatsSummary,
  type JobDetailStatsTimeSeriesPoint,
} from './jobDetailStatsPeriod'

function seededValue(seed: number, min: number, max: number): number {
  const raw = Math.sin(seed * 12.9898) * 43758.5453
  const fraction = raw - Math.floor(raw)
  return Math.round(min + fraction * (max - min))
}

export function buildDailySeries(
  publishedAt: string,
  today: Date = new Date(),
): JobDetailStatsTimeSeriesPoint[] {
  const start = resolvePeriodRange('sincePublication', publishedAt, today).start
  const end = resolvePeriodRange('sincePublication', publishedAt, today).end
  const points: JobDetailStatsTimeSeriesPoint[] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    const iso = toDateOnlyIso(cursor)
    const dayIndex = points.length
    points.push({
      date: iso,
      views: seededValue(dayIndex + 1, 50, 250),
      reactions: seededValue(dayIndex + 101, 2, 15),
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return points
}

const SAMPLE_PLACE_DEFINITIONS = [
  { id: 'jobs-cz', placeName: 'Jobs.cz', logoType: 'jobs-cz' as const, share: 0.67 },
  { id: 'prace-cz', placeName: 'Práce.cz', logoType: 'prace-cz' as const, share: 0.33 },
] as const

export function buildPlaceRowsFromTotals(
  totalViews: number,
  totalReactions: number,
  startDate: string,
  endDate: string,
): JobDetailStatsPublicationRow[] {
  let viewsAssigned = 0
  let reactionsAssigned = 0

  return SAMPLE_PLACE_DEFINITIONS.map((place, index) => {
    const isLast = index === SAMPLE_PLACE_DEFINITIONS.length - 1
    const views = isLast ? totalViews - viewsAssigned : Math.round(totalViews * place.share)
    const reactions = isLast
      ? totalReactions - reactionsAssigned
      : Math.round(totalReactions * place.share)
    viewsAssigned += views
    reactionsAssigned += reactions

    return {
      id: place.id,
      placeName: place.placeName,
      logoType: place.logoType,
      startDate,
      endDate,
      views,
      reactions,
    }
  })
}

export function summarizeSeries(
  series: JobDetailStatsTimeSeriesPoint[],
  publicationWindow: { startDate: string; endDate: string },
): JobDetailStatsSummary {
  const totalViews = series.reduce((sum, point) => sum + point.views, 0)
  const totalReactions = series.reduce((sum, point) => sum + point.reactions, 0)
  return {
    places: buildPlaceRowsFromTotals(
      totalViews,
      totalReactions,
      publicationWindow.startDate,
      publicationWindow.endDate,
    ),
  }
}

export function jobDetailStatsFixtureForPeriod(
  period: JobDetailStatsPeriod,
  publishedAt: string,
  publicationEndDate: string,
  today: Date = new Date(),
) {
  const fullSeries = buildDailySeries(publishedAt, today)
  const range = resolvePeriodRange(period, publishedAt, today)
  const series = filterSeriesByRange(fullSeries, range)
  return {
    series,
    summary: summarizeSeries(series, {
      startDate: publishedAt,
      endDate: publicationEndDate,
    }),
  }
}

export const sampleJobDetailStatsJobTitle = 'Projektový manažer (m/ž)'

export const sampleJobDetailStatsPublishedAt = '2026-08-01'

export const sampleJobDetailStatsPublicationEnd = '2026-11-20'

export const sampleJobDetailStatsPublishedRecent = '2026-10-25'
