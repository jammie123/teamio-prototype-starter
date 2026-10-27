import {
  formatExpiredPortalsLabel,
  partitionPublicationChannels,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { expiredPaidCount } from '../JobCardSimplify20/jobCardSimplify20Presentation'
import type { TagColor } from '../Tag'

export type Simplify25StatusBadgeKind = 'running' | 'endingSoon' | 'ended'

export type Simplify25StatusBadge = {
  kind: Simplify25StatusBadgeKind
  label: string
  color: TagColor
  testId: string
}

export function formatSimplify25RunningPortalsLabel(count: number) {
  if (count === 1) {
    return '1 portál běží'
  }

  if (count >= 2 && count <= 4) {
    return `${count} portály běží`
  }

  return `${count} portálů běží`
}

export function formatSimplify25EndingSoonLabel(count: number) {
  return `${count} brzy skončí`
}

/** Combinable status badges that replace the Simplify 24 advertisement heading. */
export function buildSimplify25StatusBadges(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify25StatusBadge[] {
  const publications = advertisement.publications ?? []
  const { running, endingSoon } = partitionPublicationChannels(publications, now)
  const endedCount = expiredPaidCount(publications, now)
  const badges: Simplify25StatusBadge[] = []

  if (running.length > 0) {
    badges.push({
      kind: 'running',
      label: formatSimplify25RunningPortalsLabel(running.length),
      color: 'success',
      testId: 'job-card-simplify25-running-badge',
    })
  }

  if (endingSoon.length > 0) {
    badges.push({
      kind: 'endingSoon',
      label: formatSimplify25EndingSoonLabel(endingSoon.length),
      color: 'warning',
      testId: 'job-card-simplify25-ending-soon-badge',
    })
  }

  if (endedCount > 0) {
    badges.push({
      kind: 'ended',
      label: formatExpiredPortalsLabel(endedCount),
      color: 'neutral',
      testId: 'job-card-simplify25-ended-badge',
    })
  }

  return badges
}
