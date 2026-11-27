import type { JobPublication, JobPublicationStatus } from '../types'
import { formatRemainingDaysLabel, getRemainingCalendarDays } from './dates'

export interface PublicationStatusInfo {
  text: string
  tone: 'warning' | 'ended'
}

/**
 * Status line of the hover card: how soon an ending portal finishes (`Končí za 3 dny`)
 * or when an ended one finished (`Ukončeno 15. 8. 2026`). A running portal has no line.
 */
export function getPublicationStatusInfo(
  publication: JobPublication,
  status?: JobPublicationStatus,
  now = new Date(),
): PublicationStatusInfo | undefined {
  if (status === 'endingSoon') {
    const days = publication.endDate ? getRemainingCalendarDays(publication.endDate, now) : undefined

    if (days === undefined) {
      return { text: 'Končí brzy', tone: 'warning' }
    }

    return {
      text: days <= 0 ? 'Končí dnes' : `Končí za ${formatRemainingDaysLabel(days)}`,
      tone: 'warning',
    }
  }

  if (status === 'expired') {
    return {
      text: publication.endDate ? `Ukončeno ${publication.endDate}` : 'Ukončeno',
      tone: 'ended',
    }
  }

  return undefined
}
