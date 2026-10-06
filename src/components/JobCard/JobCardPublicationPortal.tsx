import type { ReactNode } from 'react'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { cn } from '../../lib/cn'
import { formatCount } from './formatCount'
import {
  formatConversionRate,
  formatPublicationRange,
  formatUntilDate,
} from './advertisementSummary'
import type { JobPublication, JobPublicationHighlight } from './types'

export interface JobCardPublicationPortalProps {
  publication: JobPublication
  expired: boolean
  showDate: boolean
}

export interface JobCardPublicationHighlightProps {
  publication: JobPublication
  highlight: JobPublicationHighlight
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
    <>
      <div className="tm-flex tm-min-w-0 tm-items-start tm-gap-2">
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
      <PlacementStats
        viewCount={publication.viewCount}
        reactionCount={publication.reactionCount}
        testId="job-card-publication-stats"
      />
    </>
  )
}

function HoverDropdown({
  trigger,
  dropdownTestId,
  children,
}: {
  trigger: ReactNode
  dropdownTestId: string
  children: ReactNode
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
        {trigger}
      </DropdownToggle>
      <DropdownBody
        data-testid={dropdownTestId}
        overflow="visible"
        initialFocus={-1}
        className="tm-p-3"
      >
        <div className="tm-flex tm-w-[200px] tm-flex-col tm-gap-3">{children}</div>
      </DropdownBody>
    </Dropdown>
  )
}

export function JobCardPublicationPortal({
  publication,
  expired,
  showDate,
}: JobCardPublicationPortalProps) {
  return (
    <li
      data-testid="job-card-publication"
      className={cn(
        'tm-flex',
        'tm-items-center',
        'tm-gap-1.5',
        'tm-font-normal',
        'tm-text-primary-default',
        'tm-text-sm',
      )}
    >
      <span
        data-testid="job-card-publication-dot"
        className={cn(
          'tm-h-1.5',
          'tm-w-1.5',
          'tm-shrink-0',
          'tm-rounded-full',
          expired ? 'tm-bg-gray-300' : 'tm-bg-emotion-success-emphasis',
        )}
      />
      <HoverDropdown
        dropdownTestId="job-card-publication-dropdown"
        trigger={
          <span
            data-testid="job-card-publication-channel"
            className={cn(
              'tm-border-0',
              'tm-border-b',
              'tm-border-dotted',
              'tm-border-secondary',
              expired ? 'tm-font-normal' : 'tm-font-medium',
            )}
          >
            {publication.channel}
          </span>
        }
      >
        <PortalCard publication={publication} />
      </HoverDropdown>
      {showDate && publication.endDate ? (
        <span data-testid="job-card-publication-dates" className="tm-tabular-nums">
          {formatUntilDate(publication.endDate)}
        </span>
      ) : null}
    </li>
  )
}

export function JobCardPublicationHighlight({
  publication,
  highlight,
}: JobCardPublicationHighlightProps) {
  return (
    <li
      data-testid="job-card-publication-highlight"
      className={cn(
        'tm-flex',
        'tm-items-center',
        'tm-gap-1.5',
        'tm-font-normal',
        'tm-text-sm',
      )}
    >
      <HoverDropdown
        dropdownTestId="job-card-publication-highlight-dropdown"
        trigger={
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
        }
      >
        <PortalCard publication={publication} />
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
      </HoverDropdown>
    </li>
  )
}

JobCardPublicationPortal.displayName = 'JobCardPublicationPortal'
JobCardPublicationHighlight.displayName = 'JobCardPublicationHighlight'
