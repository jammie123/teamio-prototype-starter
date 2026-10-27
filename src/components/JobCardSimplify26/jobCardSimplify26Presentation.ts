import type { TagColor } from '../Tag/Tag'
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

export const SIMPLIFY_26_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const
export const SIMPLIFY_26_NOT_ADVERTISING_CLASS = 'tm-text-secondary-default' as const
export const SIMPLIFY_26_RUNNING_TITLE = 'Běží' as const
export const SIMPLIFY_26_ENDED_TITLE = 'Ukončeno' as const
export const SIMPLIFY_26_MIXED_PERIOD_TITLE = MIXED_PERIOD_HEADING

export type Simplify26GroupKind = 'running' | 'endingSoon' | 'expired'
export type Simplify26ListStatus = 'active' | 'inactive'

export interface Simplify26BoardItemModel {
  id: string
  channel: string
  status: JobPublicationStatus
  date?: string
}

export interface Simplify26GroupModel {
  kind: Simplify26GroupKind
  listStatus: Simplify26ListStatus
  items: Simplify26BoardItemModel[]
}

export interface Simplify26HeaderBadge {
  color: TagColor
  label: string
}

export type Simplify26AdvertisementModel =
  | {
      kind: 'notAdvertising'
      title: typeof SIMPLIFY_26_NOT_ADVERTISING_TITLE
      className: typeof SIMPLIFY_26_NOT_ADVERTISING_CLASS
      testId: string
    }
  | {
      kind: 'groups'
      title: string
      titleTestId: string
      badges: Simplify26HeaderBadge[]
      /** Running and ending-soon portals first, then ended portals. */
      groups: Simplify26GroupModel[]
    }
  | { kind: 'fallback' }

const NOT_ADVERTISING_MODEL = {
  kind: 'notAdvertising',
  title: SIMPLIFY_26_NOT_ADVERTISING_TITLE,
  className: SIMPLIFY_26_NOT_ADVERTISING_CLASS,
  testId: 'job-card-simplify26-not-advertising-heading',
} as const satisfies Simplify26AdvertisementModel

function itemStatus(publication: JobPublication, kind: Simplify26GroupKind): JobPublicationStatus {
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

/** Every portal shows only its end date („do …“); unlimited portals have none. */
function itemDate(publication: JobPublication): string | undefined {
  if (isUnlimitedPublication(publication.channel) || !publication.endDate) {
    return undefined
  }

  return `do ${publication.endDate}`
}

function toGroup(
  publications: JobPublication[],
  kind: Simplify26GroupKind,
): Simplify26GroupModel {
  return {
    kind,
    listStatus: kind === 'expired' ? 'inactive' : 'active',
    items: publications.map((publication) => ({
      id: publication.id,
      channel: publication.channel,
      status: itemStatus(publication, kind),
      date: itemDate(publication),
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
    return SIMPLIFY_26_RUNNING_TITLE
  }

  if (shareSameStartDate(dated) && shareSameEndDate(dated)) {
    const startDate = richestDateLabel(dated.map((publication) => publication.startDate))
    const endDate = richestDateLabel(dated.map((publication) => publication.endDate!))
    return `${SIMPLIFY_26_RUNNING_TITLE} ${formatCompactDateRange(startDate, endDate)}`
  }

  return SIMPLIFY_26_MIXED_PERIOD_TITLE
}

function buildHeaderTitle(active: JobPublication[]) {
  if (active.length === 0) {
    return {
      title: SIMPLIFY_26_ENDED_TITLE,
      titleTestId: 'job-card-simplify26-ended-heading',
    }
  }

  return {
    title: formatActiveHeaderTitle(active),
    titleTestId: 'job-card-simplify26-running-heading',
  }
}

function buildHeaderBadges(counts: {
  running: number
  endingSoon: number
  expired: number
}): Simplify26HeaderBadge[] {
  const badges: Simplify26HeaderBadge[] = []

  if (counts.running > 0) {
    badges.push({ color: 'success', label: `${counts.running} Běží` })
  }

  if (counts.endingSoon > 0) {
    badges.push({ color: 'warning', label: `${counts.endingSoon} Brzy končí` })
  }

  if (counts.expired > 0) {
    badges.push({ color: 'neutral', label: formatEndedPortalsBadgeLabel(counts.expired) })
  }

  return badges
}

export function buildSimplify26AdvertisementModel(
  advertisement: JobAdvertisement,
  now = new Date(),
): Simplify26AdvertisementModel {
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

  const groups: Simplify26GroupModel[] = [
    ...(running.length > 0 ? [toGroup(running, 'running')] : []),
    ...(endingSoon.length > 0 ? [toGroup(endingSoon, 'endingSoon')] : []),
    ...(expired.length > 0 ? [toGroup(expired, 'expired')] : []),
  ]

  return {
    kind: 'groups',
    ...buildHeaderTitle([...running, ...endingSoon]),
    badges: buildHeaderBadges({
      running: running.length,
      endingSoon: endingSoon.length,
      expired: expired.length,
    }),
    groups,
  }
}
