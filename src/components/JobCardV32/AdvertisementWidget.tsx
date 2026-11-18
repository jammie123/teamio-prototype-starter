import { Fragment, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel } from './lib/advertisementModel'
import type { JobAdvertisement, JobPublicationStatus } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title above the status. */
  showTitle?: boolean
  /** Show the status label (Běží, Ukončeno, …). Warning and ended always show it. */
  showHeadingLabel?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  /** Drop the top divider. Defaults to true for stacked advertisements. */
  hideTopBorder?: boolean
  /** Extra content on the heading row (views, Přehled, prolong). */
  headingEnd?: ReactNode
  onAdvertisementPreviewClick?: () => void
  onCreateAdvertisement?: () => void
}

const CHANNEL_CLASS: Record<JobPublicationStatus, string> = {
  active: 'tm-text-primary-default',
  endingSoon: 'tm-text-primary-default',
  expired: 'tm-text-secondary-default',
}

/**
 * Compact advertisement block under the job title:
 * status, dates, heading-row extras and portals as comma-separated text.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  showHeadingLabel = false,
  now,
  hideTopBorder = true,
  headingEnd,
  onAdvertisementPreviewClick,
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
            data-testid="job-card-advertisement-heading-row"
            className="tm-flex tm-min-w-0 tm-w-full tm-flex-row tm-flex-wrap tm-items-baseline tm-gap-3"
          >
            <AdvertisementHeader {...model.header} showLabel={showHeadingLabel} />
            {headingEnd}
          </div>
          <p
            data-testid="job-card-advertisement-publications"
            className="tm-m-0 tm-min-w-0 tm-w-full tm-p-0 tm-text-sm tm-font-normal tm-text-primary-default"
          >
            {model.publications.map((item, index) => (
              <Fragment key={item.publication.id}>
                {index > 0 ? ', ' : null}
                <span data-testid="job-card-publication" data-status={item.status}>
                  <span
                    data-testid="job-card-publication-channel"
                    className={CHANNEL_CLASS[item.status]}
                  >
                    {item.publication.channel}
                  </span>
                  {item.dateLabel ? (
                    <span
                      data-testid="job-card-publication-dates"
                      className="tm-text-secondary-default"
                    >
                      {' '}
                      {item.dateLabel}
                    </span>
                  ) : null}
                  {item.highlights.length > 0 ? (
                    <span
                      data-testid="job-card-publication-highlight"
                      className="tm-text-teamio-pink"
                    >
                      {' + '}
                      {item.highlights.map((highlight, highlightIndex) => (
                        <Fragment key={highlight.id}>
                          {highlightIndex > 0 ? ', ' : null}
                          <span data-testid="job-card-publication-highlight-name">
                            {highlight.name}
                          </span>
                        </Fragment>
                      ))}
                    </span>
                  ) : null}
                </span>
              </Fragment>
            ))}
          </p>
        </>
      )}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
