import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import {
  JOB_CARD_SIMPLIFY_17_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_17_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_17_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_17_STATUS_HEADING_PADDING_TOP,
} from './constants'
import { buildSimplify17StatusHeading, type Simplify17StatusHeading, type Simplify17StatusHeadingKind } from './jobCardSimplify17Presentation'
import { JobCardSimplify17NotAdvertisingLayout } from './JobCardSimplify17NotAdvertisingLayout'
import { Button } from '../Button'
import { Icon } from '../Icon'

export interface JobCardAdvertisementSimplify17PanelProps extends StyleProps {
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
}

function statusIcon(kind: Simplify17StatusHeadingKind) {
  if (kind === 'partial') {
    return 'alert-triangle-outline' as const
  }

  if (kind === 'expired') {
    return 'warning' as const
  }

  if (kind === 'endingSoon') {
    return 'clock' as const
  }

  if (kind === 'notAdvertising') {
    return 'view-off' as const
  }

  return 'circle-check' as const
}

function PublicationStatusHeading({
  heading,
}: {
  heading: Simplify17StatusHeading
}) {
  return (
    <p
      data-testid={heading.testId}
      className={cn(
        'tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-items-center tm-gap-2 tm-text-sm tm-font-medium',
        heading.className,
      )}
    >
      <Icon
        name={statusIcon(heading.kind)}
        size={JOB_CARD_SIMPLIFY_17_STATUS_HEADING_ICON_SIZE}
        strokeWidth={JOB_CARD_SIMPLIFY_17_STATUS_HEADING_ICON_STROKE}
        className="tm-shrink-0"
      />
      <span>{heading.label}</span>
    </p>
  )
}

function ChevronEditButton({ onEditAdvertisement }: { onEditAdvertisement: () => void }) {
  return (
    <Button
      variant="tertiary"
      size="small"
      isCircle
      aria-label="Spravovat inzerci"
      data-testid="job-card-simplify17-edit-advertisement"
      className="tm-shrink-0"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onEditAdvertisement()
      }}
    >
      <Icon name="chevron-right" />
    </Button>
  )
}

function AdvertisementStatusHeader({
  heading,
  onEditAdvertisement,
  subline,
  sublineTestId = 'job-card-simplify17-advertisement-heading-subline',
}: {
  heading: Simplify17StatusHeading
  onEditAdvertisement?: () => void
  subline?: string
  sublineTestId?: string
}) {
  return (
    <div
      data-testid="job-card-simplify17-advertisement-heading-wrap"
      className={cn(
        'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-1.5 tm-mb-2',
        JOB_CARD_SIMPLIFY_17_STATUS_HEADING_PADDING_TOP,
      )}
    >
      <div className="tm-flex tm-flex-col tm-gap-1">
        <div className="tm-flex tm-items-center tm-justify-between tm-gap-3">
          <PublicationStatusHeading heading={heading} />
          {onEditAdvertisement ? (
            <ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
          ) : null}
        </div>
        {subline ? (
          <p
            data-testid={sublineTestId}
            className="tm-m-0 tm-text-xs tm-text-secondary-default"
          >
            {subline}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function sharedAdvertisementProps(
  props: JobCardAdvertisementSimplify17PanelProps,
  className?: string,
) {
  return {
    advertisement: props.advertisement,
    onCompleteAdvertisement: props.onCompleteAdvertisement,
    onViewStatisticsClick: props.onViewStatisticsClick,
    onPreviewAdvertisement: props.onPreviewAdvertisement,
    onPreviewPublication: props.onPreviewPublication,
    onExtendPublication: props.onExtendPublication,
    onExtendPublications: props.onExtendPublications,
    showPreviewLink: false as const,
    periodPresentation: 'text' as const,
    publicationHover: 'placesTable' as const,
    publicationChannelDecoration: 'plain' as const,
    publicationDropdownPlacement: 'top-start' as const,
    publicationPresentation: 'simplify15' as const,
    publicationChannelLogoSize: JOB_CARD_SIMPLIFY_17_CHANNEL_LOGO_SIZE,
    suppressPublicationGroupHeadings: true,
    className,
  }
}

export function JobCardAdvertisementSimplify17Panel({
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
  className,
}: JobCardAdvertisementSimplify17PanelProps) {
  if (advertisement.status === 'notAdvertising') {
    return (
      <JobCardSimplify17NotAdvertisingLayout
        data-testid="job-card-simplify17-not-advertising"
        advertisement={advertisement}
        onRepublishAdvertisement={onRepublishAdvertisement ?? onExtendPublications}
        onEditAdvertisement={onEditAdvertisement}
        onCreateAdvertisement={onCreateAdvertisement}
        className={className}
      />
    )
  }

  if (isDraftAdvertisement(advertisement)) {
    return (
      <div className={cn('tm-flex tm-flex-col tm-gap-2', className)}>
        {onEditAdvertisement ? (
          <div className="tm-flex tm-justify-end">
            <ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
          </div>
        ) : null}
        <JobCardAdvertisement
          advertisement={advertisement}
          onCompleteAdvertisement={onCompleteAdvertisement}
          onViewStatisticsClick={onViewStatisticsClick}
          onPreviewAdvertisement={onPreviewAdvertisement}
          onPreviewPublication={onPreviewPublication}
          onExtendPublication={onExtendPublication}
          onExtendPublications={onExtendPublications}
          showPreviewLink={false}
          className="!tm-gap-2"
        />
      </div>
    )
  }

  const publications = advertisement.publications ?? []
  const statusHeading = buildSimplify17StatusHeading(advertisement)

  if (publications.length === 0) {
    return (
      <div className={cn('tm-flex tm-flex-col tm-gap-2', className)}>
        {statusHeading ? (
          <AdvertisementStatusHeader
            heading={statusHeading}
            onEditAdvertisement={onEditAdvertisement}
          />
        ) : null}
        <JobCardAdvertisement {...sharedAdvertisementProps({ advertisement, className })} />
      </div>
    )
  }

  return (
    <div className={cn('tm-flex tm-flex-col', className)}>
      {statusHeading ? (
        <AdvertisementStatusHeader
          heading={statusHeading}
          onEditAdvertisement={onEditAdvertisement}
        />
      ) : null}
      <JobCardAdvertisement
        {...sharedAdvertisementProps({ advertisement, className: '!tm-gap-2' })}
      />
    </div>
  )
}

JobCardAdvertisementSimplify17Panel.displayName = 'JobCardAdvertisementSimplify17Panel'
