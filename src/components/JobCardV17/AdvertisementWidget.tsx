import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementAction, type AdvertisementActionLayout } from './AdvertisementAction'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title next to the status. */
  showTitle?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onProlong?: () => void
  /** Override whether Prodloužit is shown. Defaults to the advertisement model. */
  showProlong?: boolean
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
  actionLayout?: AdvertisementActionLayout
  /** Drop the top divider, e.g. when a JobNote already sits above. */
  hideTopBorder?: boolean
}

/**
 * Advertisement block of a job card: status and portals on the left,
 * AdvertisementAction (stats, Detail, optional Prodloužit, Náhled) on the right.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  now,
  onProlong,
  showProlong,
  onViewStatisticsClick,
  onAdvertisementDetailClick,
  onAdvertisementPreviewClick,
  actionLayout,
  hideTopBorder = false,
  className,
}: AdvertisementWidgetProps) {
  const model = buildAdvertisementModel(advertisement, now)
  const isNotPublished = model.kind === 'notPublished'

  return (
    <div
      data-testid="job-card-advertisement"
      data-kind={model.kind}
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-2',
        'tm-border-0',
        !hideTopBorder && 'tm-border-t',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-pt-4',
        'tm-pb-5',
        className,
      )}
    >
      {isNotPublished ? (
        <AdvertisementHeader {...model.header} />
      ) : (
        <div
          data-testid="job-card-advertisement-top"
          className="tm-flex tm-w-full tm-items-center tm-justify-between tm-gap-2"
        >
          <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-justify-center tm-gap-2">
            {showTitle && advertisement.title ? (
              <span
                data-testid="job-card-advertisement-title"
                className="tm-max-w-48 tm-truncate tm-text-xs tm-font-normal tm-text-secondary-default"
              >
                {advertisement.title}
              </span>
            ) : null}
            <AdvertisementHeader {...model.header} />
            <div
              data-testid="job-card-advertisement-publications"
              className="tm-m-0 tm-flex tm-min-w-0 tm-w-full tm-flex-row tm-flex-wrap tm-items-center tm-gap-4 tm-p-0"
            >
              {model.publications.map((item) => (
                <Fragment key={item.publication.id}>
                  <PublicationItem
                    publication={item.publication}
                    status={item.status}
                    dateLabel={item.dateLabel}
                    showStatusDot
                  />
                  <PublicationHighlights
                    publication={item.publication}
                    highlights={item.highlights}
                  />
                </Fragment>
              ))}
            </div>
          </div>
          <AdvertisementAction
            viewCount={model.viewCount}
            showProlong={showProlong ?? model.canProlong}
            layout={actionLayout}
            onStatistics={onViewStatisticsClick}
            onDetail={onAdvertisementDetailClick}
            onProlong={onProlong}
            onPreview={onAdvertisementPreviewClick}
          />
        </div>
      )}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
