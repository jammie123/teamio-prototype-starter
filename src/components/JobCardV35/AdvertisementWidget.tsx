import { Fragment, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { AdvertisementAction, type AdvertisementActionLayout } from './AdvertisementAction'
import { AdvertisementHeader } from './AdvertisementHeader'
import { buildAdvertisementModel, type AdvertisementEndedBy } from './lib/advertisementModel'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobAdvertisement } from './types'

export interface AdvertisementWidgetProps extends StyleProps {
  advertisement: JobAdvertisement
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onProlong?: () => void
  /** Override whether Prodloužit is shown. Defaults to the advertisement model. */
  showProlong?: boolean
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
  onHighlightAdvertisement?: () => void
  /** Publikovat button of a not yet published advertisement. */
  onCreateAdvertisement?: () => void
  actionLayout?: AdvertisementActionLayout
  /** Drop the top divider, e.g. when a JobNote already sits above. */
  hideTopBorder?: boolean
  /** Portals shown before the rest collapses into "+ N dalších" (click to expand, "Zobrazit méně" to collapse). */
  maxVisiblePublications?: number
  /** The job was ended manually or archived, so portals are shown as ended regardless of their dates. */
  endedBy?: AdvertisementEndedBy
}

export const MAX_VISIBLE_PUBLICATIONS = 5

/**
 * Advertisement block of a job card: status with portals beside it on the left,
 * AdvertisementAction (stats, Detail chevron, optional Prodloužit, Náhled) on the right.
 */
export function AdvertisementWidget({
  advertisement,
  now,
  onProlong,
  showProlong,
  onViewStatisticsClick,
  onAdvertisementDetailClick,
  onAdvertisementPreviewClick,
  onHighlightAdvertisement,
  onCreateAdvertisement,
  actionLayout,
  hideTopBorder = false,
  maxVisiblePublications = MAX_VISIBLE_PUBLICATIONS,
  endedBy,
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
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-2',
        'tm-border-0',
        !hideTopBorder && 'tm-border-t',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-pt-4',
        'tm-pb-5',
        className,
      )}
    >
      {isNotPublished ? (
        <div
          data-testid="job-card-advertisement-top"
          className="tm-flex tm-w-full tm-items-center tm-justify-between tm-gap-x-4 tm-gap-y-1"
        >
          <AdvertisementHeader {...model.header} />
          {onCreateAdvertisement ? (
            <Button
              variant="primary"
              data-testid="job-card-advertisement-publish"
              className="!tm-shrink-0 tm-whitespace-nowrap"
              onClick={onCreateAdvertisement}
            >
              Publikovat
            </Button>
          ) : null}
        </div>
      ) : (
        <div
          data-testid="job-card-advertisement-top"
          className="tm-flex tm-w-full tm-flex-col tm-items-start tm-gap-3 md:tm-flex-row md:tm-items-center md:tm-justify-between md:tm-gap-2"
        >
          <div className="tm-flex tm-w-full tm-min-w-0 tm-flex-col tm-items-start tm-gap-x-8 tm-gap-y-2 md:tm-w-auto md:tm-flex-1 md:tm-flex-row md:tm-flex-wrap md:tm-items-center">
            <AdvertisementHeader {...model.header} className="tm-shrink-0" />
            <div
              data-testid="job-card-advertisement-publications"
              className="tm-m-0 tm-hidden tm-min-w-0 tm-flex-row md:tm-flex md:tm-flex-1 tm-flex-wrap tm-items-center tm-gap-x-2 tm-gap-y-1 tm-p-0"
            >
              {visiblePublications.map((item) => (
                <Fragment key={item.publication.id}>
                  <PublicationItem
                    publication={item.publication}
                    status={item.status}
                    dateLabel={item.dateLabel}
                    showStatusDot
                    highlights={item.highlights}
                    onViewAdvertisement={onAdvertisementPreviewClick}
                    onProlong={onProlong}
                    onHighlight={onHighlightAdvertisement}
                    onRepublish={onProlong}
                  />
                  <PublicationHighlights
                    publication={item.publication}
                    highlights={item.highlights}
                    onViewAdvertisement={onAdvertisementPreviewClick}
                    onProlong={onProlong}
                    onHighlight={onHighlightAdvertisement}
                    onRepublish={onProlong}
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
          </div>
          <AdvertisementAction
            viewCount={model.viewCount}
            showProlong={showProlong ?? model.canProlong}
            layout={actionLayout}
            className="tm-w-full md:tm-w-auto"
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
