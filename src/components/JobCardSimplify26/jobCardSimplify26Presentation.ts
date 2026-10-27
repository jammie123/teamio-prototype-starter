import {
  finitePaidEndDatePublications,
  formatCompactDateRange,
  formatPublicationRange,
  isUnlimitedPublication,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  shareSameStartDate,
} from '../JobCardSynteza/advertisementSummary'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import type { JobAdvertisement, JobPublication, JobPublicationStatus } from '../JobCardSynteza/types'

export const SIMPLIFY_26_RUNNING_TITLE = 'Běží' as const
export const SIMPLIFY_26_MIXED_PERIOD_TITLE = 'Běží v různá období' as const
export const SIMPLIFY_26_ENDING_SOON_TITLE = 'Brzy končí' as const
export const SIMPLIFY_26_ENDED_TITLE = 'Inzerce skončila' as const
export const SIMPLIFY_26_NOT_ADVERTISING_TITLE = 'Neinzeruje se' as const

export const SIMPLIFY_26_RUNNING_CLASS = 'tm-text-emotion-success-emphasis' as const
export const SIMPLIFY_26_ENDING_SOON_CLASS = 'tm-text-emotion-warning-emphasis' as const
export const SIMPLIFY_26_ENDED_CLASS = 'tm-text-secondary-default' as const
export const SIMPLIFY_26_NOT_ADVERTISING_CLASS = 'tm-text-secondary-default' as const

export type Simplify26GroupKind = 'running' | 'endingSoon' | 'expired'
export type Simplify26ListLayout = 'row' | 'column'
export type Simplify26ListStatus = 'active' | 'inactive'

export interface Simplify26BoardItemModel {
  id: string
  channel: string
  status: JobPublicationStatus
  date?: string
}

export interface Simplify26GroupModel {
  kind: Simplify26GroupKind
  title: string
  className: string
  testId: string
  layout: Simplify26ListLayout
  listStatus: Simplify26ListStatus
  items: Simplify26BoardItemModel[]
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
      active: Simplify26GroupModel[]
      inactive: Simplify26GroupModel[]
    }
  | { kind: 'fallback' }

const NOT_ADVERTISING_MODEL = {
  kind: 'notAdvertising',
  title: SIMPLIFY_26_NOT_ADVERTISING_TITLE,
  className: SIMPLIFY_26_NOT_ADVERTISING_CLASS,
  testId: 'job-card-simplify26-not-advertising-heading',
} as const satisfies Simplify26AdvertisementModel

function datedPaidPublications(publications: JobPublication[]) {
  return publications.filter(
    (publication) =>
      publication.startDate &&
      publication.endDate &&
      !isUnlimitedPublication(publication.channel),
  )
}

function sharedPeriodRange(publications: JobPublication[]) {
  const dated = datedPaidPublications(publications)

  if (dated.length === 0) {
    return undefined
  }

  if (!shareSameStartDate(dated) || !shareSameEndDate(dated)) {
    return undefined
  }

  const startDate = richestDateLabel(dated.map((publication) => publication.startDate))
  const endDate = richestDateLabel(
    dated.map((publication) => publication.endDate).filter((value): value is string => Boolean(value)),
  )

  return formatCompactDateRange(startDate, endDate)
}

function sharedEndLabel(publications: JobPublication[]) {
  const finite = finitePaidEndDatePublications(publications)

  if (finite.length === 0 || !shareSameEndDate(finite)) {
    return undefined
  }

  return richestDateLabel(
    finite.map((publication) => publication.endDate).filter((value): value is string => Boolean(value)),
  )
}

function periodsDiffer(publications: JobPublication[]) {
  const dated = datedPaidPublications(publications)

  if (dated.length === 0) {
    return false
  }

  return !shareSameStartDate(dated) || !shareSameEndDate(dated)
}

function endDatesDiffer(publications: JobPublication[]) {
  const finite = finitePaidEndDatePublications(publications)

  if (finite.length === 0) {
    return false
  }

  return !shareSameEndDate(finite)
}

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

function itemDate(
  publication: JobPublication,
  kind: Simplify26GroupKind,
  showDate: boolean,
) {
  if (!showDate || isUnlimitedPublication(publication.channel)) {
    return undefined
  }

  if (kind === 'running') {
    return formatPublicationRange(publication.startDate, publication.endDate)
  }

  return publication.endDate
}

function toItems(
  publications: JobPublication[],
  kind: Simplify26GroupKind,
  showDate: boolean,
): Simplify26BoardItemModel[] {
  return publications.map((publication) => ({
    id: publication.id,
    channel: publication.channel,
    status: itemStatus(publication, kind),
    date: itemDate(publication, kind, showDate),
  }))
}

function runningGroup(publications: JobPublication[]): Simplify26GroupModel {
  const mixed = periodsDiffer(publications)
  const range = mixed ? undefined : sharedPeriodRange(publications)

  return {
    kind: 'running',
    title: mixed
      ? SIMPLIFY_26_MIXED_PERIOD_TITLE
      : range
        ? `${SIMPLIFY_26_RUNNING_TITLE} ${range}`
        : SIMPLIFY_26_RUNNING_TITLE,
    className: SIMPLIFY_26_RUNNING_CLASS,
    testId: 'job-card-simplify26-running-heading',
    layout: 'column',
    listStatus: 'active',
    items: toItems(publications, 'running', mixed),
  }
}

function endingSoonGroup(publications: JobPublication[]): Simplify26GroupModel {
  const mixed = endDatesDiffer(publications)
  const endLabel = mixed ? undefined : sharedEndLabel(publications)

  return {
    kind: 'endingSoon',
    title: endLabel ? `${SIMPLIFY_26_ENDING_SOON_TITLE} ${endLabel}` : SIMPLIFY_26_ENDING_SOON_TITLE,
    className: SIMPLIFY_26_ENDING_SOON_CLASS,
    testId: 'job-card-simplify26-ending-soon-heading',
    layout: 'column',
    listStatus: 'active',
    items: toItems(publications, 'endingSoon', mixed),
  }
}

function expiredGroup(publications: JobPublication[]): Simplify26GroupModel {
  const mixed = endDatesDiffer(publications)
  const endLabel = mixed ? undefined : sharedEndLabel(publications)

  return {
    kind: 'expired',
    title: endLabel ? `${SIMPLIFY_26_ENDED_TITLE} ${endLabel}` : SIMPLIFY_26_ENDED_TITLE,
    className: SIMPLIFY_26_ENDED_CLASS,
    testId: 'job-card-simplify26-ended-heading',
    layout: 'column',
    listStatus: 'inactive',
    items: toItems(publications, 'expired', mixed),
  }
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

  return {
    kind: 'groups',
    active: [
      ...(running.length > 0 ? [runningGroup(running)] : []),
      ...(endingSoon.length > 0 ? [endingSoonGroup(endingSoon)] : []),
    ],
    inactive: expired.length > 0 ? [expiredGroup(expired)] : [],
  }
}
