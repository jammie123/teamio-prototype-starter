import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import {
  JOB_CARD_SIMPLIFY_19_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_19_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_19_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_19_STATUS_HEADING_PADDING_TOP,
} from './constants'
import {
  buildSimplify19StatusHeading,
  type Simplify19HeadingAction,
  type Simplify19StatusHeading,
  type Simplify19StatusHeadingKind,
} from './jobCardSimplify19Presentation'
import { JobCardSimplify19NotAdvertisingLayout } from './JobCardSimplify19NotAdvertisingLayout'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'

export interface JobCardAdvertisementSimplify19PanelProps extends StyleProps {
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

function statusIcon(kind: Simplify19StatusHeadingKind) {
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

  return 'check' as const
}

function ChevronEditButton({ onEditAdvertisement }: { onEditAdvertisement: () => void }) {
  return (
    <Button
      variant="tertiary"
      size="small"
      isCircle
      aria-label="Spravovat inzerci"
      data-testid="job-card-simplify19-edit-advertisement"
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
  secondaryTestId = 'job-card-simplify19-advertisement-heading-secondary',
}: {
  heading: Simplify19StatusHeading
  onEditAdvertisement?: () => void
  secondaryTestId?: string
}) {
  return (
    <div
      data-testid="job-card-simplify19-advertisement-heading-wrap"
      className={cn(
        'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-1.5 tm-mb-2',
        JOB_CARD_SIMPLIFY_19_STATUS_HEADING_PADDING_TOP,
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
              size={JOB_CARD_SIMPLIFY_19_STATUS_HEADING_ICON_SIZE}
              strokeWidth={JOB_CARD_SIMPLIFY_19_STATUS_HEADING_ICON_STROKE}
              className="tm-shrink-0"
            />
            <span>{heading.title}</span>
          </span>
          {heading.secondary ? (
            <span
              data-testid={secondaryTestId}
              className="tm-text-xs tm-font-normal tm-text-secondary-default"
            >
              {heading.secondary}
            </span>
          ) : null}
        </div>
        {onEditAdvertisement ? (
          <ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
        ) : null}
      </div>
    </div>
  )
}

function PanelActionLinks({
  actions,
  onExtendPublication,
  onExtendPublications,
  onDeclineAdvertising,
}: {
  actions: Simplify19HeadingAction[]
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onDeclineAdvertising?: () => void
}) {
  function handleExtend(targetPublications: JobPublication[]) {
    if (targetPublications.length === 0) {
      return
    }

    if (onExtendPublications) {
      onExtendPublications()
      return
    }

    for (const publication of targetPublications) {
      onExtendPublication?.(publication)
    }
  }

  const extendAction = actions.find((action) => action.kind === 'extend')
  const declineAction = actions.find((action) => action.kind === 'decline')

  const showExtend = Boolean(
    extendAction && (onExtendPublication || onExtendPublications),
  )
  const showDecline = declineAction && onDeclineAdvertising

  if (!showExtend && !showDecline) {
    return null
  }

  return (
    <>
      {showDecline ? (
        <Link
          variant="secondary"
          underlined="never"
          className="tm-text-xs tm-text-secondary-default hover:tm-text-primary-default"
          data-testid="job-card-simplify19-decline-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onDeclineAdvertising!()
          }}
        >
          {declineAction!.label}
        </Link>
      ) : null}
      {showExtend ? (
        <Link
          variant="primary"
          underlined="never"
          className="tm-shrink-0 tm-text-sm"
          data-testid="job-card-simplify19-extend-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            handleExtend(extendAction!.targetPublications)
          }}
        >
          {extendAction!.label}
        </Link>
      ) : null}
    </>
  )
}

function sharedAdvertisementProps(
  props: JobCardAdvertisementSimplify19PanelProps,
  className?: string,
  advertisementMetaTrailing?: ReactNode,
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
    publicationPresentation: 'simplify19' as const,
    publicationChannelLogoSize: JOB_CARD_SIMPLIFY_19_CHANNEL_LOGO_SIZE,
    suppressPublicationGroupHeadings: true,
    publicationInlineHighlights: 'none' as const,
    advertisementMetaTrailing,
    className,
  }
}

function PublicationsWithActions({
  advertisement,
  panelProps,
  actionProps,
  advertisementClassName,
}: {
  advertisement: JobAdvertisement
  panelProps: JobCardAdvertisementSimplify19PanelProps
  actionProps: {
    actions?: Simplify19HeadingAction[]
    onExtendPublication?: (publication: JobPublication) => void
    onExtendPublications?: () => void
    onDeclineAdvertising?: () => void
  }
  advertisementClassName?: string
}) {
  const metaTrailing =
    actionProps.actions && actionProps.actions.length > 0 ? (
      <div
        data-testid="job-card-simplify19-panel-actions"
        className="tm-flex tm-items-center tm-gap-3"
      >
        <PanelActionLinks {...actionProps} actions={actionProps.actions} />
      </div>
    ) : undefined

  return (
    <JobCardAdvertisement
      {...sharedAdvertisementProps(
        { ...panelProps, advertisement },
        advertisementClassName,
        metaTrailing,
      )}
    />
  )
}

export function JobCardAdvertisementSimplify19Panel({
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
}: JobCardAdvertisementSimplify19PanelProps) {
  if (advertisement.status === 'notAdvertising') {
    return (
      <JobCardSimplify19NotAdvertisingLayout
        data-testid="job-card-simplify19-not-advertising"
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
  const statusHeading = buildSimplify19StatusHeading(advertisement)

  const panelProps: JobCardAdvertisementSimplify19PanelProps = {
    advertisement,
    onCompleteAdvertisement,
    onViewStatisticsClick,
    onPreviewAdvertisement,
    onPreviewPublication,
    onExtendPublication,
    onExtendPublications,
  }

  const actionProps = {
    actions: statusHeading?.actions,
    onExtendPublication,
    onExtendPublications,
    onDeclineAdvertising,
  }

  const statusHeader = statusHeading ? (
    <AdvertisementStatusHeader heading={statusHeading} onEditAdvertisement={onEditAdvertisement} />
  ) : null

  if (publications.length === 0) {
    return (
      <div className={cn('tm-flex tm-flex-col tm-gap-2', className)}>
        {statusHeader}
        <PublicationsWithActions
          advertisement={advertisement}
          panelProps={panelProps}
          actionProps={actionProps}
          advertisementClassName={className}
        />
      </div>
    )
  }

  return (
    <div className={cn('tm-flex tm-flex-col', className)}>
      {statusHeader}
      <PublicationsWithActions
        advertisement={advertisement}
        panelProps={panelProps}
        actionProps={actionProps}
        advertisementClassName="!tm-gap-2"
      />
    </div>
  )
}

JobCardAdvertisementSimplify19Panel.displayName = 'JobCardAdvertisementSimplify19Panel'
