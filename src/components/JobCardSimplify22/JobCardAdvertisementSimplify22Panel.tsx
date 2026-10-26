import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { Link } from '../Link'
import { Tag } from '../Tag'
import type {
  Simplify20HeadingAction,
  Simplify20StatusHeading,
} from '../JobCardSimplify20/jobCardSimplify20Presentation'
import {
  JOB_CARD_SIMPLIFY_22_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_22_STATUS_HEADING_PADDING_TOP,
} from './constants'
import {
  buildSimplify22StatusHeading,
  resolveSimplify22EndedPortalLabel,
} from './jobCardSimplify22Presentation'
import { JobCardSimplify22ChevronEditButton } from './JobCardSimplify22ChevronEditButton'
import { JobCardSimplify22NotAdvertisingLayout } from './JobCardSimplify22NotAdvertisingLayout'

export interface JobCardAdvertisementSimplify22PanelProps extends StyleProps {
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
const ENDED_PORTAL_BADGE_CLASS =
  '!tm-min-h-0 !tm-h-auto !tm-gap-0 !tm-py-0.5 !tm-px-1.5 !tm-text-[10px] !tm-font-semibold !tm-leading-tight !tm-rounded-full'

function AdvertisementStatusHeader({
  advertisement,
  heading,
  onEditAdvertisement,
}: {
  advertisement: JobAdvertisement
  heading: Simplify20StatusHeading
  onEditAdvertisement?: () => void
}) {
  const endedPortalLabel = resolveSimplify22EndedPortalLabel(advertisement, heading)
  // For `partial`, the secondary text is the ended-portal label itself, shown as the badge.
  const secondaryText = heading.kind === 'partial' ? undefined : heading.secondary

  return (
    <div
      data-testid="job-card-simplify22-advertisement-heading-wrap"
      className={cn(
        'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-1.5 tm-mb-2',
        JOB_CARD_SIMPLIFY_22_STATUS_HEADING_PADDING_TOP,
      )}
    >
      <div className="tm-flex tm-items-center tm-justify-between tm-gap-3">
        <div
          data-testid={heading.testId}
          className="tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-baseline tm-gap-x-2 tm-gap-y-0.5 tm-text-sm tm-font-medium"
        >
          <span className={cn('tm-min-w-0', heading.className)}>{heading.title}</span>
          {endedPortalLabel ? (
            <Tag
              color="neutral"
              isSubtle
              className={ENDED_PORTAL_BADGE_CLASS}
              data-testid="job-card-simplify22-ended-portal-badge"
            >
              {endedPortalLabel}
            </Tag>
          ) : null}
          {secondaryText ? (
            <span
              data-testid="job-card-simplify22-advertisement-heading-secondary"
              className="tm-text-xs tm-font-normal tm-text-secondary-default"
            >
              {secondaryText}
            </span>
          ) : null}
        </div>
        {onEditAdvertisement ? (
          <JobCardSimplify22ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
        ) : null}
      </div>
    </div>
  )
}

function PanelMetaActionLinks({
  actions,
  onExtendPublication,
  onExtendPublications,
  onDeclineAdvertising,
}: {
  actions: Simplify20HeadingAction[]
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onDeclineAdvertising?: () => void
}) {
  const extend = actions.find((action) => action.kind === 'extend')
  const decline = actions.find((action) => action.kind === 'decline')
  const canExtend = Boolean(onExtendPublication || onExtendPublications)

  function handleExtend(targets: JobPublication[]) {
    if (targets.length === 0) {
      return
    }

    if (onExtendPublications) {
      onExtendPublications()
      return
    }

    for (const publication of targets) {
      onExtendPublication?.(publication)
    }
  }

  return (
    <>
      {decline && onDeclineAdvertising ? (
        <Link
          variant="secondary"
          underlined="never"
          className="tm-text-sm tm-text-secondary-default hover:tm-text-primary-default"
          data-testid="job-card-simplify22-decline-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onDeclineAdvertising()
          }}
        >
          {decline.label}
        </Link>
      ) : null}
      {extend && canExtend ? (
        <Link
          variant="primary"
          underlined="never"
          className="tm-shrink-0 tm-text-sm"
          data-testid="job-card-simplify22-extend-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            handleExtend(extend.targetPublications)
          }}
        >
          {extend.label}
        </Link>
      ) : null}
    </>
  )
}

export function JobCardAdvertisementSimplify22Panel({
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
}: JobCardAdvertisementSimplify22PanelProps) {
  if (advertisement.status === 'notAdvertising') {
    return (
      <JobCardSimplify22NotAdvertisingLayout
        data-testid="job-card-simplify22-not-advertising"
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
            <JobCardSimplify22ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
          </div>
        ) : null}
        <JobCardAdvertisement {...advertisementProps} />
      </div>
    )
  }

  const statusHeading = buildSimplify22StatusHeading(advertisement)
  const metaTrailing = statusHeading?.actions?.length ? (
    <div
      data-testid="job-card-simplify22-panel-actions"
      className="tm-flex tm-items-center tm-gap-3"
    >
      <PanelMetaActionLinks
        actions={statusHeading.actions}
        onExtendPublication={onExtendPublication}
        onExtendPublications={onExtendPublications}
        onDeclineAdvertising={onDeclineAdvertising}
      />
    </div>
  ) : undefined

  return (
    <div className={cn('tm-flex tm-flex-col', className)}>
      {statusHeading ? (
        <AdvertisementStatusHeader
          advertisement={advertisement}
          heading={statusHeading}
          onEditAdvertisement={onEditAdvertisement}
        />
      ) : null}
      <JobCardAdvertisement
        {...advertisementProps}
        periodPresentation="text"
        publicationHover="placesTable"
        publicationChannelDecoration="plain"
        publicationDropdownPlacement="top-start"
        publicationPresentation="simplify22"
        publicationChannelLogoSize={JOB_CARD_SIMPLIFY_22_CHANNEL_LOGO_SIZE}
        suppressPublicationGroupHeadings
        publicationInlineHighlights="none"
        advertisementMetaTrailing={metaTrailing}
      />
    </div>
  )
}

JobCardAdvertisementSimplify22Panel.displayName = 'JobCardAdvertisementSimplify22Panel'
