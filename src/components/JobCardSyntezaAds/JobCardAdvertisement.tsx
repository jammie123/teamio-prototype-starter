import { type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import {
  earliestStartDateLabel,
  formatEndedHeading,
  formatEndingSoonHeading,
  formatPartialRunningHeading,
  formatRunningHeading,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  isEndingSoonPublication,
  partitionPublications,
  richestDateLabel,
  shareSameEndDate,
  shareSamePaidEndDate,
  shareSameStartDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { Tag } from '../Tag'
import {
  DRAFT_ADVERTISEMENT_BADGE,
  DRAFT_ADVERTISEMENT_HEADING,
  expiredPeriodBadge,
  isDraftAdvertisement,
  MIXED_PERIOD_HEADING,
  groupPublicationsByEndDate,
  publicationPeriodBadge,
  sortPublicationsBySoonestEnd,
  splitIntoBalancedColumns,
  type PublicationPeriodBadge,
} from './advertisementSummaryAds'
import { shouldShowPlacesProlong } from './JobCardPlacesSummaryTable'
import { JobCardAdvertisementStatsToggle } from './JobCardAdvertisementStatsToggle'
import type { Placement } from '@floating-ui/react'
import {
  JobCardExpiredPublicationMiniLogoRow,
  JobCardPublicationPortal,
  JobCardPublicationPortalDateChipGroup,
  type JobCardPublicationChannelDecoration,
  type JobCardPublicationHover,
} from './JobCardPublicationPortal'
import { JobCardPublicationHighlight } from './JobCardPublicationHighlight'
import {
  collectProductHighlights,
  JOB_CARD_PRODUCT_HIGHLIGHTS_HEADING,
} from './advertisementProductHighlights'
import { JobCardExpiredPublicationsSimplify9Row } from './JobCardExpiredPublicationsSimplify9Row'
import {
  JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_15_STATUS_HEADING_PADDING_TOP,
} from '../JobCardSimplify15/constants'
import { JobCardSimplify19PortalRow } from '../JobCardSimplify19/JobCardSimplify19PortalRow'
import { JobCardSimplify22PortalRow } from '../JobCardSimplify22/JobCardSimplify22PortalRow'
import { JobCardSimplify23PortalRow } from '../JobCardSimplify23/JobCardSimplify23PortalRow'

export type JobCardAdvertisementPublicationPresentation =
  | 'default'
  | 'simplify5'
  | 'simplify6'
  | 'simplify7'
  | 'simplify8'
  | 'simplify9'
  | 'simplify11'
  | 'simplify13'
  | 'simplify15'
  | 'simplify19'
  | 'simplify21'
  | 'simplify22'
  | 'simplify23'
  | 'simplify24'
  | 'simplify25'

function isSimplify13StylePresentation(
  publicationPresentation?: JobCardAdvertisementPublicationPresentation,
) {
  return (
    publicationPresentation === 'simplify13' ||
    publicationPresentation === 'simplify15' ||
    publicationPresentation === 'simplify19' ||
    publicationPresentation === 'simplify21' ||
    publicationPresentation === 'simplify22' ||
    publicationPresentation === 'simplify23'
  )
}

function isStackedPortalPresentation(
  publicationPresentation?: JobCardAdvertisementPublicationPresentation,
) {
  return (
    publicationPresentation === 'simplify19' ||
    publicationPresentation === 'simplify21' ||
    publicationPresentation === 'simplify22'
  )
}

function isSimplify24FamilyPresentation(
  publicationPresentation?: JobCardAdvertisementPublicationPresentation,
) {
  return publicationPresentation === 'simplify24' || publicationPresentation === 'simplify25'
}

function stackedPortalStatusPlacement(
  publicationPresentation?: JobCardAdvertisementPublicationPresentation,
) {
  return publicationPresentation === 'simplify21' ? ('bottom' as const) : ('top' as const)
}

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  showPreviewLink?: boolean
  periodPresentation?: 'tag' | 'text'
  publicationHover?: JobCardPublicationHover
  publicationChannelDecoration?: JobCardPublicationChannelDecoration
  publicationDropdownPlacement?: Placement
  publicationPresentation?: JobCardAdvertisementPublicationPresentation
  /** Overrides default portal logo size (18px) when using default publication presentation. */
  publicationChannelLogoSize?: 18 | 20 | 24 | 30 | 35
  /** Hides Běží / Ukončeno group headings when a parent panel renders Simplify 11-style status. */
  suppressPublicationGroupHeadings?: boolean
  /** Hides aggregate views / preview meta row (e.g. Simplify 18 renders stats in the panel header). */
  suppressAdvertisementMeta?: boolean
  /** Hides per-publication highlight chips that surface view/reaction stats under portals. */
  publicationInlineHighlights?: 'all' | 'none'
  /** Renders at the end of the aggregate meta row (e.g. Simplify 18 extend link). */
  advertisementMetaTrailing?: ReactNode
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
  showPreviewLink = true,
  publicationHover = 'portalDetail',
  showProlong = false,
  onExtendAll,
  linkDecoration = 'dotted-underline',
  metaTrailing,
}: {
  publications: JobPublication[]
  viewCount?: number
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  showPreviewLink?: boolean
  publicationHover?: JobCardPublicationHover
  showProlong?: boolean
  onExtendAll?: () => void
  linkDecoration?: JobCardPublicationChannelDecoration
  metaTrailing?: ReactNode
}) {
  if (viewCount === undefined && !metaTrailing) {
    return null
  }

  const statsPanel =
    viewCount === undefined ? null : (
      <JobCardAdvertisementStatsToggle
        publications={publications}
        viewCount={viewCount}
        onViewStatisticsClick={onViewStatisticsClick}
        publicationHover={publicationHover}
        showProlong={showProlong}
        onExtendAll={onExtendAll}
        linkDecoration={linkDecoration}
      />
    )

  return (
    <div
      data-testid="job-card-advertisement-meta"
      className="tm-flex tm-w-full tm-items-center tm-gap-x-3 tm-gap-y-0.5 tm-text-13 tm-text-secondary-default"
    >
      {statsPanel || showPreviewLink ? (
        <div className="tm-flex tm-min-w-0 tm-flex-wrap tm-items-center tm-gap-x-1.5 tm-gap-y-0.5">
          {statsPanel}
          {showPreviewLink ? (
            <>
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
            </>
          ) : null}
        </div>
      ) : null}
      {metaTrailing ? (
        <div className="tm-ml-auto tm-flex tm-shrink-0 tm-items-center tm-gap-3">{metaTrailing}</div>
      ) : null}
    </div>
  )
}

