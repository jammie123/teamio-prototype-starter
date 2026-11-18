import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { AdvertisementHeader } from './AdvertisementHeader'
import { AdvertisementStats } from './AdvertisementStats'
import { AdvertisementWidget } from './AdvertisementWidget'
import type { AdvertisementModel } from './lib/advertisementModel'
import type { JobAdvertisement } from './types'

export interface JobCardAdvertisementsProps extends StyleProps {
  advertisements: JobAdvertisement[]
  /** Model of the first advertisement; drives heading and views. */
  stats?: AdvertisementModel
  showAdvertisementTitle?: boolean
  now?: Date
  onExtendAndRepublish?: () => void
  onViewStatisticsClick?: () => void
  onAdvertisementPreviewClick?: () => void
  onHighlightAdvertisement?: () => void
  onCreateAdvertisement?: () => void
}

function AdvertisementRowDivider() {
  return (
    <div
      role="separator"
      aria-hidden
      className="tm-mx-0.5 tm-h-3 tm-self-center tm-border-0 tm-border-l tm-border-solid tm-border-secondary"
    />
  )
}

/** Advertisement row beside the pipeline: status, portals and views. */
export function JobCardAdvertisements({
  advertisements,
  stats,
  showAdvertisementTitle = false,
  now,
  onExtendAndRepublish,
  onViewStatisticsClick,
  onAdvertisementPreviewClick,
  onHighlightAdvertisement,
  onCreateAdvertisement,
  className,
}: JobCardAdvertisementsProps) {
  const showPublishedRow = advertisements.length > 0 && stats && stats.kind !== 'notPublished'

  return (
    <div
      data-testid="job-card-advertisements"
      className={cn(
        'tm-flex tm-min-w-0 tm-w-full tm-flex-row tm-flex-wrap tm-items-center tm-gap-3',
        className,
      )}
    >
      {showPublishedRow ? (
        <>
          <AdvertisementHeader {...stats.header} showLabel />
          <AdvertisementRowDivider />
          <div className="tm-flex tm-shrink-0 tm-flex-col">
            {advertisements.map((advertisement, index) => (
              <AdvertisementWidget
                key={advertisement.id}
                advertisement={advertisement}
                showTitle={showAdvertisementTitle}
                now={now}
                hideTopBorder={index === 0}
                onExtendAndRepublish={onExtendAndRepublish}
                onAdvertisementPreviewClick={onAdvertisementPreviewClick}
                onHighlightAdvertisement={onHighlightAdvertisement}
                onCreateAdvertisement={onCreateAdvertisement}
              />
            ))}
          </div>
          {stats.viewCount !== undefined ? (
            <>
              <AdvertisementRowDivider />
              <AdvertisementStats viewCount={stats.viewCount} onStatistics={onViewStatisticsClick} />
            </>
          ) : null}
        </>
      ) : advertisements.length === 0 ? (
        <AdvertisementEmptyState
          onCreateAdvertisement={onCreateAdvertisement}
          onAdvertisementPreviewClick={onAdvertisementPreviewClick}
          className="tm-min-w-0 tm-flex-1"
        />
      ) : (
        advertisements.map((advertisement, index) => (
          <AdvertisementWidget
            key={advertisement.id}
            advertisement={advertisement}
            showTitle={showAdvertisementTitle}
            now={now}
            hideTopBorder={index === 0}
            onExtendAndRepublish={onExtendAndRepublish}
            onAdvertisementPreviewClick={onAdvertisementPreviewClick}
            onHighlightAdvertisement={onHighlightAdvertisement}
            onCreateAdvertisement={onCreateAdvertisement}
            className="tm-min-w-0 tm-flex-1"
          />
        ))
      )}
    </div>
  )
}

JobCardAdvertisements.displayName = 'JobCardAdvertisements'
