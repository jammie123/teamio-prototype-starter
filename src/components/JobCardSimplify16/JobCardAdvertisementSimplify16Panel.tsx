import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { formatViewCountLabel, getAdvertisementSummary } from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { JobCardAdvertisementSimplify10Panel } from '../JobCardSimplify10/JobCardAdvertisementSimplify10Panel'
import {
  JOB_CARD_SIMPLIFY_16_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_16_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_16_STATUS_HEADING_PADDING_TOP,
} from './constants'
import { JobCardSimplify16ChannelGrid } from './JobCardSimplify16ChannelGrid'
import {
  buildSimplify16AggregateStatus,
  formatSimplify16PromoSubline,
  getSimplify16PanelCta,
  isSimplify16GridMode,
  resolveJobCardSimplify16PanelMode,
  type JobCardSimplify16PanelMode,
} from './jobCardSimplify16Presentation'

export interface JobCardAdvertisementSimplify16PanelProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onRepublishAdvertisement?: () => void
  onEditAdvertisement?: () => void
}

const STATUS_ICON_STROKE = 2
const CHECK_ICON_STROKE = 1.5

function statusIconStroke(icon: 'circle-check' | 'alert-triangle-outline' | 'warning' | 'view-off') {
  return icon === 'circle-check' ? CHECK_ICON_STROKE : STATUS_ICON_STROKE
}

function AggregateStatus({
  status,
}: {
  status: NonNullable<ReturnType<typeof buildSimplify16AggregateStatus>>
}) {
  return (
    <span
      data-testid={status.testId}
      className={cn(
        'tm-flex tm-min-w-0 tm-items-center tm-gap-1.5 tm-text-[13px] tm-font-medium',
        status.className,
      )}
    >
      <Icon
        name={status.icon}
        size={JOB_CARD_SIMPLIFY_16_STATUS_HEADING_ICON_SIZE}
        strokeWidth={statusIconStroke(status.icon)}
        className="tm-shrink-0"
      />
      <span className="tm-truncate">{status.label}</span>
    </span>
  )
}