type PublicationGroupKind = 'running' | 'endingSoon' | 'expired'

type PublicationStatusHeadingKind =
  | PublicationGroupKind
  | 'mixedActive'
  | 'mixedExpired'
  | 'partial'

function publicationStatusIcon(
  kind: PublicationStatusHeadingKind,
): 'circle-check' | 'alert-triangle-outline' | 'clock' | 'warning' {
  if (kind === 'partial') {
    return 'alert-triangle-outline'
  }

  if (kind === 'expired' || kind === 'mixedExpired') {
    return 'warning'
  }

  if (kind === 'endingSoon') {
    return 'clock'
  }

  return 'circle-check'
}

const SIMPLIFY_13_STATUS_HEADING_ICON_SIZE = 24

function PublicationStatusHeading({
  kind,
  testId,
  className,
  iconSize = 20,
  strokeWidth,
  children,
}: {
  kind: PublicationStatusHeadingKind
  testId: string
  className?: string
  iconSize?: number
  strokeWidth?: number
  children: string
}) {
  return (
    <p
      data-testid={testId}
      className={cn(
        'tm-m-0 tm-flex tm-items-center tm-gap-2 tm-text-sm tm-font-medium',
        className,
      )}
    >
      <Icon
        name={publicationStatusIcon(kind)}
        size={iconSize}
        strokeWidth={strokeWidth}
        className="tm-shrink-0"
      />
      <span>{children}</span>
    </p>
  )
}

function renderPublicationGroupHeading({
  presentation,
  kind,
  heading,
  headingTestId,
  headingClassName,
  suppressPublicationGroupHeadings,
}: {
  presentation?: JobCardAdvertisementPublicationPresentation
  kind: PublicationStatusHeadingKind
  heading: string
  headingTestId: string
  headingClassName: string
  suppressPublicationGroupHeadings?: boolean
}) {
  if (suppressPublicationGroupHeadings) {
    return null
  }

  if (isSimplify13StylePresentation(presentation)) {
    const isSimplify15 = presentation !== 'simplify13'
    return (
      <div
        data-testid={`${headingTestId}-wrap`}
        className={cn(
          'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-1.5 tm-mb-2',
          isSimplify15 && JOB_CARD_SIMPLIFY_15_STATUS_HEADING_PADDING_TOP,
        )}
      >
        <PublicationStatusHeading
          kind={kind}
          testId={headingTestId}
          className={headingClassName}
          iconSize={
            isSimplify15
              ? JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_SIZE
              : SIMPLIFY_13_STATUS_HEADING_ICON_SIZE
          }
          strokeWidth={isSimplify15 ? JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_STROKE : undefined}
        >
          {heading}
        </PublicationStatusHeading>
      </div>
    )
  }

  return (
    <div data-testid={headingTestId} className={headingClassName}>
      {heading}
    </div>
  )
}

interface PublicationHoverPassThrough {
  hoverContent?: JobCardPublicationHover
  allPublications?: JobPublication[]
  showProlong?: boolean
  onExtendAll?: () => void
  channelDecoration?: JobCardPublicationChannelDecoration
  dropdownPlacement?: Placement
  channelLogoSize?: 18 | 20 | 24 | 30 | 35 | 40
  showChannelLabel?: boolean
  inlineHighlights?: 'all' | 'none'
  minimalPresentation?: boolean
  showProductHighlights?: boolean
  portalChip?: boolean
  publicationPresentation?: JobCardAdvertisementPublicationPresentation
  suppressPublicationGroupHeadings?: boolean
  channelNameClamp?: '100'
}

function simplify6PortalListGapClass() {
  return 'tm-gap-x-1.5 tm-gap-y-1'
}

function isSimplify6FamilyPresentation(
  publicationPresentation?: JobCardAdvertisementPublicationPresentation,
) {
  return (
    publicationPresentation === 'simplify6' ||
    publicationPresentation === 'simplify7' ||
    publicationPresentation === 'simplify8' ||
    publicationPresentation === 'simplify9' ||
    publicationPresentation === 'simplify11'
  )
}

function isSimplify7MixedDatesPresentation(
  publicationPresentation?: JobCardAdvertisementPublicationPresentation,
) {
  return (
    publicationPresentation === 'simplify7' ||
    publicationPresentation === 'simplify8' ||
    publicationPresentation === 'simplify9' ||
    publicationPresentation === 'simplify11'
  )
}

