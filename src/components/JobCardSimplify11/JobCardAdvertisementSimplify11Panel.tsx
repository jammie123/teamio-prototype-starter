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
import { JobCardSimplify11ChannelStrip } from './JobCardSimplify11ChannelStrip'
import {
  buildSimplify11PanelSubline,
  formatMixedPeriodsHeading,
  getSimplify11PanelCta,
  resolveJobCardSimplify11PanelMode,
  type JobCardSimplify11PanelMode,
} from './jobCardSimplify11Presentation'

export interface JobCardAdvertisementSimplify11PanelProps extends StyleProps {
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
        'tm-m-0 tm-flex tm-items-center tm-gap-1.5 tm-text-sm tm-font-medium',
        className,
      )}
    >
      <Icon name={icon} size={20} className="tm-shrink-0" />
      <span>{children}</span>
    </p>
  )
}

function headingForMode(mode: JobCardSimplify11PanelMode, advertisement: JobAdvertisement, now: Date) {
  const subline = buildSimplify11PanelSubline(advertisement, mode, now)

  switch (mode) {
    case 'partial':
      return {
        icon: 'alert-triangle-outline' as const,
        className: 'tm-text-emotion-warning-emphasis',
        testId: 'job-card-simplify11-partial-heading',
        label: formatPartialRunningHeading(),
        subline,
      }
    case 'running':
      return {
        icon: 'circle-check' as const,
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify11-running-heading',
        label: formatRunningSimpleHeading(),
        subline,
      }
    case 'ended':
      return {
        icon: 'warning' as const,
        className: 'tm-text-emotion-danger-emphasis',
        testId: 'job-card-simplify11-ended-heading',
        label: formatAdvertisementEndedHeading(),
        subline,
      }
    case 'allDisabled':
      return {
        icon: 'view-off' as const,
        className: 'tm-text-secondary-default',
        testId: 'job-card-simplify11-all-disabled-heading',
        label: 'Neinzeruje se',
        subline: undefined,
      }
    case 'mixedPeriods':
      return {
        icon: 'circle-check' as const,
        className: 'tm-text-emotion-success-emphasis',
        testId: 'job-card-simplify11-mixed-periods-heading',
        label: formatMixedPeriodsHeading(),
        subline,
      }
    default:
      return null
  }
}

function Simplify11MixedChannelPanel({
  advertisement,
  mode,
  onExtendPublication,
  onExtendPublications,
  onEnablePublication,
  now = new Date(),
}: {
  advertisement: JobAdvertisement
  mode: Extract<
    JobCardSimplify11PanelMode,
    'partial' | 'running' | 'ended' | 'allDisabled' | 'mixedPeriods'
  >
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onEnablePublication?: (publication: JobPublication) => void
  now?: Date
}) {
  const publications = advertisement.publications ?? []
  const summary = getAdvertisementSummary(advertisement)
  const heading = headingForMode(mode, advertisement, now)
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
      data-testid={`job-card-simplify11-${mode}`}
      className="tm-flex tm-flex-col tm-gap-1.5"
    >
      <StatusHeading
        icon={heading.icon}
        className={heading.className}
        testId={heading.testId}
      >
        {heading.label}
      </StatusHeading>
      {heading.subline ? (
        <p
          data-testid="job-card-simplify11-subline"
          className="tm-m-0 tm-text-xs tm-text-secondary-default"
        >
          {heading.subline}
        </p>
      ) : null}
      <JobCardSimplify11ChannelStrip
        publications={publications}
        now={now}
        onExtendPublication={onExtendPublication}
        onEnablePublication={onEnablePublication}
      />
      {summary.viewCount !== undefined ? (
        <p
          data-testid="job-card-advertisement-aggregate-views"
          className="tm-m-0 tm-text-xs tm-text-secondary-default"
        >
          {formatViewCountLabel(summary.viewCount)}
        </p>
      ) : null}
      {cta && (onExtendPublication || onExtendPublications) ? (
        <Button
          variant="secondary"
          size="medium"
          isBlock
          data-testid="job-card-simplify11-panel-cta"
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

function isSimplify11MixedMode(
  mode: JobCardSimplify11PanelMode,
): mode is 'partial' | 'running' | 'ended' | 'allDisabled' | 'mixedPeriods' {
  return (
    mode === 'partial' ||
    mode === 'running' ||
    mode === 'ended' ||
    mode === 'allDisabled' ||
    mode === 'mixedPeriods'
  )
}

export function JobCardAdvertisementSimplify11Panel({
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
}: JobCardAdvertisementSimplify11PanelProps) {
  const publications = advertisement.publications ?? []
  const mode = resolveJobCardSimplify11PanelMode(advertisement)

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

  if (isSimplify11MixedMode(mode)) {
    return (
      <div
        data-testid="job-card-advertisement"
        className={cn('tm-flex tm-flex-col tm-gap-3', className)}
      >
        <Simplify11MixedChannelPanel
          advertisement={advertisement}
          mode={mode}
          onExtendPublication={onExtendPublication}
          onExtendPublications={onExtendPublications}
          onEnablePublication={onEnablePublication}
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
      className={className}
    />
  )
}

JobCardAdvertisementSimplify11Panel.displayName = 'JobCardAdvertisementSimplify11Panel'
