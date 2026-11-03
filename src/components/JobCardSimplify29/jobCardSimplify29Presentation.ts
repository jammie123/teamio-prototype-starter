import type { TagColor } from '../Tag/Tag'
import {
  formatCompactDateRange,
  getRemainingCalendarDays,
  isEndingSoonPublication,
  isUnlimitedPublication,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  shareSameStartDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import { isDraftAdvertisement, MIXED_PERIOD_HEADING } from '../JobCardSyntezaAds/advertisementSummaryAds'
import type { JobAdvertisement, JobPublication, JobPublicationStatus } from '../JobCardSynteza/types'

export const SIMPLIFY_29_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const
export const SIMPLIFY_29_NOT_ADVERTISING_CLASS = 'tm-text-secondary-default' as const
export const SIMPLIFY_29_RUNNING_TITLE = 'Běží' as const
export const SIMPLIFY_29_RUNNING_CLASS = 'tm-text-emotion-success-emphasis' as const
export const SIMPLIFY_29_ENDED_TITLE = 'Ukončeno' as const
export const SIMPLIFY_29_MIXED_PERIOD_TITLE = MIXED_PERIOD_HEADING

export type Simplify29GroupKind = 'running' | 'endingSoon' | 'period'
export type Simplify29ListStatus = 'active' | 'inactive'
export type Simplify29DateLayout = 'hidden' | 'beside'
export const SIMPLIFY_29_UNLIMITED_PERIOD_KEY = 'unlimited' as const

export interface Simplify29BoardItemModel {
  id: string
  channel: string
  status: JobPublicationStatus
  date?: string
  dateLayout: Simplify29DateLayout
}

export interface Simplify29GroupModel {
  kind: Simplify29GroupKind
  listStatus: Simplify29ListStatus
  periodKey?: string
  periodDate?: string
  items: Simplify29BoardItemModel[]
}

export interface Simplify29HeaderBadge {
  color: TagColor
  label: string
}

export interface Simplify29ProlongHighlight {
  channels: string[]
  title: string
  perex?: string
}

export type Simplify29AdvertisementModel =
  | {
      kind: 'notAdvertising'
      title: typeof SIMPLIFY_29_NOT_ADVERTISING_TITLE
      className: typeof SIMPLIFY_29_NOT_ADVERTISING_CLASS
      testId: string
    }
  | {
      kind: 'groups'
      title: string
      titleTestId: string
      titleClassName?: string
      badges: Simplify29HeaderBadge[]
      datesDiffer: boolean
      groups: Simplify29GroupModel[]
      prolongHighlight?: Simplify29ProlongHighlight
    }
  | { kind: 'fallback' }

const NOT_ADVERTISING_MODEL = {
  kind: 'notAdvertising',
  title: SIMPLIFY_29_NOT_ADVERTISING_TITLE,
  className: SIMPLIFY_29_NOT_ADVERTISING_CLASS,
  testId: 'job-card-simplify29-not-advertising-heading',
} as const satisfies Simplify29AdvertisementModel

function itemStatus(
  publication: JobPublication,
  kind: Simplify29GroupKind,
  now?: Date,
): JobPublicationStatus {
  if (publication.status) {
    return publication.status
  }

  if (kind === 'endingSoon') {
    return 'endingSoon'
  }

  if (kind === 'period' && now && isEndingSoonPublication(publication, now)) {
    return 'endingSoon'
  }

  return 'active'
}

function itemDate(publication: JobPublication, datesDiffer: boolean): string | undefined {
  if (!datesDiffer || isUnlimitedPublication(publication.channel) || !publication.endDate) {
    return undefined
  }

  return `do ${publication.endDate}`
}

function toGroup(
  publications: JobPublication[],
  kind: Simplify29GroupKind,
  datesDiffer: boolean,
): Simplify29GroupModel {
  const dateLayout: Simplify29DateLayout = datesDiffer ? 'beside' : 'hidden'

  return {
    kind,
    listStatus: 'active',
    items: publications.map((publication) => ({
      id: publication.id,
      channel: publication.channel,
      status: itemStatus(publication, kind),
      date: itemDate(publication, datesDiffer),
      dateLayout,
    })),
  }
}

function publicationPeriodKey(publication: JobPublication) {
  if (isUnlimitedPublication(publication.channel) || !publication.endDate) {
    return SIMPLIFY_29_UNLIMITED_PERIOD_KEY
  }

  return stripYear(publication.endDate)
}

function formatPeriodDate(publications: JobPublication[]) {
  const dated = publications.filter(
    (publication) =>
      Boolean(publication.startDate) &&
      Boolean(publication.endDate) &&
      !isUnlimitedPublication(publication.channel),
  )

  if (dated.length === 0) {
    return undefined
  }

  const startDate = richestDateLabel(dated.map((publication) => publication.startDate))
  const endDate = richestDateLabel(dated.map((publication) => publication.endDate!))
  return formatCompactDateRange(startDate, endDate)
}

function periodSortDays(publications: JobPublication[], now: Date) {
  const dated = publications.find(
    (publication) => publication.endDate && !isUnlimitedPublication(publication.channel),
  )

  if (!dated?.endDate) {
    return undefined
  }

  return getRemainingCalendarDays(dated.endDate, now)
}

function toPeriodGroups(live: JobPublication[], now: Date): Simplify29GroupModel[] {
  const buckets = new Map<string, JobPublication[]>()

  for (const publication of live) {
    const key = publicationPeriodKey(publication)
    const bucket = buckets.get(key)

    if (bucket) {
      bucket.push(publication)
    } else {
      buckets.set(key, [publication])
    }
  }

  return [...buckets.entries()]
    .sort(([leftKey, leftPublications], [rightKey, rightPublications]) => {
      if (leftKey === SIMPLIFY_29_UNLIMITED_PERIOD_KEY) {
        return 1
      }

      if (rightKey === SIMPLIFY_29_UNLIMITED_PERIOD_KEY) {
        return -1
      }

      const leftDays = periodSortDays(leftPublications, now) ?? Number.POSITIVE_INFINITY
      const rightDays = periodSortDays(rightPublications, now) ?? Number.POSITIVE_INFINITY
      return leftDays - rightDays
    })
    .map(([periodKey, publications]) => ({
      kind: 'period' as const,
      listStatus: 'active' as const,
      periodKey,
      periodDate: formatPeriodDate(publications),
      items: publications.map((publication) => ({
        id: publication.id,
        channel: publication.channel,
        status: itemStatus(publication, 'period', now),
        date: undefined,
        dateLayout: 'hidden' as const,
      })),
    }))
}

/** Czech plural for ended portals: 1 ukončený, 2–4 ukončené, 5+ ukončených. */
export function formatEndedPortalsBadgeLabel(count: number) {
  const lastTwo = count % 100
  const last = count % 10

  if (count === 1) {
    return `${count} ukončený`
  }

  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `${count} ukončené`
  }

  return `${count} ukončených`
}

