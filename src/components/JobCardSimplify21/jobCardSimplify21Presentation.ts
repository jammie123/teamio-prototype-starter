import { formatExpiredPortalsLabel } from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildSimplify20StatusHeading,
  expiredPaidCount,
  type Simplify20StatusHeading,
} from '../JobCardSimplify20/jobCardSimplify20Presentation'

/** Same heading as Simplify 20, with Simplify 21 test ids. */
export function buildSimplify21StatusHeading(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify20StatusHeading | null {
  const heading = buildSimplify20StatusHeading(advertisement, now)

  return heading
    ? { ...heading, testId: heading.testId.replace('simplify20', 'simplify21') }
    : null
}

/**
 * Label for the neutral badge next to the heading. Only shown while advertising is
 * still running (`partial`) or ending soon and at least one paid portal already ended.
 */
export function resolveSimplify21EndedPortalLabel(
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
