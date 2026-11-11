import type { MouseEvent, ReactNode } from 'react'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { Link } from '../Link'
import { formatConversionRate, formatCount } from './lib/format'
import { formatPublicationRange } from './lib/dates'
import type { JobPublication, JobPublicationHighlight } from './types'

const STATS: { key: 'viewCount' | 'reactionCount'; label: string }[] = [
  { key: 'viewCount', label: 'Zhlédnutí' },
  { key: 'reactionCount', label: 'Reakce' },
]

export function PlacementStats({
  viewCount,
  reactionCount,
  testId,
}: {
  viewCount?: number
  reactionCount?: number
  testId: string
}) {
  const conversion = formatConversionRate(reactionCount, viewCount)

  return (
    <dl data-testid={testId} className="tm-m-0 tm-grid tm-grid-cols-3 tm-gap-2">
      {STATS.map((stat) => {
        const value = stat.key === 'viewCount' ? viewCount : reactionCount

        return (
          <div key={stat.key} className="tm-flex tm-min-w-0 tm-flex-col tm-gap-1">
            <dt className="tm-text-xs tm-leading-tight tm-text-secondary-default">{stat.label}</dt>
            <dd className="tm-m-0 tm-text-sm tm-font-medium tm-leading-none tm-tabular-nums tm-text-primary-default">
              {value === undefined ? '–' : formatCount(value)}
            </dd>
          </div>
        )
      })}
      <div className="tm-flex tm-min-w-0 tm-flex-col tm-gap-1">
        <dt className="tm-text-xs tm-leading-tight tm-text-secondary-default">Míra reakce</dt>
        <dd className="tm-m-0 tm-text-sm tm-font-medium tm-leading-none tm-tabular-nums tm-text-primary-default">
          {conversion ?? '–'}
        </dd>
      </div>
    </dl>
  )
}

export function AdvertisementDetailLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      className="tm-inline-flex tm-items-center tm-gap-0.5 tm-text-sm"
      data-testid="job-card-advertisement-detail-link"
      onClick={onClick}
    >
      Detail inzerce
      <Icon name="chevron-right" className="tm-text-base tm-leading-none" />
    </Link>
  )
}

/** Portal logo, name and period, with an external-link button when `viewTestId` is set. */
function PublicationRow({
  channel,
  startDate,
  endDate,
  periodTestId,
  viewTestId,
  onViewAdvertisement,
}: {
  channel: string
  startDate: string
  endDate?: string
  periodTestId: string
  viewTestId?: string
  onViewAdvertisement?: () => void
}) {
  return (
    <div className="tm-flex tm-min-w-0 tm-items-center tm-gap-3">
      <JobPortalLogo type={jobPortalLogoTypeFromChannel(channel)} title="" className="tm-size-10" />
      <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-0.5 tm-leading-tight">
        <div className="tm-text-sm tm-font-medium tm-text-primary-default">{channel}</div>
        <div data-testid={periodTestId} className="tm-text-sm tm-tabular-nums tm-text-secondary-default">
          {formatPublicationRange(startDate, endDate)}
        </div>
      </div>
      {viewTestId ? (
        <Button
          variant="tertiary"
          isCircle
          aria-label="Zobrazit inzerát"
          className="tm-shrink-0"
          data-testid={viewTestId}
          onClick={(event) => handlePublicationActionClick(event, onViewAdvertisement)}
        >
          <Icon name="external-link" />
        </Button>
      ) : null}
    </div>
  )
}

/** Paid placement (Jobstip, Topováno): pink name on the left, period on the right. No logo. */
function HighlightRow({
  name,
  startDate,
  endDate,
}: {
  name: string
  startDate: string
  endDate?: string
}) {
  return (
    <div
      data-testid="job-card-publication-highlight-row"
      className="tm-flex tm-min-w-0 tm-items-center tm-justify-between tm-gap-3"
    >
      <span className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-text-teamio-pink">{name}</span>
      <span
        data-testid="job-card-publication-highlight-period"
        className="tm-shrink-0 tm-text-sm tm-tabular-nums tm-text-secondary-default"
      >
        {formatPublicationRange(startDate, endDate)}
      </span>
    </div>
  )
}

