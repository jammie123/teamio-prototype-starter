import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { formatViewCountLabel, getAdvertisementSummary, visibleHighlights } from '../JobCard/advertisementSummary'
import { JobCardPublicationHighlight } from '../JobCard/JobCardPublicationPortal'
import {
  buildJobCardV2AdvertisementModel,
  type JobCardV2AdvertisementModel,
  type JobCardV2Tone,
} from '../JobCardV2/jobCardV2Presentation'
import { buildAdvertiseDisappearanceNotice } from '../JobCardV3/jobCardV3Presentation'
import {
  AdvertisementList,
  AdvertisementListDivider,
  AdvertisementListGroup,
} from '../JobCardSimplify14v2/AdvertisementList'
import { JobBoardItem } from '../JobCardSimplify14v2/JobBoardItem'
import {
  buildSimplify14v2StripGroups,
  resolveJobCardSimplify14v2PanelMode,
} from '../JobCardSimplify14v2/jobCardSimplify14v2Presentation'
import type { JobAdvertisement, JobPublication } from './types'

export interface JobCardAdvertisementV8Props extends StyleProps {
  advertisement: JobAdvertisement
  showTitle?: boolean
  now?: Date
  onProlong?: () => void
}

const ADVERTISEMENT_HEADING_WIDTH_CLASS = 'tm-min-w-[160px]'

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

export function JobCardAdvertisementV8({
  advertisement,
  showTitle = false,
  now,
  onProlong,
  className,
}: JobCardAdvertisementV8Props) {
  const resolvedNow = now ?? new Date()
  const model = buildJobCardV2AdvertisementModel(advertisement, resolvedNow)
  const summary = getAdvertisementSummary(advertisement)
  const visibleTitle = showTitle ? advertisement.title : undefined
  const disappearance = buildAdvertiseDisappearanceNotice(advertisement, resolvedNow)
  const publicationsById = new Map(
    (advertisement.publications ?? []).map((publication) => [publication.id, publication]),
  )
  const mode = resolveJobCardSimplify14v2PanelMode(advertisement, resolvedNow)
  const groups = buildSimplify14v2StripGroups(advertisement.publications ?? [], resolvedNow, mode)

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
        'tm-border-0',
        'tm-border-t',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-px-4',
        'tm-py-3',
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
            ADVERTISEMENT_HEADING_WIDTH_CLASS,
            'tm-shrink-0 tm-whitespace-nowrap tm-text-sm tm-font-medium',
            HEADING_CLASS[model.headingTone],
          )}
        >
          {oneRowHeading(model)}
        </div>
      )}
      {model.kind === 'empty' ? null : (
        <AdvertisementList className="tm-min-w-0 tm-flex-1">
          {groups.map((group, index) => (
            <Fragment key={group.kind}>
              {index > 0 ? <AdvertisementListDivider /> : null}
              <AdvertisementListGroup>
                {group.items.map((publication) => {
                  const source = publicationsById.get(publication.id)

                  return (
                    <Fragment key={publication.id}>
                      <JobBoardItem
                        publication={publication}
                        showDate={group.showDateLabels}
                        now={resolvedNow}
                      />
                      {source ? <PortalHighlights publication={source} /> : null}
                    </Fragment>
                  )
                })}
              </AdvertisementListGroup>
            </Fragment>
          ))}
        </AdvertisementList>
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

function PortalHighlights({ publication }: { publication: JobPublication }) {
  return visibleHighlights(publication).map((highlight) => (
    <JobCardPublicationHighlight
      key={highlight.id}
      publication={publication}
      highlight={highlight}
    />
  ))
}

JobCardAdvertisementV8.displayName = 'JobCardAdvertisementV8'
