import {
  formatDisabledChannelsSuffix,
  formatPartialExpiredSubline,
  formatUntilDate,
  isEndingSoonPublication,
  joinSublineParts,
  partitionPublicationChannels,
  resolveSimplify11PanelCta,
  resolveSimplify11SummaryMode,
  richestDateLabel,
  shareSameEndDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { MIXED_PERIOD_HEADING } from '../JobCardSyntezaAds/advertisementSummaryAds'
import {
  resolveJobCardSimplify10PanelMode,
  type JobCardSimplify10PanelMode,
} from '../JobCardSimplify10/jobCardSimplify10Presentation'

export type JobCardSimplify11PanelMode =
  | JobCardSimplify10PanelMode
  | 'partial'
  | 'running'
  | 'ended'
  | 'allDisabled'
  | 'mixedPeriods'

function sharedActiveEndDate(active: JobPublication[]) {
  if (!shareSameEndDate(active)) {
    return undefined
  }

  const dates = active
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))

  if (dates.length === 0) {
    return undefined
  }

  return richestDateLabel(dates)
}

function sharedExpiredEndDate(expired: JobPublication[]) {
  if (expired.length === 0) {
    return undefined
  }

  const dates = expired
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))

  if (dates.length === 0) {
    return undefined
  }

  return richestDateLabel(dates)
}

export function resolveJobCardSimplify11PanelMode(
  advertisement: JobAdvertisement,
  now = new Date(),
): JobCardSimplify11PanelMode {
  if (advertisement.status === 'notAdvertising') {
    return 'notAdvertising'
  }

  const publications = advertisement.publications ?? []

  if (publications.length === 0) {
    return 'fallback'
  }

  const summaryMode = resolveSimplify11SummaryMode(publications, now)
  const { disabled } = partitionPublicationChannels(publications, now)

  if (summaryMode === 'allDisabled') {
    return 'allDisabled'
  }

  if (summaryMode === 'partial') {
    return 'partial'
  }

  if (summaryMode === 'ended') {
    return disabled.length > 0 ? 'ended' : 'expiredUnexpected'
  }

  if (summaryMode === 'running') {
    const { active } = partitionPublicationChannels(publications, now)
    const mixedActivePeriods = active.length > 0 && !shareSameEndDate(active)
    const endingSoonSameDate =
      !mixedActivePeriods &&
      active.length > 0 &&
      active.every((publication) => isEndingSoonPublication(publication, now))

    if (disabled.length === 0 && endingSoonSameDate) {
      return 'endingSoon'
    }

    if (mixedActivePeriods) {
      return 'mixedPeriods'
    }

    if (disabled.length > 0 || active.length > 0) {
      return 'running'
    }

    return 'fallback'
  }

  return resolveJobCardSimplify10PanelMode(advertisement, now)
}

export function buildSimplify11PanelSubline(
  advertisement: JobAdvertisement,
  mode: JobCardSimplify11PanelMode,
  now = new Date(),
) {
  const publications = advertisement.publications ?? []
  const { active, expired, disabled } = partitionPublicationChannels(publications, now)
  const disabledSuffix = formatDisabledChannelsSuffix(disabled.length)

  if (mode === 'partial') {
    return joinSublineParts(formatPartialExpiredSubline(expired), disabledSuffix)
  }

  if (mode === 'running') {
    const endDate = sharedActiveEndDate(active)
    const until = endDate ? formatUntilDate(stripYear(endDate)) : undefined
    return joinSublineParts(until, disabledSuffix)
  }

  if (mode === 'ended') {
    const endDate = sharedExpiredEndDate(expired)
    return joinSublineParts(endDate, disabledSuffix)
  }

  if (mode === 'mixedPeriods') {
    return disabledSuffix
  }

  return disabledSuffix
}

export function formatMixedPeriodsHeading() {
  return MIXED_PERIOD_HEADING
}

export function getSimplify11PanelCta(advertisement: JobAdvertisement, now = new Date()) {
  return resolveSimplify11PanelCta(advertisement.publications ?? [], now)
}

export type Simplify11ChannelVisualState = 'running' | 'endingSoon' | 'expired' | 'disabled'

export function resolveSimplify11ChannelVisualState(
  publication: JobPublication,
  now = new Date(),
): Simplify11ChannelVisualState {
  if (publication.status === 'disabled') {
    return 'disabled'
  }

  if (publication.status === 'expired') {
    return 'expired'
  }

  if (isEndingSoonPublication(publication, now)) {
    return 'endingSoon'
  }

  return 'running'
}
