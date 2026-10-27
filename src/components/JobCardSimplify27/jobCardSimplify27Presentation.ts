import type { TagColor } from '../Tag/Tag'
import {
  formatCompactDateRange,
  isUnlimitedPublication,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  shareSameStartDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import { isDraftAdvertisement, MIXED_PERIOD_HEADING } from '../JobCardSyntezaAds/advertisementSummaryAds'
import type { JobAdvertisement, JobPublication, JobPublicationStatus } from '../JobCardSynteza/types'

export const SIMPLIFY_27_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const
export const SIMPLIFY_27_NOT_ADVERTISING_CLASS = 'tm-text-secondary-default' as const
export const SIMPLIFY_27_RUNNING_TITLE = 'Běží' as const
export const SIMPLIFY_27_RUNNING_CLASS = 'tm-text-emotion-success-emphasis' as const
export const SIMPLIFY_27_ENDED_TITLE = 'Ukončeno' as const
export const SIMPLIFY_27_MIXED_PERIOD_TITLE = MIXED_PERIOD_HEADING

export type Simplify27GroupKind = 'running' | 'endingSoon'
export type Simplify27ListStatus = 'active' | 'inactive'
export type Simplify27DateLayout = 'hidden' | 'beside'

export interface Simplify27BoardItemModel {
  id: string
  channel: string
  status: JobPublicationStatus
  date?: string
  dateLayout: Simplify27DateLayout
}

export interface Simplify27GroupModel {
  kind: Simplify27GroupKind
  listStatus: Simplify27ListStatus
  items: Simplify27BoardItemModel[]
}

export interface Simplify27HeaderBadge {
  color: TagColor
  label: string
}

export interface Simplify27ProlongHighlight {
  channels: string[]
  title: string
  perex?: string
}

export type Simplify27AdvertisementModel =
  | {
      kind: 'notAdvertising'
      title: typeof SIMPLIFY_27_NOT_ADVERTISING_TITLE
      className: typeof SIMPLIFY_27_NOT_ADVERTISING_CLASS
      testId: string
    }
  | {
      kind: 'groups'
      title: string
      titleTestId: string
      titleClassName?: string
      badges: Simplify27HeaderBadge[]
      datesDiffer: boolean
      groups: Simplify27GroupModel[]
      prolongHighlight?: Simplify27ProlongHighlight
    }
  | { kind: 'fallback' }

const NOT_ADVERTISING_MODEL = {
  kind: 'notAdvertising',
  title: SIMPLIFY_27_NOT_ADVERTISING_TITLE,
  className: SIMPLIFY_27_NOT_ADVERTISING_CLASS,
  testId: 'job-card-simplify27-not-advertising-heading',
} as const satisfies Simplify27AdvertisementModel

function itemStatus(publication: JobPublication, kind: Simplify27GroupKind): JobPublicationStatus {
  if (publication.status) {
    return publication.status
  }

  if (kind === 'endingSoon') {
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
  kind: Simplify27GroupKind,
  datesDiffer: boolean,
): Simplify27GroupModel {
  const dateLayout: Simplify27DateLayout = datesDiffer ? 'beside' : 'hidden'

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

function buildProlongHighlight(expired: JobPublication[]): Simplify27ProlongHighlight | undefined {
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
    return SIMPLIFY_27_RUNNING_TITLE
  }

  if (shareSameStartDate(dated) && shareSameEndDate(dated)) {
    const startDate = richestDateLabel(dated.map((publication) => publication.startDate))
    const endDate = richestDateLabel(dated.map((publication) => publication.endDate!))
    return `${SIMPLIFY_27_RUNNING_TITLE} ${formatCompactDateRange(startDate, endDate)}`
  }

  return SIMPLIFY_27_MIXED_PERIOD_TITLE
}

function buildHeaderTitle(active: JobPublication[]) {
  if (active.length === 0) {
    return {
      title: SIMPLIFY_27_ENDED_TITLE,
      titleTestId: 'job-card-simplify27-ended-heading',
    }
  }

  return {
    title: formatActiveHeaderTitle(active),
    titleTestId: 'job-card-simplify27-running-heading',
    titleClassName: SIMPLIFY_27_RUNNING_CLASS,
  }
}

function buildHeaderBadges(counts: {
  endingSoon: number
  expired: number
}): Simplify27HeaderBadge[] {
  const badges: Simplify27HeaderBadge[] = []

  if (counts.endingSoon > 0) {
    badges.push({ color: 'warning', label: `${counts.endingSoon} Brzy končí` })
  }

  if (counts.expired > 0) {
    badges.push({ color: 'neutral', label: formatEndedPortalsBadgeLabel(counts.expired) })
  }

  return badges
}

export function buildSimplify27AdvertisementModel(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify27AdvertisementModel {
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
  const groups: Simplify27GroupModel[] = [
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
