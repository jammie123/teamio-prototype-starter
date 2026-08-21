import { Fragment, useId, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import {
  formatExpiredPortalsLabel,
  formatRemainingDaysLabel,
  formatUntilDate,
  formatViewCountLabel,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  isAdvertisementFullyExpired,
  partitionPublications,
  shareSameEndDate,
} from './advertisementSummary'
import type { JobAdvertisement, JobPublication } from './types'
import { ViewCountRenderer } from './ViewCountRenderer'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  jobTitle: string
  defaultOpen?: boolean
}

function publicationStatus(publication: JobPublication) {
  if (publication.status === 'expired') {
    return undefined
  }

  const remainingDays =
    publication.endDate === undefined
      ? undefined
      : getRemainingCalendarDays(publication.endDate)

  if (remainingDays !== undefined && remainingDays >= 0 && remainingDays < 7) {
    return {
      label: `Brzy končí · ${formatRemainingDaysLabel(remainingDays)}`,
      className: 'tm-text-emotion-warning-emphasis',
    }
  }

  if (publication.status === 'endingSoon') {
    return { label: 'Brzy končí', className: 'tm-text-emotion-warning-emphasis' }
  }

  return undefined
}

function sumViewCounts(publications: JobPublication[]) {
  const counts = publications
    .map((publication) => publication.viewCount)
    .filter((count): count is number => count !== undefined)

  return counts.length === 0 ? undefined : counts.reduce((sum, count) => sum + count, 0)
}

const PUBLICATION_GRID_CLASS = cn(
  'tm-grid',
  'tm-w-full',
  'tm-grid-cols-[minmax(0,1fr)_auto_auto]',
  'tm-items-center',
  'tm-gap-x-4',
)

const PUBLICATION_ROW_CLASS = cn(
  'tm-col-span-full',
  'tm-grid',
  'tm-grid-cols-subgrid',
  'tm-px-3',
  'tm-py-1.5',
  'tm-text-13',
  'tm-font-normal',
  'tm-text-primary-default',
)

function PublicationDateCell({
  endDate,
  expiredSameDate = false,
  status,
}: {
  endDate?: string
  expiredSameDate?: boolean
  status?: ReturnType<typeof publicationStatus>
}) {
  return (
    <span
      data-testid="job-card-publication-dates"
      className="tm-flex tm-min-w-0 tm-flex-col tm-items-end tm-whitespace-nowrap tm-tabular-nums tm-text-right"
    >
      {endDate ? formatUntilDate(endDate, { expiredSameDate }) : null}
      {status ? (
        <span
          data-testid="job-card-publication-status"
          className={cn('tm-font-medium', 'tm-uppercase', status.className)}
        >
          {status.label}
        </span>
      ) : null}
    </span>
  )
}

function PublicationRow({
  channel,
  publication,
  expiredSameDate = false,
  showDivider = false,
}: {
  channel: string
  publication: JobPublication
  expiredSameDate?: boolean
  showDivider?: boolean
}) {
  const status = publicationStatus(publication)
  const viewCount = publication.viewCount

  return (
    <li
      data-testid="job-card-publication"
      className={cn(
        PUBLICATION_ROW_CLASS,
        showDivider && 'tm-border-0 tm-border-t tm-border-solid tm-border-secondary',
      )}
    >
      <span data-testid="job-card-publication-channel" className="tm-min-w-0 tm-truncate tm-font-medium">
        {channel}
      </span>
      <PublicationDateCell
        endDate={publication.endDate}
        expiredSameDate={expiredSameDate}
        status={status}
      />
      {viewCount === undefined ? (
        <span />
      ) : (
        <ViewCountRenderer count={viewCount} testId="job-card-publication-views" withIcon />
      )}
    </li>
  )
}

function PublicationGroup({
  publications,
  expired,
  showLeadingDivider = false,
}: {
  publications: JobPublication[]
  expired: boolean
  showLeadingDivider?: boolean
}) {
  if (publications.length === 0) {
    return null
  }

  const sameEndDate = shareSameEndDate(publications)

  if (sameEndDate) {
    const combined: JobPublication = {
      ...publications[0],
      id: publications.map((publication) => publication.id).join('-'),
      channel: publications.map((publication) => publication.channel).join(', '),
      viewCount: sumViewCounts(publications),
      status: publications.find((publication) => publication.status === 'endingSoon')?.status,
    }

    return (
      <PublicationRow
        channel={combined.channel}
        publication={combined}
        expiredSameDate={expired}
        showDivider={showLeadingDivider}
      />
    )
  }

  return (
    <>
      {expired ? (
        <li
          data-testid="job-card-publication-ended-heading"
          className={cn(PUBLICATION_ROW_CLASS, showLeadingDivider && 'tm-pt-2')}
        >
          <span />
          <span className="tm-font-medium tm-text-right">Ukončeno</span>
          <span />
        </li>
      ) : null}
      {publications.map((publication, index) => (
        <PublicationRow
          key={publication.id}
          channel={publication.channel}
          publication={publication}
          showDivider={!expired && (showLeadingDivider || index > 0)}
        />
      ))}
    </>
  )
}

