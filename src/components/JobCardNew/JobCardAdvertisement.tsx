import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Link } from '../Link'
import {
  earliestStartDateLabel,
  formatEndedHeading,
  formatPublicationDateLabel,
  formatRunningHeading,
  formatViewCountLabel,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  groupPublicationsByDate,
  isEndingSoonDays,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  shareSameStartDate,
  stripYear,
} from './advertisementSummary'
import type { JobAdvertisement, JobPublication } from './types'
import { JobCardPublicationPortal } from './JobCardPublicationPortal'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  onViewStatisticsClick?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
}

function sharedFieldDateLabel(
  publications: JobPublication[],
  field: 'startDate' | 'endDate',
) {
  const values = publications
    .map((publication) => publication[field])
    .filter((value): value is string => Boolean(value))

  if (values.length === 0) {
    return undefined
  }

  return richestDateLabel(values)
}

function sharedEndDateLabel(publications: JobPublication[]) {
  if (!shareSameEndDate(publications)) {
    return undefined
  }

  return sharedFieldDateLabel(publications, 'endDate')
}

function runningStartDateLabel(publications: JobPublication[]) {
  if (shareSameStartDate(publications)) {
    return sharedFieldDateLabel(publications, 'startDate')
  }

  return earliestStartDateLabel(publications)
}

function publicationGroupDateLabel(publications: JobPublication[], expired: boolean) {
  const startDate = richestDateLabel(publications.map((publication) => publication.startDate))
  const endDates = publications
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))
  const endDate = endDates.length > 0 ? richestDateLabel(endDates) : undefined
  const remainingDays = !expired && endDate ? getRemainingCalendarDays(endDate) : undefined

  if (!endDate) {
    return { label: startDate, endingSoon: false }
  }

  return {
    label: formatPublicationDateLabel({ startDate, endDate, remainingDays }),
    endingSoon: isEndingSoonDays(remainingDays),
  }
}

