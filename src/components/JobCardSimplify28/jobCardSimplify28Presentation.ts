import {
  formatCompactDateRange,
  isUnlimitedPublication,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  shareSameStartDate,
} from '../JobCardSynteza/advertisementSummary'
import { isDraftAdvertisement, MIXED_PERIOD_HEADING } from '../JobCardSyntezaAds/advertisementSummaryAds'
import type { JobAdvertisement, JobPublication, JobPublicationStatus } from '../JobCardSynteza/types'

export const SIMPLIFY_28_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const
export const SIMPLIFY_28_NOT_ADVERTISING_CLASS = 'tm-text-secondary-default' as const
export const SIMPLIFY_28_RUNNING_TITLE = 'Běží' as const
export const SIMPLIFY_28_RUNNING_CLASS = 'tm-text-emotion-success-emphasis' as const
export const SIMPLIFY_28_ENDED_TITLE = 'Ukončeno' as const
export const SIMPLIFY_28_MIXED_PERIOD_TITLE = MIXED_PERIOD_HEADING

export type Simplify28GroupKind = 'running' | 'endingSoon' | 'expired'
export type Simplify28ListStatus = 'success' | 'default'
export type Simplify28DateLayout = 'hidden' | 'beside'

export interface Simplify28BoardItemModel {
  id: string
  channel: string
  status: JobPublicationStatus
  date?: string
  dateLayout: Simplify28DateLayout
}

export interface Simplify28ListBadge {
  tone: Simplify28ListStatus
  label: string
}

export interface Simplify28GroupModel {
  kind: Simplify28GroupKind
  listStatus: Simplify28ListStatus
  badge: Simplify28ListBadge
  items: Simplify28BoardItemModel[]
}

export type Simplify28AdvertisementModel =
  | {
      kind: 'notAdvertising'
      title: typeof SIMPLIFY_28_NOT_ADVERTISING_TITLE
      className: typeof SIMPLIFY_28_NOT_ADVERTISING_CLASS
      testId: string
    }
  | {
      kind: 'groups'
      title: string
      titleTestId: string
      titleClassName?: string
      datesDiffer: boolean
      groups: Simplify28GroupModel[]
    }
  | { kind: 'fallback' }

const NOT_ADVERTISING_MODEL = {
  kind: 'notAdvertising',
  title: SIMPLIFY_28_NOT_ADVERTISING_TITLE,
  className: SIMPLIFY_28_NOT_ADVERTISING_CLASS,
  testId: 'job-card-simplify28-not-advertising-heading',
} as const satisfies Simplify28AdvertisementModel

function itemStatus(publication: JobPublication, kind: Simplify28GroupKind): JobPublicationStatus {
  if (publication.status) {
    return publication.status
  }

  if (kind === 'endingSoon') {
    return 'endingSoon'
  }

  if (kind === 'expired') {
    return 'expired'
  }

  return 'active'
}

function itemDate(publication: JobPublication, datesDiffer: boolean): string | undefined {
  if (!datesDiffer || isUnlimitedPublication(publication.channel) || !publication.endDate) {
    return undefined
  }

  return `do ${publication.endDate}`
}

function publicationDatesDiffer(publications: JobPublication[]) {
  const dated = publications.filter(
    (publication) => Boolean(publication.endDate) && !isUnlimitedPublication(publication.channel),
  )

  if (dated.length < 2) {
    return false
  }

  return !shareSameEndDate(dated)
}

function badgeFor(kind: Simplify28GroupKind, count: number): Simplify28ListBadge {
  if (kind === 'expired') {
    return { tone: 'default', label: formatEndedPortalsBadgeLabel(count) }
  }

  if (kind === 'endingSoon') {
    return { tone: 'success', label: `${count} Brzy končí` }
  }

  return { tone: 'success', label: SIMPLIFY_28_RUNNING_TITLE }
}

function toGroup(
  publications: JobPublication[],
  kind: Simplify28GroupKind,
  datesDiffer: boolean,
): Simplify28GroupModel {
  const badge = badgeFor(kind, publications.length)
  const dateLayout: Simplify28DateLayout = datesDiffer ? 'beside' : 'hidden'

  return {
    kind,
    listStatus: badge.tone,
    badge,
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

function finiteDatedPublications(publications: JobPublication[]) {
  return publications.filter(
    (publication) =>
      Boolean(publication.startDate) &&
      Boolean(publication.endDate) &&
      !isUnlimitedPublication(publication.channel),
  )
}

/** Live portals: same period → „Běží od–do“, mixed dates → „Běží v různá období“, else „Běží“. */
function formatActiveHeaderTitle(active: JobPublication[]) {
  const dated = finiteDatedPublications(active)

  if (dated.length === 0) {
    return SIMPLIFY_28_RUNNING_TITLE
  }

  if (shareSameStartDate(dated) && shareSameEndDate(dated)) {
    const startDate = richestDateLabel(dated.map((publication) => publication.startDate))
    const endDate = richestDateLabel(dated.map((publication) => publication.endDate!))
    return `${SIMPLIFY_28_RUNNING_TITLE} ${formatCompactDateRange(startDate, endDate)}`
  }

  return SIMPLIFY_28_MIXED_PERIOD_TITLE
}

function buildHeaderTitle(active: JobPublication[]) {
  if (active.length === 0) {
    return {
      title: SIMPLIFY_28_ENDED_TITLE,
      titleTestId: 'job-card-simplify28-ended-heading',
    }
  }

  return {
    title: formatActiveHeaderTitle(active),
    titleTestId: 'job-card-simplify28-running-heading',
    titleClassName: SIMPLIFY_28_RUNNING_CLASS,
  }
}

export function buildSimplify28AdvertisementModel(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify28AdvertisementModel {
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
  const datesDiffer = publicationDatesDiffer(live)
  const groups: Simplify28GroupModel[] = [
    ...(running.length > 0 ? [toGroup(running, 'running', datesDiffer)] : []),
    ...(endingSoon.length > 0 ? [toGroup(endingSoon, 'endingSoon', datesDiffer)] : []),
    ...(expired.length > 0 ? [toGroup(expired, 'expired', publicationDatesDiffer(expired))] : []),
  ]

  return {
    kind: 'groups',
    ...buildHeaderTitle(live),
    datesDiffer,
    groups,
  }
}
