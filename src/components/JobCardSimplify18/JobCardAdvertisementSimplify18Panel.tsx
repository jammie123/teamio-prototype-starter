import { useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import {
  formatViewCountLabel,
  getAdvertisementSummary,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardPlacesSummaryTable } from '../JobCardSyntezaAds/JobCardPlacesSummaryTable'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import {
  JOB_CARD_SIMPLIFY_18_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_18_STATUS_HEADING_PADDING_TOP,
} from './constants'
import {
  buildSimplify18StatusHeading,
  type Simplify18HeadingAction,
  type Simplify18StatusHeading,
  type Simplify18StatusHeadingKind,
} from './jobCardSimplify18Presentation'
import { JobCardSimplify18NotAdvertisingLayout } from './JobCardSimplify18NotAdvertisingLayout'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'

export interface JobCardAdvertisementSimplify18PanelProps extends StyleProps {
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

function statusIcon(kind: Simplify18StatusHeadingKind) {
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

function ChevronEditButton({ onEditAdvertisement }: { onEditAdvertisement: () => void }) {
  return (
    <Button
      variant="tertiary"
      size="small"
      isCircle
      aria-label="Spravovat inzerci"
      data-testid="job-card-simplify18-edit-advertisement"
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

function HeaderAggregateViews({
  publications,
  viewCount,
  onViewStatisticsClick,
  onExtendPublications,
}: {
  publications: JobPublication[]
  viewCount: number
  onViewStatisticsClick?: () => void
  onExtendPublications?: () => void
}) {
  const [open, setOpen] = useState(false)

  const viewsLabel = (
    <span data-testid="job-card-advertisement-aggregate-views">{formatViewCountLabel(viewCount)}</span>
  )

  return (
    <div
      className="tm-relative tm-flex tm-shrink-0 tm-items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        data-testid="job-card-advertisement-stats-toggle"
        aria-expanded={open}
        className="tm-border-0 tm-bg-transparent tm-p-0 tm-font-inherit tm-text-13 tm-text-secondary-default tm-cursor-pointer hover:tm-text-primary-default"
        onClick={() => setOpen((current) => !current)}
      >
        {viewsLabel}
      </button>
      {open ? (
        <div
          data-testid="job-card-advertisement-stats-dropdown"
          className="tm-absolute tm-right-0 tm-top-full tm-z-50 tm-mt-2 tm-w-max tm-max-w-[min(36rem,calc(100vw-2rem))] tm-rounded tm-border tm-border-primary tm-bg-basic tm-p-2 tm-shadow"
        >
          <JobCardPlacesSummaryTable
            publications={publications}
            showProlong={Boolean(onExtendPublications)}
            onExtend={onExtendPublications}
          />
          {onViewStatisticsClick ? (
            <button
              type="button"
              className="tm-mt-2 tm-w-full tm-border-0 tm-bg-transparent tm-p-0 tm-text-left tm-text-13 tm-text-secondary-default hover:tm-text-primary-default"
              data-testid="job-card-advertisement-detailed-stats"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onViewStatisticsClick()
              }}
            >
              Přejít na podrobné statistiky
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function AdvertisementStatusHeader({
  heading,
  publications,
  viewCount,
  onViewStatisticsClick,
  onExtendPublications,
  onEditAdvertisement,
  secondaryTestId = 'job-card-simplify18-advertisement-heading-secondary',
}: {
  heading: Simplify18StatusHeading
  publications: JobPublication[]
  viewCount?: number
  onViewStatisticsClick?: () => void
  onExtendPublications?: () => void
  onEditAdvertisement?: () => void
  secondaryTestId?: string
}) {
  return (
    <div
      data-testid="job-card-simplify18-advertisement-heading-wrap"
      className={cn(
        'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-1.5 tm-mb-2',
        JOB_CARD_SIMPLIFY_18_STATUS_HEADING_PADDING_TOP,
      )}
    >
      <div className="tm-flex tm-items-center tm-justify-between tm-gap-3">
        <div
          data-testid={heading.testId}
          className="tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-baseline tm-gap-x-2 tm-gap-y-0.5 tm-text-sm tm-font-medium"
        >
          <span className="tm-inline-flex tm-min-w-0 tm-items-center tm-gap-2">
            <Icon
              name={statusIcon(heading.kind)}
              size={JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_SIZE}
              strokeWidth={JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_STROKE}
              className="tm-shrink-0"
            />
            <span className={heading.className}>{heading.title}</span>
          </span>
          {heading.secondary ? (
            <span
              data-testid={secondaryTestId}
              className="tm-text-xs tm-font-normal tm-text-secondary-default"
            >
              {heading.secondary}
            </span>
          ) : null}
          {viewCount !== undefined ? (
            <HeaderAggregateViews
              publications={publications}
              viewCount={viewCount}
              onViewStatisticsClick={onViewStatisticsClick}
              onExtendPublications={onExtendPublications}
            />
          ) : null}
        </div>
        {onEditAdvertisement ? (
          <ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
        ) : null}
      </div>
    </div>
  )
}

function PanelActions({
  actions,
  onExtendPublication,
  onExtendPublications,
  onDeclineAdvertising,
}: {
  actions: Simplify18HeadingAction[]
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

  return (
    <div
      data-testid="job-card-simplify18-panel-actions"
      className="tm-mt-0 tm-flex tm-flex-wrap tm-items-center tm-gap-2"
    >
      {actions.map((action) => {
        if (action.kind === 'extend') {
          if (!onExtendPublication && !onExtendPublications) {
            return null
          }

          return (
            <Button
              key={`extend-${action.label}`}
              variant="secondary"
              size="medium"
              data-testid="job-card-simplify18-extend-advertising"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                handleExtend(action.targetPublications)
              }}
            >
              {action.label}
            </Button>
          )
        }

        if (!onDeclineAdvertising) {
          return null
        }

        return (
          <Link
            key="decline"
            variant="secondary"
            underlined="never"
            className="tm-text-xs tm-text-secondary-default hover:tm-text-primary-default"
            data-testid="job-card-simplify18-decline-advertising"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onDeclineAdvertising()
            }}
          >
            {action.label}
          </Link>
        )
      })}
    </div>
  )
}

function sharedAdvertisementProps(
  props: JobCardAdvertisementSimplify18PanelProps,
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
    publicationChannelLogoSize: JOB_CARD_SIMPLIFY_18_CHANNEL_LOGO_SIZE,
    suppressPublicationGroupHeadings: true,
    suppressAdvertisementMeta: true as const,
    publicationInlineHighlights: 'none' as const,
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
  panelProps: JobCardAdvertisementSimplify18PanelProps
  actionProps: {
    actions?: Simplify18HeadingAction[]
    onExtendPublication?: (publication: JobPublication) => void
    onExtendPublications?: () => void
    onDeclineAdvertising?: () => void
  }
  advertisementClassName?: string
}) {
  return (
    <div className="tm-flex tm-flex-col tm-gap-1.5">
      <JobCardAdvertisement
        {...sharedAdvertisementProps({ ...panelProps, advertisement }, advertisementClassName)}
      />
      <PanelActionBlock {...actionProps} />
    </div>
  )
}

function PanelActionBlock({
  actions,
  onExtendPublication,
  onExtendPublications,
  onDeclineAdvertising,
}: {
  actions?: Simplify18HeadingAction[]
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onDeclineAdvertising?: () => void
}) {
  if (!actions?.length) {
    return null
  }

  return (
    <PanelActions
      actions={actions}
      onExtendPublication={onExtendPublication}
      onExtendPublications={onExtendPublications}
      onDeclineAdvertising={onDeclineAdvertising}
    />
  )
}

export function JobCardAdvertisementSimplify18Panel({
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
}: JobCardAdvertisementSimplify18PanelProps) {
  if (advertisement.status === 'notAdvertising') {
    return (
      <JobCardSimplify18NotAdvertisingLayout
        data-testid="job-card-simplify18-not-advertising"
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
  const statusHeading = buildSimplify18StatusHeading(advertisement)
  const summary = getAdvertisementSummary(advertisement)

  const panelProps: JobCardAdvertisementSimplify18PanelProps = {
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

  const statusHeader =
    statusHeading ? (
      <AdvertisementStatusHeader
        heading={statusHeading}
        publications={publications}
        viewCount={summary.viewCount}
        onViewStatisticsClick={onViewStatisticsClick}
        onExtendPublications={onExtendPublications}
        onEditAdvertisement={onEditAdvertisement}
      />
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

JobCardAdvertisementSimplify18Panel.displayName = 'JobCardAdvertisementSimplify18Panel'
