import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import {
  formatEndedHeading,
  formatRunningHeading,
  formatUntilDate,
  formatViewCountLabel,
  getAdvertisementSummary,
  partitionPublications,
  shareSameEndDate,
  stripYear,
} from './advertisementSummary'
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

function PublicationPortal({
  publication,
  expired,
  showDate,
}: {
  publication: JobPublication
  expired: boolean
  showDate: boolean
}) {
  return (
    <li
      data-testid="job-card-publication"
      className={cn(
        'tm-flex',
        'tm-items-center',
        'tm-gap-1.5',
        'tm-font-normal',
        'tm-text-primary-default',
        'tm-text-sm',
      )}
    >
      <span
        data-testid="job-card-publication-dot"
        className={cn(
          'tm-h-1.5',
          'tm-w-1.5',
          'tm-shrink-0',
          'tm-rounded-full',
          expired ? 'tm-bg-gray-300' : 'tm-bg-emotion-success-emphasis',
        )}
      />
      <span data-testid="job-card-publication-channel">{publication.channel}</span>
      {showDate && publication.endDate ? (
        <span data-testid="job-card-publication-dates" className="tm-tabular-nums">
          {formatUntilDate(publication.endDate)}
        </span>
      ) : null}
    </li>
  )
}

function PublicationGroup({
  publications,
  expired,
  showLeadingDivider = false,
  title,
}: {
  publications: JobPublication[]
  expired: boolean
  showLeadingDivider?: boolean
  title?: string
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
        {title ? (
          <>
            <span
              data-testid="job-card-advertisement-title"
              className="tm-text-sm tm-font-medium tm-text-primary-default"
            >
              {title}
            </span>
            <span
              data-testid="job-card-advertisement-title-separator"
              className="tm-text-secondary-default"
              aria-hidden
            >
              ·
            </span>
          </>
        ) : null}
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
          <PublicationPortal
            key={publication.id}
            publication={publication}
            expired={expired}
            showDate={!sameDate}
          />
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
        'tm-relative',
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
      {summary.viewCount === undefined ? null : (
        <span
          data-testid="job-card-advertisement-aggregate-views"
          className="tm-absolute tm-right-3 tm-top-3 tm-text-13 tm-text-secondary-default"
        >
          {formatViewCountLabel(summary.viewCount)}
        </span>
      )}

      <div
        data-testid="job-card-advertisement-publications"
        className={cn(summary.viewCount !== undefined && 'tm-pr-20')}
      >
        {publications.length === 0 ? (
          <div className="tm-flex tm-flex-col tm-gap-1.5">
            {visibleTitle ? (
              <span
                data-testid="job-card-advertisement-title"
                className="tm-text-sm tm-font-medium tm-text-primary-default"
              >
                {visibleTitle}
              </span>
            ) : null}
            <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
              Inzerát není nikde vystavený.
            </p>
          </div>
        ) : (
          <div className="tm-flex tm-flex-col tm-gap-2">
            <PublicationGroup publications={active} expired={false} title={visibleTitle} />
            <PublicationGroup
              publications={expired}
              expired
              showLeadingDivider={active.length > 0}
              title={active.length === 0 ? visibleTitle : undefined}
            />
          </div>
        )}
      </div>
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
