import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardAdvertisementSimplify13Panel } from '../JobCardSimplify13/JobCardAdvertisementSimplify13Panel'
import { AdvertiseListEnd } from './AdvertiseListEnd'
import { AdvertisementHeader } from './AdvertisementHeader'
import { AdvertisementList } from './AdvertisementList'
import { JobBoardItem } from './JobBoardItem'
import {
  buildSimplify28AdvertisementModel,
  type Simplify28GroupModel,
} from './jobCardSimplify28Presentation'

export interface JobCardAdvertisementSimplify28PanelProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onRepublishAdvertisement?: () => void
}

function endedSummaryTitle(group: Simplify28GroupModel) {
  if (group.items.length === 1) {
    return group.items[0].channel
  }

  return group.badge.label
}

function portalItems(group: Simplify28GroupModel) {
  return group.items.map((item) => (
    <JobBoardItem
      key={item.id}
      channel={item.channel}
      date={item.date}
      dateLayout={item.dateLayout}
      status={item.status}
    />
  ))
}

export function JobCardAdvertisementSimplify28Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onRepublishAdvertisement,
  className,
}: JobCardAdvertisementSimplify28PanelProps) {
  const model = buildSimplify28AdvertisementModel(advertisement)

  if (model.kind === 'fallback') {
    return (
      <JobCardAdvertisementSimplify13Panel
        advertisement={advertisement}
        onCompleteAdvertisement={onCompleteAdvertisement}
        onViewStatisticsClick={onViewStatisticsClick}
        onPreviewAdvertisement={onPreviewAdvertisement}
        onPreviewPublication={onPreviewPublication}
        onExtendPublication={onExtendPublication}
        onExtendPublications={onExtendPublications}
        onRepublishAdvertisement={onRepublishAdvertisement}
        className={className}
      />
    )
  }

  if (model.kind === 'notAdvertising') {
    return (
      <AdvertisementHeader
        title={model.title}
        titleTestId={model.testId}
        className={cn(model.className, className)}
      />
    )
  }

  return (
    <div data-testid="job-card-simplify28-portals" className={cn('tm-flex tm-flex-col tm-gap-4', className)}>
      {model.groups.map((group) =>
        group.kind === 'expired' ? (
          <AdvertiseListEnd
            key={group.kind}
            channels={group.items.map((item) => item.channel)}
            title={endedSummaryTitle(group)}
          >
            {portalItems(group)}
          </AdvertiseListEnd>
        ) : (
          <AdvertisementList key={group.kind} status={group.listStatus} badge={group.badge.label}>
            {portalItems(group)}
          </AdvertisementList>
        ),
      )}
    </div>
  )
}

JobCardAdvertisementSimplify28Panel.displayName = 'JobCardAdvertisementSimplify28Panel'
