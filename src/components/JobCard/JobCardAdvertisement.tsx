import { Fragment, useId, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { formatExpiredPortalsLabel, getAdvertisementSummary, isAdvertisementFullyExpired } from './advertisementSummary'
import type { JobAdvertisement, JobPublication } from './types'
import { ViewCountRenderer } from './ViewCountRenderer'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  defaultOpen?: boolean
}

function publicationStatus(publication: JobPublication) {
  if (publication.status === 'expired') {
    return { label: 'Ukončeno', className: 'tm-text-emotion-danger-emphasis' }
  }
  if (publication.status === 'endingSoon') {
    return { label: 'Brzy končí', className: 'tm-text-emotion-warning-emphasis' }
  }
  return undefined
}

const PUBLICATION_GRID_CLASS = cn(
  'tm-grid',
  'tm-w-full',
  'tm-grid-cols-[minmax(10rem,max-content)_auto_auto_auto]',
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

function PublicationRow({
  publication,
  showDivider = false,
}: {
  publication: JobPublication
  showDivider?: boolean
}) {
  const status = publicationStatus(publication)

  return (
    <li
      data-testid="job-card-publication"
      className={cn(
        PUBLICATION_ROW_CLASS,
        showDivider && 'tm-border-0 tm-border-t tm-border-solid tm-border-secondary',
      )}
    >
      <span
        data-testid="job-card-publication-channel"
        className="tm-truncate tm-font-medium"
      >
        {publication.channel}
      </span>
      <span
        data-testid="job-card-publication-dates"
        className="tm-min-w-0 tm-whitespace-nowrap"
      >
        {publication.startDate} – {publication.endDate ?? 'dosud'}
      </span>
      {status ? (
        <span
          data-testid="job-card-publication-status"
          className={cn('tm-font-medium', 'tm-uppercase', status.className)}
        >
          {status.label}
        </span>
      ) : (
        <span />
      )}
      <span>
        {publication.viewCount === undefined ? null : (
          <ViewCountRenderer
            count={publication.viewCount}
            testId="job-card-publication-views"
          />
        )}
      </span>
    </li>
  )
}

export function JobCardAdvertisement({
  advertisement,
  defaultOpen = true,
  className,
}: JobCardAdvertisementProps) {
  const contentId = useId()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const publications = advertisement.publications ?? []

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
          <ViewCountRenderer
            key="views"
            count={summary.viewCount}
            testId="job-card-advertisement-aggregate-views"
          />,
        ]),
  ]

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-px-3',
        'tm-py-2',
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
          <span className="tm-text-sm tm-font-medium tm-text-primary-default">Inzerce</span>
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
        className="-tm-mx-3 tm-w-full tm-pl-8 tm-pt-1"
      >
        {publications.length === 0 ? (
          <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
            Inzerát není nikde vystavený.
          </p>
        ) : (
          <ul className={cn(PUBLICATION_GRID_CLASS, 'tm-m-0 tm-list-none tm-p-0')}>
            {publications.map((publication, index) => (
              <PublicationRow
                key={publication.id}
                publication={publication}
                showDivider={index > 0}
              />
            ))}
            {summary.viewCount === undefined ? null : (
              <li
                data-testid="job-card-advertisement-total-views"
                className={cn(
                  PUBLICATION_ROW_CLASS,
                  'tm-border-0 tm-border-t tm-border-solid tm-border-secondary',
                )}
              >
                <span />
                <span />
                <span />
                <span>
                  <ViewCountRenderer
                    count={summary.viewCount}
                    testId="job-card-advertisement-aggregate-views"
                  />
                </span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
