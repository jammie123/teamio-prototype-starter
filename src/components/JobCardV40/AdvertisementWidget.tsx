import { Fragment, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel, type AdvertisementEndedBy } from './lib/advertisementModel'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Show the advertisement title above the status. */
  showTitle?: boolean
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  /** Drop the top divider. Defaults to true for the compact right column. */
  hideTopBorder?: boolean
  /** Called from Prodloužit / Znovuvystavit inzerát in the portal hover card. */
  onExtendAndRepublish?: () => void
  onAdvertisementPreviewClick?: () => void
  onHighlightAdvertisement?: () => void
  onCreateAdvertisement?: () => void
  /** The job was ended manually or archived, so portals are shown as ended regardless of their dates. */
  endedBy?: AdvertisementEndedBy
  /** Portals shown before the rest collapses into "+ N dalších" (click to expand, "Zobrazit méně" to collapse). */
  maxVisiblePublications?: number
}

export const MAX_VISIBLE_PUBLICATIONS = 5

/**
 * Compact advertisement block for the job-card right column:
 * status, dates and portals.
 */
export function AdvertisementWidget({
  advertisement,
  showTitle = false,
  now,
  hideTopBorder = true,
  onExtendAndRepublish,
  onAdvertisementPreviewClick,
  onHighlightAdvertisement,
  onCreateAdvertisement,
  endedBy,
  maxVisiblePublications = MAX_VISIBLE_PUBLICATIONS,
  className,
}: AdvertisementWidgetProps) {
  const model = buildAdvertisementModel(advertisement, now, { endedBy })
  const [expanded, setExpanded] = useState(false)
  const collapsible = model.publications.length > maxVisiblePublications
  const visiblePublications =
    collapsible && !expanded ? model.publications.slice(0, maxVisiblePublications) : model.publications
  const hiddenCount = model.publications.length - visiblePublications.length
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
        'md:tm-items-stretch',
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
          <AdvertisementHeader {...model.header} />
          <div
            data-testid="job-card-advertisement-publications"
            className={cn(
              'tm-m-0 tm-hidden tm-min-w-0 tm-w-full tm-flex-wrap tm-items-start tm-gap-1 tm-p-0 md:tm-flex',
              model.sharedDates ? 'tm-flex-row' : 'tm-flex-col',
            )}
          >
            {visiblePublications.map((item) => (
              <Fragment key={item.publication.id}>
                <PublicationItem
                  publication={item.publication}
                  status={item.status}
                  dateLabel={item.dateLabel}
                  onViewAdvertisement={onAdvertisementPreviewClick}
                  onProlong={onExtendAndRepublish}
                  onHighlight={onHighlightAdvertisement}
                  onRepublish={onExtendAndRepublish}
                  highlights={item.highlights}
                />
                <PublicationHighlights
                  publication={item.publication}
                  highlights={item.highlights}
                  onViewAdvertisement={onAdvertisementPreviewClick}
                  onProlong={onExtendAndRepublish}
                  onHighlight={onHighlightAdvertisement}
                  onRepublish={onExtendAndRepublish}
                />
              </Fragment>
            ))}
            {collapsible ? (
              <button
                type="button"
                data-testid="job-card-publications-more"
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
                className="tm-cursor-pointer tm-border-0 tm-bg-transparent tm-p-0 tm-text-sm tm-font-normal tm-text-secondary-default hover:tm-text-action-link-hover focus-visible:tm-text-action-link-hover"
              >
                {expanded ? 'Zobrazit méně' : `+ ${hiddenCount} dalších`}
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

AdvertisementWidget.displayName = 'AdvertisementWidget'
