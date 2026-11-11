import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title above the status. */
  showTitle?: boolean
  /** Show the status label (Běží, Ukončeno, …). Warning and ended always show it. */
  showHeadingLabel?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  /** Drop the top divider. Defaults to true for the compact right column. */
  hideTopBorder?: boolean
  /** Called from Naplánovat prodloužení when the advertisement is ending soon. */
  onProlong?: () => void
  onAdvertisementPreviewClick?: () => void
  onHighlightAdvertisement?: () => void
  onCreateAdvertisement?: () => void
}

/**
 * Compact advertisement block for the job-card right column:
 * status, dates and portals.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  showHeadingLabel = false,
  now,
  hideTopBorder = true,
  onProlong,
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
        'tm-w-full',
        'tm-flex-col',
        'tm-items-start',
        'md:tm-items-stretch',
        'tm-gap-2',
        'tm-border-0',
        'tm-border-solid',
        'tm-border-secondary',
        !hideTopBorder && 'tm-border-t tm-pt-4',
        className,
      )}
    >
      {isNotPublished ? (
        <AdvertisementEmptyState onCreateAdvertisement={onCreateAdvertisement} />
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
          <AdvertisementHeader {...model.header} showLabel={showHeadingLabel} />
          <div
            data-testid="job-card-advertisement-publications"
            className="tm-m-0 tm-flex tm-min-w-0 tm-w-full tm-flex-row tm-flex-wrap tm-items-start tm-gap-1 tm-p-0 md:tm-flex-col"
          >
            {model.publications.map((item) => (
              <Fragment key={item.publication.id}>
                <PublicationItem
                  publication={item.publication}
                  status={item.status}
                  dateLabel={item.dateLabel}
                  showStatusDot
                  onViewAdvertisement={onAdvertisementPreviewClick}
                  onProlong={onProlong}
                  onHighlight={onHighlightAdvertisement}
                  onRepublish={onProlong}
                  highlights={item.highlights}
                />
                <PublicationHighlights
                  publication={item.publication}
                  highlights={item.highlights}
                  onViewAdvertisement={onAdvertisementPreviewClick}
                  onProlong={onProlong}
                  onHighlight={onHighlightAdvertisement}
                />
              </Fragment>
            ))}
          </div>
          {model.canProlong ? (
            <Button
              variant="primary"
              data-testid="job-card-disappearance-prolong"
              aria-label="Naplánovat prodloužení"
              onClick={(event) => {
                event.stopPropagation()
                onProlong?.()
              }}
            >
              Naplánovat prodloužení
            </Button>
          ) : null}
        </>
      )}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
