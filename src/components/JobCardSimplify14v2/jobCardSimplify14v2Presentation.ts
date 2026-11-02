import {
  formatCompactDateRange,
  isUnlimitedPublication,
  partitionPublicationChannels,
  richestDateLabel,
  shareSameEndDate,
  shareSameStartDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { TagColor } from '../Tag/Tag'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  formatMixedPeriodsHeading,
  getSimplify11PanelCta,
  resolveJobCardSimplify11PanelMode,
  resolveSimplify11ChannelVisualState,
  type JobCardSimplify11PanelMode,
  type Simplify11ChannelVisualState,
} from '../JobCardSimplify11/jobCardSimplify11Presentation'

export type JobCardSimplify14v2PanelMode = JobCardSimplify11PanelMode

export {
  formatMixedPeriodsHeading,
  getSimplify11PanelCta,
  resolveSimplify11ChannelVisualState,
}

export type Simplify14v2ChannelDateLabelTone = 'default' | 'muted' | 'warning' | 'danger'
export type Simplify14v2HeadingIcon =
  | 'circle-check'
  | 'alert-triangle-outline'
  | 'warning'
  | 'view-off'

export const SIMPLIFY_14V2_RUNNING_TITLE = 'Běží' as const
export const SIMPLIFY_14V2_ENDED_TITLE = 'Ukončeno' as const
export const SIMPLIFY_14V2_ENDING_SOON_TITLE = 'Brzy končí' as const
export const SIMPLIFY_14V2_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const
export const SIMPLIFY_14V2_ENDED_CLASS = 'tm-text-secondary-default' as const
export const SIMPLIFY_14V2_ENDED_STATUS_DOT_CLASS = '!tm-bg-[#C2C8CE]' as const

export interface Simplify14v2Heading {
  icon: Simplify14v2HeadingIcon
  className: string
  testId: string
  label: string
}

export interface Simplify14v2HeaderBadge {
  color: TagColor
  label: string
}

export type Simplify14v2StripGroupKind = 'running' | 'ended'

export interface Simplify14v2StripGroup {
  kind: Simplify14v2StripGroupKind
  items: JobPublication[]
  showDateLabels: boolean
}

const STRIP_CHANNEL_ORDER = ['Jobs.cz', 'Prace.cz', 'Kariérní stránky']

