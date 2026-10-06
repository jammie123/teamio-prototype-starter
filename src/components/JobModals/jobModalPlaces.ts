import {
  formatPublicationRange,
  getRemainingCalendarDays,
  isEndingSoonDays,
} from '../JobCardSynteza/advertisementSummary'
import { JOB_MODAL_COPY } from './jobModalCopy'
import type { JobModalPublicationPlace } from './types'

export const JOB_MODAL_PROLONG_DAYS = 30
export const JOB_MODAL_EMPTY_VALUE = '–'

export type JobModalPlaceRunStatus = 'running' | 'endingSoon' | 'ended' | 'never'

export type JobModalNewPeriod = {
  kind: 'extend' | 'republish'
  title: string
  range: string
}

function parseCzechDate(value: string, now = new Date()) {
  const match = value.trim().match(/^(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?\.?$/)

  if (!match) {
    return undefined
  }

  const [, day, month, year] = match

  return new Date(year ? Number(year) : now.getFullYear(), Number(month) - 1, Number(day))
}

function addCalendarDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/** Compact `D.M.YYYY` for the new-period copy. */
export function formatCzechDateCompact(date: Date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

export function formatAdvertisedFrom(place: JobModalPublicationPlace) {
  if (!place.startDate?.trim()) {
    return JOB_MODAL_EMPTY_VALUE
  }

  return formatPublicationRange(place.startDate, place.endDate)
}

function advertisedTimestamp(value: string | undefined, now: Date) {
  if (!value?.trim()) {
    return undefined
  }

  return parseCzechDate(value, now)?.getTime()
}

/** Oldest Inzerováno first; never-advertised places stay at the bottom. */
export function sortPlacesByOldestAdvertised(
  places: JobModalPublicationPlace[],
  now = new Date(),
): JobModalPublicationPlace[] {
  return [...places].sort((left, right) => {
    const leftStart = advertisedTimestamp(left.startDate, now)
    const rightStart = advertisedTimestamp(right.startDate, now)

    if (leftStart == null && rightStart == null) {
      return 0
    }

    if (leftStart == null) {
      return 1
    }

    if (rightStart == null) {
      return -1
    }

    if (leftStart !== rightStart) {
      return leftStart - rightStart
    }

    const leftEnd = advertisedTimestamp(left.endDate, now) ?? Number.POSITIVE_INFINITY
    const rightEnd = advertisedTimestamp(right.endDate, now) ?? Number.POSITIVE_INFINITY
    return leftEnd - rightEnd
  })
}

export function isExtendPlace(place: JobModalPublicationPlace, now = new Date()) {
  const status = resolvePlaceRunStatus(place, now)
  return status === 'running' || status === 'endingSoon'
}

export function isRepublishPlace(place: JobModalPublicationPlace, now = new Date()) {
  const status = resolvePlaceRunStatus(place, now)
  return status === 'ended' || status === 'never'
}

export function resolveProlongConfirmLabel(
  places: JobModalPublicationPlace[],
  now = new Date(),
) {
  const extend = places.some((place) => isExtendPlace(place, now))
  const republish = places.some((place) => isRepublishPlace(place, now))

  if (extend && republish) {
    return JOB_MODAL_COPY.prolong.confirmBoth
  }

  if (republish) {
    return JOB_MODAL_COPY.prolong.confirmRepublish
  }

  return JOB_MODAL_COPY.prolong.confirmExtend
}

export function resolvePlaceRunStatus(
  place: JobModalPublicationPlace,
  now = new Date(),
): JobModalPlaceRunStatus {
  if (!place.startDate?.trim()) {
    return 'never'
  }

  if (place.endDate) {
    const remaining = getRemainingCalendarDays(place.endDate, now)

    if (remaining !== undefined) {
      if (remaining < 0) {
        return 'ended'
      }

      if (isEndingSoonDays(remaining)) {
        return 'endingSoon'
      }

      return 'running'
    }
  }

  if (place.status === 'expired') {
    return 'ended'
  }

  if (place.status === 'endingSoon') {
    return 'endingSoon'
  }

  return 'running'
}

export function placeStatusLabel(status: JobModalPlaceRunStatus) {
  switch (status) {
    case 'running':
      return 'běží'
    case 'endingSoon':
      return 'brzy končí'
    case 'ended':
      return 'ukončeno'
    case 'never':
      return JOB_MODAL_EMPTY_VALUE
  }
}

export function formatNewPeriod(place: JobModalPublicationPlace, now = new Date()): JobModalNewPeriod {
  const status = resolvePlaceRunStatus(place, now)
  const extend = status === 'running' || status === 'endingSoon'
  const start = extend ? (parseCzechDate(place.endDate ?? '', now) ?? now) : now
  const end = addCalendarDays(start, JOB_MODAL_PROLONG_DAYS - 1)

  if (extend) {
    return {
      kind: 'extend',
      title: `Prodloužení o ${JOB_MODAL_PROLONG_DAYS} dní.`,
      range: `Od ${formatCzechDateCompact(start)} do ${formatCzechDateCompact(end)}`,
    }
  }

  return {
    kind: 'republish',
    title: `Na ${JOB_MODAL_PROLONG_DAYS} dní`,
    range: `od ${formatCzechDateCompact(start)}-${formatCzechDateCompact(end)}`,
  }
}
