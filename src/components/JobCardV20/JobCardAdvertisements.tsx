import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { AdvertisementStats, type AdvertisementStatsAction } from './AdvertisementStats'
import { AdvertisementWidget } from './AdvertisementWidget'
import { JOB_CARD_SIDE_COLUMN_WIDTH } from './layout'
import type { AdvertisementModel } from './lib/advertisementModel'
import type { JobAdvertisement } from './types'

export interface JobCardAdvertisementsProps extends StyleProps {
  advertisements: JobAdvertisement[]
  /** Model of the first advertisement; drives the stats footer. */
  stats?: AdvertisementModel
  showAdvertisementTitle?: boolean
  now?: Date
  onExtendAndRepublish?: () => void
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
  onHighlightAdvertisement?: () => void
  onCreateAdvertisement?: () => void
}

function statsAction(stats: AdvertisementModel): AdvertisementStatsAction | undefined {
  if (stats.canProlong) {
    return 'prolong'
  }

  return stats.kind === 'ended' ? 'republish' : undefined
}

/** Right column of the job card: advertisements (portals, dates) with a stats footer, or the promo. */
export function JobCardAdvertisements({
  advertisements,
  stats,
  showAdvertisementTitle = false,
  now,
  onExtendAndRepublish,
  onViewStatisticsClick,
  onAdvertisementDetailClick,
  onAdvertisementPreviewClick,
  onHighlightAdvertisement,
  onCreateAdvertisement,
  className,
}: JobCardAdvertisementsProps) {
  return (
    <div
      data-testid="job-card-advertisements"
      className={cn(
        'tm-flex tm-w-full tm-shrink-0 tm-flex-row tm-items-start tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-px-6 tm-py-6 md:tm-flex-col md:tm-items-stretch md:tm-border-t-0 md:tm-border-l',
        JOB_CARD_SIDE_COLUMN_WIDTH,
        className,
      )}
    >
      {advertisements.length === 0 ? (
        <AdvertisementEmptyState
          onCreateAdvertisement={onCreateAdvertisement}
          onAdvertisementPreviewClick={onAdvertisementPreviewClick}
        />
      ) : (
        <>
          <div className="tm-flex tm-min-w-0 tm-w-full tm-flex-1 tm-flex-col">
            {advertisements.map((advertisement, index) => (
              <AdvertisementWidget
                key={advertisement.id}
                advertisement={advertisement}
                showTitle={showAdvertisementTitle}
                showHeadingLabel
                now={now}
                hideTopBorder={index === 0}
                onExtendAndRepublish={onExtendAndRepublish}
                onAdvertisementPreviewClick={onAdvertisementPreviewClick}
                onHighlightAdvertisement={onHighlightAdvertisement}
                onCreateAdvertisement={onCreateAdvertisement}
              />
            ))}
          </div>
          {stats && stats.kind !== 'notPublished' ? (
            <AdvertisementStats
              viewCount={stats.viewCount}
              action={statsAction(stats)}
              onAction={onExtendAndRepublish}
              onStatistics={onViewStatisticsClick}
              onDetail={onAdvertisementDetailClick}
            />
          ) : null}
        </>
      )}
    </div>
  )
}

JobCardAdvertisements.displayName = 'JobCardAdvertisements'
