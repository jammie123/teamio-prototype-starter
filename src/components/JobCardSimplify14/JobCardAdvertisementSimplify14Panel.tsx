import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  formatAdvertisementEndedHeading,
  formatPartialRunningHeading,
  formatRunningSimpleHeading,
  formatViewCountLabel,
  getAdvertisementSummary,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { JobCardAdvertisementSimplify10Panel } from '../JobCardSimplify10/JobCardAdvertisementSimplify10Panel'
import { JobCardSimplify14ChannelStrip } from './JobCardSimplify14ChannelStrip'
import {
  formatMixedPeriodsHeading,
  getSimplify11PanelCta,
  resolveJobCardSimplify14PanelMode,
  formatSimplify14SamePeriodRange,
  shouldShowPerChannelDateLabels,
  shouldShowSimplify14SamePeriodRange,
  type JobCardSimplify14PanelMode,
} from './jobCardSimplify14Presentation'

export interface JobCardAdvertisementSimplify14PanelProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onDeclineAdvertising?: () => void
  onRepublishAdvertisement?: () => void
  onEnablePublication?: (publication: JobPublication) => void
}

const SIMPLIFY_14_STATUS_ICON_CLASS = 'tm-shrink-0 tm-text-lg tm-leading-none'
const SIMPLIFY_14_CHECK_ICON_CLASS = 'tm-shrink-0 tm-text-base tm-leading-none'
const SIMPLIFY_14_STATUS_ICON_STROKE = 2
const SIMPLIFY_14_CHECK_ICON_STROKE = 1.5

function statusIconStroke(icon: 'circle-check' | 'alert-triangle-outline' | 'warning' | 'view-off') {
  return icon === 'circle-check' ? SIMPLIFY_14_CHECK_ICON_STROKE : SIMPLIFY_14_STATUS_ICON_STROKE
}

function statusIconClass(icon: 'circle-check' | 'alert-triangle-outline' | 'warning' | 'view-off') {
  return icon === 'circle-check' ? SIMPLIFY_14_CHECK_ICON_CLASS : SIMPLIFY_14_STATUS_ICON_CLASS
}

function StatusHeading({
  icon,
  className,
  testId,
  children,
}: {
  icon: 'circle-check' | 'alert-triangle-outline' | 'warning' | 'view-off'
  className: string
  testId: string
  children: string
}) {
  return (
    <p
      data-testid={testId}
      className={cn(
        'tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-items-center tm-gap-2 tm-text-sm tm-font-medium',
        className,
      )}
    >
      <Icon
        name={icon}
        strokeWidth={statusIconStroke(icon)}
        className={statusIconClass(icon)}
      />
      <span>{children}</span>
    </p>
  )
}

