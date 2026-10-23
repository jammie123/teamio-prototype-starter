import { jobPortalLogoTypeFromChannel } from '../JobPortalLogo/JobPortalLogo'
import {
  earliestEndDateLabel,
  formatExpiredPortalsLabel,
  formatRemainingDaysLabel,
  formatViewCountLabel,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  isEndingSoonDays,
  isEndingSoonPublication,
  isUnlimitedPublication,
  partitionPublicationChannels,
  resolveSimplify11PanelCta,
  richestDateLabel,
  shareSameEndDate,
  shareSamePaidEndDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { MIXED_PERIOD_HEADING } from '../JobCardSyntezaAds/advertisementSummaryAds'
import {
  formatMixedPeriodsHeading,
  resolveJobCardSimplify11PanelMode,
  resolveSimplify11ChannelVisualState,
} from '../JobCardSimplify11/jobCardSimplify11Presentation'
import type { JobCardSimplify20ChannelStatusTone } from './JobCardSimplify20ChannelStatusDot'
import {
  formatSimplify14SamePeriodRange,
  shouldShowSimplify14SamePeriodRange,
} from '../JobCardSimplify14/jobCardSimplify14Presentation'

export type Simplify20StatusHeadingKind =
  | 'running'
  | 'partial'
  | 'endingSoon'
  | 'mixedActive'
  | 'expired'
  | 'notAdvertising'

export type Simplify20HeadingActionKind = 'extend' | 'decline'

export type Simplify20HeadingAction = {
  kind: Simplify20HeadingActionKind
  label: string
  targetPublications: JobPublication[]
}

export type Simplify20EndReason = 'ended' | 'expiredUnexpected'

export type Simplify20StatusHeading = {
  kind: Simplify20StatusHeadingKind
  title: string
  secondary?: string
  actions?: Simplify20HeadingAction[]
  endReason?: Simplify20EndReason
  className: string
  testId: string
}

export const SIMPLIFY_20_ENDING_SOON_TITLE = 'Brzy končí' as const
export const SIMPLIFY_20_ENDED_TITLE = 'Inzerce skončila' as const
export const SIMPLIFY_20_EXTEND_LABEL = 'Prodloužit' as const
export const SIMPLIFY_20_DECLINE_LABEL = 'Zatím neprodlužovat' as const
export const SIMPLIFY_20_RUNNING_TITLE = 'Běží' as const

export function resolveSimplify20ChannelStatusTone(
  publication: JobPublication,
  now = new Date(),
): JobCardSimplify20ChannelStatusTone {
  if (publication.status === 'expired' || publication.status === 'disabled') {
    return 'gray'
  }

  if (publication.endDate && !isUnlimitedPublication(publication.channel)) {
    const remainingDays = getRemainingCalendarDays(publication.endDate, now)
    if (remainingDays !== undefined && remainingDays < 0) {
      return 'gray'
    }
  }

  const visual = resolveSimplify11ChannelVisualState(publication, now)

  if (visual === 'endingSoon') {
    return 'warning'
  }

  if (visual === 'running') {
    return 'success'
  }

  return 'gray'
}

function stripTrailingYearFromRange(range: string) {
  return range.replace(/\s+\d{4}$/, '')
}

function sharedFullEndDate(publications: JobPublication[]) {
  if (!shareSameEndDate(publications)) {
    return undefined
  }

  const dates = publications
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))

  if (dates.length === 0) {
    return undefined
  }

  return richestDateLabel(dates)
}

function finitePaidPublications(publications: JobPublication[]) {
  return publications.filter(
    (publication) => publication.endDate && !isUnlimitedPublication(publication.channel),
  )
}

export function formatSimplify20RemainingSecondary(remainingDays: number, endDate: string) {
  if (remainingDays === 0) {
    return `Zbývá dnes, do ${endDate}`
  }

  return `Zbývá ${formatRemainingDaysLabel(remainingDays)}, do ${endDate}`
}

