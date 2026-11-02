import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import {
  formatViewCountLabel,
  getAdvertisementSummary,
  visibleHighlights,
} from '../JobCard/advertisementSummary'
import { JobCardPublicationHighlight } from '../JobCard/JobCardPublicationPortal'
import { JobCardV2PublicationPortal } from './JobCardV2PublicationPortal'
import {
  buildJobCardV2AdvertisementModel,
  type JobCardV2Tone,
} from './jobCardV2Presentation'
import type { JobAdvertisement } from './types'

export interface JobCardAdvertisementV2Props extends StyleProps {
  advertisement: JobAdvertisement
  showTitle?: boolean
  now?: Date
}

const HEADING_CLASS: Record<JobCardV2Tone, string> = {
  success: 'tm-text-emotion-success-emphasis',
  warning: 'tm-text-emotion-warning-emphasis',
  ended: 'tm-text-secondary-default',
}

function AdvertisementMeta({ title, viewCount }: { title?: string; viewCount?: number }) {
  if (!title && viewCount === undefined) {
    return null
  }

  return (
    <div className="tm-flex tm-shrink-0 tm-items-baseline tm-gap-2 tm-text-13 tm-text-secondary-default">
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

export function JobCardAdvertisementV2({
  advertisement,
  showTitle = false,
  now,
  className,
}: JobCardAdvertisementV2Props) {
  const model = buildJobCardV2AdvertisementModel(advertisement, now)
  const summary = getAdvertisementSummary(advertisement)
  const visibleTitle = showTitle ? advertisement.title : undefined

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-gap-2',
        'tm-rounded',
        'tm-border',
        'tm-border-secondary',
        'tm-px-3',
        'tm-py-3',
        className,
      )}
    >
      <div className="tm-flex tm-items-start tm-justify-between tm-gap-3">
        <div data-testid="job-card-advertisement-publications" className="tm-min-w-0 tm-flex-1">
          {model.kind === 'empty' ? (
            <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
              Inzerát není nikde vystavený.
            </p>
          ) : (
            <div className="tm-flex tm-flex-col tm-gap-3">
              <div
                data-testid="job-card-advertisement-heading"
                className={cn('tm-text-sm', 'tm-font-medium', HEADING_CLASS[model.headingTone])}
              >
                {model.heading}
              </div>
              <ul
                data-testid="job-card-advertisement-publication-list"
                className={cn(
                  'tm-m-0',
                  'tm-flex',
                  'tm-flex-row',
                  'tm-flex-wrap',
                  'tm-gap-x-6',
                  'tm-gap-y-1.5',
                  'tm-list-none',
                  'tm-p-0',
                )}
              >
                {model.portals.map((item) => (
                  <Fragment key={item.publication.id}>
                    <JobCardV2PublicationPortal
                      publication={item.publication}
                      tone={item.tone}
                      dateLabel={item.dateLabel}
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
            </div>
          )}
        </div>
        <AdvertisementMeta title={visibleTitle} viewCount={summary.viewCount} />
      </div>
    </div>
  )
}

JobCardAdvertisementV2.displayName = 'JobCardAdvertisementV2'