function PublicationDateGroup({
  publications,
  expired,
  onPreview,
  onExtend,
}: {
  publications: JobPublication[]
  expired: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
  const { label, endingSoon } = publicationGroupDateLabel(publications, expired)

  return (
    <li
      data-testid="job-card-publication-date-group"
      className="tm-contents tm-text-sm tm-font-normal tm-text-primary-default"
    >
      {label ? (
        <span
          data-testid="job-card-publication-dates"
          className={cn(
            'tm-tabular-nums',
            endingSoon && 'tm-font-semibold tm-text-emotion-warning-emphasis',
          )}
        >
          {label}
        </span>
      ) : (
        <span />
      )}
      <ul className="tm-m-0 tm-flex tm-flex-row tm-flex-wrap tm-items-center tm-gap-x-2 tm-gap-y-1.5 tm-list-none tm-p-0">
        {publications.map((publication, index) => (
          <JobCardPublicationPortal
            key={publication.id}
            publication={publication}
            expired={expired}
            withSeparator={index > 0}
            onPreview={onPreview}
            onExtend={onExtend}
          />
        ))}
      </ul>
    </li>
  )
}

function AdvertisementMeta({
  viewCount,
  onViewStatisticsClick,
}: {
  viewCount?: number
  onViewStatisticsClick?: () => void
}) {
  return (
    <div
      data-testid="job-card-advertisement-meta"
      className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-1.5 tm-gap-y-0.5 tm-text-13 tm-text-secondary-default"
    >
      {viewCount !== undefined ? (
        <span data-testid="job-card-advertisement-aggregate-views">
          {formatViewCountLabel(viewCount)}
        </span>
      ) : null}
      {viewCount !== undefined ? (
        <span aria-hidden data-testid="job-card-advertisement-meta-separator">
          ·
        </span>
      ) : null}
      <Link
        variant="secondary"
        className="tm-inline-flex tm-items-center tm-gap-1 tm-text-13 tm-text-secondary-default"
        data-testid="job-card-advertisement-more-stats"
        onClick={onViewStatisticsClick}
      >
        <Icon name="bar-chart" />
        Zobrazit více statistik
      </Link>
    </div>
  )
}

function PublicationGroup({
  publications,
  expired,
  showLeadingDivider = false,
  sharedDateGrid = false,
  onPreview,
  onExtend,
}: {
  publications: JobPublication[]
  expired: boolean
  showLeadingDivider?: boolean
  sharedDateGrid?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
  if (publications.length === 0) {
    return null
  }

  const sameDate = shareSameEndDate(publications)
  const stacked = !sameDate
  const date = sharedEndDateLabel(publications)
  const remainingDays = !expired && date ? getRemainingCalendarDays(date) : undefined
  const endingSoon = isEndingSoonDays(remainingDays)
  const heading = expired
    ? formatEndedHeading({ sameDate, date: date ? stripYear(date) : undefined })
    : formatRunningHeading({
        sameDate,
        startDate: runningStartDateLabel(publications),
        endDate: date,
        remainingDays,
      })
  const headingTestId = expired
    ? 'job-card-publication-ended-heading'
    : 'job-card-advertisement-running-heading'
  const listTestId = expired
    ? 'job-card-advertisement-ended-publications'
    : 'job-card-advertisement-active-publications'
  const headingClassName = cn(
    'tm-text-sm',
    expired
      ? 'tm-font-normal tm-text-secondary-default'
      : endingSoon && sameDate
        ? 'tm-font-semibold tm-text-emotion-warning-emphasis'
        : 'tm-font-medium tm-text-emotion-success-emphasis',
  )
  const portals = stacked
    ? groupPublicationsByDate(publications).map((group) => (
        <PublicationDateGroup
          key={group.map((publication) => publication.id).join('|')}
          publications={group}
          expired={expired}
          onPreview={onPreview}
          onExtend={onExtend}
        />
      ))
    : publications.map((publication, index) => (
        <JobCardPublicationPortal
          key={publication.id}
          publication={publication}
          expired={expired}
          withSeparator={index > 0}
          onPreview={onPreview}
          onExtend={onExtend}
        />
      ))

  if (sharedDateGrid && stacked) {
    return (
      <div className="tm-contents">
        <div
          data-testid={headingTestId}
          className={cn(
            headingClassName,
            'tm-col-span-2',
            showLeadingDivider &&
              'tm-mt-1 tm-border-0  tm-pt-2',
          )}
        >
          {heading}
        </div>
        <ul data-testid={listTestId} className="tm-contents tm-m-0 tm-list-none tm-p-0">
          {portals}
        </ul>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-gap-0.5',
        sharedDateGrid && 'tm-col-span-2',
        showLeadingDivider && ' tm-pt-2',
      )}
    >
      <div data-testid={headingTestId} className={headingClassName}>
        {heading}
      </div>
      <ul
        data-testid={listTestId}
        className={cn(
          'tm-m-0',
          'tm-list-none',
          'tm-p-0',
          sameDate
            ? 'tm-flex tm-flex-row tm-flex-wrap tm-gap-x-2 tm-gap-y-1.5'
            : 'tm-grid tm-grid-cols-[auto_auto] tm-justify-start tm-gap-x-4 tm-gap-y-1',
        )}
      >
        {portals}
      </ul>
    </div>
  )
}

export function JobCardAdvertisement({
  advertisement,
  onViewStatisticsClick,
  onPreviewPublication,
  onExtendPublication,
  className,
}: JobCardAdvertisementProps) {
  const publications = advertisement.publications ?? []
  const { active, expired } = partitionPublications(publications)
  const summary = getAdvertisementSummary(advertisement)
  const sharedDateGrid =
    active.length > 0 &&
    expired.length > 0 &&
    !shareSameEndDate(active) &&
    !shareSameEndDate(expired)

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-4', className)}
    >
      <div data-testid="job-card-advertisement-publications" className="tm-min-w-0">
        {publications.length === 0 ? (
          <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
            Inzerát není nikde vystavený.
          </p>
        ) : (
          <div
            data-testid="job-card-publication-groups"
            className={
              sharedDateGrid
                ? 'tm-grid tm-grid-cols-[auto_auto] tm-justify-start tm-gap-x-4 tm-gap-y-1'
                : 'tm-flex tm-flex-col tm-gap-2'
            }
          >
            <PublicationGroup
              publications={active}
              expired={false}
              sharedDateGrid={sharedDateGrid}
              onPreview={onPreviewPublication}
              onExtend={onExtendPublication}
            />
            <PublicationGroup
              publications={expired}
              expired
              showLeadingDivider={active.length > 0}
              sharedDateGrid={sharedDateGrid}
              onPreview={onPreviewPublication}
              onExtend={onExtendPublication}
            />
          </div>
        )}
      </div>
      <AdvertisementMeta
        viewCount={summary.viewCount}
        onViewStatisticsClick={onViewStatisticsClick}
      />
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