export function formatSimplify20SinglePortalEndingSecondary(remainingDays: number) {
  return `1 portál končí za ${formatRemainingDaysLabel(remainingDays)}`
}

export function formatSimplify20NearestEndingSecondary(remainingDays: number, endDate: string) {
  return `Nejbližší konec za ${formatRemainingDaysLabel(remainingDays)}, do ${endDate}`
}

function endingSoonOnSameEndDate(finiteActive: JobPublication[], now: Date) {
  if (finiteActive.length === 0 || !shareSameEndDate(finiteActive)) {
    return undefined
  }

  const endDate = richestDateLabel(
    finiteActive
      .map((publication) => publication.endDate)
      .filter((value): value is string => Boolean(value)),
  )
  const remainingDays = getRemainingCalendarDays(endDate, now)

  if (remainingDays === undefined || !isEndingSoonDays(remainingDays)) {
    return undefined
  }

  return formatSimplify20RemainingSecondary(remainingDays, endDate)
}

function countPaidPortalsOnEndDate(publications: JobPublication[], endDate: string) {
  const target = stripYear(endDate)
  return publications.filter(
    (publication) =>
      publication.endDate &&
      !isUnlimitedPublication(publication.channel) &&
      stripYear(publication.endDate) === target,
  ).length
}

export function buildSimplify20EndingSoonSecondary(
  publications: JobPublication[],
  now = new Date(),
) {
  const { active } = partitionPublicationChannels(publications, now)
  const endingSoonActive = active.filter((publication) =>
    isEndingSoonPublication(publication, now),
  )

  if (endingSoonActive.length === 0) {
    return undefined
  }

  const finiteActive = finitePaidPublications(active)
  const finiteEndingSoon = finitePaidPublications(endingSoonActive)

  const sameEndSecondary = endingSoonOnSameEndDate(finiteActive, now)
  if (sameEndSecondary) {
    return sameEndSecondary
  }

  if (finiteEndingSoon.length === 1) {
    const endDate = finiteEndingSoon[0].endDate!
    const remainingDays = getRemainingCalendarDays(endDate, now)

    if (remainingDays !== undefined) {
      return formatSimplify20SinglePortalEndingSecondary(remainingDays)
    }
  }

  const nearestEnd = earliestEndDateLabel(finiteEndingSoon)
  if (!nearestEnd) {
    return undefined
  }

  const remainingDays = getRemainingCalendarDays(nearestEnd, now)
  if (remainingDays === undefined) {
    return undefined
  }

  const fullEndDate = richestDateLabel(
    finiteEndingSoon
      .filter((publication) => stripYear(publication.endDate!) === nearestEnd)
      .map((publication) => publication.endDate!),
  )

  const portalsOnNearest = countPaidPortalsOnEndDate(finiteEndingSoon, fullEndDate)

  if (portalsOnNearest === 1) {
    return formatSimplify20SinglePortalEndingSecondary(remainingDays)
  }

  return formatSimplify20NearestEndingSecondary(remainingDays, fullEndDate)
}

function expiredPaidCount(publications: JobPublication[], now = new Date()) {
  const { expired } = partitionPublicationChannels(publications, now)
  return expired.filter((publication) => !isUnlimitedPublication(publication.channel)).length
}

function expiredFullEndDate(publications: JobPublication[], now = new Date()) {
  const { expired } = partitionPublicationChannels(publications, now)
  const dates = expired
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))

  if (dates.length === 0) {
    return undefined
  }

  return richestDateLabel(dates)
}

