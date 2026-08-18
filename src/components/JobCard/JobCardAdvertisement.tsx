import { Fragment, useId, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { getAdvertisementSummary, portalCountLabel } from './advertisementSummary'
import { JobCardActions } from './JobCardActions'
import type { JobAdvertisement, JobPublication } from './types'
import { ViewCountRenderer } from './ViewCountRenderer'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  defaultOpen?: boolean
}

function isExpired(publication: JobPublication) {
  return publication.status === 'expired'
}

const PUBLICATION_GRID_CLASS = cn(
  'tm-grid',
  'tm-w-full',
  'tm-grid-cols-[minmax(8rem,1fr)_7rem_10.5rem_5.5rem]',
  'tm-items-center',
  'tm-gap-x-6',
)

const PUBLICATION_ROW_CLASS = cn(
  PUBLICATION_GRID_CLASS,
  'tm-py-1.5',
  'tm-text-sm',
  'tm-font-normal',
  'tm-text-primary-default',
)

function PublicationRow({ publication }: { publication: JobPublication }) {
  return (
    <li data-testid="job-card-publication" className={PUBLICATION_ROW_CLASS}>
      <span className="tm-min-w-0 tm-truncate">{publication.channel}</span>
      <span
        data-testid="job-card-publication-status"
        className={cn(
          'tm-font-medium',
          isExpired(publication)
            ? 'tm-text-emotion-danger-emphasis'
            : 'tm-text-emotion-success-emphasis',
        )}
      >
        {isExpired(publication) ? 'Ukončeno' : 'Aktivní'}
      </span>
      <span className="tm-min-w-0 tm-whitespace-nowrap">
        {publication.startDate} – {publication.endDate ?? 'dosud'}
      </span>
      <span className="tm-justify-self-end">
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
  const summaryParts = [
    summary.portalCount > 0 ? portalCountLabel(summary.portalCount) : undefined,
    summary.runsUntil ? `Inzerce do ${summary.runsUntil}` : undefined,
  ].filter((part): part is string => part !== undefined)
  const showCollapsedSummary =
    !isOpen && (summaryParts.length > 0 || summary.viewCount !== undefined)
  const collapsedSummaryItems = [
    ...summaryParts.map((part) => (
      <span key={part}>{part}</span>
    )),
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
    <div data-testid="job-card-advertisement" className={cn('tm-flex', 'tm-flex-col', className)}>
      <div className="tm-flex tm-items-center tm-gap-2">
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
          <span className="tm-text-xs tm-font-semibold tm-uppercase tm-tracking-wide">
            {advertisement.title ?? 'Aktuální inzerát'}
          </span>
        </button>
        {advertisement.actions?.length ? (
          <JobCardActions
            actions={advertisement.actions}
            label="Další akce inzerátu"
            testId="job-card-advertisement-actions-toggle"
            className="tm-ml-auto"
          />
        ) : null}
      </div>

      {showCollapsedSummary ? (
        <div
          data-testid="job-card-advertisement-summary"
          className={cn(
            'tm-flex',
            'tm-flex-wrap',
            'tm-items-center',
            'tm-gap-x-3',
            'tm-pl-6',
            'tm-py-1.5',
            'tm-text-xs',
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

      <div id={contentId} hidden={!isOpen} className="tm-pl-6 tm-pt-1">
        {publications.length === 0 ? (
          <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
            Inzerát není nikde vystavený.
          </p>
        ) : (
          <>
            <ul className="tm-m-0 tm-w-full tm-list-none tm-p-0">
              {publications.map((publication) => (
                <PublicationRow key={publication.id} publication={publication} />
              ))}
            </ul>
            {summary.viewCount === undefined ? null : (
              <div
                data-testid="job-card-advertisement-total-views"
                className={PUBLICATION_ROW_CLASS}
              >
                <span />
                <span />
                <span />
                <span className="tm-justify-self-end">
                  <ViewCountRenderer count={summary.viewCount} />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
