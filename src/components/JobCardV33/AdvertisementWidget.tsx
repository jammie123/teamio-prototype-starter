import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { JOB_CARD_PUBLICATIONS_WIDTH } from './layout'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title above the portals. */
  showTitle?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  /** Drop the top divider. Defaults to true for the first advertisement in the row. */
  hideTopBorder?: boolean
  /** Called from Prodloužit / Znovuvystavit inzerát in the portal hover card. */
  onExtendAndRepublish?: () => void
  onAdvertisementPreviewClick?: () => void
  onHighlightAdvertisement?: () => void
  onCreateAdvertisement?: () => void
}

/**
 * Publications cell of the job-card advertisement row: portals with hover cards.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  now,
  hideTopBorder = true,
  onExtendAndRepublish,
  onAdvertisementPreviewClick,
  onHighlightAdvertisement,
  onCreateAdvertisement,
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
        'tm-min-w-0',
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-2',
        'tm-border-0',
        'tm-border-solid',
        'tm-border-secondary',
        !hideTopBorder && 'tm-border-t tm-pt-4',
        className,
      )}
    >
      {isNotPublished ? (
        <AdvertisementEmptyState
          onCreateAdvertisement={onCreateAdvertisement}
          onAdvertisementPreviewClick={onAdvertisementPreviewClick}
        />
      ) : (
        <>
          {showTitle && advertisement.title ? (
            <span
              data-testid="job-card-advertisement-title"
              className="tm-max-w-[12rem] tm-truncate tm-text-xs tm-font-normal tm-text-secondary-default"
            >
              {advertisement.title}
            </span>
          ) : null}
          <div
            data-testid="job-card-advertisement-publications"
            className={cn(
              'tm-m-0 tm-flex tm-shrink-0 tm-flex-wrap tm-items-start tm-gap-1 tm-p-0',
              JOB_CARD_PUBLICATIONS_WIDTH,
              model.sharedDates ? 'tm-flex-row' : 'tm-flex-col',
            )}
          >
            {model.publications.map((item) => (
              <Fragment key={item.publication.id}>
                <PublicationItem
                  publication={item.publication}
                  status={item.status}
                  dateLabel={item.dateLabel}
                  onViewAdvertisement={onAdvertisementPreviewClick}
                  onProlong={onExtendAndRepublish}
                  onHighlight={onHighlightAdvertisement}
                  onRepublish={onExtendAndRepublish}
                  highlights={item.highlights}
                />
                <PublicationHighlights
                  publication={item.publication}
                  highlights={item.highlights}
                  onViewAdvertisement={onAdvertisementPreviewClick}
                  onProlong={onExtendAndRepublish}
                  onHighlight={onHighlightAdvertisement}
                  onRepublish={onExtendAndRepublish}
                />
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
