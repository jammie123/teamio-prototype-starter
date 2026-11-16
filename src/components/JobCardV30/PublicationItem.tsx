import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { publicationSupportsHighlight } from './lib/publicationActions'
import { PublicationDetails, PublicationHoverCard } from './PublicationHoverCard'
import type { JobPublication, JobPublicationHighlight, JobPublicationStatus } from './types'

export interface PublicationItemProps extends StyleProps {
  publication: JobPublication
  /** Běží (active), Brzy končí (endingSoon) or Ukončený (expired). */
  status: JobPublicationStatus
  /** Pre-composed label such as `do 30. 9.` or `ukončeno 15. 8.`. */
  dateLabel?: string
  /** Status dot before the portal name. */
  showStatusDot?: boolean
  onViewAdvertisement?: () => void
  /** Offer Prodloužit in the hover card. Defaults to true for an ending-soon portal. */
  showProlong?: boolean
  onProlong?: () => void
  /** Override whether Zvýraznit is offered. Defaults to Jobs.cz, Prace.cz and Atmoskop. */
  showHighlight?: boolean
  onHighlight?: () => void
  /** Znovuvystavit inzerát, offered on ended (expired) publications. */
  onRepublish?: () => void
  /** Placements shown as rows in the hover card (e.g. Jobstip). */
  highlights?: JobPublicationHighlight[]
}

const DOT_CLASS: Record<JobPublicationStatus, string> = {
  active: 'tm-bg-emotion-success-emphasis',
  endingSoon: 'tm-bg-emotion-warning-emphasis',
  expired: 'tm-bg-gray-300',
}

const CHANNEL_CLASS: Record<JobPublicationStatus, string> = {
  active: 'tm-font-normal tm-text-primary-default',
  endingSoon: 'tm-font-normal tm-text-primary-default',
  expired: 'tm-font-normal tm-text-secondary-default',
}

/** Job portal row: status dot, dotted-underline portal name (hover for stats) and optional date. */
export function PublicationItem({
  publication,
  status,
  dateLabel,
  showStatusDot = true,
  onViewAdvertisement,
  showProlong = status === 'endingSoon',
  onProlong,
  showHighlight = publicationSupportsHighlight(publication) && status !== 'expired',
  onHighlight,
  onRepublish,
  highlights = [],
  className,
}: PublicationItemProps) {
  return (
    <span
      data-testid="job-card-publication"
      data-status={status}
      className={cn(
        'tm-inline-flex',
        'tm-items-center',
        'tm-gap-1.5',
        'tm-px-2',
        'tm-text-sm',
        'tm-font-normal',
        className,
      )}
    >
      {showStatusDot ? (
        <span
          data-testid="job-card-publication-dot"
          className={cn('tm-h-1.5', 'tm-w-1.5', 'tm-shrink-0', 'tm-rounded-full', DOT_CLASS[status])}
        />
      ) : null}
      <PublicationHoverCard
        dropdownTestId="job-card-publication-dropdown"
        showProlong={showProlong}
        showHighlight={showHighlight}
        showRepublish={status === 'expired'}
        onProlong={onProlong}
        onHighlight={onHighlight}
        onRepublish={onRepublish}
        trigger={
          <span
            data-testid="job-card-publication-channel"
            className={cn(
              CHANNEL_CLASS[status],
              'tm-border-0',
              'tm-border-b',
              'tm-border-dotted',
              'tm-border-secondary',
              status === 'expired' ? 'tm-font-normal' : 'tm-font-medium',
            )}
          >
            {publication.channel}
          </span>
        }
      >
        <PublicationDetails
          publication={publication}
          highlights={highlights}
          onViewAdvertisement={onViewAdvertisement}
        />
      </PublicationHoverCard>
      {dateLabel ? (
        <span
          data-testid="job-card-publication-dates"
          className="tm-text-13 tm-tabular-nums tm-text-secondary-default"
        >
          {dateLabel}
        </span>
      ) : null}
    </span>
  )
}

PublicationItem.displayName = 'PublicationItem'

export interface PublicationHighlightsProps extends StyleProps {
  publication: JobPublication
  highlights: JobPublicationHighlight[]
  onViewAdvertisement?: () => void
  showProlong?: boolean
  onProlong?: () => void
  showHighlight?: boolean
  onHighlight?: () => void
  onRepublish?: () => void
}

function PublicationHighlightName({
  publication,
  highlight,
  highlights,
  onViewAdvertisement,
  showProlong = false,
  onProlong,
  showHighlight = publicationSupportsHighlight(publication),
  onHighlight,
  onRepublish,
}: {
  publication: JobPublication
  highlight: JobPublicationHighlight
  highlights: JobPublicationHighlight[]
  onViewAdvertisement?: () => void
  showProlong?: boolean
  onProlong?: () => void
  showHighlight?: boolean
  onHighlight?: () => void
  onRepublish?: () => void
}) {
  const isEnded = publication.status === 'expired'

  return (
    <PublicationHoverCard
      dropdownTestId="job-card-publication-highlight-dropdown"
      showProlong={showProlong}
      showHighlight={showHighlight && !isEnded}
      showRepublish={isEnded}
      onProlong={onProlong}
      onHighlight={onHighlight}
      onRepublish={onRepublish}
      trigger={
        <span
          data-testid="job-card-publication-highlight-name"
          className={cn(
            'tm-border-0',
            'tm-border-b',
            'tm-border-dotted',
            'tm-border-secondary',
            'tm-font-normal',
            'tm-text-teamio-pink',
          )}
        >
          {highlight.name}
        </span>
      }
    >
      <PublicationDetails
        publication={publication}
        highlights={highlights}
        onViewAdvertisement={onViewAdvertisement}
      />
    </PublicationHoverCard>
  )
}

/** Placements tied to a portal (Jobstip on Jobs.cz): "+ Jobstip" or "+ Jobstip, Topováno". */
export function PublicationHighlights({
  publication,
  highlights,
  onViewAdvertisement,
  showProlong = false,
  onProlong,
  showHighlight = publicationSupportsHighlight(publication),
  onHighlight,
  onRepublish,
  className,
}: PublicationHighlightsProps) {
  if (highlights.length === 0) {
    return null
  }

  return (
    <span
      data-testid="job-card-publication-highlight"
      className={cn(
        'tm-inline-flex',
        'tm-flex-wrap',
        'tm-items-center',
        'tm-gap-x-1',
        'tm-font-normal',
        'tm-text-sm',
        className,
      )}
    >
      <span className="tm-text-secondary-default" aria-hidden>
        +{' '}
      </span>
      {highlights.map((highlight, index) => (
        <Fragment key={highlight.id}>
          {index > 0 ? (
            <span className="tm-text-secondary-default" aria-hidden>
              {', '}
            </span>
          ) : null}
          <PublicationHighlightName
            publication={publication}
            highlight={highlight}
            highlights={highlights}
            onViewAdvertisement={onViewAdvertisement}
            showProlong={showProlong}
            onProlong={onProlong}
            showHighlight={showHighlight}
            onHighlight={onHighlight}
            onRepublish={onRepublish}
          />
        </Fragment>
      ))}
    </span>
  )
}

PublicationHighlights.displayName = 'PublicationHighlights'