function publicationStatusHeadingClass(
  kind: PublicationGroupKind,
  minimalPresentation: boolean | undefined,
  sameDate: boolean,
  publicationPresentation?: JobCardAdvertisementPublicationPresentation,
) {
  const isSimplify6Family = isSimplify6FamilyPresentation(publicationPresentation)

  if (isSimplify6Family && minimalPresentation) {
    return cn(
      'tm-text-sm',
      kind === 'expired' && 'tm-font-normal tm-text-secondary-default',
      kind === 'endingSoon' &&
        (sameDate
          ? 'tm-font-semibold tm-text-emotion-warning-emphasis'
          : 'tm-font-medium tm-text-emotion-warning-emphasis'),
      kind === 'running' && 'tm-font-medium tm-text-emotion-success-emphasis',
    )
  }

  if (minimalPresentation) {
    if (kind === 'endingSoon') {
      return 'tm-text-sm tm-font-normal tm-text-secondary-default'
    }

    return 'tm-text-13 tm-font-normal tm-text-secondary-default'
  }

  if (isSimplify13StylePresentation(publicationPresentation)) {
    return cn(
      kind === 'expired' && 'tm-text-emotion-danger-emphasis',
      kind === 'endingSoon' && 'tm-text-emotion-warning-emphasis',
      kind === 'running' && 'tm-text-emotion-success-emphasis',
    )
  }

  return cn(
    'tm-text-sm',
    kind === 'expired' && 'tm-font-normal tm-text-secondary-default',
    kind === 'endingSoon' &&
      (sameDate
        ? 'tm-font-semibold tm-text-emotion-warning-emphasis'
        : 'tm-font-medium tm-text-emotion-warning-emphasis'),
    kind === 'running' && 'tm-font-medium tm-text-emotion-success-emphasis',
  )
}

function ProductHighlightsSection({
  publications,
  channelDecoration,
  minimalPresentation,
}: {
  publications: JobPublication[]
  channelDecoration?: JobCardPublicationChannelDecoration
  minimalPresentation?: boolean
}) {
  const entries = collectProductHighlights(publications)

  if (entries.length === 0) {
    return null
  }

  return (
    <div
      data-testid="job-card-advertisement-product-highlights"
      className={cn(
        'tm-flex tm-flex-col',
        minimalPresentation ? 'tm-mt-1 tm-gap-2 tm-border-t tm-border-secondary tm-pt-3' : 'tm-gap-0.5 tm-pt-2',
      )}
    >
      <div
        data-testid="job-card-advertisement-product-highlights-heading"
        className={
          minimalPresentation
            ? 'tm-text-13 tm-font-normal tm-text-secondary-default'
            : 'tm-text-sm tm-font-medium tm-text-secondary-default'
        }
      >
        {JOB_CARD_PRODUCT_HIGHLIGHTS_HEADING}
      </div>
      <ul
        className={cn(
          'tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-p-0',
          minimalPresentation ? 'tm-gap-x-3 tm-gap-y-2' : 'tm-gap-x-2 tm-gap-y-1.5',
        )}
      >
        {entries.map(({ publication, highlight }) => (
          <JobCardPublicationHighlight
            key={highlight.id}
            publication={publication}
            highlight={highlight}
            nameDecoration={channelDecoration}
            variant={minimalPresentation ? 'subtle' : 'default'}
          />
        ))}
      </ul>
    </div>
  )
}

