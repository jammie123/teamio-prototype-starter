import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { getAdvertisementSummary, stripYear, visibleHighlights } from '../JobCard/advertisementSummary'
import { JobCardPublicationHighlight } from '../JobCard/JobCardPublicationPortal'
import {
  buildJobCardV2AdvertisementModel,
  type JobCardV2PortalModel,
  type JobCardV2Tone,
} from '../JobCardV2/jobCardV2Presentation'
import { buildAdvertiseDisappearanceNotice } from '../JobCardV3/jobCardV3Presentation'
import { JobBoardItem } from '../JobCardSimplify26/JobBoardItem'
import { buildSimplify26AdvertisementModel } from '../JobCardSimplify26/jobCardSimplify26Presentation'
import {
  AdvertisementHeading,
  AdvertisementMeta,
} from '../JobCardV9/JobCardAdvertisementV9'
import { Tag } from '../Tag'
import type { JobAdvertisement, JobPublicationStatus } from './types'

export interface JobCardAdvertisementV12Props extends StyleProps {
  advertisement: JobAdvertisement
  showTitle?: boolean
  now?: Date
  onProlong?: () => void
  headingClassName?: string
}

function portalStatus(tone: JobCardV2Tone): JobPublicationStatus {
  if (tone === 'ended') {
    return 'expired'
  }

  if (tone === 'warning') {
    return 'endingSoon'
  }

  return 'active'
}

function portalDateLabel(item: JobCardV2PortalModel) {
  if (item.tone !== 'ended' && item.dateLabel && item.publication.endDate) {
    return `do ${stripYear(item.publication.endDate)}`
  }

  return item.dateLabel
}

export function JobCardAdvertisementV12({
  advertisement,
  showTitle = false,
  now,
  onProlong,
  headingClassName,
  className,
}: JobCardAdvertisementV12Props) {
  const resolvedNow = now ?? new Date()
  const model = buildJobCardV2AdvertisementModel(advertisement, resolvedNow)
  const boardModel = buildSimplify26AdvertisementModel(advertisement, resolvedNow)
  const summary = getAdvertisementSummary(advertisement)
  const visibleTitle = showTitle ? advertisement.title : undefined
  const disappearance = buildAdvertiseDisappearanceNotice(advertisement, resolvedNow)
  const badges = boardModel.kind === 'groups' ? boardModel.badges : []

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
        'tm-border-solid',
        'tm-border-secondary',
        className,
      )}
    >
      {model.kind === 'empty' ? (
        <p className="tm-mb-0 tm-min-w-0 tm-flex-1 tm-text-sm tm-text-secondary-default">
          Inzerát není nikde vystavený.
        </p>
      ) : (
        <div className="tm-shrink-0">
          <AdvertisementHeading
            model={model}
            advertisement={advertisement}
            className={headingClassName}
          />
          {badges.length ? (
            <div
              data-testid="job-card-advertisement-badges"
              className="tm-mt-1 tm-flex tm-flex-wrap tm-gap-1"
            >
              {badges.map((badge) => (
                <Tag
                  key={badge.label}
                  color={badge.color}
                  isSubtle
                  className="!tm-text-[11px] !tm-font-semibold"
                  data-testid="advertisement-header-badge"
                  data-tone={badge.color}
                >
                  {badge.label}
                </Tag>
              ))}
            </div>
          ) : null}
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
              <JobBoardItem
                channel={item.publication.channel}
                status={portalStatus(item.tone)}
                date={portalDateLabel(item)}
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

JobCardAdvertisementV12.displayName = 'JobCardAdvertisementV12'