export function getSimplify20HeadingActions(
  advertisement: JobAdvertisement,
  kind: Simplify20StatusHeadingKind,
  now = new Date(),
  endReason?: Simplify20EndReason,
): Simplify20HeadingAction[] | undefined {
  const publications = advertisement.publications ?? []

  if (kind === 'endingSoon') {
    const { active } = partitionPublicationChannels(publications, now)
    const targets = active.filter((publication) => isEndingSoonPublication(publication, now))

    if (targets.length === 0) {
      return undefined
    }

    return [
      {
        kind: 'extend',
        label: SIMPLIFY_20_EXTEND_LABEL,
        targetPublications: targets,
      },
    ]
  }

  if (kind === 'partial' || kind === 'expired') {
    const cta = resolveSimplify11PanelCta(publications, now)
    const actions: Simplify20HeadingAction[] = []

    if (cta && cta.targetPublications.length > 0) {
      actions.push({
        kind: 'extend',
        label: SIMPLIFY_20_EXTEND_LABEL,
        targetPublications: cta.targetPublications,
      })
    }

    if (kind === 'expired' && endReason === 'expiredUnexpected') {
      actions.push({
        kind: 'decline',
        label: SIMPLIFY_20_DECLINE_LABEL,
        targetPublications: [],
      })
    }

    return actions.length > 0 ? actions : undefined
  }

  return undefined
}

export function declinedAdvertisingDate(advertisement: JobAdvertisement) {
  if (advertisement.advertisingDeclinedAt) {
    return advertisement.advertisingDeclinedAt
  }

  const publications = advertisement.publications ?? []
  return sharedFullEndDate(publications) ?? getAdvertisementSummary(advertisement).lastEndedOn
}

export function formatSimplify20PortalCareerSummary(publications: JobPublication[]) {
  let portalCount = 0
  let hasCareer = false

  for (const publication of publications) {
    if (isUnlimitedPublication(publication.channel)) {
      if (jobPortalLogoTypeFromChannel(publication.channel) === 'pages') {
        hasCareer = true
      }
    } else {
      portalCount += 1
    }
  }

  const parts: string[] = []

  if (portalCount > 0) {
    if (portalCount === 1) {
      parts.push('1 portál')
    } else if (portalCount >= 2 && portalCount <= 4) {
      parts.push(`${portalCount} portály`)
    } else {
      parts.push(`${portalCount} portálů`)
    }
  }

  if (hasCareer) {
    parts.push('kariérní stránky')
  }

  return parts.join(' + ')
}

export function notAdvertisingHasPublicationHistory(advertisement: JobAdvertisement) {
  const publications = advertisement.publications ?? []

  if (publications.length === 0) {
    return false
  }

  const summary = getAdvertisementSummary(advertisement)

  if (summary.viewCount !== undefined && summary.viewCount > 0) {
    return true
  }

  return publications.some(
    (publication) => publication.status === 'expired' || Boolean(publication.endDate),
  )
}

export const SIMPLIFY_20_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const
export const SIMPLIFY_20_START_ADVERTISING_LABEL = 'Začít inzerovat' as const

export function buildSimplify20NotAdvertisingPerex(advertisement: JobAdvertisement) {
  if (!notAdvertisingHasPublicationHistory(advertisement)) {
    return undefined
  }

  const parts: string[] = []
  const declinedDate = declinedAdvertisingDate(advertisement)

  if (declinedDate) {
    parts.push(`ukončeno od ${stripYear(declinedDate)}`)
  }

  const summary = getAdvertisementSummary(advertisement)

  if (summary.viewCount !== undefined) {
    parts.push(formatViewCountLabel(summary.viewCount))
  }

  const channels = formatSimplify20PortalCareerSummary(advertisement.publications ?? [])

  if (channels) {
    parts.push(channels)
  }

  return parts.join(' · ')
}

