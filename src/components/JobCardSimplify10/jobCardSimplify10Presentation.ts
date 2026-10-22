import {
  isEndingSoonPublication,
  partitionPublications,
  shareSameEndDate,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement } from '../JobCardSynteza/types'

export type JobCardSimplify10PanelMode =
  | 'notAdvertising'
  | 'endingSoon'
  | 'expiredUnexpected'
  | 'fallback'

export function resolveJobCardSimplify10PanelMode(
  advertisement: JobAdvertisement,
  now = new Date(),
): JobCardSimplify10PanelMode {
  if (advertisement.status === 'notAdvertising') {
    return 'notAdvertising'
  }

  const publications = advertisement.publications ?? []
  const { active, expired } = partitionPublications(publications, now)
  const mixedActivePeriods = active.length > 0 && !shareSameEndDate(active)
  const endingSoonSameDate =
    !mixedActivePeriods &&
    active.length > 0 &&
    active.every((publication) => isEndingSoonPublication(publication, now))

  if (active.length === 0 && expired.length > 0) {
    return 'expiredUnexpected'
  }

  if (endingSoonSameDate && expired.length === 0) {
    return 'endingSoon'
  }

  return 'fallback'
}
