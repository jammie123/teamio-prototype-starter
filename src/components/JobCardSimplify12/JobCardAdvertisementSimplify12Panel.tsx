import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  formatViewCountLabel,
  getAdvertisementSummary,
  isUnlimitedPublication,
  partitionPublicationChannels,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { JobCardAdvertisementSimplify10Panel } from '../JobCardSimplify10/JobCardAdvertisementSimplify10Panel'
import { JobCardSimplify12ChannelRows } from './JobCardSimplify12ChannelRows'
import { JobCardSimplify12LogoRow } from './JobCardSimplify12LogoRow'
import {
  buildMixedEndDatesHeading,
  buildPartialHeading,
  buildRunningCalmHeading,
  formatPaidEndedOwnChannelsHeading,
  getSimplify12PanelCta,
  resolveJobCardSimplify12PanelMode,
  type JobCardSimplify12PanelMode,
} from './jobCardSimplify12Presentation'

export interface JobCardAdvertisementSimplify12PanelProps extends StyleProps {
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
  icon: 'circle-check' | 'alert-triangle-outline' | 'clock' | 'warning'
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

function isSimplify12AbcMode(
  mode: JobCardSimplify12PanelMode,
): mode is
  | 'runningCalm'
  | 'partial'
  | 'mixedEndDates'
  | 'paidEndedOwnChannelsOnly'
  | 'allDisabled' {
  return (
    mode === 'runningCalm' ||
    mode === 'partial' ||
    mode === 'mixedEndDates' ||
    mode === 'paidEndedOwnChannelsOnly' ||
    mode === 'allDisabled'
  )
}

function Simplify12AbcPanel({
  advertisement,
  mode,
  onExtendPublication,
  onExtendPublications,
  now = new Date(),
}: {
  advertisement: JobAdvertisement
  mode: Extract<
    JobCardSimplify12PanelMode,
    'runningCalm' | 'partial' | 'mixedEndDates' | 'paidEndedOwnChannelsOnly' | 'allDisabled'
  >
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  now?: Date
}) {
  const publications = advertisement.publications ?? []
  const summary = getAdvertisementSummary(advertisement)
  const cta = getSimplify12PanelCta(advertisement, mode, now)

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

  if (mode === 'allDisabled') {
    return (
      <div data-testid="job-card-simplify12-all-disabled" className="tm-flex tm-flex-col tm-gap-2">
        <p
          data-testid="job-card-simplify12-all-disabled-heading"
          className="tm-m-0 tm-text-sm tm-font-medium tm-text-secondary-default"
        >
          Neinzeruje se
        </p>
      </div>
    )
  }

  if (mode === 'runningCalm') {
    return (
      <div data-testid="job-card-simplify12-running-calm" className="tm-flex tm-flex-col tm-gap-2">
        <StatusHeading
          icon="circle-check"
          className="tm-text-emotion-success-emphasis"
          testId="job-card-simplify12-running-calm-heading"
        >
          {buildRunningCalmHeading(advertisement, now)}
        </StatusHeading>
        <JobCardSimplify12LogoRow publications={publications} />
        {summary.viewCount !== undefined ? (
          <p
            data-testid="job-card-advertisement-aggregate-views"
            className="tm-m-0 tm-text-xs tm-text-secondary-default"
          >
            {formatViewCountLabel(summary.viewCount)}
          </p>
        ) : null}
      </div>
    )
  }

  if (mode === 'partial') {
    return (
      <div data-testid="job-card-simplify12-partial" className="tm-flex tm-flex-col tm-gap-2">
        <StatusHeading
          icon="alert-triangle-outline"
          className="tm-text-emotion-warning-emphasis"
          testId="job-card-simplify12-partial-heading"
        >
          {buildPartialHeading(publications, now)}
        </StatusHeading>
        <JobCardSimplify12ChannelRows
          publications={publications}
          variant="partial"
          now={now}
          onExtendPublication={onExtendPublication}
        />
      </div>
    )
  }

  if (mode === 'mixedEndDates') {
    return (
      <div data-testid="job-card-simplify12-mixed-dates" className="tm-flex tm-flex-col tm-gap-2">
        <StatusHeading
          icon="clock"
          className="tm-text-emotion-warning-emphasis"
          testId="job-card-simplify12-mixed-dates-heading"
        >
          {buildMixedEndDatesHeading(publications, now)}
        </StatusHeading>
        <JobCardSimplify12ChannelRows
          publications={publications}
          variant="mixedEndDates"
          now={now}
          highlightNearestEnd
        />
        {cta && (onExtendPublication || onExtendPublications) ? (
          <Button
            variant="secondary"
            size="small"
            isBlock
            className="!tm-min-h-8"
            data-testid="job-card-simplify12-panel-cta"
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

  const { active } = partitionPublicationChannels(publications, now)
  const unlimitedActive = active.filter((publication) =>
    isUnlimitedPublication(publication.channel),
  )

  return (
    <div
      data-testid="job-card-simplify12-paid-ended-own"
      className="tm-flex tm-flex-col tm-gap-2"
    >
      <StatusHeading
        icon="warning"
        className="tm-text-emotion-danger-emphasis"
        testId="job-card-simplify12-paid-ended-heading"
      >
        {formatPaidEndedOwnChannelsHeading(unlimitedActive)}
      </StatusHeading>
      <JobCardSimplify12LogoRow publications={active} />
      {cta && (onExtendPublication || onExtendPublications) ? (
        <Button
          variant="secondary"
          size="small"
          isBlock
          className="!tm-min-h-8"
          data-testid="job-card-simplify12-panel-cta"
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

export function JobCardAdvertisementSimplify12Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onDeclineAdvertising,
  onRepublishAdvertisement,
  onEnablePublication: _onEnablePublication,
  className,
}: JobCardAdvertisementSimplify12PanelProps) {
  const publications = advertisement.publications ?? []
  const mode = resolveJobCardSimplify12PanelMode(advertisement)

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

  if (isSimplify12AbcMode(mode)) {
    return (
      <div
        data-testid="job-card-advertisement"
        className={cn('tm-flex tm-flex-col tm-gap-3', className)}
      >
        <Simplify12AbcPanel
          advertisement={advertisement}
          mode={mode}
          onExtendPublication={onExtendPublication}
          onExtendPublications={onExtendPublications}
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
      actionButtonSize="small"
      className={className}
    />
  )
}

JobCardAdvertisementSimplify12Panel.displayName = 'JobCardAdvertisementSimplify12Panel'
