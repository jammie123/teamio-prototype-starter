import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { isDraftAdvertisement } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { JobCardAdvertisementSimplify10Panel } from '../JobCardSimplify10/JobCardAdvertisementSimplify10Panel'
import {
  JOB_CARD_SIMPLIFY_15_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_15_STATUS_HEADING_PADDING_TOP,
} from './constants'

export interface JobCardAdvertisementSimplify15PanelProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onRepublishAdvertisement?: () => void
}

export function JobCardAdvertisementSimplify15Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onRepublishAdvertisement,
  className,
}: JobCardAdvertisementSimplify15PanelProps) {
  const publications = advertisement.publications ?? []

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
        channelLogoSize={JOB_CARD_SIMPLIFY_15_CHANNEL_LOGO_SIZE}
        showPortalPeriodBadges={false}
        expiredLogosMuted={false}
        actionButtonVariant="secondary"
        actionButtonSize="medium"
        notAdvertisingMetaClassName="tm-text-sm tm-text-secondary-default"
        notAdvertisingHeadingIconSize={JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_SIZE}
        notAdvertisingHeadingIconStrokeWidth={JOB_CARD_SIMPLIFY_15_STATUS_HEADING_ICON_STROKE}
        notAdvertisingHeadingWrapClassName={JOB_CARD_SIMPLIFY_15_STATUS_HEADING_PADDING_TOP}
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
        publicationChannelLogoSize={JOB_CARD_SIMPLIFY_15_CHANNEL_LOGO_SIZE}
        className={className}
      />
    )
  }

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
      publicationChannelLogoSize={JOB_CARD_SIMPLIFY_15_CHANNEL_LOGO_SIZE}
      className={cn('!tm-gap-2', className)}
    />
  )
}

JobCardAdvertisementSimplify15Panel.displayName = 'JobCardAdvertisementSimplify15Panel'
