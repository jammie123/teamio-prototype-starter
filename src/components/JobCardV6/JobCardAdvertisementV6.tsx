import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import {
  formatViewCountLabel,
  getAdvertisementSummary,
  visibleHighlights,
} from '../JobCard/advertisementSummary'
import { JobCardPublicationHighlight } from '../JobCard/JobCardPublicationPortal'
import { JobCardV2PublicationPortal } from '../JobCardV2/JobCardV2PublicationPortal'
import {
  buildJobCardV2AdvertisementModel,
  type JobCardV2Tone,
} from '../JobCardV2/jobCardV2Presentation'
import { AdvertiseDisappearanceNotice } from '../JobCardV3/AdvertiseDisappearanceNotice'
import { buildAdvertiseDisappearanceNotice } from '../JobCardV3/jobCardV3Presentation'
import type { JobAdvertisement } from './types'

export interface JobCardAdvertisementV6Props extends StyleProps {
  advertisement: JobAdvertisement
  showTitle?: boolean
  now?: Date
  onProlong?: () => void
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

export function JobCardAdvertisementV6({
  advertisement,
  showTitle = false,
  now,
  onProlong,
  className,
}: JobCardAdvertisementV6Props) {
  const model = buildJobCardV2AdvertisementModel(advertisement, now)
  const summary = getAdvertisementSummary(advertisement)
  const visibleTitle = showTitle ? advertisement.title : undefined
  const disappearance = buildAdvertiseDisappearanceNotice(advertisement, now)

  return (
    <div
      data-testid="job-card-advertisement"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-gap-2',
        'tm-border-0',
        'tm-border-t',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-px-4',
        'tm-py-3',
        className,
      )}
    >
      <div className="tm-flex tm-items-start tm-justify-between tm-gap-3">
        {model.kind === 'empty' ? (
          <p className="tm-mb-0 tm-min-w-0 tm-flex-1 tm-text-sm tm-text-secondary-default">
            Inzerát není nikde vystavený.
          </p>
        ) : (
          <div
            data-testid="job-card-advertisement-heading"
            className={cn(
              'tm-min-w-0 tm-flex-1 tm-text-sm tm-font-medium',
              HEADING_CLASS[model.headingTone],
            )}
          >
            {model.heading}
          </div>
        )}
        <AdvertisementMeta title={visibleTitle} viewCount={summary.viewCount} />
      </div>
      {disappearance ? (
        <AdvertiseDisappearanceNotice message={disappearance.message} onProlong={onProlong} />
      ) : null}
      {model.kind === 'empty' ? null : (
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
      )}
    </div>
  )
}

JobCardAdvertisementV6.displayName = 'JobCardAdvertisementV6'
