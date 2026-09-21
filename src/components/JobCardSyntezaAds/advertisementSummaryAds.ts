import {
  formatRemainingDaysLabel,
  getRemainingCalendarDays,
  isEndingSoonDays,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'

export function isDraftAdvertisement(advertisement: JobAdvertisement) {
  return advertisement.status === 'draft'
}

export const DRAFT_ADVERTISEMENT_HEADING = 'Rozpracovaný inzerát'
export const DRAFT_ADVERTISEMENT_BADGE = 'Rozpracovaný'

export function advertisementSwitcherTitle(advertisement: JobAdvertisement, index: number) {
  if (advertisement.title) {
    return advertisement.title
  }

  if (isDraftAdvertisement(advertisement)) {
    return DRAFT_ADVERTISEMENT_HEADING
  }

  return `Inzerát ${index + 1}`
}

export const MIXED_PERIOD_HEADING = 'Běží v různá období'

/** Below this the portals stay in one column; above it they split into two balanced ones. */
export const MIXED_PERIOD_MIN_ITEMS_PER_TWO_COLUMNS = 3

export function splitIntoBalancedColumns<T>(items: T[]): T[][] {
  if (items.length < MIXED_PERIOD_MIN_ITEMS_PER_TWO_COLUMNS) {
    return [items]
  }

  const firstColumnLength = Math.ceil(items.length / 2)

  return [items.slice(0, firstColumnLength), items.slice(firstColumnLength)]
}

export function formatRemainingBadgeLabel(days: number) {
  return `zbývá ${formatRemainingDaysLabel(days)}`
}

export type PublicationPeriodBadge = {
  color: 'warning' | 'informative'
  label: string
}

export function publicationPeriodBadge(publication: JobPublication): PublicationPeriodBadge | undefined {
  if (!publication.endDate) {
    return undefined
  }

  const remainingDays = getRemainingCalendarDays(publication.endDate)

  if (remainingDays !== undefined && isEndingSoonDays(remainingDays)) {
    return {
      color: 'warning',
      label: formatRemainingBadgeLabel(remainingDays),
    }
  }

  return {
    color: 'informative',
    label: publication.endDate,
  }
}

export function expiredPeriodBadge(publication: JobPublication): PublicationPeriodBadge | undefined {
  if (!publication.endDate) {
    return undefined
  }

  return {
    color: 'informative',
    label: publication.endDate,
  }
}