/**
 * Body of the hover card of a publication: the portal row, one compact row per
 * Jobstip / Topováno placement, and the summary stats of the publication at the bottom.
 */
export function PublicationDetails({
  publication,
  highlights = [],
  onViewAdvertisement,
}: {
  publication: JobPublication
  highlights?: JobPublicationHighlight[]
  onViewAdvertisement?: () => void
}) {
  return (
    <div className="tm-flex tm-min-w-0 tm-flex-col">
      <div className="tm-pb-4">
        <PublicationRow
          channel={publication.channel}
          startDate={publication.startDate}
          endDate={publication.endDate}
          periodTestId="job-card-publication-dropdown-period"
          viewTestId="job-card-publication-view-advertisement"
          onViewAdvertisement={onViewAdvertisement}
        />
      </div>
      {highlights.length > 0 ? (
        <div
          data-testid="job-card-publication-highlights"
          className="tm-flex tm-flex-col tm-gap-2 tm-border-t tm-border-solid tm-border-secondary tm-py-4"
        >
          {highlights.map((highlight) => (
            <HighlightRow
              key={highlight.id}
              name={highlight.name}
              startDate={highlight.startDate}
              endDate={highlight.endDate}
            />
          ))}
        </div>
      ) : null}
      <div className="tm-border-t tm-border-solid tm-border-secondary tm-pt-4">
        <PlacementStats
          viewCount={publication.viewCount}
          reactionCount={publication.reactionCount}
          testId="job-card-publication-stats"
        />
      </div>
    </div>
  )
}

function handlePublicationActionClick(event: MouseEvent<HTMLElement>, onClick?: () => void) {
  event.preventDefault()
  event.stopPropagation()
  onClick?.()
}

/** Hover-only popover anchored to `trigger`. */
export function PublicationHoverCard({
  trigger,
  dropdownTestId,
  showProlong = false,
  showHighlight = false,
  showRepublish = false,
  onProlong,
  onHighlight,
  onRepublish,
  children,
}: {
  trigger: ReactNode
  dropdownTestId: string
  showProlong?: boolean
  showHighlight?: boolean
  /** Offer Znovuvystavit inzerát on an ended publication. */
  showRepublish?: boolean
  onProlong?: () => void
  onHighlight?: () => void
  onRepublish?: () => void
  children: ReactNode
}) {
  const showActions = showProlong || showHighlight || showRepublish

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      autoClose={false}
      placement="bottom-start"
      strategy="fixed"
      className="tm-group tm-inline-flex"
    >
      <DropdownToggle variant="custom" className="tm-rounded-none tm-bg-transparent">
        {trigger}
      </DropdownToggle>
      <DropdownBody
        data-testid={dropdownTestId}
        overflow="visible"
        initialFocus={-1}
        className="tm-p-4 !tm-w-[300px] !tm-max-w-none !tm-rounded-xl"
      >
        <div className="tm-flex tm-w-full tm-flex-col tm-gap-4">
          {children}
          {showActions ? (
            <div
              data-testid="job-card-publication-actions"
              className="tm-flex tm-flex-row tm-flex-nowrap tm-items-center tm-gap-2"
            >
              {showProlong ? (
                <Button
                  variant="secondary"
                  data-testid="job-card-publication-prolong"
                  onClick={(event) => handlePublicationActionClick(event, onProlong)}
                >
                  Prodloužit
                </Button>
              ) : null}
              {showHighlight ? (
                <Button
                  variant="secondary"
                  data-testid="job-card-publication-highlight"
                  onClick={(event) => handlePublicationActionClick(event, onHighlight)}
                >
                  Zvýraznit
                </Button>
              ) : null}
              {showRepublish ? (
                <Button
                  variant="secondary"
                  data-testid="job-card-publication-republish"
                  onClick={(event) => handlePublicationActionClick(event, onRepublish)}
                >
                  Znovuvystavit inzerát
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </DropdownBody>
    </Dropdown>
  )
}
