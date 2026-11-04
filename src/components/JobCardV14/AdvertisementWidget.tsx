import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { formatViewCountLabel } from './lib/format'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title next to the views. */
  showTitle?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onProlong?: () => void
}

function AdvertisementMeta({
  title,
  viewCount,
  className,
}: StyleProps & { title?: string; viewCount?: number }) {
  if (!title && viewCount === undefined) {
    return null
  }

  return (
    <div
      className={cn(
        'tm-flex tm-shrink-0 tm-items-baseline tm-gap-2 tm-whitespace-nowrap tm-text-xs tm-text-secondary-default',
        className,
      )}
    >
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
 * Advertisement block of a job card: status header with views on the right, then
 * portal rows (with Jobstip / Topováno highlights) and "Prodloužit" when it ends soon.
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
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-2',
        'tm-border-0',
        'tm-border-t',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-py-5',
        className,
      )}
    >
      <div
        data-testid="job-card-advertisement-top"
        className="tm-flex tm-w-full tm-items-start tm-justify-between tm-gap-2"
      >
        <AdvertisementHeader {...model.header} />
        {isNotPublished ? null : (
          <AdvertisementMeta
            title={showTitle ? advertisement.title : undefined}
            viewCount={model.viewCount}
            className="tm-shrink-0 tm-self-start"
          />
        )}
      </div>
      {isNotPublished ? null : (
        <>
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
                <PublicationHighlights publication={item.publication} highlights={item.highlights} />
              </Fragment>
            ))}
          </div>
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
        </>
      )}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