export function formatEndedPortalsHighlightTitle(channels: string[]) {
  if (channels.length === 1) {
    return channels[0]
  }

  return `Inzerce ukončena na ${channels.length} portálech`
}

export function formatEndedPortalsHighlightPerex(endDates: string[]) {
  const uniqueDays: string[] = []
  const seen = new Set<string>()

  for (const endDate of endDates) {
    const day = stripYear(endDate).trim()

    if (!day || seen.has(day)) {
      continue
    }

    seen.add(day)
    uniqueDays.push(day)
  }

  if (uniqueDays.length === 0) {
    return undefined
  }

  if (uniqueDays.length === 1) {
    return `Ukončeno ${uniqueDays[0]}`
  }

  if (uniqueDays.length === 2) {
    return `Ukončeno ${uniqueDays[0]} a ${uniqueDays[1]}`
  }

  const last = uniqueDays[uniqueDays.length - 1]
  const rest = uniqueDays.slice(0, -1).join(', ')
  return `Ukončeno ${rest} a ${last}`
}

function finiteDatedPublications(publications: JobPublication[]) {
  return publications.filter(
    (publication) =>
      Boolean(publication.startDate) &&
      Boolean(publication.endDate) &&
      !isUnlimitedPublication(publication.channel),
  )
}

function liveDatesDiffer(live: JobPublication[]) {
  const dated = live.filter(
    (publication) => Boolean(publication.endDate) && !isUnlimitedPublication(publication.channel),
  )

  if (dated.length < 2) {
    return false
  }

  return !shareSameEndDate(dated)
}