function FooterViews({
  viewCount,
  onViewStatisticsClick,
}: {
  viewCount: number
  onViewStatisticsClick?: () => void
}) {
  const label = formatViewCountLabel(viewCount)
  const className = 'tm-text-xs tm-italic tm-text-secondary-default'

  if (onViewStatisticsClick) {
    return (
      <button
        type="button"
        data-testid="job-card-simplify16-aggregate-views"
        className={cn(
          className,
          'tm-border-0 tm-bg-transparent tm-p-0 tm-font-inherit tm-cursor-pointer hover:tm-text-primary-default',
        )}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onViewStatisticsClick()
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <span data-testid="job-card-simplify16-aggregate-views" className={className}>
      {label}
    </span>
  )
}

function Simplify16GridPanel({
  advertisement,
  mode,
  onExtendPublication,
  onExtendPublications,
  onViewStatisticsClick,
  onEditAdvertisement,
  now = new Date(),
}: {
  advertisement: JobAdvertisement
  mode: Extract<
    JobCardSimplify16PanelMode,
    'partial' | 'running' | 'ended' | 'allDisabled' | 'mixedPeriods'
  >
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onViewStatisticsClick?: () => void
  onEditAdvertisement?: () => void
  now?: Date
}) {
  const publications = advertisement.publications ?? []
  const summary = getAdvertisementSummary(advertisement)
  const aggregateStatus = buildSimplify16AggregateStatus(advertisement, mode, now)
  const promoSubline = formatSimplify16PromoSubline(publications, now)
  const cta =
    mode === 'running' || mode === 'allDisabled' || mode === 'mixedPeriods'
      ? undefined
      : getSimplify16PanelCta(advertisement, now)

  function handlePanelCta() {
    if (!cta || cta.targetPublications.length === 0) {
      return
    }

    if (onExtendPublications) {
      onExtendPublications()
      return
    }

    for (const publication of cta.targetPublications) {
      onExtendPublication?.(publication)
    }
  }

  if (!aggregateStatus) {
    return null
  }

  return (
    <div
      data-testid={`job-card-simplify16-${mode}`}
      className="tm-flex tm-flex-col tm-rounded-xl tm-border tm-border-solid tm-border-secondary tm-bg-cover-light tm-px-[18px] tm-pb-3 tm-pt-3.5"
    >
      <div
        data-testid="job-card-simplify16-advertisement-heading"
        className="tm-flex tm-flex-col tm-gap-1 tm-border-0 tm-border-b tm-border-solid tm-border-strong tm-pb-2.5"
      >
        <div className="tm-flex tm-items-center tm-gap-2">
          <span className="tm-shrink-0 tm-text-sm tm-font-medium tm-text-primary-default">
            Inzerce
          </span>
          <AggregateStatus status={aggregateStatus} />
          {onEditAdvertisement ? (
            <button
              type="button"
              data-testid="job-card-simplify16-edit-advertisement"
              className="tm-ml-auto tm-flex tm-shrink-0 tm-items-center tm-justify-center tm-border-0 tm-bg-transparent tm-p-0 tm-text-lg tm-text-secondary-default hover:tm-text-primary-default"
              aria-label="Spravovat inzerci"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onEditAdvertisement()
              }}
            >
              <Icon name="chevron-down" strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
        {promoSubline ? (
          <p
            data-testid="job-card-simplify16-promo-subline"
            className="tm-m-0 tm-text-xs tm-text-secondary-default"
          >
            {promoSubline}
          </p>
        ) : null}
      </div>

      <JobCardSimplify16ChannelGrid publications={publications} now={now} />

      <div
        data-testid="job-card-simplify16-footer"
        className="tm-mt-0.5 tm-flex tm-items-center tm-gap-3 tm-border-0 tm-border-t tm-border-solid tm-border-strong tm-pt-2.5"
      >
        {summary.viewCount !== undefined ? (
          <FooterViews
            viewCount={summary.viewCount}
            onViewStatisticsClick={onViewStatisticsClick}
          />
        ) : null}
        {cta && (onExtendPublication || onExtendPublications) ? (
          <Button
            variant="primary"
            size="medium"
            className="tm-ml-auto !tm-h-8 !tm-min-h-8 !tm-rounded-full !tm-px-3.5 !tm-py-0"
            data-testid="job-card-simplify16-panel-cta"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              handlePanelCta()
            }}
          >
            {cta.label}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export function JobCardAdvertisementSimplify16Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onRepublishAdvertisement,
  onEditAdvertisement,
  className,
}: JobCardAdvertisementSimplify16PanelProps) {
  const publications = advertisement.publications ?? []
  const mode = resolveJobCardSimplify16PanelMode(advertisement)

  if (advertisement.status === 'notAdvertising') {
    return (
      <JobCardAdvertisementSimplify10Panel
        advertisement={advertisement}
        onCompleteAdvertisement={onCompleteAdvertisement}
        onViewStatisticsClick={onViewStatisticsClick}
        onPreviewAdvertisement={onPreviewAdvertisement}
        onPreviewPublication={onPreviewPublication}
        onExtendPublication={onExtendPublication}
        onExtendPublications={onExtendPublications}
        onRepublishAdvertisement={onRepublishAdvertisement ?? onExtendPublications}
        channelLogoSize={24}
        showPortalPeriodBadges={false}
        expiredLogosMuted={false}
        actionButtonVariant="secondary"
        actionButtonSize="medium"
        notAdvertisingMetaClassName="tm-text-sm tm-text-secondary-default"
        notAdvertisingHeadingIconSize={JOB_CARD_SIMPLIFY_16_STATUS_HEADING_ICON_SIZE}
        notAdvertisingHeadingIconStrokeWidth={JOB_CARD_SIMPLIFY_16_STATUS_HEADING_ICON_STROKE}
        notAdvertisingHeadingWrapClassName={JOB_CARD_SIMPLIFY_16_STATUS_HEADING_PADDING_TOP}
        notAdvertisingHeadingBorder
        className={className}
      />
    )
  }

  if (isDraftAdvertisement(advertisement) || publications.length === 0) {
    return (
      <JobCardAdvertisement
        advertisement={advertisement}
        onCompleteAdvertisement={onCompleteAdvertisement}
        onViewStatisticsClick={onViewStatisticsClick}
        onPreviewAdvertisement={onPreviewAdvertisement}
        onPreviewPublication={onPreviewPublication}
        onExtendPublication={onExtendPublication}
        onExtendPublications={onExtendPublications}
        showPreviewLink={false}
        periodPresentation="text"
        publicationHover="placesTable"
        publicationChannelDecoration="plain"
        publicationDropdownPlacement="top-start"
        publicationPresentation="simplify15"
        publicationChannelLogoSize={24}
        className={className}
      />
    )
  }

  if (isSimplify16GridMode(mode)) {
    return (
      <div
        data-testid="job-card-advertisement"
        className={cn('tm-flex tm-flex-col', className)}
      >
        <Simplify16GridPanel
          advertisement={advertisement}
          mode={mode}
          onExtendPublication={onExtendPublication}
          onExtendPublications={onExtendPublications}
          onViewStatisticsClick={onViewStatisticsClick}
          onEditAdvertisement={onEditAdvertisement}
        />
      </div>
    )
  }

  return (
    <JobCardAdvertisementSimplify10Panel
      advertisement={advertisement}
      onCompleteAdvertisement={onCompleteAdvertisement}
      onViewStatisticsClick={onViewStatisticsClick}
      onPreviewAdvertisement={onPreviewAdvertisement}
      onPreviewPublication={onPreviewPublication}
      onExtendPublication={onExtendPublication}
      onExtendPublications={onExtendPublications}
      onRepublishAdvertisement={onRepublishAdvertisement ?? onExtendPublications}
      channelLogoSize={24}
      showPortalPeriodBadges={false}
      expiredLogosMuted={false}
      actionButtonVariant="secondary"
      actionButtonSize="medium"
      notAdvertisingHeadingBorder
      className={className}
    />
  )
}

JobCardAdvertisementSimplify16Panel.displayName = 'JobCardAdvertisementSimplify16Panel'
