import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import {
  formatCompactDateRange,
  formatViewCountLabel,
  getAdvertisementSummary,
  shareSameEndDate,
  stripYear,
  visibleHighlights,
} from '../JobCard/advertisementSummary'
import type { JobPublication } from '../JobCard/types'
import { JobCardPublicationHighlight } from '../JobCard/JobCardPublicationPortal'
import { JobCardPublicationPortalV9 } from './JobCardPublicationPortalV9'
import {
  buildJobCardV2AdvertisementModel,
  type JobCardV2AdvertisementModel,
  type JobCardV2PortalModel,
  type JobCardV2Tone,
} from '../JobCardV2/jobCardV2Presentation'
import { buildAdvertiseDisappearanceNotice } from '../JobCardV3/jobCardV3Presentation'
import type { JobAdvertisement } from './types'

export interface JobCardAdvertisementV9Props extends StyleProps {
  advertisement: JobAdvertisement
  showTitle?: boolean
  now?: Date
  onProlong?: () => void
  headingClassName?: string
  /** Každý portál jako Tag badge místo položky seznamu. */
  publicationsInBadges?: boolean
  /** Skrýt tečku stavu, dokud portály nemají různý tón. */
  showPublicationStatusDotsOnlyWhenMixed?: boolean
}

function hasMixedPublicationTones(portals: JobCardV2PortalModel[]) {
  return new Set(portals.map((portal) => portal.tone)).size > 1
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

function formatHeadingDateRange(startDate: string, endDate: string) {
  return formatCompactDateRange(startDate, endDate)
}

function samePeriodLivePublication(advertisement: JobAdvertisement) {
  const liveDated = (advertisement.publications ?? []).filter(
    (publication) =>
      isLivePublication(publication) && publication.startDate && publication.endDate,
  )

  if (
    liveDated.length === 0 ||
    !shareSameStartDate(liveDated) ||
    !shareSameEndDate(liveDated)
  ) {
    return undefined
  }

  return liveDated[0]
}

function isLivePublication(publication: JobPublication) {
  return publication.status !== 'expired'
}

function shareSameStartDate(publications: JobPublication[]) {
  if (publications.length === 0) {
    return false
  }

  const labels = publications.map((publication) =>
    publication.startDate ? stripYear(publication.startDate) : undefined,
  )

  if (labels.some((label) => label === undefined)) {
    return false
  }

  return labels.every((label) => label === labels[0])
}

function resolveHeadingDisplay(
  model: Exclude<JobCardV2AdvertisementModel, { kind: 'empty' }>,
  advertisement: JobAdvertisement,
) {
  const split = splitAdvertisementHeading(oneRowHeading(model))
  const samePeriod = samePeriodLivePublication(advertisement)

  if (
    samePeriod?.startDate &&
    samePeriod.endDate &&
    (model.kind === 'endingSoon' || model.kind === 'runningSame')
  ) {
    return {
      label: split.label,
      dateInfo: formatHeadingDateRange(samePeriod.startDate, samePeriod.endDate),
    }
  }

  return split
}

function splitAdvertisementHeading(heading: string): {
  label: string
  dateInfo?: string
  dateSeparator?: string
} {
  const bulletSeparator = ' · '
  const bulletIndex = heading.lastIndexOf(bulletSeparator)
  if (bulletIndex !== -1) {
    return {
      label: heading.slice(0, bulletIndex),
      dateSeparator: bulletSeparator,
      dateInfo: heading.slice(bulletIndex + bulletSeparator.length),
    }
  }

  if (heading.startsWith('Ukončeno ')) {
    return {
      label: 'Ukončeno',
      dateInfo: heading.slice('Ukončeno '.length),
    }
  }

  if (heading.startsWith('Běží od ')) {
    const rest = heading.slice('Běží od '.length)
    const rangeSeparator = ' do '
    const rangeIndex = rest.lastIndexOf(rangeSeparator)
    if (rangeIndex !== -1) {
      const startPart = rest.slice(0, rangeIndex).trim()
      const endPart = rest.slice(rangeIndex + rangeSeparator.length).trim()
      const endYear = endPart.match(/(\d{4})\.?$/)?.[1]
      const startDate = endYear && !startPart.match(/(\d{4})\.?$/)
        ? `${startPart.replace(/\s+$/, '')} ${endYear}`
        : startPart

      return {
        label: 'Běží',
        dateInfo: formatHeadingDateRange(startDate, endPart),
      }
    }

    return { label: 'Běží', dateInfo: rest }
  }

  if (heading.startsWith('Běží do ')) {
    return {
      label: 'Běží',
      dateInfo: heading.slice('Běží do '.length),
    }
  }

  return { label: heading }
}

export function AdvertisementHeading({
  model,
  advertisement,
  className,
}: {
  model: Exclude<JobCardV2AdvertisementModel, { kind: 'empty' }>
  advertisement: JobAdvertisement
  className?: string
}) {
  const { label, dateInfo, dateSeparator } = resolveHeadingDisplay(model, advertisement)

  return (
    <div
      data-testid="job-card-advertisement-heading"
      className={cn(
        HEADING_WIDTH_CLASS,
        'tm-flex tm-items-baseline tm-gap-x-1 tm-whitespace-nowrap tm-text-sm tm-font-medium',
        HEADING_CLASS[model.headingTone],
        className,
      )}
    >
      <span data-testid="job-card-advertisement-heading-label">{label}</span>
      {dateInfo ? (
        <>
          {dateSeparator?.includes('·') ? (
            <span
              data-testid="job-card-advertisement-heading-separator"
              aria-hidden="true"
            >
              {dateSeparator}
            </span>
          ) : (
            <span data-testid="job-card-advertisement-heading-separator" aria-hidden="true">
              {' '}
            </span>
          )}
          <span
            data-testid="job-card-advertisement-heading-date"
            className="tm-font-normal tm-text-secondary-default"
          >
            {dateInfo}
          </span>
        </>
      ) : null}
    </div>
  )
}

export function AdvertisementMeta({ title, viewCount }: { title?: string; viewCount?: number }) {
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

export function JobCardAdvertisementV9({
  advertisement,
  showTitle = false,
  now,
  onProlong,
  headingClassName,
  publicationsInBadges = false,
  showPublicationStatusDotsOnlyWhenMixed = false,
  className,
}: JobCardAdvertisementV9Props) {
  const model = buildJobCardV2AdvertisementModel(advertisement, now)
  const summary = getAdvertisementSummary(advertisement)
  const visibleTitle = showTitle ? advertisement.title : undefined
  const disappearance = buildAdvertiseDisappearanceNotice(advertisement, now)
  const showPublicationStatusDots =
    model.kind === 'empty'
      ? false
      : !showPublicationStatusDotsOnlyWhenMixed || hasMixedPublicationTones(model.portals)
  const PublicationListTag = publicationsInBadges ? 'div' : 'ul'

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
        <AdvertisementHeading
          model={model}
          advertisement={advertisement}
          className={headingClassName}
        />
      )}
      {model.kind === 'empty' ? null : (
        <PublicationListTag
          data-testid={
            publicationsInBadges
              ? 'job-card-advertisement-badges'
              : 'job-card-advertisement-publication-list'
          }
          className={cn(
            'tm-m-0',
            'tm-flex',
            'tm-min-w-0',
            'tm-flex-1',
            'tm-flex-row',
            'tm-flex-wrap',
            'tm-items-center',
            publicationsInBadges ? 'tm-gap-2' : 'tm-gap-x-6 tm-gap-y-1.5',
            !publicationsInBadges && 'tm-list-none',
            'tm-p-0',
          )}
        >
          {model.portals.map((item) => (
            <Fragment key={item.publication.id}>
              <JobCardPublicationPortalV9
                publication={item.publication}
                tone={item.tone}
                variant={publicationsInBadges ? 'badge' : 'default'}
                showStatusDot={showPublicationStatusDots}
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
        </PublicationListTag>
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

JobCardAdvertisementV9.displayName = 'JobCardAdvertisementV9'
