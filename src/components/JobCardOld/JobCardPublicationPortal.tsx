import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { cn } from '../../lib/cn'
import { formatCount } from './formatCount'
import { formatConversionRate, formatPublicationRange } from './advertisementSummary'
import type { JobPublication, JobPublicationHighlight } from './types'

export interface JobCardPublicationPortalProps {
  publication: JobPublication
  expired: boolean
  withSeparator: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}

export interface JobCardPublicationHighlightProps {
  publication: JobPublication
  highlight: JobPublicationHighlight
  withSeparator: boolean
}

const STATS: { key: 'viewCount' | 'reactionCount'; label: string }[] = [
  { key: 'viewCount', label: 'Zhlédnutí' },
  { key: 'reactionCount', label: 'Reakce' },
]

function PlacementStats({
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
          <div key={stat.key} className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
            <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">{stat.label}</dt>
            <dd className="tm-m-0 tm-text-sm tm-font-medium tm-tabular-nums tm-text-primary-default">
              {value === undefined ? '–' : formatCount(value)}
            </dd>
          </div>
        )
      })}
      <div className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
        <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">Konverze</dt>
        <dd className="tm-m-0 tm-text-sm tm-font-medium tm-tabular-nums tm-text-primary-default">
          {conversion ?? '–'}
        </dd>
      </div>
    </dl>
  )
}

function PortalCard({ publication }: { publication: JobPublication }) {
  return (
    <div className="tm-flex tm-min-w-0 tm-flex-1 tm-items-start tm-gap-2">
      <JobPortalLogo
        type={jobPortalLogoTypeFromChannel(publication.channel)}
        title=""
        className="tm-size-8"
      />
      <div className="tm-min-w-0 tm-flex-1">
        <div className="tm-text-sm tm-font-medium tm-text-primary-default">{publication.channel}</div>
        <div
          data-testid="job-card-publication-dropdown-period"
          className="tm-text-13 tm-tabular-nums tm-text-secondary-default"
        >
          {formatPublicationRange(publication.startDate, publication.endDate)}
        </div>
      </div>
    </div>
  )
}

function Separator({ show }: { show: boolean }) {
  if (!show) {
    return null
  }

  return (
    <span
      aria-hidden
      data-testid="job-card-publication-separator"
      className="tm-text-secondary-default"
    >
      ·
    </span>
  )
}

function PublicationDropdown({
  publication,
  expired,
  onPreview,
  onExtend,
}: {
  publication: JobPublication
  expired: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
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
          <span
            data-testid="job-card-publication-channel"
            className={cn(
              'tm-border-0',
              'tm-border-b',
              'tm-border-dotted',
              'tm-border-secondary',
              expired ? 'tm-font-normal tm-text-secondary-default' : 'tm-font-medium',
              expired && 'tm-line-through tm-group-hover:tm-no-underline tm-group-open:tm-no-underline',
            )}
          >
            {publication.channel}
          </span>
        </DropdownToggle>
        <DropdownBody
          data-testid="job-card-publication-dropdown"
          overflow="visible"
          initialFocus={-1}
          className="tm-p-3"
        >
          <div className="tm-flex tm-w-[200px] tm-flex-col tm-gap-3">
            <PortalCard publication={publication} />

            <PlacementStats
              viewCount={publication.viewCount}
              reactionCount={publication.reactionCount}
              testId="job-card-publication-stats"
            />

            {expired ? (
              <Button
                variant="secondary"
                size="small"
                data-testid="job-card-publication-extend"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onExtend?.(publication)
                }}
              >
                Prodloužit
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="small"
                data-testid="job-card-publication-preview"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onPreview?.(publication)
                }}
              >
                <Icon name="external-link" />
                Zobrazit inzerát
              </Button>
            )}
          </div>
        </DropdownBody>
    </Dropdown>
  )
}

export function JobCardPublicationPortal({
  publication,
  expired,
  withSeparator,
  onPreview,
  onExtend,
}: JobCardPublicationPortalProps) {
  return (
    <li
      data-testid="job-card-publication"
      className={cn(
        'tm-flex',
        'tm-items-center',
        'tm-gap-1.5',
        'tm-font-normal',
        expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
        'tm-text-sm',
      )}
    >
      <Separator show={withSeparator} />
      <PublicationDropdown
        publication={publication}
        expired={expired}
        onPreview={onPreview}
        onExtend={onExtend}
      />
    </li>
  )
}

export function JobCardPublicationHighlight({
  publication,
  highlight,
  withSeparator,
}: JobCardPublicationHighlightProps) {
  return (
    <li
      data-testid="job-card-publication-highlight"
      className={cn('tm-flex', 'tm-items-center', 'tm-gap-1.5', 'tm-font-normal', 'tm-text-sm')}
    >
      <Separator show={withSeparator} />
      <Dropdown
        openOnHover
        hoverDelay={150}
        autoClose={false}
        placement="bottom-start"
        strategy="fixed"
        className="tm-group tm-inline-flex"
      >
        <DropdownToggle variant="custom" className="tm-rounded-none tm-bg-transparent">
          <span
            data-testid="job-card-publication-highlight-name"
            className={cn(
              'tm-border-0',
              'tm-border-b',
              'tm-border-dotted',
              'tm-border-secondary',
              'tm-font-medium',
              'tm-text-teamio-pink',
            )}
          >
            {highlight.name}
          </span>
        </DropdownToggle>
        <DropdownBody
          data-testid="job-card-publication-highlight-dropdown"
          overflow="visible"
          initialFocus={-1}
          className="tm-p-3"
        >
          <div className="tm-flex tm-w-[200px] tm-flex-col tm-gap-3">
            <PortalCard publication={publication} />
            <PlacementStats
              viewCount={publication.viewCount}
              reactionCount={publication.reactionCount}
              testId="job-card-publication-stats"
            />
            <div className="tm-flex tm-flex-col tm-gap-3">
              <div>
                <div className="tm-text-sm tm-font-medium tm-text-teamio-pink">{highlight.name}</div>
                <div
                  data-testid="job-card-publication-highlight-period"
                  className="tm-text-13 tm-tabular-nums tm-text-secondary-default"
                >
                  {formatPublicationRange(highlight.startDate, highlight.endDate)}
                </div>
              </div>
              <PlacementStats
                viewCount={highlight.viewCount}
                reactionCount={highlight.reactionCount}
                testId="job-card-publication-highlight-stats"
              />
            </div>
          </div>
        </DropdownBody>
      </Dropdown>
    </li>
  )
}

JobCardPublicationPortal.displayName = 'JobCardPublicationPortal'
JobCardPublicationHighlight.displayName = 'JobCardPublicationHighlight'
