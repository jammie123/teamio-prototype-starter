export type JobResponseRateStatus = 'above' | 'expected' | 'below' | 'tooEarly' | 'noComparison'

export interface JobResponseRateData {
  responses: number
  views: number
  /** Lower bound of the usual response rate (in %) of similar ads. */
  typicalMin: number
  /** Upper bound of the usual response rate (in %) of similar ads. */
  typicalMax: number
  /** Views needed before the ad can be evaluated. */
  minViews: number
}

export interface JobResponseRateMetric {
  /** Formatted rate, e.g. "5,2 %". */
  value: string
  /** Supporting numbers, e.g. "43 odpovědí z 830 zobrazení". */
  caption: string
}

/** Positions (in % of the scale width) used to draw the comparison scale. */
export interface JobResponseRateScale {
  bandStart: number
  bandEnd: number
  marker: number
  bandStartLabel: string
  bandEndLabel: string
  /** Sentence under the scale, with the usual range rounded outwards to whole percents. */
  caption: string
  /** Text alternative of the whole scale. */
  description: string
}

export interface JobResponseRateCopy {
  /** Badge label. */
  label: string
  /** Trailing symbol of the badge label, if any. */
  symbol?: string
  title: string
  /** Highlighted response rate shown right below the title. */
  metric?: JobResponseRateMetric
  /** Scale comparing the rate with the usual range of similar ads. */
  scale?: JobResponseRateScale
  /** Explanation lines shown below the metric and scale. */
  lines: string[]
  /** Footnote about what the rate was compared with. */
  source?: string
}

export const JOB_RESPONSE_RATE_DEFAULTS: Record<JobResponseRateStatus, JobResponseRateData> = {
  above: {
    responses: 43,
    views: 830,
    typicalMin: 2.5,
    typicalMax: 4.6,
    minViews: 200,
  },
  expected: {
    responses: 28,
    views: 830,
    typicalMin: 2.5,
    typicalMax: 4.6,
    minViews: 200,
  },
  below: {
    responses: 9,
    views: 830,
    typicalMin: 2.5,
    typicalMax: 4.6,
    minViews: 200,
  },
  tooEarly: {
    responses: 3,
    views: 120,
    typicalMin: 2.5,
    typicalMax: 4.6,
    minViews: 200,
  },
  noComparison: {
    responses: 14,
    views: 500,
    typicalMin: 2.5,
    typicalMax: 4.6,
    minViews: 200,
  },
}

export const JOB_RESPONSE_RATE_SYMBOLS = {
  above: '▲',
  expected: '●',
  below: '▼',
} as const

/** The scale always spans at least this many percent so that small rates keep their position. */
const MIN_SCALE_MAX = 8

/** Czech plural of "odpověď" (1 odpověď, 2–4 odpovědi, 0 and 5+ odpovědí). */
export function formatResponsesCount(count: number): string {
  if (count === 1) return `${count} odpověď`
  if (count >= 2 && count <= 4) return `${count} odpovědi`
  return `${count} odpovědí`
}

function formatViewsCount(count: number): string {
  return `${count} zobrazení`
}

/** "z 830 zobrazení", but "ze 120 zobrazení" (ze sta dvaceti). */
function formatFromViews(count: number): string {
  return `${count >= 100 && count < 200 ? 'ze' : 'z'} ${formatViewsCount(count)}`
}