function PublicationGroup({
  publications,
  kind,
  showLeadingDivider = false,
  onPreview,
  onExtend,
  hoverContent,
  allPublications,
  showProlong,
  onExtendAll,
  channelDecoration,
  dropdownPlacement,
  channelLogoSize,
  showChannelLabel,
  inlineHighlights,
  minimalPresentation,
  publicationPresentation,
  suppressPublicationGroupHeadings,
  channelNameClamp,
}: {
  publications: JobPublication[]
  kind: PublicationGroupKind
  showLeadingDivider?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
} & PublicationHoverPassThrough) {
  if (publications.length === 0) {
    return null
  }

  const isSimplify6Family = isSimplify6FamilyPresentation(publicationPresentation)
  const isSimplify5Inline = minimalPresentation && publicationPresentation === 'simplify5'
  const expired = kind === 'expired'
  const sameDate = shareSameEndDate(publications)
  const date = sharedEndDateLabel(publications)
  const remainingDays = !expired && date ? getRemainingCalendarDays(date) : undefined
  let heading =
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

  if (isSimplify13StylePresentation(publicationPresentation)) {
    if (kind === 'running' && sameDate && date) {
      heading = `Běží do ${stripYear(date)}`
    }

    if (kind === 'endingSoon') {
      heading = formatEndingSoonHeading({
        sameDate,
        endDate: date ? stripYear(date) : undefined,
        remainingDays,
      })
    }
  }

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
  const headingClassName = publicationStatusHeadingClass(
    kind,
    minimalPresentation,
    sameDate,
    publicationPresentation,
  )

  if (
    expired &&
    publicationPresentation === 'simplify9' &&
    minimalPresentation &&
    isSimplify6Family
  ) {
    const sortedPublications = sortPublicationsBySoonestEnd(publications)
    return (
      <JobCardExpiredPublicationsSimplify9Row onExtendAll={onExtendAll}>
        <div data-testid={headingTestId} className={headingClassName}>
          {heading}
        </div>
        <JobCardExpiredPublicationMiniLogoRow
          publications={sortedPublications}
          listTestId={listTestId}
          hoverContent={hoverContent}
          allPublications={allPublications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration={channelDecoration}
          dropdownPlacement={dropdownPlacement}
        />
      </JobCardExpiredPublicationsSimplify9Row>
    )
  }

  const portalList =
    expired && publicationPresentation === 'simplify8' ? (
      <JobCardExpiredPublicationMiniLogoRow
        publications={publications}
        listTestId={listTestId}
        hoverContent={hoverContent}
        allPublications={allPublications}
        showProlong={showProlong}
        onPreview={onPreview}
        onExtend={onExtend}
        onExtendAll={onExtendAll}
        channelDecoration={channelDecoration}
        dropdownPlacement={dropdownPlacement}
      />
    ) : publicationPresentation === 'simplify23' ? (
      <JobCardSimplify23PortalRow
        publications={publications}
        listTestId={listTestId}
        expired={expired}
        periodBadge={expired ? expiredPeriodBadge : () => undefined}
        periodPresentation="text"
        hoverContent={hoverContent}
        allPublications={allPublications}
        showProlong={showProlong}
        onPreview={onPreview}
        onExtend={onExtend}
        onExtendAll={onExtendAll}
        channelDecoration={channelDecoration}
        dropdownPlacement={dropdownPlacement}
        channelLogoSize={channelLogoSize}
        showChannelLabel={false}
        inlineHighlights={inlineHighlights}
      />
    ) : publicationPresentation === 'simplify22' ? (
      <JobCardSimplify22PortalRow
        publications={publications}
        listTestId={listTestId}
        expired={expired}
        periodBadge={expired ? expiredPeriodBadge : () => undefined}
        periodPresentation="text"
        hoverContent={hoverContent}
        allPublications={allPublications}
        showProlong={showProlong}
        onPreview={onPreview}
        onExtend={onExtend}
        onExtendAll={onExtendAll}
        channelDecoration={channelDecoration}
        dropdownPlacement={dropdownPlacement}
        channelLogoSize={channelLogoSize}
        showChannelLabel={showChannelLabel}
        inlineHighlights={inlineHighlights}
      />
    ) : isStackedPortalPresentation(publicationPresentation) ? (
      <JobCardSimplify19PortalRow
        publications={publications}
        listTestId={listTestId}
        expired={expired}
        periodBadge={expired ? expiredPeriodBadge : () => undefined}
        periodPresentation="text"
        hoverContent={hoverContent}
        allPublications={allPublications}
        showProlong={showProlong}
        onPreview={onPreview}
        onExtend={onExtend}
        onExtendAll={onExtendAll}
        channelDecoration={channelDecoration}
        dropdownPlacement={dropdownPlacement}
        channelLogoSize={channelLogoSize}
        showChannelLabel={showChannelLabel}
        inlineHighlights={inlineHighlights}
        channelLogoStatusPlacement={stackedPortalStatusPlacement(publicationPresentation)}
      />
    ) : (
      <ul
        data-testid={listTestId}
        className={cn(
          'tm-m-0 tm-flex tm-list-none tm-p-0',
          isSimplify24FamilyPresentation(publicationPresentation)
            ? 'tm-flex-col tm-gap-1'
            : 'tm-flex-row tm-flex-wrap',
          isSimplify24FamilyPresentation(publicationPresentation)
            ? undefined
            : isSimplify6Family
              ? simplify6PortalListGapClass()
              : minimalPresentation
                ? 'tm-gap-x-3 tm-gap-y-2'
                : 'tm-gap-x-2 tm-gap-y-1.5',
        )}
      >
        {publications.map((publication, index) => (
          <JobCardPublicationPortal
            key={publication.id}
            publication={publication}
            expired={expired}
            withSeparator={
              !isSimplify24FamilyPresentation(publicationPresentation) &&
              !minimalPresentation &&
              index > 0
            }
            hoverContent={hoverContent}
            publications={allPublications}
            showProlong={showProlong}
            onPreview={onPreview}
            onExtend={onExtend}
            onExtendAll={onExtendAll}
            channelDecoration={channelDecoration}
            dropdownPlacement={dropdownPlacement}
            channelLogoSize={channelLogoSize}
            showChannelLabel={showChannelLabel}
            inlineHighlights={inlineHighlights}
            channelNameClamp={channelNameClamp}
          />
        ))}
      </ul>
    )

  const contentGap = isSimplify13StylePresentation(publicationPresentation)
    ? 'tm-gap-0'
    : minimalPresentation
      ? 'tm-gap-1.5'
      : 'tm-gap-0.5'

  return (
    <div
      className={cn(
        'tm-flex',
        'tm-flex-col',
        contentGap,
        showLeadingDivider && (minimalPresentation ? 'tm-border-t tm-border-secondary tm-pt-3' : ' tm-pt-2'),
      )}
    >
      {isSimplify5Inline ? (
        <div
          data-testid="job-card-advertisement-status-row"
          className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-3 tm-gap-y-2"
        >
          {renderPublicationGroupHeading({
            presentation: publicationPresentation,
            kind,
            heading,
            headingTestId,
            headingClassName,
            suppressPublicationGroupHeadings,
          })}
          {portalList}
        </div>
      ) : (
        <>
          {renderPublicationGroupHeading({
            presentation: publicationPresentation,
            kind,
            heading,
            headingTestId,
            headingClassName,
            suppressPublicationGroupHeadings,
          })}
          {portalList}
        </>
      )}
    </div>
  )
}

function PeriodBadgeColumn({
  publications,
  expired,
  perPublicationExpired = false,
  periodBadge,
  periodPresentation,
  onPreview,
  onExtend,
  hoverContent,
  allPublications,
  showProlong,
  onExtendAll,
  channelDecoration,
  dropdownPlacement,
  channelLogoSize,
  showChannelLabel,
  inlineHighlights,
  channelNameClamp,
}: {
  publications: JobPublication[]
  expired: boolean
  perPublicationExpired?: boolean
  periodBadge: (publication: JobPublication) => PublicationPeriodBadge | undefined
  periodPresentation?: 'tag' | 'text'
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
} & PublicationHoverPassThrough) {
  return (
    <div
      data-testid="job-card-advertisement-period-column"
      className={cn(
        'tm-grid tm-items-center tm-content-start tm-gap-x-2 tm-gap-y-1',
        channelNameClamp === '100'
          ? 'tm-grid-cols-[100px_auto]'
          : 'tm-grid-cols-[minmax(0,10rem)_auto]',
      )}
    >
      {publications.map((publication) => (
        <JobCardPublicationPortal
          key={publication.id}
          publication={publication}
          expired={perPublicationExpired ? publication.status === 'expired' : expired}
          withSeparator={false}
          variant="grid"
          periodBadge={periodBadge(publication)}
          periodPresentation={periodPresentation}
          hoverContent={hoverContent}
          publications={allPublications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration={channelDecoration}
          dropdownPlacement={dropdownPlacement}
          channelLogoSize={channelLogoSize}
          showChannelLabel={showChannelLabel}
          inlineHighlights={inlineHighlights}
          channelNameClamp={channelNameClamp}
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
  periodPresentation,
  onPreview,
  onExtend,
  hoverContent,
  allPublications,
  showProlong,
  onExtendAll,
  channelDecoration,
  dropdownPlacement,
  channelLogoSize,
  showChannelLabel,
  inlineHighlights,
  minimalPresentation,
  portalChip,
  publicationPresentation,
  suppressPublicationGroupHeadings,
  channelNameClamp,
  statusHeadingKind,
  perPublicationExpired = false,
}: {
  publications: JobPublication[]
  expired: boolean
  heading: string
  headingTestId: string
  headingClassName: string
  listTestId: string
  showLeadingDivider?: boolean
  periodBadge: (publication: JobPublication) => PublicationPeriodBadge | undefined
  periodPresentation?: 'tag' | 'text'
  statusHeadingKind?: PublicationStatusHeadingKind
  perPublicationExpired?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
} & PublicationHoverPassThrough) {
  if (publications.length === 0) {
    return null
  }

  const isSimplify6Family = isSimplify6FamilyPresentation(publicationPresentation)
  const isSimplify7MixedDates = isSimplify7MixedDatesPresentation(publicationPresentation)
  const isSimplify5Inline = minimalPresentation && publicationPresentation === 'simplify5'
  const columns = splitIntoBalancedColumns(sortPublicationsBySoonestEnd(publications))
  const minimalHeadingClass = 'tm-text-13 tm-font-normal tm-text-secondary-default'
  const sortedPublications = sortPublicationsBySoonestEnd(publications)
  const dateGroups = groupPublicationsByEndDate(publications)

  if (minimalPresentation && isSimplify6Family) {
    if (expired && publicationPresentation === 'simplify8') {
      return (
        <div
          className={cn(
            'tm-flex tm-flex-col tm-gap-1.5',
            showLeadingDivider && 'tm-border-t tm-border-secondary tm-pt-3',
          )}
        >
          <div data-testid={headingTestId} className={headingClassName}>
            {heading}
          </div>
          <JobCardExpiredPublicationMiniLogoRow
            publications={sortedPublications}
            listTestId={listTestId}
            hoverContent={hoverContent}
            allPublications={allPublications}
            showProlong={showProlong}
            onPreview={onPreview}
            onExtend={onExtend}
            onExtendAll={onExtendAll}
            channelDecoration={channelDecoration}
            dropdownPlacement={dropdownPlacement}
          />
        </div>
      )
    }

    const mixedRunningLogoSize = !expired ? (20 as const) : channelLogoSize
    const mixedRunningBlock = (
      <>
        <div data-testid={headingTestId} className={headingClassName}>
          {heading}
        </div>
        <ul
          data-testid={listTestId}
          className={cn(
            'tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-p-0',
            simplify6PortalListGapClass(),
          )}
        >
          {dateGroups.map((group) => {
            const badge = periodBadge(group[0])

            if (!badge) {
              return null
            }

            return (
              <JobCardPublicationPortalDateChipGroup
                key={group.map((publication) => publication.id).join('|')}
                publications={group}
                expired={expired}
                periodBadge={badge}
                periodPresentation={periodPresentation}
                hoverContent={hoverContent}
                allPublications={allPublications}
                showProlong={showProlong}
                onPreview={onPreview}
                onExtend={onExtend}
                onExtendAll={onExtendAll}
                channelDecoration={channelDecoration}
                dropdownPlacement={dropdownPlacement}
                channelLogoSize={mixedRunningLogoSize}
                showChannelLabel={showChannelLabel}
                dateChipPresentation={isSimplify7MixedDates ? 'simplify7MixedDates' : 'default'}
              />
            )
          })}
        </ul>
      </>
    )

    if (expired && publicationPresentation === 'simplify9') {
      return (
        <JobCardExpiredPublicationsSimplify9Row onExtendAll={onExtendAll}>
          {mixedRunningBlock}
        </JobCardExpiredPublicationsSimplify9Row>
      )
    }

    return (
      <div
        className={cn(
          'tm-flex tm-flex-col tm-gap-1.5',
          showLeadingDivider && 'tm-border-t tm-border-secondary tm-pt-3',
        )}
      >
        {!expired && !isSimplify7MixedDatesPresentation(publicationPresentation) ? (
          <div
            data-testid="job-card-advertisement-mixed-running-cover"
            className="tm-flex tm-flex-col tm-gap-1.5 tm-rounded tm-bg-cover-default tm-p-3"
          >
            {mixedRunningBlock}
          </div>
        ) : (
          mixedRunningBlock
        )}
      </div>
    )
  }

  if (isSimplify5Inline) {
    return (
      <div
        className={cn(
          'tm-flex tm-flex-col tm-gap-1.5',
          showLeadingDivider && 'tm-border-t tm-border-secondary tm-pt-3',
        )}
      >
        <div
          data-testid="job-card-advertisement-status-row"
          className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-3 tm-gap-y-2"
        >
          {renderPublicationGroupHeading({
            presentation: publicationPresentation,
            kind: statusHeadingKind ?? (expired ? 'mixedExpired' : 'mixedActive'),
            heading,
            headingTestId,
            headingClassName: minimalHeadingClass,
            suppressPublicationGroupHeadings,
          })}
          <ul
            data-testid={listTestId}
            className="tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-x-3 tm-gap-y-2 tm-p-0"
          >
            {sortedPublications.map((publication) => (
              <JobCardPublicationPortal
                key={publication.id}
                publication={publication}
                expired={expired}
                withSeparator={false}
                periodBadge={periodBadge(publication)}
                periodPresentation={periodPresentation}
                portalChip={portalChip}
                hoverContent={hoverContent}
                publications={allPublications}
                showProlong={showProlong}
                onPreview={onPreview}
                onExtend={onExtend}
                onExtendAll={onExtendAll}
                channelDecoration={channelDecoration}
                dropdownPlacement={dropdownPlacement}
                channelLogoSize={channelLogoSize}
                showChannelLabel={showChannelLabel}
                inlineHighlights={inlineHighlights}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const badgeGroupHeadingKind =
    statusHeadingKind ?? (expired ? 'mixedExpired' : 'mixedActive')
  const badgeGroupHeadingClassName = isSimplify13StylePresentation(publicationPresentation)
    ? expired
      ? 'tm-text-emotion-danger-emphasis'
      : badgeGroupHeadingKind === 'partial' || badgeGroupHeadingKind === 'endingSoon'
        ? 'tm-text-emotion-warning-emphasis'
        : 'tm-text-emotion-success-emphasis'
    : headingClassName

  const badgeGroupContentGap = isSimplify13StylePresentation(publicationPresentation)
    ? 'tm-gap-0'
    : 'tm-gap-0.5'

  const badgeGroupHeading = renderPublicationGroupHeading({
    presentation: publicationPresentation,
    kind: badgeGroupHeadingKind,
    heading,
    headingTestId,
    headingClassName: badgeGroupHeadingClassName,
    suppressPublicationGroupHeadings,
  })

  if (publicationPresentation === 'simplify23') {
    return (
      <div
        className={cn('tm-flex tm-flex-col', badgeGroupContentGap, showLeadingDivider && ' tm-pt-2')}
      >
        {badgeGroupHeading}
        <JobCardSimplify23PortalRow
          publications={publications}
          listTestId={listTestId}
          expired={expired}
          perPublicationExpired={perPublicationExpired}
          periodBadge={periodBadge}
          periodPresentation={periodPresentation}
          hoverContent={hoverContent}
          allPublications={allPublications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration={channelDecoration}
          dropdownPlacement={dropdownPlacement}
          channelLogoSize={channelLogoSize}
          showChannelLabel={false}
          inlineHighlights={inlineHighlights}
        />
      </div>
    )
  }

  if (publicationPresentation === 'simplify22') {
    return (
      <div
        className={cn('tm-flex tm-flex-col', badgeGroupContentGap, showLeadingDivider && ' tm-pt-2')}
      >
        {badgeGroupHeading}
        <JobCardSimplify22PortalRow
          publications={publications}
          listTestId={listTestId}
          expired={expired}
          perPublicationExpired={perPublicationExpired}
          periodBadge={periodBadge}
          periodPresentation={periodPresentation}
          hoverContent={hoverContent}
          allPublications={allPublications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration={channelDecoration}
          dropdownPlacement={dropdownPlacement}
          channelLogoSize={channelLogoSize}
          showChannelLabel={showChannelLabel}
          inlineHighlights={inlineHighlights}
        />
      </div>
    )
  }

  if (isSimplify24FamilyPresentation(publicationPresentation)) {
    return (
      <div
        className={cn('tm-flex tm-flex-col', badgeGroupContentGap, showLeadingDivider && ' tm-pt-2')}
      >
        {badgeGroupHeading}
        <ul
          data-testid={listTestId}
          className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-1 tm-p-0"
        >
          {sortedPublications.map((publication) => (
            <JobCardPublicationPortal
              key={publication.id}
              publication={publication}
              expired={perPublicationExpired ? publication.status === 'expired' : expired}
              withSeparator={false}
              periodBadge={periodBadge(publication)}
              periodPresentation={periodPresentation}
              hoverContent={hoverContent}
              publications={allPublications}
              showProlong={showProlong}
              onPreview={onPreview}
              onExtend={onExtend}
              onExtendAll={onExtendAll}
              channelDecoration={channelDecoration}
              dropdownPlacement={dropdownPlacement}
              channelLogoSize={channelLogoSize}
              showChannelLabel={showChannelLabel}
              inlineHighlights={inlineHighlights}
              channelNameClamp={channelNameClamp}
            />
          ))}
        </ul>
      </div>
    )
  }

  if (isStackedPortalPresentation(publicationPresentation)) {
    return (
      <div
        className={cn('tm-flex tm-flex-col', badgeGroupContentGap, showLeadingDivider && ' tm-pt-2')}
      >
        {badgeGroupHeading}
        <JobCardSimplify19PortalRow
          publications={publications}
          listTestId={listTestId}
          expired={expired}
          perPublicationExpired={perPublicationExpired}
          periodBadge={periodBadge}
          periodPresentation={periodPresentation}
          hoverContent={hoverContent}
          allPublications={allPublications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration={channelDecoration}
          dropdownPlacement={dropdownPlacement}
          channelLogoSize={channelLogoSize}
          showChannelLabel={showChannelLabel}
          inlineHighlights={inlineHighlights}
          channelLogoStatusPlacement={stackedPortalStatusPlacement(publicationPresentation)}
        />
      </div>
    )
  }

  return (
    <div
      className={cn('tm-flex tm-flex-col', badgeGroupContentGap, showLeadingDivider && ' tm-pt-2')}
    >
      {badgeGroupHeading}
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
            perPublicationExpired={perPublicationExpired}
            periodBadge={periodBadge}
            periodPresentation={periodPresentation}
            hoverContent={hoverContent}
            allPublications={allPublications}
            showProlong={showProlong}
            onPreview={onPreview}
            onExtend={onExtend}
            onExtendAll={onExtendAll}
            channelDecoration={channelDecoration}
            dropdownPlacement={dropdownPlacement}
            channelLogoSize={channelLogoSize}
            showChannelLabel={showChannelLabel}
            inlineHighlights={inlineHighlights}
            channelNameClamp={channelNameClamp}
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
  onExtendPublications,
  showPreviewLink = true,
  periodPresentation = 'tag',
  publicationHover = 'portalDetail',
  publicationChannelDecoration,
  publicationDropdownPlacement,
  publicationPresentation = 'default',
  publicationChannelLogoSize,
  suppressPublicationGroupHeadings = false,
  suppressAdvertisementMeta = false,
  publicationInlineHighlights,
  advertisementMetaTrailing,
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
  const { active, expired, endingSoon } = partitionPublications(publications)
  const summary = getAdvertisementSummary(advertisement)
  const mixedActivePeriods =
    active.length > 0 &&
    !(isStackedPortalPresentation(publicationPresentation)
      ? shareSamePaidEndDate(active)
      : shareSameEndDate(active))
  const mixedExpiredPeriods = expired.length > 0 && !shareSameEndDate(expired)
  const endingSoonSameDate =
    !mixedActivePeriods &&
    active.length > 0 &&
    active.every((publication) => isEndingSoonPublication(publication))
  const showProlong = shouldShowPlacesProlong(publications)
  const onExtendAll =
    onExtendPublications ??
    (onExtendPublication
      ? () => {
          const target = expired[0] ?? endingSoon[0] ?? publications[0]
          if (target) {
            onExtendPublication(target)
          }
        }
      : undefined)
  const simplifyMinimalPresentation =
    publicationPresentation === 'simplify5' ||
    publicationPresentation === 'simplify6' ||
    publicationPresentation === 'simplify7' ||
    publicationPresentation === 'simplify8' ||
    publicationPresentation === 'simplify9' ||
    publicationPresentation === 'simplify11'
  const simplifyChannelLogoSize =
    publicationPresentation === 'simplify11'
      ? (40 as const)
      : publicationPresentation === 'simplify6' ||
          publicationPresentation === 'simplify7' ||
          publicationPresentation === 'simplify8' ||
          publicationPresentation === 'simplify9'
        ? (35 as const)
        : publicationPresentation === 'simplify5'
          ? (30 as const)
          : undefined
  const simplifyPeriodBadge = (publication: JobPublication) => {
    if (publicationPresentation === 'simplify11') {
      return undefined
    }

    return publicationPeriodBadge(publication)
  }
  const simplifyExpiredPeriodBadge = (publication: JobPublication) => {
    if (publicationPresentation === 'simplify11') {
      return undefined
    }

    return expiredPeriodBadge(publication)
  }
  const simplify13StylePartialActiveAndExpired =
    isSimplify13StylePresentation(publicationPresentation) &&
    active.length > 0 &&
    expired.length > 0
  const simplify13StylePartialPublications = simplify13StylePartialActiveAndExpired
    ? sortPublicationsBySoonestEnd([...active, ...expired])
    : []
  const simplify13StylePartialPeriodBadge = (publication: JobPublication) =>
    publication.status === 'expired'
      ? simplifyExpiredPeriodBadge(publication)
      : simplifyPeriodBadge(publication)
  const simplify13StylePartialIdSuffix =
    publicationPresentation === 'simplify15'
      ? '15'
      : publicationPresentation === 'simplify19'
        ? '19'
        : publicationPresentation === 'simplify21'
          ? '21'
          : publicationPresentation === 'simplify22'
            ? '22'
            : publicationPresentation === 'simplify23'
              ? '23'
              : '13'
  const mixedActiveGroupHeading = (() => {
    if (!isSimplify13StylePresentation(publicationPresentation)) {
      return {
        heading: MIXED_PERIOD_HEADING,
        headingClassName: 'tm-text-sm tm-font-medium tm-text-secondary-default',
        statusHeadingKind: 'mixedActive' as const,
      }
    }

    const endingSoonActive = active.filter((publication) =>
      isEndingSoonPublication(publication),
    )

    if (endingSoonActive.length > 0) {
      const sameDate = shareSameEndDate(endingSoonActive)
      const date = sharedEndDateLabel(endingSoonActive)
      const remainingDays = date ? getRemainingCalendarDays(date) : undefined

      return {
        heading: formatEndingSoonHeading({
          sameDate,
          endDate: date ? stripYear(date) : undefined,
          remainingDays,
        }),
        headingClassName: 'tm-text-emotion-warning-emphasis',
        statusHeadingKind: 'endingSoon' as const,
      }
    }

    return {
      heading: MIXED_PERIOD_HEADING,
      headingClassName: 'tm-text-emotion-success-emphasis',
      statusHeadingKind: 'mixedActive' as const,
    }
  })()
  const hoverPassThrough: PublicationHoverPassThrough = {
    hoverContent: publicationHover,
    allPublications: publications,
    showProlong,
    onExtendAll,
    channelDecoration: publicationChannelDecoration,
    dropdownPlacement: publicationDropdownPlacement,
    publicationPresentation,
    suppressPublicationGroupHeadings,
    ...(publicationInlineHighlights ? { inlineHighlights: publicationInlineHighlights } : {}),
    ...(simplifyMinimalPresentation && simplifyChannelLogoSize
      ? {
          channelLogoSize: simplifyChannelLogoSize,
          showChannelLabel: false,
          inlineHighlights: 'none' as const,
          minimalPresentation: true,
          showProductHighlights: false,
          portalChip: true,
        }
      : publicationChannelLogoSize
        ? { channelLogoSize: publicationChannelLogoSize }
        : {}),
    ...(isSimplify24FamilyPresentation(publicationPresentation)
      ? { channelNameClamp: '100' as const }
      : {}),
  }

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn('tm-flex', 'tm-flex-col', simplifyMinimalPresentation ? 'tm-gap-3' : 'tm-gap-4', className)}
    >
      <div data-testid="job-card-advertisement-publications" className="tm-min-w-0">
        {publications.length === 0 ? (
          <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
            Inzerát není nikde vystavený.
          </p>
        ) : (
          <div
            data-testid="job-card-publication-groups"
            className={cn(
              publicationPresentation === 'simplify25' && active.length > 0 && expired.length > 0
                ? 'tm-grid tm-grid-cols-2 tm-items-start tm-gap-4'
                : cn(
                    'tm-flex tm-flex-col',
                    isSimplify13StylePresentation(publicationPresentation)
                      ? 'tm-gap-3'
                      : simplifyMinimalPresentation
                        ? 'tm-gap-3'
                        : 'tm-gap-2',
                  ),
            )}
          >
            {simplify13StylePartialActiveAndExpired ? (
              <PeriodBadgeGroup
                publications={simplify13StylePartialPublications}
                expired={false}
                perPublicationExpired
                heading={formatPartialRunningHeading()}
                headingTestId={`job-card-simplify${simplify13StylePartialIdSuffix}-partial-heading`}
                headingClassName="tm-text-emotion-warning-emphasis"
                statusHeadingKind="partial"
                listTestId={`job-card-simplify${simplify13StylePartialIdSuffix}-partial-publications`}
                periodBadge={simplify13StylePartialPeriodBadge}
                periodPresentation={periodPresentation}
                onPreview={onPreviewPublication}
                onExtend={onExtendPublication}
                {...hoverPassThrough}
              />
            ) : (
              <>
                {mixedActivePeriods ? (
                  <PeriodBadgeGroup
                    publications={active}
                    expired={false}
                    heading={mixedActiveGroupHeading.heading}
                    headingTestId="job-card-advertisement-running-heading"
                    headingClassName={mixedActiveGroupHeading.headingClassName}
                    statusHeadingKind={mixedActiveGroupHeading.statusHeadingKind}
                    listTestId="job-card-advertisement-active-publications"
                    periodBadge={simplifyPeriodBadge}
                    periodPresentation={periodPresentation}
                    onPreview={onPreviewPublication}
                    onExtend={onExtendPublication}
                    {...hoverPassThrough}
                  />
                ) : (
                  <PublicationGroup
                    kind={endingSoonSameDate ? 'endingSoon' : 'running'}
                    publications={active}
                    onPreview={onPreviewPublication}
                    onExtend={onExtendPublication}
                    {...hoverPassThrough}
                  />
                )}
                {simplifyMinimalPresentation &&
                hoverPassThrough.showProductHighlights !== false &&
                active.length > 0 ? (
                  <ProductHighlightsSection
                    publications={active}
                    channelDecoration={publicationChannelDecoration}
                    minimalPresentation
                  />
                ) : null}
                {mixedExpiredPeriods ? (
                  <PeriodBadgeGroup
                    publications={expired}
                    expired
                    heading="Ukončeno"
                    headingTestId="job-card-publication-ended-heading"
                    headingClassName={
                      isSimplify13StylePresentation(publicationPresentation)
                        ? 'tm-text-emotion-danger-emphasis'
                        : 'tm-text-sm tm-font-normal tm-text-secondary-default'
                    }
                    statusHeadingKind="mixedExpired"
                    listTestId="job-card-advertisement-ended-publications"
                    showLeadingDivider={
                      active.length > 0 &&
                      !(publicationPresentation === 'simplify25' && expired.length > 0)
                    }
                    periodBadge={simplifyExpiredPeriodBadge}
                    periodPresentation={periodPresentation}
                    onPreview={onPreviewPublication}
                    onExtend={onExtendPublication}
                    {...hoverPassThrough}
                  />
                ) : (
                  <PublicationGroup
                    kind="expired"
                    publications={expired}
                    showLeadingDivider={
                      active.length > 0 &&
                      !(publicationPresentation === 'simplify25' && expired.length > 0)
                    }
                    onPreview={onPreviewPublication}
                    onExtend={onExtendPublication}
                    {...hoverPassThrough}
                  />
                )}
              </>
            )}
            {simplify13StylePartialActiveAndExpired &&
            simplifyMinimalPresentation &&
            hoverPassThrough.showProductHighlights !== false ? (
              <ProductHighlightsSection
                publications={active}
                channelDecoration={publicationChannelDecoration}
                minimalPresentation
              />
            ) : null}
          </div>
        )}
      </div>
      {!suppressAdvertisementMeta &&
      (summary.viewCount !== undefined || advertisementMetaTrailing) ? (
        <div className={cn(isSimplify13StylePresentation(publicationPresentation) && 'tm-mt-3')}>
          <AdvertisementMeta
            publications={publications}
            viewCount={summary.viewCount}
            showPreviewLink={showPreviewLink}
            publicationHover={publicationHover}
            showProlong={showProlong}
            onExtendAll={onExtendAll}
            linkDecoration={publicationChannelDecoration}
            onViewStatisticsClick={onViewStatisticsClick}
            metaTrailing={advertisementMetaTrailing}
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
      ) : null}
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