export function JobCardAdvertisement({
  advertisement,
  jobTitle,
  defaultOpen = true,
  className,
}: JobCardAdvertisementProps) {
  const contentId = useId()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const publications = advertisement.publications ?? []
  const { active, expired } = partitionPublications(publications)

  const summary = getAdvertisementSummary(advertisement)
  const allExpired = isAdvertisementFullyExpired(advertisement)
  const portalNames = allExpired ? '' : summary.activePortalNames.join(', ')
  const firstEndsLabel = allExpired || !summary.firstEndsOn ? undefined : `první končí ${summary.firstEndsOn}`
  const expiredPortalsLabel =
    allExpired && summary.expiredPortalCount > 0
      ? formatExpiredPortalsLabel(summary.expiredPortalCount)
      : undefined
  const lastEndedLabel = allExpired ? summary.lastEndedOn : undefined
  const showCollapsedSummary =
    !isOpen &&
    (portalNames.length > 0 ||
      firstEndsLabel !== undefined ||
      expiredPortalsLabel !== undefined ||
      lastEndedLabel !== undefined ||
      summary.viewCount !== undefined)
  const collapsedSummaryItems = [
    ...(expiredPortalsLabel
      ? [
          <span key="expired">{expiredPortalsLabel}</span>,
        ]
      : []),
    ...(portalNames
      ? [
          <span key="portals">{portalNames}</span>,
        ]
      : []),
    ...(firstEndsLabel
      ? [
          <span key="first-ends">{firstEndsLabel}</span>,
        ]
      : []),
    ...(lastEndedLabel
      ? [
          <span key="last-ended">{lastEndedLabel}</span>,
        ]
      : []),
    ...(summary.viewCount === undefined
      ? []
      : [
          <span key="views" data-testid="job-card-advertisement-aggregate-views">
            {formatViewCountLabel(summary.viewCount)}
          </span>,
        ]),
  ]

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-rounded',
        'tm-border',
        'tm-border-transparent',
        'tm-px-3',
        'tm-py-2',
        'hover:tm-border-secondary',
        className,
      )}
    >
      <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-3 tm-gap-y-1">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className={cn(
            'tm-inline-flex',
            'tm-items-center',
            'tm-gap-2',
            'tm-border-0',
            'tm-bg-transparent',
            'tm-p-0',
            'tm-font-inherit',
            'tm-cursor-pointer',
            'tm-text-secondary-default',
            'focus-visible:tm-rounded-sm',
            'focus-visible:tm-outline-0',
            'focus-visible:tm-ring',
          )}
        >
          <Icon
            name="chevron-down"
            className={cn('tm-text-base', !isOpen && '-tm-rotate-90')}
          />
          <span className="tm-text-sm tm-font-medium tm-text-primary-default">{jobTitle}</span>
        </button>
        {showCollapsedSummary ? (
          <div
            data-testid="job-card-advertisement-summary"
            className={cn(
              'tm-flex',
              'tm-min-w-0',
              'tm-flex-1',
              'tm-flex-wrap',
              'tm-items-center',
              'tm-gap-x-3',
              'tm-text-13',
              'tm-text-secondary-default',
            )}
          >
            {collapsedSummaryItems.map((item, index) => (
              <Fragment key={item.key}>
                {index > 0 ? <span aria-hidden="true">·</span> : null}
                {item}
              </Fragment>
            ))}
          </div>
        ) : null}
      </div>

      <div
        id={contentId}
        hidden={!isOpen}
        data-testid="job-card-advertisement-publications"
        className="-tm-mx-3 tm-w-full tm-pl-8"
      >
        {publications.length === 0 ? (
          <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
            Inzerát není nikde vystavený.
          </p>
        ) : (
          <ul className={cn(PUBLICATION_GRID_CLASS, 'tm-m-0 tm-list-none tm-p-0')}>
            <PublicationGroup publications={active} expired={false} />
            <PublicationGroup
              publications={expired}
              expired
              showLeadingDivider={active.length > 0}
            />
          </ul>
        )}
      </div>
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
