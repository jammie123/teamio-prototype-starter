import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { AdvertisementStats, type AdvertisementStatsAction } from './AdvertisementStats'
import { AdvertisementWidget } from './AdvertisementWidget'
import type { AdvertisementModel } from './lib/advertisementModel'
import type { JobAdvertisement } from './types'

export interface JobCardAdvertisementsProps extends StyleProps {
  advertisements: JobAdvertisement[]
  /** Model of the first advertisement; drives the heading-row stats. */
  stats?: AdvertisementModel
  showAdvertisementTitle?: boolean
  now?: Date
  onExtendAndRepublish?: () => void
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
  onCreateAdvertisement?: () => void
}

function statsAction(stats: AdvertisementModel): AdvertisementStatsAction | undefined {
  if (stats.canProlong) {
    return 'prolong'
  }

  return stats.kind === 'ended' ? 'republish' : undefined
}

/** Advertisement block under the job title: status, portals and heading-row stats. */
export function JobCardAdvertisements({
  advertisements,
  stats,
  showAdvertisementTitle = false,
  now,
  onExtendAndRepublish,
  onViewStatisticsClick,
  onAdvertisementDetailClick,
  onAdvertisementPreviewClick,
  onCreateAdvertisement,
  className,
}: JobCardAdvertisementsProps) {
  return (
    <div
      data-testid="job-card-advertisements"
      className={cn('tm-flex tm-min-w-0 tm-w-full tm-flex-col tm-items-stretch', className)}
    >
      {advertisements.length === 0 ? (
        <AdvertisementEmptyState
          onCreateAdvertisement={onCreateAdvertisement}
          onAdvertisementPreviewClick={onAdvertisementPreviewClick}
        />
      ) : (
        <div className="tm-flex tm-min-w-0 tm-w-full tm-flex-col">
          {advertisements.map((advertisement, index) => (
            <AdvertisementWidget
              key={advertisement.id}
              advertisement={advertisement}
              showTitle={showAdvertisementTitle}
              showHeadingLabel
              now={now}
              hideTopBorder={index === 0}
              headingEnd={
                index === 0 && stats && stats.kind !== 'notPublished' ? (
                  <AdvertisementStats
                    viewCount={stats.viewCount}
                    action={statsAction(stats)}
                    onAction={onExtendAndRepublish}
                    onStatistics={onViewStatisticsClick}
                    onDetail={onAdvertisementDetailClick}
                  />
                ) : undefined
              }
              onAdvertisementPreviewClick={onAdvertisementPreviewClick}
              onCreateAdvertisement={onCreateAdvertisement}
            />
          ))}
        </div>
      )}
    </div>
  )
}

JobCardAdvertisements.displayName = 'JobCardAdvertisements'
