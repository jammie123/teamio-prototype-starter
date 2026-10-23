import { jobPortalLogoTypeFromChannel } from '../JobPortalLogo/JobPortalLogo'
import {
  formatAdvertisementEndedHeading,
  formatAdvertisementExpiredHeading,
  formatEndingSoonHeading,
  formatViewCountLabel,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  isUnlimitedPublication,
  partitionPublicationChannels,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { MIXED_PERIOD_HEADING } from '../JobCardSyntezaAds/advertisementSummaryAds'
import {
  buildSimplify11PanelSubline,
  formatMixedPeriodsHeading,
  resolveJobCardSimplify11PanelMode,
} from '../JobCardSimplify11/jobCardSimplify11Presentation'
import { partialChannelCounts } from '../JobCardSimplify12/jobCardSimplify12Presentation'
import {
  formatSimplify14SamePeriodRange,
  shouldShowSimplify14SamePeriodRange,
} from '../JobCardSimplify14/jobCardSimplify14Presentation'

export type Simplify17StatusHeadingKind =
  | 'running'
  | 'partial'
  | 'endingSoon'
  | 'mixedActive'
  | 'expired'
  | 'notAdvertising'

export type Simplify17StatusHeading = {
  kind: Simplify17StatusHeadingKind
  label: string
  className: string
  testId: string
}

export function joinStatusDetail(prefix: string, detail: string) {
  return `${prefix} · ${detail}`
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

export function declinedAdvertisingDate(advertisement: JobAdvertisement) {
  if (advertisement.advertisingDeclinedAt) {
    return advertisement.advertisingDeclinedAt
  }

  const publications = advertisement.publications ?? []
  return sharedFullEndDate(publications) ?? getAdvertisementSummary(advertisement).lastEndedOn
}

export function formatSimplify17PortalCareerSummary(publications: JobPublication[]) {
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

export const SIMPLIFY_17_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const
export const SIMPLIFY_17_START_ADVERTISING_LABEL = 'Začít inzerovat' as const

export function buildSimplify17NotAdvertisingPerex(advertisement: JobAdvertisement) {
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

  const channels = formatSimplify17PortalCareerSummary(advertisement.publications ?? [])

  if (channels) {
    parts.push(channels)
  }

  return parts.join(' · ')
}

function endingSoonHeading(publications: JobPublication[], now = new Date()) {
  const { active } = partitionPublications(publications, now)
  const sameDate = shareSameEndDate(active)
  const dates = active
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))
  const date = dates.length > 0 ? richestDateLabel(dates) : undefined
  const remainingDays = date ? getRemainingCalendarDays(date) : undefined

  return formatEndingSoonHeading({
    sameDate,
    endDate: date ? stripYear(date) : undefined,
    remainingDays,
  })
}

export function buildSimplify17StatusHeading(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify17StatusHeading | null {
  const mode = resolveJobCardSimplify11PanelMode(advertisement, now)
  const publications = advertisement.publications ?? []

  if (mode === 'partial') {
    const { runningCount, totalCount } = partialChannelCounts(publications, now)

    return {
      kind: 'partial',
      label: joinStatusDetail('Běží', `${runningCount} ze ${totalCount} kanálů`),
      className: 'tm-text-secondary-default',
      testId: 'job-card-simplify17-partial-heading',
    }
  }

  if (mode === 'running') {
    if (shouldShowSimplify14SamePeriodRange('running', publications, now)) {
      const range = formatSimplify14SamePeriodRange(publications, now)

      if (range) {
        return {
          kind: 'running',
          label: joinStatusDetail('Běží', stripTrailingYearFromRange(range)),
          className: 'tm-text-emotion-success-emphasis',
          testId: 'job-card-simplify17-running-heading',
        }
      }
    }

    const subline = buildSimplify11PanelSubline(advertisement, mode, now)
    const label = subline ? joinStatusDetail('Běží', subline) : 'Běží'

    return {
      kind: 'running',
      label,
      className: 'tm-text-emotion-success-emphasis',
      testId: 'job-card-simplify17-running-heading',
    }
  }

  if (mode === 'mixedPeriods') {
    return {
      kind: 'mixedActive',
      label: formatMixedPeriodsHeading(),
      className: 'tm-text-emotion-success-emphasis',
      testId: 'job-card-simplify17-mixed-periods-heading',
    }
  }

  if (mode === 'endingSoon') {
    return {
      kind: 'endingSoon',
      label: endingSoonHeading(publications, now),
      className: 'tm-text-emotion-warning-emphasis',
      testId: 'job-card-simplify17-ending-soon-heading',
    }
  }

  if (mode === 'ended') {
    const subline = buildSimplify11PanelSubline(advertisement, mode, now)

    return {
      kind: 'expired',
      label: formatAdvertisementEndedHeading(subline),
      className: 'tm-text-emotion-danger-emphasis',
      testId: 'job-card-simplify17-ended-heading',
    }
  }

  if (mode === 'expiredUnexpected') {
    const summary = getAdvertisementSummary(advertisement)

    return {
      kind: 'expired',
      label: formatAdvertisementExpiredHeading(summary.lastEndedOn),
      className: 'tm-text-emotion-danger-emphasis',
      testId: 'job-card-simplify17-expired-heading',
    }
  }

  if (mode === 'allDisabled') {
    return {
      kind: 'notAdvertising',
      label: 'Neinzeruje se',
      className: 'tm-text-secondary-default',
      testId: 'job-card-simplify17-all-disabled-heading',
    }
  }

  if (publications.length > 0) {
    const { active } = partitionPublicationChannels(publications, now)
    const mixedActivePeriods = active.length > 0 && !shareSameEndDate(active)

    if (mixedActivePeriods) {
      return {
        kind: 'mixedActive',
        label: MIXED_PERIOD_HEADING,
        className: 'tm-text-secondary-default',
        testId: 'job-card-simplify17-mixed-active-heading',
      }
    }
  }

  return {
    kind: 'running',
    label: 'Běží',
    className: 'tm-text-emotion-success-emphasis',
    testId: 'job-card-simplify17-running-heading',
  }
}

export const SIMPLIFY_17_NEVER_CREATED_BODY =
  'Zveřejněte ji na portálech a kariérních stránkách a získejte první kandidáty.' as const
