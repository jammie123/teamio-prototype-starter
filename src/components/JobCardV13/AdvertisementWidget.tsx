import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { formatViewCountLabel } from './lib/format'
import { PublicationHighlightItem, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title next to the views. */
  showTitle?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onProlong?: () => void
}

function AdvertisementMeta({ title, viewCount }: { title?: string; viewCount?: number }) {
  if (!title && viewCount === undefined) {
    return null
  }

  return (
    <div className="tm-flex tm-shrink-0 tm-items-baseline tm-gap-2 tm-whitespace-nowrap tm-text-xs tm-text-secondary-default">
      {title ? (
        <span
          data-testid="job-card-advertisement-title"
          className="tm-max-w-48 tm-truncate tm-font-normal"
        >
          {title}
        </span>
      ) : null}
      {title && viewCount !== undefined ? (
        <span data-testid="job-card-advertisement-title-separator" aria-hidden>
          ·
        </span>
      ) : null}
      {viewCount === undefined ? null : (
        <span data-testid="job-card-advertisement-aggregate-views">
          {formatViewCountLabel(viewCount)}
        </span>
      )}
    </div>
  )
}

/**
 * Advertisement row of a job card: status header, job portal chips (with
 * Jobstip / Topováno highlights), total views and "Prodloužit" when it ends soon.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  now,
  onProlong,
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
        'tm-flex-row',
        'tm-flex-wrap',
        'tm-items-center',
        'tm-gap-x-8',
        'tm-gap-y-2',
        'tm-border-0',
        'tm-border-t',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-py-5',
        className,
      )}
    >
      <AdvertisementHeader {...model.header} />
      {isNotPublished ? null : (
        <>
          <div
            data-testid="job-card-advertisement-badges"
            className="tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-flex-row tm-flex-wrap tm-items-center tm-gap-2 tm-p-0"
          >
            {model.publications.map((item) => (
              <Fragment key={item.publication.id}>
                <PublicationItem
                  publication={item.publication}
                  status={item.status}
                  dateLabel={item.dateLabel}
                  showStatusDot={model.showStatusDots}
                />
                {item.highlights.map((highlight) => (
                  <PublicationHighlightItem
                    key={highlight.id}
                    publication={item.publication}
                    highlight={highlight}
                  />
                ))}
              </Fragment>
            ))}
          </div>
          <AdvertisementMeta
            title={showTitle ? advertisement.title : undefined}
            viewCount={model.viewCount}
          />
        </>
      )}
      {model.canProlong ? (
        <Button
          variant="primary"
          size="small"
          className="!tm-min-h-8 !tm-shrink-0 !tm-px-4"
          data-testid="job-card-disappearance-prolong"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onProlong?.()
          }}
        >
          Prodloužit
        </Button>
      ) : null}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
