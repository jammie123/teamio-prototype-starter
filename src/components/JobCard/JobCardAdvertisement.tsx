import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import {
  formatEndedHeading,
  formatRunningHeading,
  formatViewCountLabel,
  getAdvertisementSummary,
  partitionPublications,
  shareSameEndDate,
  stripYear,
  visibleHighlights,
} from './advertisementSummary'
import { JobCardPublicationHighlight, JobCardPublicationPortal } from './JobCardPublicationPortal'
import type { JobAdvertisement, JobPublication } from './types'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  showTitle?: boolean
}

function sharedEndDateLabel(publications: JobPublication[]) {
  if (!shareSameEndDate(publications) || !publications[0]?.endDate) {
    return undefined
  }

  return stripYear(publications[0].endDate)
}

function AdvertisementMeta({ title, viewCount }: { title?: string; viewCount?: number }) {
  if (!title && viewCount === undefined) {
    return null
  }

  return (
    <div className="tm-flex tm-shrink-0 tm-items-baseline tm-gap-2 tm-text-13 tm-text-secondary-default">
      {title ? (
        <span
          data-testid="job-card-advertisement-title"
          className="tm-max-w-48 tm-truncate tm-font-normal"
        >
          {title}
        </span>
      ) : null}
      {title && viewCount !== undefined ? (
        <span data-testid="job-card-advertisement-title-separator" aria-hidden>
          ·
        </span>
      ) : null}
      {viewCount === undefined ? null : (
        <span data-testid="job-card-advertisement-aggregate-views">{formatViewCountLabel(viewCount)}</span>
      )}
    </div>
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

  const sameDate = shareSameEndDate(publications)
  const date = sharedEndDateLabel(publications)
  const heading = expired
    ? formatEndedHeading({ sameDate, date })
    : formatRunningHeading({ sameDate, date })

  return (
    <div
      className={cn(
        showLeadingDivider && 'tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-pt-2',
      )}
    >
      <div className="tm-mb-1.5 tm-flex tm-flex-wrap tm-items-center tm-gap-x-1.5">
        <div
          data-testid={
            expired ? 'job-card-publication-ended-heading' : 'job-card-advertisement-running-heading'
          }
          className={cn(
            'tm-text-sm',
            'tm-font-medium',
            expired ? 'tm-text-emotion-warning-emphasis' : 'tm-text-emotion-success-emphasis',
          )}
        >
          {heading}
        </div>
      </div>
      <ul
        data-testid={
          expired
            ? 'job-card-advertisement-ended-publications'
            : 'job-card-advertisement-active-publications'
        }
        className={cn(
          'tm-m-0',
          'tm-flex',
          'tm-flex-row',
          'tm-flex-wrap',
          'tm-gap-x-5',
          'tm-gap-y-1.5',
          'tm-list-none',
          'tm-p-0',
        )}
      >
        {publications.map((publication) => (
          <Fragment key={publication.id}>
            <JobCardPublicationPortal
              publication={publication}
              expired={expired}
              showDate={!sameDate}
            />
            {expired
              ? null
              : visibleHighlights(publication).map((highlight) => (
                  <JobCardPublicationHighlight
                    key={highlight.id}
                    publication={publication}
                    highlight={highlight}
                  />
                ))}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}

export function JobCardAdvertisement({
  advertisement,
  showTitle = true,
  className,
}: JobCardAdvertisementProps) {
  const publications = advertisement.publications ?? []
  const { active, expired } = partitionPublications(publications)
  const summary = getAdvertisementSummary(advertisement)
  const visibleTitle = showTitle ? advertisement.title : undefined

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-gap-2',
        'tm-rounded',
        'tm-border',
        'tm-border-secondary',
        'tm-px-3',
        'tm-py-3',
        className,
      )}
    >
      <div className="tm-flex tm-items-start tm-justify-between tm-gap-3">
        <div data-testid="job-card-advertisement-publications" className="tm-min-w-0 tm-flex-1">
          {publications.length === 0 ? (
            <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
              Inzerát není nikde vystavený.
            </p>
          ) : (
            <div className="tm-flex tm-flex-col tm-gap-2">
              <PublicationGroup publications={active} expired={false} />
              <PublicationGroup
                publications={expired}
                expired
                showLeadingDivider={active.length > 0}
              />
            </div>
          )}
        </div>
        <AdvertisementMeta title={visibleTitle} viewCount={summary.viewCount} />
      </div>
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
