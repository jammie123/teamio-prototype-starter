import { useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { Link } from '../Link'
import {
  earliestStartDateLabel,
  formatEndedHeading,
  formatEndingSoonHeading,
  formatRunningHeading,
  formatViewCountLabel,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  isEndingSoonPublication,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  shareSameStartDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { formatCount } from '../JobCardSynteza/formatCount'
import { Tag } from '../Tag'
import {
  DRAFT_ADVERTISEMENT_BADGE,
  DRAFT_ADVERTISEMENT_HEADING,
  expiredPeriodBadge,
  isDraftAdvertisement,
  MIXED_PERIOD_HEADING,
  publicationPeriodBadge,
  splitIntoBalancedColumns,
  type PublicationPeriodBadge,
} from './advertisementSummaryAds'
import { JobCardPublicationPortal } from './JobCardPublicationPortal'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
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

function AdvertisementMeta({
  publications,
  viewCount,
  onViewStatisticsClick,
  onPreviewAdvertisement,
}: {
  publications: JobPublication[]
  viewCount?: number
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
}) {
  const [open, setOpen] = useState(false)

  if (viewCount === undefined) {
    return null
  }

  return (
    <div
      data-testid="job-card-advertisement-meta"
      className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-1.5 tm-gap-y-0.5 tm-text-13 tm-text-secondary-default"
    >
      <div
        className="tm-relative tm-flex tm-items-center"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          data-testid="job-card-advertisement-stats-toggle"
          aria-expanded={open}
          className="tm-border-0 tm-bg-transparent tm-p-0 tm-font-inherit tm-text-13 tm-text-secondary-default tm-cursor-pointer"
          onClick={() => setOpen((current) => !current)}
        >
          <span
            data-testid="job-card-advertisement-aggregate-views"
            className="tm-border-0 tm-border-b tm-border-dotted tm-border-secondary"
          >
            {formatViewCountLabel(viewCount)}
          </span>
        </button>
        {open ? (
          <div
            data-testid="job-card-advertisement-stats-dropdown"
            className="tm-absolute tm-left-0 tm-top-full tm-z-50 tm-mt-2 tm-rounded tm-border tm-border-primary tm-bg-basic tm-p-3 tm-shadow"
          >
            <div className="tm-flex tm-w-[16rem] tm-flex-col tm-gap-3">
              <ul
                data-testid="job-card-advertisement-stats-list"
                className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0"
              >
                {publications.map((publication) => (
                  <li
                    key={publication.id}
                    data-testid="job-card-advertisement-stats-row"
                    className="tm-flex tm-items-start tm-gap-2"
                  >
                    <JobPortalLogo
                      type={jobPortalLogoTypeFromChannel(publication.channel)}
                      title=""
                      className="tm-size-6"
                    />
                    <div className="tm-min-w-0 tm-flex-1">
                      <div className="tm-text-sm tm-font-medium tm-text-primary-default">
                        {publication.channel}
                      </div>
                      <div className="tm-text-13 tm-tabular-nums tm-text-secondary-default">
                        {publication.viewCount === undefined
                          ? '– zhlédnutí'
                          : `${formatCount(publication.viewCount)} zhlédnutí`}
                        {' · '}
                        {publication.reactionCount === undefined
                          ? '– reakcí'
                          : `${formatCount(publication.reactionCount)} reakcí`}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                variant="secondary"
                size="small"
                data-testid="job-card-advertisement-detailed-stats"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onViewStatisticsClick?.()
                }}
              >
                Přejít na podrobné statistiky
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <span aria-hidden data-testid="job-card-advertisement-preview-separator">
        ·
      </span>
      <Link
        variant="secondary"
        className="tm-inline-flex tm-items-center tm-gap-1 tm-text-13 tm-text-secondary-default"
        data-testid="job-card-advertisement-preview"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onPreviewAdvertisement?.()
        }}
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
  onPreview,
  onExtend,
}: {
  publications: JobPublication[]
  kind: PublicationGroupKind
  showLeadingDivider?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
  if (publications.length === 0) {
    return null
  }

  const expired = kind === 'expired'
  const sameDate = shareSameEndDate(publications)
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
    kind === 'expired' && 'tm-font-normal tm-text-secondary-default',
    kind === 'endingSoon' &&
      (sameDate
        ? 'tm-font-semibold tm-text-emotion-warning-emphasis'
        : 'tm-font-medium tm-text-emotion-warning-emphasis'),
    kind === 'running' && 'tm-font-medium tm-text-emotion-success-emphasis',
  )

  return (
    <div
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-gap-0.5',
        showLeadingDivider && ' tm-pt-2',
      )}
    >
      <div data-testid={headingTestId} className={headingClassName}>
        {heading}
      </div>
      <ul
        data-testid={listTestId}
        className="tm-m-0 tm-flex tm-flex-row tm-flex-wrap tm-gap-x-2 tm-gap-y-1.5 tm-list-none tm-p-0"
      >
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
    </div>
  )
}

function PeriodBadgeColumn({
  publications,
  expired,
  periodBadge,
  onPreview,
  onExtend,
}: {
  publications: JobPublication[]
  expired: boolean
  periodBadge: (publication: JobPublication) => PublicationPeriodBadge | undefined
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
  return (
    <div
      data-testid="job-card-advertisement-period-column"
      className="tm-grid tm-grid-cols-[minmax(0,8rem)_auto] tm-items-center tm-content-start tm-gap-x-2 tm-gap-y-1"
    >
      {publications.map((publication) => (
        <JobCardPublicationPortal
          key={publication.id}
          publication={publication}
          expired={expired}
          withSeparator={false}
          variant="grid"
          periodBadge={periodBadge(publication)}
          onPreview={onPreview}
          onExtend={onExtend}
        />
      ))}
    </div>
  )
}

function PeriodBadgeGroup({
  publications,
  expired,
  heading,
  headingTestId,
  headingClassName,
  listTestId,
  showLeadingDivider = false,
  periodBadge,
  onPreview,
  onExtend,
}: {
  publications: JobPublication[]
  expired: boolean
  heading: string
  headingTestId: string
  headingClassName: string
  listTestId: string
  showLeadingDivider?: boolean
  periodBadge: (publication: JobPublication) => PublicationPeriodBadge | undefined
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
  if (publications.length === 0) {
    return null
  }

  const columns = splitIntoBalancedColumns(publications)

  return (
    <div className={cn('tm-flex tm-flex-col tm-gap-0.5', showLeadingDivider && ' tm-pt-2')}>
      <div data-testid={headingTestId} className={headingClassName}>
        {heading}
      </div>
      <div
        data-testid={listTestId}
        className={cn(
          'tm-grid',
          'tm-items-start',
          'tm-justify-start',
          'tm-gap-x-4',
          'tm-gap-y-1',
          columns.length > 1 ? 'tm-grid-cols-2' : 'tm-grid-cols-1',
        )}
      >
        {columns.map((column) => (
          <PeriodBadgeColumn
            key={column.map((publication) => publication.id).join('|')}
            publications={column}
            expired={expired}
            periodBadge={periodBadge}
            onPreview={onPreview}
            onExtend={onExtend}
          />
        ))}
      </div>
    </div>
  )
}

export function JobCardAdvertisement({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  className,
}: JobCardAdvertisementProps) {
  if (isDraftAdvertisement(advertisement)) {
    return (
      <div
        data-testid="job-card-advertisement"
        className={cn('tm-flex', 'tm-flex-col', 'tm-gap-4', className)}
      >
        <div
          data-testid="job-card-advertisement-draft"
          className="tm-flex tm-flex-col tm-items-start tm-gap-3 tm-rounded tm-border tm-border-secondary tm-bg-cover-light tm-p-4"
        >
          <div className="tm-flex tm-flex-col tm-gap-1">
            <div className="tm-flex tm-min-w-0 tm-items-center tm-gap-2">
              <div className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-text-primary-default">
                {advertisement.title ?? DRAFT_ADVERTISEMENT_HEADING}
              </div>
              <Tag
                color="informative"
                isSubtle
                className="tm-shrink-0"
                data-testid="job-card-advertisement-draft-badge"
              >
                {DRAFT_ADVERTISEMENT_BADGE}
              </Tag>
            </div>
            <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
              Inzerát ještě není dokončený. Dokončete ho a pokračujte ve zveřejnění.
            </p>
          </div>
          {onCompleteAdvertisement ? (
            <Button
              variant="secondary"
              size="small"
              className="!tm-min-h-7 !tm-px-3 !tm-py-1"
              data-testid="job-card-advertisement-complete"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onCompleteAdvertisement(advertisement)
              }}
            >
              Dokončit inzerát
            </Button>
          ) : null}
        </div>
      </div>
    )
  }

  const publications = advertisement.publications ?? []
  const { active, expired } = partitionPublications(publications)
  const summary = getAdvertisementSummary(advertisement)
  const mixedActivePeriods = active.length > 0 && !shareSameEndDate(active)
  const mixedExpiredPeriods = expired.length > 0 && !shareSameEndDate(expired)
  const endingSoonSameDate =
    !mixedActivePeriods &&
    active.length > 0 &&
    active.every((publication) => isEndingSoonPublication(publication))

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
            className="tm-flex tm-flex-col tm-gap-2"
          >
            {mixedActivePeriods ? (
              <PeriodBadgeGroup
                publications={active}
                expired={false}
                heading={MIXED_PERIOD_HEADING}
                headingTestId="job-card-advertisement-running-heading"
                headingClassName="tm-text-sm tm-font-medium tm-text-emotion-success-emphasis"
                listTestId="job-card-advertisement-active-publications"
                periodBadge={publicationPeriodBadge}
                onPreview={onPreviewPublication}
                onExtend={onExtendPublication}
              />
            ) : (
              <PublicationGroup
                kind={endingSoonSameDate ? 'endingSoon' : 'running'}
                publications={active}
                onPreview={onPreviewPublication}
                onExtend={onExtendPublication}
              />
            )}
            {mixedExpiredPeriods ? (
              <PeriodBadgeGroup
                publications={expired}
                expired
                heading="Ukončeno"
                headingTestId="job-card-publication-ended-heading"
                headingClassName="tm-text-sm tm-font-normal tm-text-secondary-default"
                listTestId="job-card-advertisement-ended-publications"
                showLeadingDivider={active.length > 0}
                periodBadge={expiredPeriodBadge}
                onPreview={onPreviewPublication}
                onExtend={onExtendPublication}
              />
            ) : (
              <PublicationGroup
                kind="expired"
                publications={expired}
                showLeadingDivider={active.length > 0}
                onPreview={onPreviewPublication}
                onExtend={onExtendPublication}
              />
            )}
          </div>
        )}
      </div>
      <AdvertisementMeta
        publications={publications}
        viewCount={summary.viewCount}
        onViewStatisticsClick={onViewStatisticsClick}
        onPreviewAdvertisement={
          onPreviewAdvertisement ??
          (onPreviewPublication
            ? () => {
                const publication =
                  publications.find((item) => item.status !== 'expired') ?? publications[0]
                if (publication) {
                  onPreviewPublication(publication)
                }
              }
            : undefined)
        }
      />
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
