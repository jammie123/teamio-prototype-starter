import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Link } from '../Link'
import {
  earliestStartDateLabel,
  formatEndedHeading,
  formatEndingSoonHeading,
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
  visibleHighlights,
} from './advertisementSummary'
import type { JobAdvertisement, JobPublication } from './types'
import { JobCardPublicationHighlight, JobCardPublicationPortal } from './JobCardPublicationPortal'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  /** When true and the advertisement has no portals, show the advertisement title. Default true. */
  showTitle?: boolean
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
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

function publicationRowItems(
  publications: JobPublication[],
  expired: boolean,
) {
  return publications.flatMap((publication) => [
    { kind: 'portal' as const, publication },
    ...(expired
      ? []
      : visibleHighlights(publication).map((highlight) => ({
          kind: 'highlight' as const,
          publication,
          highlight,
        }))),
  ])
}

function PublicationItems({
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
  return publicationRowItems(publications, expired).map((item, index) =>
    item.kind === 'portal' ? (
      <JobCardPublicationPortal
        key={item.publication.id}
        publication={item.publication}
        expired={expired}
        withSeparator={index > 0}
        onPreview={onPreview}
        onExtend={onExtend}
      />
    ) : (
      <JobCardPublicationHighlight
        key={item.highlight.id}
        publication={item.publication}
        highlight={item.highlight}
        withSeparator={index > 0}
      />
    ),
  )
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
            endingSoon && 'tm-font-medium tm-text-emotion-warning-emphasis',
          )}
        >
          {label}
        </span>
      ) : (
        <span />
      )}
      <ul className="tm-m-0 tm-flex tm-flex-row tm-flex-wrap tm-items-center tm-gap-x-2 tm-gap-y-1.5 tm-list-none tm-p-0">
        <PublicationItems
          publications={publications}
          expired={expired}
          onPreview={onPreview}
          onExtend={onExtend}
        />
      </ul>
    </li>
  )
}

function AdvertisementMeta({
  viewCount,
  onViewStatisticsClick,
  onPreviewAdvertisement,
}: {
  viewCount?: number
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
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
      <span aria-hidden data-testid="job-card-advertisement-preview-separator">
        ·
      </span>
      <Link
        variant="secondary"
        className="tm-inline-flex tm-items-center tm-gap-1 tm-text-13 tm-text-secondary-default"
        data-testid="job-card-advertisement-preview"
        onClick={onPreviewAdvertisement}
      >
        <Icon name="search" />
        Zobrazit náhled
      </Link>
    </div>
  )
}

type PublicationGroupKind = 'running' | 'endingSoon' | 'expired'

function PublicationGroup({
  publications,
  kind,
  showLeadingDivider = false,
  sharedDateGrid = false,
  onPreview,
  onExtend,
}: {
  publications: JobPublication[]
  kind: PublicationGroupKind
  showLeadingDivider?: boolean
  sharedDateGrid?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
  if (publications.length === 0) {
    return null
  }

  const expired = kind === 'expired'
  const sameDate = shareSameEndDate(publications)
  const stacked = !sameDate
  const date = sharedEndDateLabel(publications)
  const remainingDays = !expired && date ? getRemainingCalendarDays(date) : undefined
  const heading =
    kind === 'expired'
      ? formatEndedHeading({ sameDate, date: date ? stripYear(date) : undefined })
      : kind === 'endingSoon'
        ? formatEndingSoonHeading({ sameDate, endDate: date, remainingDays })
        : formatRunningHeading({
            sameDate,
            startDate: runningStartDateLabel(publications),
            endDate: date,
            remainingDays,
          })
  const headingTestId =
    kind === 'expired'
      ? 'job-card-publication-ended-heading'
      : kind === 'endingSoon'
        ? 'job-card-advertisement-ending-soon-heading'
        : 'job-card-advertisement-running-heading'
  const listTestId =
    kind === 'expired'
      ? 'job-card-advertisement-ended-publications'
      : kind === 'endingSoon'
        ? 'job-card-advertisement-ending-soon-publications'
        : 'job-card-advertisement-active-publications'
  const headingClassName = cn(
    'tm-text-sm',
    'tm-font-normal',
    kind === 'expired' && 'tm-text-secondary-default',
    kind === 'endingSoon' && 'tm-text-emotion-warning-emphasis',
    kind === 'running' && 'tm-text-emotion-success-emphasis',
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
    : (
        <PublicationItems
          publications={publications}
          expired={expired}
          onPreview={onPreview}
          onExtend={onExtend}
        />
      )

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
  showTitle = true,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  className,
}: JobCardAdvertisementProps) {
  const publications = advertisement.publications ?? []
  const { running, endingSoon, expired } = partitionPublications(publications)
  const summary = getAdvertisementSummary(advertisement)
  const sharedDateGrid =
    running.length > 0 &&
    expired.length > 0 &&
    !shareSameEndDate(running) &&
    !shareSameEndDate(expired)
  const unpublishedTitle = advertisement.title ?? 'Inzerát'

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-4', className)}
    >
      <div data-testid="job-card-advertisement-publications" className="tm-min-w-0">
        {publications.length === 0 ? (
          <div className="tm-flex tm-flex-col tm-gap-1">
            {showTitle ? (
              <div
                data-testid="job-card-advertisement-title"
                className="tm-text-sm tm-font-medium tm-text-primary-default"
              >
                {unpublishedTitle}
              </div>
            ) : null}
            <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
              Inzerát je vytvořený, ale zatím není vystavený na žádném portálu.
            </p>
          </div>
        ) : (
          <div
            data-testid="job-card-publication-groups"
            className={
              sharedDateGrid && endingSoon.length === 0
                ? 'tm-grid tm-grid-cols-[auto_auto] tm-justify-start tm-gap-x-4 tm-gap-y-1'
                : 'tm-flex tm-flex-col tm-gap-2'
            }
          >
            <PublicationGroup
              kind="endingSoon"
              publications={endingSoon}
              onPreview={onPreviewPublication}
              onExtend={onExtendPublication}
            />
            {sharedDateGrid && endingSoon.length > 0 ? (
              <div className="tm-grid tm-grid-cols-[auto_auto] tm-justify-start tm-gap-x-4 tm-gap-y-1">
                <PublicationGroup
                  kind="running"
                  publications={running}
                  sharedDateGrid
                  onPreview={onPreviewPublication}
                  onExtend={onExtendPublication}
                />
                <PublicationGroup
                  kind="expired"
                  publications={expired}
                  showLeadingDivider={running.length > 0}
                  sharedDateGrid
                  onPreview={onPreviewPublication}
                  onExtend={onExtendPublication}
                />
              </div>
            ) : (
              <>
                <PublicationGroup
                  kind="running"
                  publications={running}
                  sharedDateGrid={sharedDateGrid}
                  onPreview={onPreviewPublication}
                  onExtend={onExtendPublication}
                />
                <PublicationGroup
                  kind="expired"
                  publications={expired}
                  showLeadingDivider={running.length > 0 || endingSoon.length > 0}
                  sharedDateGrid={sharedDateGrid}
                  onPreview={onPreviewPublication}
                  onExtend={onExtendPublication}
                />
              </>
            )}
          </div>
        )}
      </div>
      {publications.length > 0 ? (
        <AdvertisementMeta
          viewCount={summary.viewCount}
          onViewStatisticsClick={onViewStatisticsClick}
          onPreviewAdvertisement={onPreviewAdvertisement}
        />
      ) : null}
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
