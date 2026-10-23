import {
  formatAdvertisementEndedHeading,
  formatPartialRunningHeading,
  formatRunningSimpleHeading,
  formatUntilDate,
  isUnlimitedPublication,
  stripYear,
  visibleHighlights,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  buildSimplify11PanelSubline,
  formatMixedPeriodsHeading,
  getSimplify11PanelCta,
  resolveJobCardSimplify11PanelMode,
  resolveSimplify11ChannelVisualState,
  type JobCardSimplify11PanelMode,
  type Simplify11ChannelVisualState,
} from '../JobCardSimplify11/jobCardSimplify11Presentation'
import { JOB_CARD_SIMPLIFY_16_CHANNEL_ORDER, JOB_CARD_SIMPLIFY_16_MAX_VISIBLE_CHANNELS } from './constants'

export type JobCardSimplify16PanelMode = JobCardSimplify11PanelMode

export {
  getSimplify11PanelCta as getSimplify16PanelCta,
  resolveJobCardSimplify11PanelMode as resolveJobCardSimplify16PanelMode,
  resolveSimplify11ChannelVisualState as resolveSimplify16ChannelVisualState,
}

export type Simplify16CellStatusTone = 'success' | 'warning' | 'danger' | 'muted'

export type Simplify16AggregateStatus = {
  icon: 'circle-check' | 'alert-triangle-outline' | 'warning' | 'view-off'
  className: string
  testId: string
  label: string
}

function parseHighlightEndTime(value: string, now = new Date()) {
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

export function sortPublicationsForSimplify16Grid(publications: JobPublication[]) {
  return [...publications].sort((left, right) => {
    const leftIndex = JOB_CARD_SIMPLIFY_16_CHANNEL_ORDER.indexOf(
      left.channel as (typeof JOB_CARD_SIMPLIFY_16_CHANNEL_ORDER)[number],
    )
    const rightIndex = JOB_CARD_SIMPLIFY_16_CHANNEL_ORDER.indexOf(
      right.channel as (typeof JOB_CARD_SIMPLIFY_16_CHANNEL_ORDER)[number],
    )
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

export function partitionSimplify16GridPublications(publications: JobPublication[]) {
  const ordered = sortPublicationsForSimplify16Grid(publications)
  const visible = ordered.slice(0, JOB_CARD_SIMPLIFY_16_MAX_VISIBLE_CHANNELS)
  const hiddenCount = Math.max(0, ordered.length - visible.length)

  return { ordered, visible, hiddenCount }
}

export function publicationHasActivePromo(publication: JobPublication) {
  return visibleHighlights(publication).length > 0
}

export function formatSimplify16PromoSubline(
  publications: JobPublication[],
  now = new Date(),
): string | undefined {
  let nearest: { time: number; label: string } | undefined

  for (const publication of publications) {
    for (const highlight of visibleHighlights(publication)) {
      if (!highlight.endDate) {
        continue
      }

      const time = parseHighlightEndTime(highlight.endDate, now) ?? Number.MAX_SAFE_INTEGER

      if (!nearest || time < nearest.time) {
        nearest = { time, label: stripYear(highlight.endDate) }
      }
    }
  }

  return nearest ? `Zvýrazněno do ${nearest.label}` : undefined
}

export function buildSimplify16AggregateStatus(
  advertisement: JobAdvertisement,
  mode: JobCardSimplify16PanelMode,
  now = new Date(),
): Simplify16AggregateStatus | null {
  const subline = buildSimplify11PanelSubline(advertisement, mode, now)

  switch (mode) {
    case 'partial':
      return {
        icon: 'alert-triangle-outline',
        className: 'tm-text-emotion-warning-emphasis',
        testId: 'job-card-simplify16-partial-heading',
        label: formatPartialRunningHeading(),
      }
    case 'running': {
      const label = subline
        ? `${formatRunningSimpleHeading()} ${subline}`.trim()
        : formatRunningSimpleHeading()
      return {
        icon: 'circle-check',
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify16-running-heading',
        label,
      }
    }
    case 'ended':
      return {
        icon: 'warning',
        className: 'tm-text-emotion-danger-emphasis',
        testId: 'job-card-simplify16-ended-heading',
        label: formatAdvertisementEndedHeading(subline),
      }
    case 'allDisabled':
      return {
        icon: 'view-off',
        className: 'tm-text-secondary-default',
        testId: 'job-card-simplify16-all-disabled-heading',
        label: 'Neinzeruje se',
      }
    case 'mixedPeriods':
      return {
        icon: 'circle-check',
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify16-mixed-periods-heading',
        label: formatMixedPeriodsHeading(),
      }
    default:
      return null
  }
}

export function formatSimplify16CellStatusLabel(visual: Simplify11ChannelVisualState): string {
  switch (visual) {
    case 'endingSoon':
      return 'Končí'
    case 'expired':
      return 'Skončila'
    case 'disabled':
      return 'Vypnuto'
    case 'running':
    default:
      return 'Běží'
  }
}

export function resolveSimplify16CellStatusTone(
  visual: Simplify11ChannelVisualState,
): Simplify16CellStatusTone {
  switch (visual) {
    case 'endingSoon':
      return 'warning'
    case 'expired':
      return 'danger'
    case 'disabled':
      return 'muted'
    case 'running':
    default:
      return 'success'
  }
}

export function simplify16CellStatusClassName(tone: Simplify16CellStatusTone): string {
  switch (tone) {
    case 'warning':
      return 'tm-text-emotion-warning-emphasis'
    case 'danger':
      return 'tm-text-emotion-danger-emphasis'
    case 'muted':
      return 'tm-text-secondary-default'
    case 'success':
    default:
      return 'tm-text-emotion-success-emphasis'
  }
}

export function formatSimplify16CellDate(
  publication: JobPublication,
  visual: Simplify11ChannelVisualState,
): string {
  if (visual === 'disabled') {
    return publication.startDate ? `od ${stripYear(publication.startDate)}` : '–'
  }

  if (visual === 'expired' || visual === 'endingSoon') {
    return publication.endDate ? stripYear(publication.endDate) : '–'
  }

  if (isUnlimitedPublication(publication.channel)) {
    return 'bez limitu'
  }

  if (publication.endDate) {
    return formatUntilDate(stripYear(publication.endDate))
  }

  return '–'
}

export function isSimplify16GridMode(
  mode: JobCardSimplify16PanelMode,
): mode is 'partial' | 'running' | 'ended' | 'allDisabled' | 'mixedPeriods' {
  return (
    mode === 'partial' ||
    mode === 'running' ||
    mode === 'ended' ||
    mode === 'allDisabled' ||
    mode === 'mixedPeriods'
  )
}

export function simplify16GridColumnCount(publicationCount: number) {
  return publicationCount === 1 ? 1 : 2
}

export function simplify16GridCellBorders(
  index: number,
  visibleCount: number,
  columnCount: number,
) {
  const row = Math.floor(index / columnCount)
  const column = index % columnCount
  const totalRows = Math.ceil(visibleCount / columnCount)
  const isLastRow = row === totalRows - 1

  return {
    showBottomBorder: !isLastRow,
    showLeftBorder: columnCount > 1 && column === 1,
  }
}
