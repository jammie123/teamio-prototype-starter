import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title above the status. */
  showTitle?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  /** Drop the top divider. Defaults to true for the compact right column. */
  hideTopBorder?: boolean
}

/**
 * Compact advertisement block for the job-card right column:
 * status, dates and portals.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  now,
  hideTopBorder = true,
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
        'tm-w-full',
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
        <AdvertisementHeader {...model.header} />
      ) : (
        <>
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
            className="tm-m-0 tm-flex tm-min-w-0 tm-w-full tm-flex-row tm-flex-wrap tm-items-center tm-gap-2 tm-p-0"
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
        </>
      )}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