function sortPublicationsForStrip(publications: JobPublication[]) {
  return [...publications].sort((left, right) => {
    const leftIndex = STRIP_CHANNEL_ORDER.indexOf(left.channel)
    const rightIndex = STRIP_CHANNEL_ORDER.indexOf(right.channel)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

function finiteDatedPublications(publications: JobPublication[]) {
  return publications.filter(
    (publication) =>
      Boolean(publication.startDate) &&
      Boolean(publication.endDate) &&
      !isUnlimitedPublication(publication.channel),
  )
}

function finiteEndDatedPublications(publications: JobPublication[]) {
  return publications.filter(
    (publication) => publication.endDate && !isUnlimitedPublication(publication.channel),
  )
}

function publicationsWithSamePeriod(publications: JobPublication[]) {
  const dated = finiteDatedPublications(publications)

  if (dated.length === 0) {
    return []
  }

  if (!shareSameStartDate(dated) || !shareSameEndDate(dated)) {
    return []
  }

  return dated
}

function periodPool(mode: JobCardSimplify11PanelMode, publications: JobPublication[], now: Date) {
  const { active, expired } = partitionPublicationChannels(publications, now)
  return mode === 'ended' ? expired : active
}

export function resolveJobCardSimplify14v2PanelMode(
  advertisement: JobAdvertisement,
  now = new Date(),
): JobCardSimplify14v2PanelMode {
  const mode = resolveJobCardSimplify11PanelMode(advertisement, now)
  return mode === 'expiredUnexpected' ? 'ended' : mode
}

function headingLabel(title: string, periodRange?: string) {
  return periodRange ? `${title} ${periodRange}` : title
}

export function buildSimplify14v2Heading(
  mode: JobCardSimplify14v2PanelMode,
  periodRange?: string,
): Simplify14v2Heading | null {
  switch (mode) {
    case 'partial':
    case 'running':
      return {
        icon: 'circle-check',
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify14v2-running-heading',
        label: headingLabel(SIMPLIFY_14V2_RUNNING_TITLE, periodRange),
      }
    case 'ended':
      return {
        icon: 'warning',
        className: SIMPLIFY_14V2_ENDED_CLASS,
        testId: 'job-card-simplify14v2-ended-heading',
        label: headingLabel(SIMPLIFY_14V2_ENDED_TITLE, periodRange),
      }
    case 'endingSoon':
      return {
        icon: 'alert-triangle-outline',
        className: 'tm-text-emotion-warning-emphasis',
        testId: 'job-card-simplify14v2-ending-soon-heading',
        label: headingLabel(SIMPLIFY_14V2_ENDING_SOON_TITLE, periodRange),
      }
    case 'allDisabled':
      return {
        icon: 'view-off',
        className: 'tm-text-secondary-default',
        testId: 'job-card-simplify14v2-all-disabled-heading',
        label: SIMPLIFY_14V2_NOT_ADVERTISING_TITLE,
      }
    case 'mixedPeriods':
      return {
        icon: 'circle-check',
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify14v2-mixed-periods-heading',
        label: formatMixedPeriodsHeading(),
      }
    default:
      return null
  }
}

export function formatSimplify14v2SamePeriodRange(
  mode: JobCardSimplify11PanelMode,
  publications: JobPublication[],
  now = new Date(),
): string | undefined {
  const dated = publicationsWithSamePeriod(periodPool(mode, publications, now))

  if (dated.length === 0) {
    return undefined
  }

  const startDate = richestDateLabel(dated.map((publication) => publication.startDate!))
  const endDate = richestDateLabel(dated.map((publication) => publication.endDate!))

  return formatCompactDateRange(startDate, endDate)
}

export function shouldShowPerChannelDateLabels(
  mode: JobCardSimplify11PanelMode,
  publications: JobPublication[],
  now = new Date(),
): boolean {
  if (mode === 'mixedPeriods') {
    return true
  }

  if (mode === 'partial') {
    const { active } = partitionPublicationChannels(publications, now)
    return shouldShowPerChannelDateLabels('running', active, now)
  }

  const pool = periodPool(mode, publications, now)

  if (mode === 'running' || mode === 'endingSoon' || mode === 'ended') {
    const finite = finiteEndDatedPublications(pool)
    if (finite.length === 0) {
      return false
    }

    return !shareSameEndDate(finite)
  }

  return false
}

export function shouldShowSimplify14v2SamePeriodRange(
  mode: JobCardSimplify11PanelMode,
  publications: JobPublication[],
  now = new Date(),
): boolean {
  if (mode !== 'running' && mode !== 'endingSoon' && mode !== 'ended' && mode !== 'partial') {
    return false
  }

  if (shouldShowPerChannelDateLabels(mode, publications, now)) {
    return false
  }

  return formatSimplify14v2SamePeriodRange(mode, publications, now) !== undefined
}

export function formatSimplify14v2ChannelDateLabel(
  publication: JobPublication,
  now = new Date(),
): string {
  const visual = resolveSimplify11ChannelVisualState(publication, now)

  if (visual === 'disabled') {
    return 'vypnuto'
  }

  if (isUnlimitedPublication(publication.channel) && visual !== 'expired') {
    return 'bez limitu'
  }

  if (publication.endDate) {
    return stripYear(publication.endDate)
  }

  return '–'
}

export function resolveSimplify14v2ChannelDateLabelTone(
  publication: JobPublication,
  now = new Date(),
): Simplify14v2ChannelDateLabelTone {
  const visual = resolveSimplify11ChannelVisualState(publication, now)

  if (visual === 'disabled') {
    return 'muted'
  }

  if (isUnlimitedPublication(publication.channel) && visual !== 'expired') {
    return 'muted'
  }

  if (visual === 'expired') {
    return 'muted'
  }

  if (visual === 'endingSoon') {
    return 'warning'
  }

  return 'default'
}

export function simplify14v2ChannelDateLabelClassName(
  tone: Simplify14v2ChannelDateLabelTone,
): string {
  switch (tone) {
    case 'danger':
      return 'tm-text-emotion-danger-emphasis'
    case 'warning':
      return 'tm-text-emotion-warning-emphasis'
    case 'muted':
      return 'tm-text-secondary-default'
    default:
      return 'tm-text-secondary-default'
  }
}

/** Czech plural for ended portals: 1 ukončený, 2–4 ukončené, 5+ ukončených. */
export function formatEndedPortalsBadgeLabel(count: number) {
  const lastTwo = count % 100
  const last = count % 10

  if (count === 1) {
    return `${count} ukončený`
  }

  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `${count} ukončené`
  }

  return `${count} ukončených`
}

export function buildSimplify14v2HeaderBadges(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify14v2HeaderBadge[] {
  const { active, expired } = partitionPublicationChannels(advertisement.publications ?? [], now)

  if (active.length === 0 || expired.length === 0) {
    return []
  }

  return [{ color: 'neutral', label: formatEndedPortalsBadgeLabel(expired.length) }]
}

export function buildSimplify14v2StripGroups(
  publications: JobPublication[],
  now = new Date(),
  mode?: JobCardSimplify14v2PanelMode,
): Simplify14v2StripGroup[] {
  const { active, expired, disabled } = partitionPublicationChannels(publications, now)

  if (active.length > 0 && expired.length > 0) {
    return [
      {
        kind: 'running',
        items: sortPublicationsForStrip(active),
        showDateLabels: shouldShowPerChannelDateLabels('running', active, now),
      },
      {
        kind: 'ended',
        items: sortPublicationsForStrip([...expired, ...disabled]),
        showDateLabels: shouldShowPerChannelDateLabels('ended', expired, now),
      },
    ]
  }

  return [
    {
      kind: expired.length > 0 ? 'ended' : 'running',
      items: sortPublicationsForStrip(publications),
      showDateLabels: mode ? shouldShowPerChannelDateLabels(mode, publications, now) : false,
    },
  ]
}

export type { Simplify11ChannelVisualState as Simplify14v2ChannelVisualState }
