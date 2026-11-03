import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import {
  formatViewCountLabel,
  getAdvertisementSummary,
  stripYear,
  visibleHighlights,
} from '../JobCard/advertisementSummary'
import { JobCardPublicationHighlight } from '../JobCard/JobCardPublicationPortal'
import { JobCardPublicationPortalV10 } from './JobCardPublicationPortalV10'
import {
  buildJobCardV2AdvertisementModel,
  type JobCardV2AdvertisementModel,
  type JobCardV2Tone,
} from '../JobCardV2/jobCardV2Presentation'
import { buildAdvertiseDisappearanceNotice } from '../JobCardV3/jobCardV3Presentation'
import type { JobAdvertisement } from './types'

export interface JobCardAdvertisementV10Props extends StyleProps {
  advertisement: JobAdvertisement
  showTitle?: boolean
  now?: Date
  onProlong?: () => void
}

const HEADING_WIDTH_CLASS = 'tm-min-w-[160px] tm-shrink-0'

const HEADING_CLASS: Record<JobCardV2Tone, string> = {
  success: 'tm-text-emotion-success-emphasis',
  warning: 'tm-text-emotion-warning-emphasis',
  ended: 'tm-text-secondary-default',
}

function oneRowHeading(model: Exclude<JobCardV2AdvertisementModel, { kind: 'empty' }>) {
  if (model.kind !== 'mixed') {
    return model.heading
  }

  const separator = ' · '
  const index = model.heading.lastIndexOf(separator)
  return index === -1 ? model.heading : model.heading.slice(0, index)
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
        <span data-testid="job-card-advertisement-aggregate-views">{formatViewCountLabel(viewCount)}</span>
      )}
    </div>
  )
}

export function JobCardAdvertisementV10({
  advertisement,
  showTitle = false,
  now,
  onProlong,
  className,
}: JobCardAdvertisementV10Props) {
  const model = buildJobCardV2AdvertisementModel(advertisement, now)
  const summary = getAdvertisementSummary(advertisement)
  const visibleTitle = showTitle ? advertisement.title : undefined
  const disappearance = buildAdvertiseDisappearanceNotice(advertisement, now)

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn(
        'tm-flex',
        'tm-flex-row',
        'tm-flex-wrap',
        'tm-items-center',
        'tm-gap-x-8',
        'tm-gap-y-2',
        className,
      )}
    >
      {model.kind === 'empty' ? (
        <p className="tm-mb-0 tm-min-w-0 tm-flex-1 tm-text-sm tm-text-secondary-default">
          Inzerát není nikde vystavený.
        </p>
      ) : (
        <div
          data-testid="job-card-advertisement-heading"
          className={cn(
            HEADING_WIDTH_CLASS,
            'tm-whitespace-nowrap tm-text-sm tm-font-medium',
            HEADING_CLASS[model.headingTone],
          )}
        >
          {oneRowHeading(model)}
        </div>
      )}
      {model.kind === 'empty' ? null : (
        <ul
          data-testid="job-card-advertisement-publication-list"
          className={cn(
            'tm-m-0',
            'tm-flex',
            'tm-min-w-0',
            'tm-flex-1',
            'tm-flex-row',
            'tm-flex-wrap',
            'tm-items-center',
            'tm-gap-x-6',
            'tm-gap-y-1.5',
            'tm-list-none',
            'tm-p-0',
          )}
        >
          {model.portals.map((item) => (
            <Fragment key={item.publication.id}>
              <JobCardPublicationPortalV10
                publication={item.publication}
                tone={item.tone}
                dateLabel={
                  item.tone !== 'ended' && item.dateLabel && item.publication.endDate
                    ? `do ${stripYear(item.publication.endDate)}`
                    : item.dateLabel
                }
              />
              {item.tone === 'ended'
                ? null
                : visibleHighlights(item.publication).map((highlight) => (
                    <JobCardPublicationHighlight
                      key={highlight.id}
                      publication={item.publication}
                      highlight={highlight}
                    />
                  ))}
            </Fragment>
          ))}
        </ul>
      )}
      {model.kind === 'empty' ? null : (
        <AdvertisementMeta title={visibleTitle} viewCount={summary.viewCount} />
      )}
      {disappearance ? (
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

JobCardAdvertisementV10.displayName = 'JobCardAdvertisementV10'