function AggregateViews({
  viewCount,
  onViewStatisticsClick,
}: {
  viewCount: number
  onViewStatisticsClick?: () => void
}) {
  const label = formatViewCountLabel(viewCount)
  const className = 'tm-shrink-0 tm-text-sm tm-text-secondary-default'

  if (onViewStatisticsClick) {
    return (
      <button
        type="button"
        data-testid="job-card-advertisement-aggregate-views"
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
    <span data-testid="job-card-advertisement-aggregate-views" className={className}>
      {label}
    </span>
  )
}

function headingForMode(mode: JobCardSimplify14PanelMode) {
  switch (mode) {
    case 'partial':
      return {
        icon: 'alert-triangle-outline' as const,
        className: 'tm-text-emotion-warning-emphasis',
        testId: 'job-card-simplify14-partial-heading',
        label: formatPartialRunningHeading(),
      }
    case 'running':
      return {
        icon: 'circle-check' as const,
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify14-running-heading',
        label: formatRunningSimpleHeading(),
      }
    case 'ended':
      return {
        icon: 'warning' as const,
        className: 'tm-text-emotion-danger-emphasis',
        testId: 'job-card-simplify14-ended-heading',
        label: formatAdvertisementEndedHeading(),
      }
    case 'allDisabled':
      return {
        icon: 'view-off' as const,
        className: 'tm-text-secondary-default',
        testId: 'job-card-simplify14-all-disabled-heading',
        label: 'Neinzeruje se',
      }
    case 'mixedPeriods':
      return {
        icon: 'circle-check' as const,
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify14-mixed-periods-heading',
        label: formatMixedPeriodsHeading(),
      }
    default:
      return null
  }
}

function Simplify14MixedChannelPanel({
  advertisement,
  mode,
  onExtendPublication,
  onExtendPublications,
  onEnablePublication,
  onViewStatisticsClick,
  now = new Date(),
}: {
  advertisement: JobAdvertisement
  mode: Extract<
    JobCardSimplify14PanelMode,
    'partial' | 'running' | 'ended' | 'allDisabled' | 'mixedPeriods'
  >
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onEnablePublication?: (publication: JobPublication) => void
  onViewStatisticsClick?: () => void
  now?: Date
}) {
  const publications = advertisement.publications ?? []
  const summary = getAdvertisementSummary(advertisement)
  const heading = headingForMode(mode)
  const showDateLabels = shouldShowPerChannelDateLabels(mode, publications, now)
  const samePeriodRange = shouldShowSimplify14SamePeriodRange(mode, publications, now)
    ? formatSimplify14SamePeriodRange(publications, now)
    : undefined
  const cta =
    mode === 'running' || mode === 'allDisabled' || mode === 'mixedPeriods'
      ? undefined
      : getSimplify11PanelCta(advertisement, now)

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

  if (!heading) {
    return null
  }

  return (
    <div
      data-testid={`job-card-simplify14-${mode}`}
      className="tm-flex tm-flex-col tm-gap-1.5"
    >
      <div
        data-testid="job-card-simplify14-advertisement-heading"
        className="tm-flex tm-flex-col tm-gap-1 tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-2"
      >
        <div className="tm-flex tm-items-start tm-justify-between tm-gap-3">
          <StatusHeading
            icon={heading.icon}
            className={heading.className}
            testId={heading.testId}
          >
            {heading.label}
          </StatusHeading>
          {summary.viewCount !== undefined ? (
            <AggregateViews
              viewCount={summary.viewCount}
              onViewStatisticsClick={onViewStatisticsClick}
            />
          ) : null}
        </div>
        {samePeriodRange ? (
          <p
            data-testid="job-card-simplify14-subline"
            className="tm-m-0 tm-text-sm tm-text-secondary-default"
          >
            {samePeriodRange}
          </p>
        ) : null}
      </div>
      <JobCardSimplify14ChannelStrip
        publications={publications}
        showDateLabels={showDateLabels}
        now={now}
        onExtendPublication={onExtendPublication}
        onEnablePublication={onEnablePublication}
      />
      {cta && (onExtendPublication || onExtendPublications) ? (
        <Button
          variant="secondary"
          size="medium"
          isBlock
          data-testid="job-card-simplify14-panel-cta"
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
  )
}

function isSimplify14MixedMode(
  mode: JobCardSimplify14PanelMode,
): mode is 'partial' | 'running' | 'ended' | 'allDisabled' | 'mixedPeriods' {
  return (
    mode === 'partial' ||
    mode === 'running' ||
    mode === 'ended' ||
    mode === 'allDisabled' ||
    mode === 'mixedPeriods'
  )
}

export function JobCardAdvertisementSimplify14Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onDeclineAdvertising,
  onRepublishAdvertisement,
  onEnablePublication,
  className,
}: JobCardAdvertisementSimplify14PanelProps) {
  const publications = advertisement.publications ?? []
  const mode = resolveJobCardSimplify14PanelMode(advertisement)

  const sharedAdvertisementProps = {
    advertisement,
    onCompleteAdvertisement,
    onViewStatisticsClick,
    onPreviewAdvertisement,
    onPreviewPublication,
    onExtendPublication,
    onExtendPublications,
    showPreviewLink: false as const,
    periodPresentation: 'text' as const,
    publicationHover: 'placesTable' as const,
    publicationChannelDecoration: 'plain' as const,
    publicationDropdownPlacement: 'top-start' as const,
    publicationPresentation: 'simplify11' as const,
    className,
  }

  if (isDraftAdvertisement(advertisement)) {
    return <JobCardAdvertisement {...sharedAdvertisementProps} />
  }

  if (publications.length === 0) {
    return <JobCardAdvertisement {...sharedAdvertisementProps} />
  }

  if (isSimplify14MixedMode(mode)) {
    return (
      <div
        data-testid="job-card-advertisement"
        className={cn('tm-flex tm-flex-col tm-gap-3', className)}
      >
        <Simplify14MixedChannelPanel
          advertisement={advertisement}
          mode={mode}
          onExtendPublication={onExtendPublication}
          onExtendPublications={onExtendPublications}
          onEnablePublication={onEnablePublication}
          onViewStatisticsClick={onViewStatisticsClick}
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
      onDeclineAdvertising={onDeclineAdvertising}
      onRepublishAdvertisement={onRepublishAdvertisement}
      channelLogoSize={40}
      showPortalPeriodBadges={false}
      expiredLogosMuted={false}
      actionButtonVariant="secondary"
      actionButtonSize="medium"
      hideNotAdvertisingMeta
      notAdvertisingHeadingBorder
      className={className}
    />
  )
}

JobCardAdvertisementSimplify14Panel.displayName = 'JobCardAdvertisementSimplify14Panel'
