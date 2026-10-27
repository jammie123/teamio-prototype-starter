import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { getAdvertisementSummary } from '../JobCardSynteza/advertisementSummary'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { JobCardAdvertisementStatsToggle } from '../JobCardSyntezaAds/JobCardAdvertisementStatsToggle'
import { shouldShowPlacesProlong } from '../JobCardSyntezaAds/JobCardPlacesSummaryTable'
import { Link } from '../Link'
import { Tag } from '../Tag'
import {
  getSimplify20HeadingActions,
  SIMPLIFY_20_DECLINE_LABEL,
} from '../JobCardSimplify20/jobCardSimplify20Presentation'
import { resolveJobCardSimplify11PanelMode } from '../JobCardSimplify11/jobCardSimplify11Presentation'
import {
  JOB_CARD_SIMPLIFY_25_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_25_STATUS_HEADING_PADDING_TOP,
} from './constants'
import { buildSimplify25StatusBadges } from './jobCardSimplify25Presentation'
import { JobCardSimplify25ChevronEditButton } from './JobCardSimplify25ChevronEditButton'
import { JobCardSimplify25NotAdvertisingLayout } from './JobCardSimplify25NotAdvertisingLayout'

export interface JobCardAdvertisementSimplify25PanelProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onRepublishAdvertisement?: () => void
  onEditAdvertisement?: () => void
  onCreateAdvertisement?: () => void
  onDeclineAdvertising?: () => void
}

/** Same footprint as the "nový" / "ohodnocený" badges on the candidate stats. */
export const SIMPLIFY_25_STATUS_BADGE_CLASS =
  '!tm-min-h-0 !tm-h-auto !tm-gap-0 !tm-py-0.5 !tm-px-1.5 !tm-text-[10px] !tm-font-semibold !tm-leading-tight !tm-rounded-full'

function AdvertisementStatusHeader({
  advertisement,
  onViewStatisticsClick,
  onExtendPublications,
  onExtendPublication,
}: {
  advertisement: JobAdvertisement
  onViewStatisticsClick?: () => void
  onExtendPublications?: () => void
  onExtendPublication?: (publication: JobPublication) => void
}) {
  const badges = buildSimplify25StatusBadges(advertisement)
  const publications = advertisement.publications ?? []
  const viewCount = getAdvertisementSummary(advertisement).viewCount
  const onExtendAll =
    onExtendPublications ??
    (onExtendPublication
      ? () => {
          publications.forEach((publication) => onExtendPublication(publication))
        }
      : undefined)

  return (
    <div
      data-testid="job-card-simplify25-advertisement-heading-wrap"
      className={cn(
        'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-1.5 tm-mb-2',
        JOB_CARD_SIMPLIFY_25_STATUS_HEADING_PADDING_TOP,
      )}
    >
      <div className="tm-flex tm-items-center tm-justify-between tm-gap-3">
        <div className="tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-center tm-gap-x-1.5 tm-gap-y-0.5">
          {badges.map((badge) => (
            <Tag
              key={badge.kind}
              color={badge.color}
              isSubtle
              className={SIMPLIFY_25_STATUS_BADGE_CLASS}
              data-testid={badge.testId}
            >
              {badge.label}
            </Tag>
          ))}
        </div>
        {viewCount !== undefined ? (
          <JobCardAdvertisementStatsToggle
            publications={publications}
            viewCount={viewCount}
            onViewStatisticsClick={onViewStatisticsClick}
            publicationHover="placesTable"
            showProlong={shouldShowPlacesProlong(publications)}
            onExtendAll={onExtendAll}
            linkDecoration="plain"
            dropdownAlign="end"
            className="tm-shrink-0"
          />
        ) : null}
      </div>
    </div>
  )
}

export function JobCardAdvertisementSimplify25Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onRepublishAdvertisement,
  onEditAdvertisement,
  onCreateAdvertisement,
  onDeclineAdvertising,
  className,
}: JobCardAdvertisementSimplify25PanelProps) {
  if (advertisement.status === 'notAdvertising') {
    return (
      <JobCardSimplify25NotAdvertisingLayout
        data-testid="job-card-simplify25-not-advertising"
        advertisement={advertisement}
        onRepublishAdvertisement={onRepublishAdvertisement ?? onExtendPublications}
        onEditAdvertisement={onEditAdvertisement}
        onCreateAdvertisement={onCreateAdvertisement}
        className={className}
      />
    )
  }

  const advertisementProps = {
    advertisement,
    onCompleteAdvertisement,
    onViewStatisticsClick,
    onPreviewAdvertisement,
    onPreviewPublication,
    onExtendPublication,
    onExtendPublications,
    showPreviewLink: false,
    className: '!tm-gap-2',
  } as const

  if (isDraftAdvertisement(advertisement)) {
    return (
      <div className={cn('tm-flex tm-flex-col tm-gap-2', className)}>
        {onEditAdvertisement ? (
          <div className="tm-flex tm-justify-end">
            <JobCardSimplify25ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
          </div>
        ) : null}
        <JobCardAdvertisement {...advertisementProps} />
      </div>
    )
  }

  const mode = resolveJobCardSimplify11PanelMode(advertisement)
  const showDecline =
    mode === 'expiredUnexpected' &&
    Boolean(onDeclineAdvertising) &&
    Boolean(
      getSimplify20HeadingActions(advertisement, 'expired', new Date(), 'expiredUnexpected')?.some(
        (action) => action.kind === 'decline',
      ),
    )

  return (
    <div className={cn('tm-flex tm-flex-col', className)}>
      <AdvertisementStatusHeader
        advertisement={advertisement}
        onViewStatisticsClick={onViewStatisticsClick}
        onExtendPublications={onExtendPublications}
        onExtendPublication={onExtendPublication}
      />
      <JobCardAdvertisement
        {...advertisementProps}
        periodPresentation="text"
        publicationHover="placesTable"
        publicationChannelDecoration="plain"
        publicationDropdownPlacement="top-start"
        publicationPresentation="simplify25"
        publicationChannelLogoSize={JOB_CARD_SIMPLIFY_25_CHANNEL_LOGO_SIZE}
        suppressPublicationGroupHeadings
        suppressAdvertisementMeta
        publicationInlineHighlights="none"
      />
      {showDecline && onDeclineAdvertising ? (
        <Link
          variant="secondary"
          underlined="never"
          className="tm-mt-2 tm-text-sm tm-text-secondary-default hover:tm-text-primary-default"
          data-testid="job-card-simplify25-decline-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onDeclineAdvertising()
          }}
        >
          {SIMPLIFY_20_DECLINE_LABEL}
        </Link>
      ) : null}
    </div>
  )
}

JobCardAdvertisementSimplify25Panel.displayName = 'JobCardAdvertisementSimplify25Panel'
