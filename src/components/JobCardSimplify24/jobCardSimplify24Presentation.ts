import {
  formatExpiredPortalsLabel,
  getRemainingCalendarDays,
  partitionPublicationChannels,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildSimplify20StatusHeading,
  expiredPaidCount,
  type Simplify20StatusHeading,
} from '../JobCardSimplify20/jobCardSimplify20Presentation'

/** Ended advertising stays red for this many days after the last portal ended. */
export const SIMPLIFY_24_ENDED_RECENT_MAX_DAYS = 5 as const

export const SIMPLIFY_24_ENDED_RECENT_CLASS = 'tm-text-emotion-danger-emphasis' as const
export const SIMPLIFY_24_ENDED_OLD_CLASS = 'tm-text-secondary-default' as const
export const SIMPLIFY_24_RUNNING_CLASS = 'tm-text-emotion-success-emphasis' as const

/**
 * Calendar days since the advertisement ended (its latest ended portal). `undefined` when no
 * ended portal has a parsable end date.
 */
export function daysSinceAdvertisementEnded(
  advertisement: JobAdvertisement,
  now = new Date(),
): number | undefined {
  const { expired } = partitionPublicationChannels(advertisement.publications ?? [], now)
  const remaining = expired
    .map((publication) =>
      publication.endDate ? getRemainingCalendarDays(publication.endDate, now) : undefined,
    )
    .filter((days): days is number => days !== undefined)

  if (remaining.length === 0) {
    return undefined
  }

  return -Math.max(...remaining)
}

/** Red for recently ended advertising (up to 5 days), gray for older. */
export function resolveSimplify24EndedHeadingClass(
  advertisement: JobAdvertisement,
  now = new Date(),
) {
  const days = daysSinceAdvertisementEnded(advertisement, now)

  return days !== undefined && days > SIMPLIFY_24_ENDED_RECENT_MAX_DAYS
    ? SIMPLIFY_24_ENDED_OLD_CLASS
    : SIMPLIFY_24_ENDED_RECENT_CLASS
}

/** Same heading as Simplify 20, with Simplify 24 test ids and the ended-heading age tone. */
export function buildSimplify24StatusHeading(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify20StatusHeading | null {
  const heading = buildSimplify20StatusHeading(advertisement, now)

  if (!heading) {
    return null
  }

  return {
    ...heading,
    testId: heading.testId.replace('simplify20', 'simplify24'),
    className: resolveSimplify24HeadingClass(advertisement, heading, now),
  }
}

function resolveSimplify24HeadingClass(
  advertisement: JobAdvertisement,
  heading: Simplify20StatusHeading,
  now: Date,
) {
  if (heading.kind === 'expired') {
    return resolveSimplify24EndedHeadingClass(advertisement, now)
  }

  // "Běží částečně" uses the same success token as "Běží".
  if (heading.kind === 'partial') {
    return SIMPLIFY_24_RUNNING_CLASS
  }

  return heading.className
}

/**
 * Label for the neutral badge next to the heading. Only shown while advertising is
 * still running (`partial`) or ending soon and at least one paid portal already ended.
 */
export function resolveSimplify24EndedPortalLabel(
  advertisement: JobAdvertisement,
  heading: Simplify20StatusHeading,
  now = new Date(),
): string | undefined {
  if (heading.kind !== 'partial' && heading.kind !== 'endingSoon') {
    return undefined
  }

  const expiredCount = expiredPaidCount(advertisement.publications ?? [], now)

  return expiredCount > 0 ? formatExpiredPortalsLabel(expiredCount) : undefined
}
