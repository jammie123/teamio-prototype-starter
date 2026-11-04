import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementHeader } from '../JobCardV14/AdvertisementHeader'
import { buildAdvertisementModel } from '../JobCardV14/lib/advertisementModel'
import { PublicationHighlights, PublicationItem } from '../JobCardV14/PublicationItem'
import type { JobAdvertisement } from '../JobCardV14/types'
import { AdvertisementAction } from './AdvertisementAction'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title next to the status. */
  showTitle?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onProlong?: () => void
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
}

function formatChannelSummary(channels: string[]) {
  return channels.join(' · ')
}

/**
 * Advertisement block for JobCardV16: status and portals on the left,
 * AdvertisementAction (stats, Detail, optional Prodloužit, Náhled) on the right.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  now,
  onProlong,
  onViewStatisticsClick,
  onAdvertisementDetailClick,
  onAdvertisementPreviewClick,
  className,
}: AdvertisementWidgetProps) {
  const model = buildAdvertisementModel(advertisement, now)
  const isNotPublished = model.kind === 'notPublished'
  const hasHighlights = model.publications.some((item) => item.highlights.length > 0)
  const showCompactChannels =
    !isNotPublished &&
    !hasHighlights &&
    model.publications.length > 0 &&
    (model.kind === 'running' || model.kind === 'endingSoon' || model.kind === 'ended')

  const channelSummary = showCompactChannels
    ? formatChannelSummary(model.publications.map((item) => item.publication.channel))
    : undefined

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
        'tm-pt-4',
        'tm-pb-5',
        className,
      )}
    >
      {isNotPublished ? (
        <AdvertisementHeader {...model.header} />
      ) : (
        <div
          data-testid="job-card-advertisement-panel"
          className={cn(
            'tm-flex',
            'tm-w-full',
            'tm-min-h-[4.75rem]',
            'tm-items-stretch',
            'tm-justify-between',
            'tm-gap-4',
            'tm-overflow-hidden',
            'tm-rounded-xl',
            'tm-border',
            'tm-border-solid',
            'tm-border-secondary',
            'tm-bg-cover-light',
          )}
        >
          <div
            data-testid="job-card-advertisement-meta"
            className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-justify-center tm-gap-1 tm-px-5 tm-py-4"
          >
            {showTitle && advertisement.title ? (
              <span
                data-testid="job-card-advertisement-title"
                className="tm-max-w-48 tm-truncate tm-text-xs tm-font-normal tm-text-secondary-default"
              >
                {advertisement.title}
              </span>
            ) : null}
            <AdvertisementHeader {...model.header} />
            {channelSummary ? (
              <span
                data-testid="job-card-advertisement-channel-summary"
                className="tm-text-sm tm-text-secondary-default"
              >
                {channelSummary}
              </span>
            ) : (
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
                      showStatusDot={model.showStatusDots}
                    />
                    <PublicationHighlights
                      publication={item.publication}
                      highlights={item.highlights}
                    />
                  </Fragment>
                ))}
              </div>
            )}
          </div>
          <AdvertisementAction
            viewCount={model.viewCount}
            showProlong={model.canProlong}
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