function buildProlongHighlight(expired: JobPublication[]): Simplify29ProlongHighlight | undefined {
  if (expired.length === 0) {
    return undefined
  }

  const channels = expired.map((publication) => publication.channel)
  const endDates = expired.flatMap((publication) =>
    publication.endDate && !isUnlimitedPublication(publication.channel) ? [publication.endDate] : [],
  )

  return {
    channels,
    title: formatEndedPortalsHighlightTitle(channels),
    perex: formatEndedPortalsHighlightPerex(endDates),
  }
}

/** Live portals: same period → „Běží od–do“, mixed dates → „Běží v různá období“, else „Běží“. */
function formatActiveHeaderTitle(active: JobPublication[]) {
  const dated = finiteDatedPublications(active)

  if (dated.length === 0) {
    return SIMPLIFY_29_RUNNING_TITLE
  }

  if (shareSameStartDate(dated) && shareSameEndDate(dated)) {
    const startDate = richestDateLabel(dated.map((publication) => publication.startDate))
    const endDate = richestDateLabel(dated.map((publication) => publication.endDate!))
    return `${SIMPLIFY_29_RUNNING_TITLE} ${formatCompactDateRange(startDate, endDate)}`
  }

  return SIMPLIFY_29_MIXED_PERIOD_TITLE
}

function buildHeaderTitle(active: JobPublication[]) {
  if (active.length === 0) {
    return {
      title: SIMPLIFY_29_ENDED_TITLE,
      titleTestId: 'job-card-simplify29-ended-heading',
    }
  }

  return {
    title: formatActiveHeaderTitle(active),
    titleTestId: 'job-card-simplify29-running-heading',
    titleClassName: SIMPLIFY_29_RUNNING_CLASS,
  }
}

function buildHeaderBadges(counts: {
  endingSoon: number
  expired: number
}): Simplify29HeaderBadge[] {
  const badges: Simplify29HeaderBadge[] = []

  if (counts.endingSoon > 0) {
    badges.push({ color: 'warning', label: `${counts.endingSoon} Brzy končí` })
  }

  if (counts.expired > 0) {
    badges.push({ color: 'neutral', label: formatEndedPortalsBadgeLabel(counts.expired) })
  }

  return badges
}

export function buildSimplify29AdvertisementModel(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify29AdvertisementModel {
  if (advertisement.status === 'notAdvertising') {
    return NOT_ADVERTISING_MODEL
  }

  const publications = advertisement.publications ?? []

  if (isDraftAdvertisement(advertisement) || publications.length === 0) {
    return { kind: 'fallback' }
  }

  const { running, endingSoon, expired } = partitionPublications(publications, now)

  if (running.length === 0 && endingSoon.length === 0 && expired.length === 0) {
    return NOT_ADVERTISING_MODEL
  }

  const live = [...running, ...endingSoon]
  const datesDiffer = liveDatesDiffer(live)
  const groups: Simplify29GroupModel[] = datesDiffer
    ? toPeriodGroups(live, now)
    : [
        ...(running.length > 0 ? [toGroup(running, 'running', datesDiffer)] : []),
        ...(endingSoon.length > 0 ? [toGroup(endingSoon, 'endingSoon', datesDiffer)] : []),
      ]

  return {
    kind: 'groups',
    ...buildHeaderTitle(live),
    badges: buildHeaderBadges({
      endingSoon: endingSoon.length,
      expired: expired.length,
    }),
    datesDiffer,
    groups,
    prolongHighlight: buildProlongHighlight(expired),
  }
}
