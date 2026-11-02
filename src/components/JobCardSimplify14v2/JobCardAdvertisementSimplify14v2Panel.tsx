import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { getAdvertisementSummary } from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { JobCardAdvertisementSimplify10Panel } from '../JobCardSimplify10/JobCardAdvertisementSimplify10Panel'
import { AdvertisementHeader } from './AdvertisementHeader'
import {
  AdvertisementList,
  AdvertisementListDivider,
  AdvertisementListGroup,
} from './AdvertisementList'
import { JobBoardItem } from './JobBoardItem'
import {
  buildSimplify14v2HeaderBadges,
  buildSimplify14v2Heading,
  buildSimplify14v2StripGroups,
  formatSimplify14v2SamePeriodRange,
  getSimplify11PanelCta,
  resolveJobCardSimplify14v2PanelMode,
  shouldShowSimplify14v2SamePeriodRange,
  type JobCardSimplify14v2PanelMode,
} from './jobCardSimplify14v2Presentation'

export interface JobCardAdvertisementSimplify14v2PanelProps extends StyleProps {
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

function isSimplify14v2StripMode(
  mode: JobCardSimplify14v2PanelMode,
): mode is 'partial' | 'running' | 'ended' | 'endingSoon' | 'allDisabled' | 'mixedPeriods' {
  return (
    mode === 'partial' ||
    mode === 'running' ||
    mode === 'ended' ||
    mode === 'endingSoon' ||
    mode === 'allDisabled' ||
    mode === 'mixedPeriods'
  )
}

function Simplify14v2StripPanel({
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
    JobCardSimplify14v2PanelMode,
    'partial' | 'running' | 'ended' | 'endingSoon' | 'allDisabled' | 'mixedPeriods'
  >
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onEnablePublication?: (publication: JobPublication) => void
  onViewStatisticsClick?: () => void
  now?: Date
}) {
  const publications = advertisement.publications ?? []
  const summary = getAdvertisementSummary(advertisement)
  const badges = buildSimplify14v2HeaderBadges(advertisement, now)
  const samePeriodRange = shouldShowSimplify14v2SamePeriodRange(mode, publications, now)
    ? formatSimplify14v2SamePeriodRange(mode, publications, now)
    : undefined
  const heading = buildSimplify14v2Heading(mode, samePeriodRange)
  const groups = buildSimplify14v2StripGroups(publications, now, mode)
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

  if (!heading && badges.length === 0) {
    return null
  }

  return (
    <div
      data-testid={`job-card-simplify14v2-${mode}`}
      className="tm-flex tm-flex-col tm-gap-1.5"
    >
      <AdvertisementHeader
        title={heading?.label}
        titleTestId={heading?.testId}
        icon={heading?.icon}
        className={heading?.className}
        badges={badges}
        viewCount={summary.viewCount}
        onViewStatisticsClick={onViewStatisticsClick}
      />
      <AdvertisementList>
        {groups.map((group, index) => (
          <Fragment key={group.kind}>
            {index > 0 ? <AdvertisementListDivider /> : null}
            <AdvertisementListGroup>
              {group.items.map((publication) => (
                <JobBoardItem
                  key={publication.id}
                  publication={publication}
                  showDate={group.showDateLabels}
                  now={now}
                  onExtendPublication={onExtendPublication}
                  onEnablePublication={onEnablePublication}
                />
              ))}
            </AdvertisementListGroup>
          </Fragment>
        ))}
        {cta && (onExtendPublication || onExtendPublications) ? (
          <Button
            variant="secondary"
            size="small"
            className="tm-ml-auto tm-h-[40px] tm-min-h-[40px] tm-shrink-0 tm-self-start tm-px-4 tm-py-0"
            data-testid="job-card-simplify14v2-panel-cta"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              handlePanelCta()
            }}
          >
            {cta.label}
          </Button>
        ) : null}
      </AdvertisementList>
    </div>
  )
}

export function JobCardAdvertisementSimplify14v2Panel({
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
}: JobCardAdvertisementSimplify14v2PanelProps) {
  const publications = advertisement.publications ?? []
  const mode = resolveJobCardSimplify14v2PanelMode(advertisement)

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

  if (isSimplify14v2StripMode(mode)) {
    return (
      <div
        data-testid="job-card-advertisement"
        className={cn('tm-flex tm-flex-col tm-gap-3', className)}
      >
        <Simplify14v2StripPanel
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

JobCardAdvertisementSimplify14v2Panel.displayName = 'JobCardAdvertisementSimplify14v2Panel'
