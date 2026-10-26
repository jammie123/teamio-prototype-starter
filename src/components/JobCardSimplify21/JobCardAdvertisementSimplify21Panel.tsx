import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { Tag } from '../Tag'
import type {
  Simplify20HeadingAction,
  Simplify20StatusHeading,
  Simplify20StatusHeadingKind,
} from '../JobCardSimplify20/jobCardSimplify20Presentation'
import {
  JOB_CARD_SIMPLIFY_21_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_21_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_21_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_21_STATUS_HEADING_PADDING_TOP,
} from './constants'
import {
  buildSimplify21StatusHeading,
  resolveSimplify21EndedPortalLabel,
} from './jobCardSimplify21Presentation'
import { JobCardSimplify21ChevronEditButton } from './JobCardSimplify21ChevronEditButton'
import { JobCardSimplify21NotAdvertisingLayout } from './JobCardSimplify21NotAdvertisingLayout'

export interface JobCardAdvertisementSimplify21PanelProps extends StyleProps {
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

function statusIcon(kind: Simplify20StatusHeadingKind) {
  switch (kind) {
    case 'partial':
      return 'alert-triangle-outline' as const
    case 'expired':
      return 'warning' as const
    case 'endingSoon':
      return 'clock' as const
    case 'notAdvertising':
      return 'view-off' as const
    default:
      return 'check' as const
  }
}

function AdvertisementStatusHeader({
  advertisement,
  heading,
  onEditAdvertisement,
}: {
  advertisement: JobAdvertisement
  heading: Simplify20StatusHeading
  onEditAdvertisement?: () => void
}) {
  const endedPortalLabel = resolveSimplify21EndedPortalLabel(advertisement, heading)
  // For `partial`, the secondary text is the ended-portal label itself, shown as the badge.
  const secondaryText = heading.kind === 'partial' ? undefined : heading.secondary

  return (
    <div
      data-testid="job-card-simplify21-advertisement-heading-wrap"
      className={cn(
        'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-1.5 tm-mb-2',
        JOB_CARD_SIMPLIFY_21_STATUS_HEADING_PADDING_TOP,
      )}
    >
      <div className="tm-flex tm-items-center tm-justify-between tm-gap-3">
        <div
          data-testid={heading.testId}
          className="tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-baseline tm-gap-x-2 tm-gap-y-0.5 tm-text-sm tm-font-medium"
        >
          <span
            className={cn(
              'tm-inline-flex tm-min-w-0 tm-items-center tm-gap-2',
              heading.className,
            )}
          >
            <Icon
              name={statusIcon(heading.kind)}
              size={JOB_CARD_SIMPLIFY_21_STATUS_HEADING_ICON_SIZE}
              strokeWidth={JOB_CARD_SIMPLIFY_21_STATUS_HEADING_ICON_STROKE}
              className="tm-shrink-0"
            />
            <span>{heading.title}</span>
          </span>
          {endedPortalLabel ? (
            <Tag color="neutral" isSubtle data-testid="job-card-simplify21-ended-portal-badge">
              {endedPortalLabel}
            </Tag>
          ) : null}
          {secondaryText ? (
            <span
              data-testid="job-card-simplify21-advertisement-heading-secondary"
              className="tm-text-xs tm-font-normal tm-text-secondary-default"
            >
              {secondaryText}
            </span>
          ) : null}
        </div>
        {onEditAdvertisement ? (
          <JobCardSimplify21ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
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
          data-testid="job-card-simplify21-decline-advertising"
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
          data-testid="job-card-simplify21-extend-advertising"
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

export function JobCardAdvertisementSimplify21Panel({
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
}: JobCardAdvertisementSimplify21PanelProps) {
  if (advertisement.status === 'notAdvertising') {
    return (
      <JobCardSimplify21NotAdvertisingLayout
        data-testid="job-card-simplify21-not-advertising"
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
            <JobCardSimplify21ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
          </div>
        ) : null}
        <JobCardAdvertisement {...advertisementProps} />
      </div>
    )
  }

  const statusHeading = buildSimplify21StatusHeading(advertisement)
  const metaTrailing = statusHeading?.actions?.length ? (
    <div
      data-testid="job-card-simplify21-panel-actions"
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
        publicationPresentation="simplify21"
        publicationChannelLogoSize={JOB_CARD_SIMPLIFY_21_CHANNEL_LOGO_SIZE}
        suppressPublicationGroupHeadings
        publicationInlineHighlights="none"
        advertisementMetaTrailing={metaTrailing}
      />
    </div>
  )
}

JobCardAdvertisementSimplify21Panel.displayName = 'JobCardAdvertisementSimplify21Panel'