/** Formats a percentage with a decimal comma and a non-breaking space, e.g. "5,2 %". */
export function formatPercent(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}\u00a0%`
}

/** Response rate in %, e.g. 43 of 830 views -> 5.18. */
export function getResponseRate(responses: number, views: number): number {
  return views > 0 ? (responses / views) * 100 : 0
}

function rateMetric(data: JobResponseRateData): JobResponseRateMetric {
  return {
    value: formatPercent(getResponseRate(data.responses, data.views)),
    caption: `${formatResponsesCount(data.responses)} ${formatFromViews(data.views)}`,
  }
}

function rateScale(data: JobResponseRateData): JobResponseRateScale {
  const rate = getResponseRate(data.responses, data.views)
  const scaleMax = Math.max(MIN_SCALE_MAX, Math.ceil(Math.max(rate, data.typicalMax) * 1.25))
  const toPosition = (value: number) => Math.min(100, Math.max(0, (value / scaleMax) * 100))
  const bandStartLabel = formatPercent(data.typicalMin)
  const bandEndLabel = formatPercent(data.typicalMax)

  return {
    bandStart: toPosition(data.typicalMin),
    bandEnd: toPosition(data.typicalMax),
    marker: toPosition(rate),
    bandStartLabel,
    bandEndLabel,
    caption: `Typická míra odpovědí u podobných inzerátů je ${Math.floor(data.typicalMin)}–${Math.ceil(data.typicalMax)}\u00a0%.`,
    description: `Míra odpovědí ${formatPercent(rate)}, obvyklý rozsah ${bandStartLabel} až ${bandEndLabel}`,
  }
}

const COMPARED_SOURCE = 'Srovnáno s podobnými inzeráty (stejná pozice, lokalita a portály).'

export function getJobResponseRateCopy(
  status: JobResponseRateStatus,
  data: JobResponseRateData,
): JobResponseRateCopy {
  switch (status) {
    case 'above':
      return {
        label: 'Nad očekáváním',
        symbol: JOB_RESPONSE_RATE_SYMBOLS.above,
        title: 'Míra odpovědí je vyšší než obvykle',
        metric: rateMetric(data),
        scale: rateScale(data),
        lines: [],
        source: COMPARED_SOURCE,
      }
    case 'expected':
      return {
        label: 'Podle očekávání',
        symbol: JOB_RESPONSE_RATE_SYMBOLS.expected,
        title: 'Míra odpovědí je zhruba obvyklá',
        metric: rateMetric(data),
        scale: rateScale(data),
        lines: [],
        source: COMPARED_SOURCE,
      }
    case 'below':
      return {
        label: 'Pod očekáváním',
        symbol: JOB_RESPONSE_RATE_SYMBOLS.below,
        title: 'Míra odpovědí je nižší než obvykle',
        metric: rateMetric(data),
        scale: rateScale(data),
        lines: [],
        source: COMPARED_SOURCE,
      }
    case 'tooEarly':
      return {
        label: 'Zatím brzy',
        title: 'Zatím nelze spolehlivě vyhodnotit',
        metric: rateMetric(data),
        lines: [`Inzerát vyhodnotíme, až bude zobrazení víc (obvykle od ${data.minViews}).`],
      }
    case 'noComparison':
      return {
        label: 'Bez srovnání',
        title: 'Pro tuto pozici nemáme dost srovnatelných inzerátů',
        metric: rateMetric(data),
        lines: ['Míru odpovědí neporovnáváme. Číslo míry odpovědí vidíte výše.'],
      }
  }
}

export type JobResponseRateBandId = 'below' | 'expected' | 'above'

export interface JobResponseRateBand {
  id: JobResponseRateBandId
  /** Band name, matches the badge label of the same status. */
  label: string
  /** Range covered by the band, e.g. "do 2,5 %", "2,5–4,6 %", "od 4,6 %". */
  rangeLabel: string
}

/** Smallest and largest share of a band width where the marker may sit, so the callout stays inside. */
export const BAND_MARKER_MIN = 0.08
export const BAND_MARKER_MAX = 0.92

/** The three comparison bands, ordered from the lowest to the highest response rate. */
export function getJobResponseRateBands(typicalMin: number, typicalMax: number): JobResponseRateBand[] {
  const minLabel = formatPercent(typicalMin)
  const maxLabel = formatPercent(typicalMax)

  return [
    { id: 'below', label: 'Pod očekáváním', rangeLabel: `do ${minLabel}` },
    {
      id: 'expected',
      label: 'Podle očekávání',
      rangeLabel: `${minLabel.replace('\u00a0%', '')}–${maxLabel}`,
    },
    { id: 'above', label: 'Nad očekáváním', rangeLabel: `od ${maxLabel}` },
  ]
}

/**
 * Where the marker sits inside its band, as a share of the band width (0–1, clamped).
 * The open-ended bands reuse the width of the usual range, e.g. "above" ends at max + (max - min).
 */
export function getBandMarkerPosition(
  band: JobResponseRateBandId,
  rate: number,
  typicalMin: number,
  typicalMax: number,
): number {
  const span = typicalMax - typicalMin
  let share: number

  switch (band) {
    case 'below':
      share = typicalMin > 0 ? rate / typicalMin : 0.5
      break
    case 'expected':
      share = span > 0 ? (rate - typicalMin) / span : 0.5
      break
    case 'above':
      share = span > 0 ? (rate - typicalMax) / span : 0.5
      break
  }

  return Math.min(BAND_MARKER_MAX, Math.max(BAND_MARKER_MIN, share))
}
