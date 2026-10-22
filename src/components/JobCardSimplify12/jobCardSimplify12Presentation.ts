import {
  earliestEndDateLabel,
  formatNearestEndHeading,
  formatPartialChannelCountHeading,
  formatRunningUntilHeading,
  getRemainingCalendarDays,
  isEndingSoonPublication,
  isUnlimitedPublication,
  partitionPublicationChannels,
  resolveSimplify11PanelCta,
  resolveSimplify11SummaryMode,
  richestDateLabel,
  shareSameEndDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  resolveJobCardSimplify10PanelMode,
  type JobCardSimplify10PanelMode,
} from '../JobCardSimplify10/jobCardSimplify10Presentation'

export type JobCardSimplify12PanelMode =
  | JobCardSimplify10PanelMode
  | 'runningCalm'
  | 'partial'
  | 'mixedEndDates'
  | 'paidEndedOwnChannelsOnly'
  | 'allDisabled'
  | 'fallback'

function finiteActivePublications(active: JobPublication[]) {
  return active.filter(
    (publication) => publication.endDate && !isUnlimitedPublication(publication.channel),
  )
}

function sharedFiniteActiveEndDate(active: JobPublication[]) {
  const finite = finiteActivePublications(active)
  if (!shareSameEndDate(finite)) {
    return undefined
  }

  const dates = finite
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))

  if (dates.length === 0) {
    return undefined
  }

  return richestDateLabel(dates)
}

export function isPaidEndedOwnChannelsOnly(
  publications: JobPublication[],
  now = new Date(),
) {
  const { active, expired } = partitionPublicationChannels(publications, now)
  const paidActive = active.filter((publication) => !isUnlimitedPublication(publication.channel))
  const paidExpired = expired.filter((publication) => !isUnlimitedPublication(publication.channel))
  const unlimitedActive = active.filter((publication) =>
    isUnlimitedPublication(publication.channel),
  )

  return paidActive.length === 0 && paidExpired.length > 0 && unlimitedActive.length > 0
}

export function partialChannelCounts(publications: JobPublication[], now = new Date()) {
  const { active, disabled } = partitionPublicationChannels(publications, now)
  const visible = publications.filter((publication) => publication.status !== 'disabled')
  return {
    runningCount: active.length,
    totalCount: visible.length,
    disabledCount: disabled.length,
  }
}

export function formatPaidEndedOwnChannelsHeading(unlimitedActive: JobPublication[]) {
  if (unlimitedActive.length === 1) {
    const channel = unlimitedActive[0].channel
    if (/kariér/i.test(channel)) {
      return 'Placená inzerce skončila, běží jen kariérní web'
    }

    return `Placená inzerce skončila, běží jen ${channel}`
  }

  return 'Placená inzerce skončila, běží jen vlastní kanály'
}

export function resolveJobCardSimplify12PanelMode(
  advertisement: JobAdvertisement,
  now = new Date(),
): JobCardSimplify12PanelMode {
  if (advertisement.status === 'notAdvertising') {
    return 'notAdvertising'
  }

  const publications = advertisement.publications ?? []

  if (publications.length === 0) {
    return 'fallback'
  }

  if (isPaidEndedOwnChannelsOnly(publications, now)) {
    return 'paidEndedOwnChannelsOnly'
  }

  const summaryMode = resolveSimplify11SummaryMode(publications, now)
  const { active, disabled } = partitionPublicationChannels(publications, now)

  if (summaryMode === 'allDisabled') {
    return 'allDisabled'
  }

  if (summaryMode === 'partial') {
    return 'partial'
  }

  if (summaryMode === 'ended') {
    return 'expiredUnexpected'
  }

  if (summaryMode === 'running') {
    const finiteActive = finiteActivePublications(active)
    const mixedActivePeriods = finiteActive.length > 0 && !shareSameEndDate(finiteActive)
    const endingSoonSameDate =
      !mixedActivePeriods &&
      finiteActive.length > 0 &&
      finiteActive.every((publication) => isEndingSoonPublication(publication, now))

    if (disabled.length === 0 && endingSoonSameDate) {
      return 'endingSoon'
    }

    if (mixedActivePeriods) {
      return 'mixedEndDates'
    }

    if (active.length > 0) {
      return 'runningCalm'
    }

    return 'fallback'
  }

  return resolveJobCardSimplify10PanelMode(advertisement, now)
}

export function buildRunningCalmHeading(advertisement: JobAdvertisement, now = new Date()) {
  const { active } = partitionPublicationChannels(advertisement.publications ?? [], now)
  const endDate = sharedFiniteActiveEndDate(active)

  if (!endDate) {
    return formatRunningUntilHeading('–')
  }

  return formatRunningUntilHeading(endDate)
}

export function buildPartialHeading(publications: JobPublication[], now = new Date()) {
  const { runningCount, totalCount } = partialChannelCounts(publications, now)
  return formatPartialChannelCountHeading(runningCount, totalCount)
}

export function buildMixedEndDatesHeading(publications: JobPublication[], now = new Date()) {
  const { active } = partitionPublicationChannels(publications, now)
  const finiteActive = finiteActivePublications(active)
  const endDate = earliestEndDateLabel(finiteActive)

  if (!endDate) {
    return 'Nejdřív končí brzy'
  }

  const remainingDays = getRemainingCalendarDays(endDate, now)

  if (remainingDays === undefined) {
    return `Nejdřív končí · ${endDate}`
  }

  return formatNearestEndHeading(remainingDays, endDate)
}

export function nearestEndPublicationId(publications: JobPublication[], now = new Date()) {
  const { active } = partitionPublicationChannels(publications, now)
  const finiteActive = finiteActivePublications(active)
  const endDate = earliestEndDateLabel(finiteActive)

  if (!endDate) {
    return undefined
  }

  const match = finiteActive.find(
    (publication) => publication.endDate && stripYear(publication.endDate) === endDate,
  )

  return match?.id
}

export interface Simplify12PanelCta {
  label: string
  targetPublications: JobPublication[]
}

export function getSimplify12PanelCta(
  advertisement: JobAdvertisement,
  mode: JobCardSimplify12PanelMode,
  now = new Date(),
): Simplify12PanelCta | undefined {
  const publications = advertisement.publications ?? []

  if (mode === 'mixedEndDates') {
    const { active } = partitionPublicationChannels(publications, now)
    const targets = finiteActivePublications(active)

    if (targets.length === 0) {
      return undefined
    }

    return {
      label: 'Prodloužit inzerci',
      targetPublications: targets,
    }
  }

  if (mode === 'paidEndedOwnChannelsOnly') {
    return resolveSimplify11PanelCta(publications, now)
  }

  return undefined
}

export type Simplify12ChannelVisualState = 'running' | 'endingSoon' | 'expired' | 'disabled' | 'unlimited'

export function resolveSimplify12ChannelVisualState(
  publication: JobPublication,
  now = new Date(),
): Simplify12ChannelVisualState {
  if (publication.status === 'disabled') {
    return 'disabled'
  }

  if (publication.status === 'expired') {
    return 'expired'
  }

  if (isUnlimitedPublication(publication.channel)) {
    return 'unlimited'
  }

  if (isEndingSoonPublication(publication, now)) {
    return 'endingSoon'
  }

  return 'running'
}

export function publicationsForChannelBreakdown(publications: JobPublication[]) {
  return publications.filter((publication) => publication.status !== 'disabled')
}