export function buildSimplify20StatusHeading(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify20StatusHeading | null {
  const publications = advertisement.publications ?? []
  let mode = resolveJobCardSimplify11PanelMode(advertisement, now)

  if (mode === 'mixedPeriods') {
    const { active } = partitionPublicationChannels(publications, now)
    if (shareSamePaidEndDate(active)) {
      mode = 'running'
    }
  }

  const endingSoonSecondary = buildSimplify20EndingSoonSecondary(publications, now)

  if (
    endingSoonSecondary &&
    mode !== 'ended' &&
    mode !== 'expiredUnexpected' &&
    mode !== 'allDisabled'
  ) {
    const heading: Simplify20StatusHeading = {
      kind: 'endingSoon',
      title: SIMPLIFY_20_ENDING_SOON_TITLE,
      secondary: endingSoonSecondary,
      className: 'tm-text-emotion-warning-emphasis',
      testId: 'job-card-simplify20-ending-soon-heading',
    }
    heading.actions = getSimplify20HeadingActions(advertisement, heading.kind, now)
    return heading
  }

  if (mode === 'partial') {
    const expiredCount = expiredPaidCount(publications, now)
    const heading: Simplify20StatusHeading = {
      kind: 'partial',
      title: SIMPLIFY_20_RUNNING_TITLE,
      secondary: expiredCount > 0 ? formatExpiredPortalsLabel(expiredCount) : undefined,
      className: 'tm-text-secondary-default',
      testId: 'job-card-simplify20-partial-heading',
    }
    heading.actions = getSimplify20HeadingActions(advertisement, heading.kind, now)
    return heading
  }

  if (mode === 'running') {
    let secondary: string | undefined

    if (shouldShowSimplify14SamePeriodRange('running', publications, now)) {
      const range = formatSimplify14SamePeriodRange(publications, now)
      if (range) {
        secondary = stripTrailingYearFromRange(range)
      }
    }

    return {
      kind: 'running',
      title: SIMPLIFY_20_RUNNING_TITLE,
      secondary,
      className: 'tm-text-emotion-success-emphasis',
      testId: 'job-card-simplify20-running-heading',
    }
  }

  if (mode === 'mixedPeriods') {
    return {
      kind: 'mixedActive',
      title: formatMixedPeriodsHeading(),
      className: 'tm-text-emotion-success-emphasis',
      testId: 'job-card-simplify20-mixed-periods-heading',
    }
  }

  if (mode === 'ended' || mode === 'expiredUnexpected') {
    const secondary =
      expiredFullEndDate(publications, now) ??
      getAdvertisementSummary(advertisement).lastEndedOn

    const endReason: Simplify20EndReason =
      mode === 'ended' ? 'ended' : 'expiredUnexpected'

    const heading: Simplify20StatusHeading = {
      kind: 'expired',
      title: SIMPLIFY_20_ENDED_TITLE,
      secondary,
      endReason,
      className: 'tm-text-emotion-danger-emphasis',
      testId:
        mode === 'ended'
          ? 'job-card-simplify20-ended-heading'
          : 'job-card-simplify20-expired-heading',
    }
    heading.actions = getSimplify20HeadingActions(
      advertisement,
      heading.kind,
      now,
      heading.endReason,
    )
    return heading
  }

  if (mode === 'allDisabled') {
    return {
      kind: 'notAdvertising',
      title: 'Neinzeruje se',
      className: 'tm-text-secondary-default',
      testId: 'job-card-simplify20-all-disabled-heading',
    }
  }

  if (publications.length > 0) {
    const { active } = partitionPublicationChannels(publications, now)
    const mixedActivePeriods = active.length > 0 && !shareSamePaidEndDate(active)

    if (mixedActivePeriods) {
      return {
        kind: 'mixedActive',
        title: MIXED_PERIOD_HEADING,
        className: 'tm-text-secondary-default',
        testId: 'job-card-simplify20-mixed-active-heading',
      }
    }
  }

  return {
    kind: 'running',
    title: SIMPLIFY_20_RUNNING_TITLE,
    className: 'tm-text-emotion-success-emphasis',
    testId: 'job-card-simplify20-running-heading',
  }
}

export const SIMPLIFY_20_NEVER_CREATED_BODY =
  'Zveřejněte ji na portálech a kariérních stránkách a získejte první kandidáty.' as const
